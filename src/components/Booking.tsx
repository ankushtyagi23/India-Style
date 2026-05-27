import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { CheckCircle2, User as UserIcon, Phone, Mail } from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';
import { services } from '../data/services';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, serverTimestamp, doc, runTransaction, query, where, onSnapshot, addDoc, getDocs } from 'firebase/firestore';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [dateBookings, setDateBookings] = useState<any[]>([]);
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceId = params.get('service');
    if (serviceId && services.some(s => s.id === serviceId)) {
      setSelectedServices([serviceId]);
    }
  }, [location]);

  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      setDateBookings([]);
      setSelectedSlot(null);
      return;
    }
    const q = query(collection(db, 'slots'), where('date', '==', date));
    const unsubscribeSlots = onSnapshot(q, (snapshot) => {
       const fetchedSlots: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       fetchedSlots.sort((a: any, b: any) => a.time.localeCompare(b.time));
       setAvailableSlots(fetchedSlots);
       // If selected slot is no longer available or became full, could deselect
       if (selectedSlot) {
           const updatedSlot = fetchedSlots.find(s => s.id === selectedSlot.id);
           if (!updatedSlot || updatedSlot.booked >= updatedSlot.capacity) {
               setSelectedSlot(null);
           } else {
               setSelectedSlot(updatedSlot);
           }
       }
    });

    const qBookings = query(collection(db, 'bookings'), where('date', '==', date));
    const unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
       const fetchedBookings: any[] = snapshot.docs.map(doc => doc.data());
       setDateBookings(fetchedBookings);
    });

    return () => {
        unsubscribeSlots();
        unsubscribeBookings();
    };
  }, [date, selectedSlot]);

  const toggleService = (id: string) => {
    setFormError('');
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((acc, id) => {
      const s = services.find(x => x.id === id);
      if (s) {
        acc.min += s.basePrice;
        acc.max += s.maxPrice;
      }
      return acc;
    }, { min: 0, max: 0 });
  };
  
  const total = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (selectedServices.length === 0) {
      setFormError("Please select at least one service.");
      return;
    }
    if (!selectedSlot && !time) {
      setFormError("Please select a time slot or enter a time.");
      return;
    }
    
    if (!user) {
      setFormError("You need to be logged in to book an appointment.");
      return;
    }

    setLoading(true);
    try {
      if (selectedSlot) {
          const slotRef = doc(db, 'slots', selectedSlot.id);
          
          await runTransaction(db, async (transaction) => {
            const slotDoc = await transaction.get(slotRef);
            if (!slotDoc.exists()) {
              throw new Error("Slot does not exist!");
            }

            const slotData = slotDoc.data();
            const newBooked = (slotData.booked || 0) + 1;
            
            if (newBooked > slotData.capacity) {
              throw new Error("Sorry, this slot just got full.");
            }

            // update slot booked count immediately to hold the seat
            transaction.update(slotRef, { booked: newBooked });
            
            // add booking document
            const newBookingRef = doc(collection(db, 'bookings'));
            transaction.set(newBookingRef, {
              userId: user.uid,
              name,
              email,
              phone,
              services: selectedServices,
              date,
              time: selectedSlot.time,
              slotId: selectedSlot.id,
              status: 'pending',
              estimatedTotal: total,
              createdAt: serverTimestamp()
            });
          });
      } else {
         // Fallback manual booking logic - max 3 seats
         const q = query(
             collection(db, 'bookings'),
             where('date', '==', date)
         );
         const snapshot = await getDocs(q);
         const timeBookings = snapshot.docs.filter(d => {
             const data = d.data();
             return data.time === time && !['cancelled', 'completed'].includes(data.status);
         });
         
         if (timeBookings.length >= 3) {
             throw new Error(`Sorry, the time slot for ${time} is completely booked (3/3). Please select a different time or date.`);
         }

         await addDoc(collection(db, 'bookings'), {
              userId: user.uid,
              name,
              email,
              phone,
              services: selectedServices,
              date,
              time,
              status: 'pending',
              estimatedTotal: total,
              createdAt: serverTimestamp()
         });
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Error booking: ", error);
      if (error.message && error.message.includes("Missing or insufficient permissions")) {
         alert("Firebase permissions error: Please update your Firestore Security Rules in the Firebase Console (allow read, write: if true; for test mode).");
      } else {
         alert(error.message || "Failed to book appointment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="py-32 flex justify-center text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <section id="booking" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="bg-gradient-to-br from-[#3b0b75] to-[#7f15b8] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff007f]/20 blur-[100px] rounded-full"></div>
          
          <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-64 h-64 border-[4px] border-white/20 rounded-[3rem] rotate-12 bg-white/5 backdrop-blur-sm items-center justify-center font-bold text-white/40 text-6xl tracking-widest pointer-events-none">
            HAIR
          </div>

          <div className="lg:w-1/2 relative z-10 w-full">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready for a transformation?
            </h2>
            <p className="text-purple-100 mb-8 max-w-md leading-relaxed text-sm">
              Check off the services you'd like, select your date and time, and we'll take care of the rest.
            </p>

            {submitted ? (
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Slot Confirmed</h3>
                <p className="text-purple-200 text-sm">Check your email for details!</p>
                <button onClick={() => {
                  setSubmitted(false);
                  setSelectedServices([]);
                  setName('');
                  setPhone('');
                  setDate('');
                  setSelectedSlot(null);
                }} className="mt-4 text-xs font-semibold text-white/70 hover:text-white underline">Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex bg-[#181423]/80 rounded-xl p-1 border border-white/5 focus-within:border-purple-400 transition-colors">
                       <div className="pl-3 flex items-center justify-center"><UserIcon className="w-4 h-4 text-gray-400" /></div>
                       <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" className="w-full bg-transparent text-white px-3 py-2 text-sm focus:outline-none" />
                     </div>
                     <div className="flex bg-[#181423]/80 rounded-xl p-1 border border-white/5 focus-within:border-purple-400 transition-colors">
                       <div className="pl-3 flex items-center justify-center"><Phone className="w-4 h-4 text-gray-400" /></div>
                       <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone Number" className="w-full bg-transparent text-white px-3 py-2 text-sm focus:outline-none" />
                     </div>
                 </div>
                 
                 <div className="flex bg-[#181423]/80 rounded-xl p-1 border border-white/5 focus-within:border-purple-400 transition-colors">
                   <div className="pl-3 flex items-center justify-center"><Mail className="w-4 h-4 text-gray-400" /></div>
                   <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" className="w-full bg-transparent text-white px-3 py-2 text-sm focus:outline-none opacity-80" readOnly />
                 </div>
                 
                 <div className="bg-[#181423]/80 rounded-xl p-3 border border-white/5 pb-2">
                   <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 px-1 font-semibold">Select Services</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                     {services.map(srv => {
                       const isSelected = selectedServices.includes(srv.id);
                       return (
                        <label key={srv.id} className={`flex items-center p-2.5 border rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-purple-600/30 border-purple-400/60' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isSelected}
                            onChange={() => toggleService(srv.id)}
                          />
                          <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs md:text-sm font-medium text-white truncate flex-1">{srv.title}</span>
                        </label>
                       );
                     })}
                   </div>
                   
                   {selectedServices.length > 0 && (
                     <div className="mt-4 px-1 pt-3 border-t border-white/10 flex justify-between items-center">
                       <span className="text-xs text-gray-300 font-medium tracking-wide">Estimated Total:</span>
                       <span className="text-sm font-bold text-white">₹{total.min} – ₹{total.max}+</span>
                     </div>
                   )}
                 </div>

                 <div className="flex bg-[#181423]/80 rounded-xl p-1 border border-white/5 focus-within:border-purple-400 transition-colors mb-4">
                    <input required value={date} onChange={(e) => {setDate(e.target.value); setSelectedSlot(null);}} type="date" className="w-full bg-transparent text-white px-4 py-2 text-sm focus:outline-none [color-scheme:dark]" min={new Date().toISOString().split('T')[0]} />
                 </div>
                 
                 {date && (
                     <div className="bg-[#181423]/80 rounded-xl p-3 border border-white/5 mb-4">
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 px-1 font-semibold">Select Time Slot</label>
                        {(() => {
                            const slotsToShow = availableSlots.length > 0
                                ? availableSlots
                                : ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => {
                                      const bookedCount = dateBookings.filter(b => b.time === t && !['cancelled', 'completed'].includes(b.status)).length;
                                      return { id: `default-${t}`, time: t, booked: bookedCount, capacity: 3 };
                                  });
                            
                            return (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 mb-3 custom-scrollbar">
                                    {slotsToShow.map(slot => {
                                        const isFull = slot.booked >= slot.capacity;
                                        const isSelected = selectedSlot?.id === slot.id || (!selectedSlot && time === slot.time && slot.id.startsWith('default-'));
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isFull) {
                                                        alert("This time slot is full. Please select a different time or date.");
                                                    } else {
                                                        if (slot.id.startsWith('default-')) {
                                                            setSelectedSlot(null);
                                                            setTime(slot.time);
                                                        } else {
                                                            setSelectedSlot(slot);
                                                            setTime('');
                                                        }
                                                    }
                                                }}
                                                className={`p-2 rounded-lg border text-left flex flex-col transition-all ${
                                                    isFull 
                                                    ? 'bg-red-500/10 border-red-500/20 opacity-60' 
                                                    : isSelected 
                                                        ? 'bg-green-500/20 border-green-500/50' 
                                                        : 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                                                }`}
                                            >
                                                <span className={`text-sm font-bold ${isFull ? 'text-red-400' : 'text-green-400'}`}>{slot.time}</span>
                                                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                                                    {isFull ? 'FULL' : `${slot.capacity - slot.booked} Seats left`}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                        <div className="flex bg-[#181423] p-1 rounded-xl border border-white/10 focus-within:border-purple-400 transition-colors">
                            <input 
                                required={!selectedSlot}
                                value={!selectedSlot ? time : selectedSlot.time} 
                                onChange={(e) => { setTime(e.target.value); setSelectedSlot(null); }} 
                                type="time" 
                                className="w-full bg-transparent text-white px-4 py-2 text-sm focus:outline-none [color-scheme:dark]" 
                                placeholder="Or enter manual time"
                            />
                        </div>
                     </div>
                 )}
                 
                 <button disabled={loading} type="submit" className="w-full mt-2 inline-flex justify-center items-center bg-white text-purple-900 text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                   {loading ? 'Processing...' : 'Confirm Booking'}
                 </button>
                 
                 {formError && (
                    <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-medium text-center">
                       {formError}
                    </div>
                 )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

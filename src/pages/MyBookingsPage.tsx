import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Calendar, Clock, MapPin, X, Trash2, Phone, Download, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { services } from '../data/services';
import { toPng } from 'html-to-image';

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const downloadTicket = async (id: string) => {
      const card = cardRefs.current[id];
      if (!card) return;
      
      setDownloadingId(id);
      try {
          const dataUrl = await toPng(card, {
              backgroundColor: '#181423',
              pixelRatio: 2,
          });
          
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `appointment-${id}.png`;
          link.click();
      } catch (err) {
          console.error("Error downloading ticket:", err);
          alert("Failed to download ticket. Please try again.");
      } finally {
          setDownloadingId(null);
      }
  };

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort client-side to avoid requiring a composite index in Firestore
        data.sort((a: any, b: any) => {
           const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return timeB - timeA;
        });
        setBookings(data);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        // Error handling if index is missing or permission denied
        if (err.message && err.message.includes("Missing or insufficient permissions")) {
            setError("Firebase permissions error: Please update your Firestore Security Rules in the Firebase Console (allow read, write: if true; for test mode) or correctly configure authenticated access.");
        } else if (err.message && err.message.includes("requires an index")) {
            setError("Firebase index required. Please create the required composite index in Firebase Console.");
        } else {
            setError("Failed to load bookings");
        }
      } finally {
        setFetching(false);
      }
    }

    if (!loading) {
      fetchBookings();
    }
  }, [user, loading]);

  if (loading || fetching) return <div className="min-h-screen py-32 flex justify-center text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getServiceNames = (serviceIds: string[]) => {
     if (!serviceIds) return "No Services";
     return serviceIds.map(id => {
         const svc = services.find(s => s.id === id);
         return svc ? svc.title : id;
     }).join(", ");
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#090514] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">My Bookings</h1>
        <p className="text-gray-400 mb-10">Manage your upcoming and past appointments.</p>

        {error ? (
           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
              {error}
           </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#181423] border border-white/5 p-12 rounded-3xl text-center">
             <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
             <h3 className="text-xl font-medium mb-2">No booked appointments yet.</h3>
             <p className="text-gray-400">Head over to the booking page to reserve a slot.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1, duration: 0.5 }}
                 key={booking.id}
                 className="relative group h-full"
               >
                 <div
                   ref={el => cardRefs.current[booking.id] = el}
                   className="bg-[#181423]/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col h-full relative"
                 >
                   <div className="flex justify-between items-start mb-4">
                       <span className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${booking.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : (new Date(booking.date + 'T' + booking.time) > new Date() ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}`}>
                          {booking.status === 'completed' ? 'Completed' : (new Date(booking.date + 'T' + booking.time) > new Date() ? 'Upcoming' : 'Past')}
                       </span>
                       <span className="text-gray-400 text-sm font-medium">₹{booking.estimatedTotal?.min} - ₹{booking.estimatedTotal?.max}+</span>
                   </div>
                   
                   <h3 className="text-xl font-bold mb-4 line-clamp-2">{getServiceNames(booking.services)}</h3>
                   
                   <div className="space-y-3 mb-6 flex-grow">
                       <div className="flex items-center justify-between text-xs text-gray-500 mb-2 border-b border-white/5 pb-2">
                           <span>Booking ID:</span>
                           <span className="font-mono tracking-wider">{booking.id.toUpperCase().substring(0, 8)}</span>
                       </div>
                       {booking.name && (
                          <div className="flex items-center text-gray-200 text-sm font-medium">
                             <User className="w-4 h-4 mr-3 text-purple-400" />
                             {booking.name}
                          </div>
                       )}
                       {booking.phone && (
                          <div className="flex items-center text-gray-400 text-sm">
                             <Phone className="w-4 h-4 mr-3 text-purple-400" />
                             {booking.phone}
                          </div>
                       )}
                      <div className="flex items-center text-gray-400 text-sm">
                         <Calendar className="w-4 h-4 mr-3 text-purple-400" />
                         {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                         <Clock className="w-4 h-4 mr-3 text-purple-400" />
                         {booking.time}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                         <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                         India Style Studio, Gurugram
                      </div>
                   </div>
                 </div>

                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2 mt-12 pr-4">
                    <button
                        onClick={() => downloadTicket(booking.id)}
                        disabled={downloadingId === booking.id}
                        className="bg-black/50 hover:bg-purple-600 text-white p-2 rounded-xl backdrop-blur-md transition-colors shadow-xl border border-white/10"
                        title="Download Ticket"
                    >
                        {downloadingId === booking.id ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Download className="w-4 h-4" />}
                    </button>
                    {/* Add download instructions for user */}
                 </div>
               </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

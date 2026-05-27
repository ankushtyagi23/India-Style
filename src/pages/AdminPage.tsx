import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, onSnapshot, getDoc, runTransaction } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { Settings, LayoutDashboard, Calendar, Clock, Scissors } from 'lucide-react';

import DashboardHome from '../components/admin/DashboardHome';
import BookingsManager from '../components/admin/BookingsManager';
import SlotsManager from '../components/admin/SlotsManager';
import ServicesManager from '../components/admin/ServicesManager';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'slots' | 'services'>('dashboard');
  
  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  // Slots State
  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, [user, isAdmin]);

  useEffect(() => {
     if (!isAdmin) return;
     const q = query(collection(db, 'slots'));
     const unsubscribe = onSnapshot(q, (snapshot) => {
         const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
         setSlots(data);
     });
     return () => unsubscribe();
  }, [isAdmin]);

  async function fetchBookings() {
    if (!isAdmin) return;
    setFetching(true);
    try {
      const q = query(collection(db, 'bookings'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      data.sort((a: any, b: any) => {
         const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
         const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
         return timeB - timeA;
      });
      setBookings(data);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      if (err.message && err.message.includes("Missing or insufficient permissions")) {
          setError("Firebase permissions error: Please update your Firestore Security Rules.");
      } else {
          setError("Failed to load bookings.");
      }
    } finally {
      setFetching(false);
    }
  }

  const handleDeleteBooking = async (id: string) => {
      try {
          const bookingInfo = bookings.find(b => b.id === id);
          if (bookingInfo && bookingInfo.slotId && !['cancelled', 'completed'].includes(bookingInfo.status)) {
              const slotRef = doc(db, 'slots', bookingInfo.slotId);
              await runTransaction(db, async (transaction) => {
                 const slotDoc = await transaction.get(slotRef);
                 if (slotDoc.exists()) {
                     const newBooked = Math.max(0, (slotDoc.data().booked || 0) - 1);
                     transaction.update(slotRef, { booked: newBooked });
                 }
              });
          }
          await deleteDoc(doc(db, 'bookings', id));
          setBookings(bookings.filter(b => b.id !== id));
      } catch(err) {
          console.error("Error deleting", err);
      }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
      try {
          const bookingInfo = bookings.find(b => b.id === id);
          if (bookingInfo && bookingInfo.slotId) {
             const slotRef = doc(db, 'slots', bookingInfo.slotId);
             
             const isFreeing = ['cancelled', 'completed'].includes(newStatus) && !['cancelled', 'completed'].includes(bookingInfo.status);
             const isReclaiming = !['cancelled', 'completed'].includes(newStatus) && ['cancelled', 'completed'].includes(bookingInfo.status);

             if (isFreeing) {
                 // Free up the seat
                 await runTransaction(db, async (transaction) => {
                    const slotDoc = await transaction.get(slotRef);
                    if (slotDoc.exists()) {
                        const newBooked = Math.max(0, (slotDoc.data().booked || 0) - 1);
                        transaction.update(slotRef, { booked: newBooked });
                    }
                 });
             } else if (isReclaiming) {
                 // Reclaim the seat
                 await runTransaction(db, async (transaction) => {
                    const slotDoc = await transaction.get(slotRef);
                    if (slotDoc.exists()) {
                        const newBooked = (slotDoc.data().booked || 0) + 1;
                        transaction.update(slotRef, { booked: newBooked });
                    }
                 });
             }
          }

          await updateDoc(doc(db, 'bookings', id), {
              status: newStatus
          });
          setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      } catch (err) {
          console.error("Error updating", err);
          alert("Failed to update status.");
      }
  }

  if (loading || fetching) return <div className="min-h-screen py-32 flex justify-center text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;

  if (!user || user.email !== 'ankushtyagi122333@gmail.com') {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { id: 'bookings', label: 'Booking Management', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { id: 'slots', label: 'Time Slots', icon: <Clock className="w-4 h-4 mr-2" /> },
    { id: 'services', label: 'Services', icon: <Scissors className="w-4 h-4 mr-2" /> },
  ] as const;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#090514] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center">
                   <Settings className="w-8 h-8 mr-3 text-purple-500" />
                   Admin Workspace
                </h1>
                <p className="text-gray-400">Manage bookings, schedules, and services.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 bg-[#181423] p-1.5 rounded-xl border border-white/5 w-full md:w-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-1 md:flex-none justify-center ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {error && (
           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6 font-medium">
              {error}
           </div>
        )}

        {/* Dynamic Content */}
        <div className="animate-in fade-in duration-500">
           {activeTab === 'dashboard' && <DashboardHome bookings={bookings} />}
           {activeTab === 'bookings' && <BookingsManager bookings={bookings} onStatusUpdate={handleStatusUpdate} onDelete={handleDeleteBooking} />}
           {activeTab === 'slots' && <SlotsManager slots={slots} />}
           {activeTab === 'services' && <ServicesManager />}
        </div>

      </div>
    </div>
  );
}

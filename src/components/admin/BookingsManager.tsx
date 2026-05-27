import React, { useState, useMemo } from 'react';
import { Search, Eye, Check, X, Trash2, Calendar, Clock, MapPin, User, Mail, Phone } from 'lucide-react';
import { services } from '../../data/services'; // fallback

interface BookingsManagerProps {
  bookings: any[];
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BookingsManager({ bookings, onStatusUpdate, onDelete }: BookingsManagerProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = (b.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (b.email?.toLowerCase() || '').includes(search.toLowerCase());
      
      if (!matchSearch) return false;
      if (activeTab === 'all') return true;
      if (activeTab === 'new' && b.status === 'pending') return true;
      return b.status === activeTab;
    });
  }, [bookings, activeTab, search]);

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'new', label: 'New/Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map(t => (
               <button
                 key={t.id}
                 onClick={() => setActiveTab(t.id)}
                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                   activeTab === t.id ? 'bg-purple-600 text-white' : 'bg-[#181423] text-gray-400 hover:text-white border border-white/5'
                 }`}
               >
                  {t.label}
               </button>
            ))}
          </div>
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <input 
               type="text" 
               placeholder="Search name or email..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="pl-9 pr-4 py-2 bg-[#181423] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 w-full lg:w-64"
             />
          </div>
       </div>

       <div className="bg-[#181423] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Customer</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Apt. Date & Time</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Booked On</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {filteredBookings.map(b => (
                     <tr key={b.id} className="hover:bg-white/5 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-medium text-white">{b.name}</div>
                         <div className="text-gray-400 text-xs">{b.email}</div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-white">{b.date}</div>
                         <div className="text-gray-400 text-xs">{b.time}</div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-gray-400 text-xs text-wrap w-24">
                            {b.createdAt ? new Date(b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            b.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                            b.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' :
                            b.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'
                         }`}>
                            {b.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 text-gray-400">
                             <button onClick={() => setSelectedBooking(b)} className="p-2 hover:text-white transition-colors title='View'"><Eye className="w-4 h-4" /></button>
                             {b.status === 'pending' && <button onClick={() => onStatusUpdate(b.id, 'accepted')} className="p-2 hover:text-blue-400 transition-colors title='Accept'"><Check className="w-4 h-4" /></button>}
                             {(b.status === 'pending' || b.status === 'accepted') && <button onClick={() => onStatusUpdate(b.id, 'completed')} className="p-2 hover:text-green-400 transition-colors title='Complete'"><Check className="w-4 h-4" /></button>}
                             {b.status !== 'cancelled' && <button onClick={() => onStatusUpdate(b.id, 'cancelled')} className="p-2 hover:text-red-400 transition-colors title='Cancel'"><X className="w-4 h-4" /></button>}
                             <button onClick={() => onDelete(b.id)} className="p-2 hover:text-red-500 transition-colors title='Delete'"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </td>
                     </tr>
                   ))}
                   {filteredBookings.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No bookings match your filters.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

       {/* Booking Details Modal */}
       {selectedBooking && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#181423] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-xl font-bold">Booking Details</h3>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                           selectedBooking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                           selectedBooking.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' :
                           selectedBooking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                           'bg-yellow-500/10 text-yellow-500'
                        }`}>{selectedBooking.status}</span>
                     </div>
                     <span className="text-purple-400 font-medium">Est. ₹{selectedBooking.estimatedTotal?.min || 0}+</span>
                  </div>

                     <div className="flex justify-between items-center bg-black/20 rounded-xl p-4">
                        <div className="space-y-3">
                           <div className="flex items-center text-gray-300 text-sm"><User className="w-4 h-4 mr-3 text-purple-400" />{selectedBooking.name}</div>
                           <div className="flex items-center text-gray-300 text-sm"><Phone className="w-4 h-4 mr-3 text-purple-400" />{selectedBooking.phone || 'N/A'}</div>
                           <div className="flex items-center text-gray-300 text-sm"><Mail className="w-4 h-4 mr-3 text-purple-400" />{selectedBooking.email}</div>
                        </div>
                        <div className="space-y-3 border-l border-white/10 pl-4">
                           <div className="flex items-center text-gray-300 text-sm"><Calendar className="w-4 h-4 mr-3 text-purple-400" />{selectedBooking.date}</div>
                           <div className="flex items-center text-gray-300 text-sm"><Clock className="w-4 h-4 mr-3 text-purple-400" />{selectedBooking.time}</div>
                           {selectedBooking.createdAt && (
                              <div className="text-xs text-gray-500 mt-2">Booked: {new Date(selectedBooking.createdAt?.toMillis ? selectedBooking.createdAt.toMillis() : selectedBooking.createdAt).toLocaleString()}</div>
                           )}
                        </div>
                     </div>

                  <div>
                     <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-3">Requested Services</h4>
                     <ul className="space-y-2">
                        {selectedBooking.services?.map((svcId: string) => {
                           const svcInfo = services.find(s => s.id === svcId);
                           return (
                             <li key={svcId} className="flex justify-between text-sm bg-white/5 px-3 py-2 rounded-lg">
                               <span>{svcInfo ? svcInfo.title : svcId}</span>
                               <span className="text-gray-400">{svcInfo ? `₹${svcInfo.basePrice}+` : ''}</span>
                             </li>
                           );
                        })}
                     </ul>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
}

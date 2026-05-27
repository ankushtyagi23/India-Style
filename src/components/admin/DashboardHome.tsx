import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardHomeProps {
  bookings: any[];
}

export default function DashboardHome({ bookings }: DashboardHomeProps) {
  const [reportPeriod, setReportPeriod] = useState('30days');

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pending = 0;
    let accepted = 0;
    let cancelled = 0;
    let completed = 0;
    
    // Simulating users count from bookings (unique emails)
    const uniqueUsers = new Set();
    
    // Filter bookings based on period if we had real dates, but for now we just show all or mock it
    const filteredBookings = bookings; 

    filteredBookings.forEach(b => {
      uniqueUsers.add(b.email || b.userId);
      // calc revenue based on estimatedTotal.min or max (using min for conservative estimate)
      if (b.status === 'completed' && b.estimatedTotal) {
        totalRevenue += b.estimatedTotal.min || 0;
      }
      
      if (b.status === 'pending') pending++;
      else if (b.status === 'accepted') accepted++;
      else if (b.status === 'cancelled') cancelled++;
      else if (b.status === 'completed') completed++;
    });

    return {
      users: uniqueUsers.size,
      totalBookings: filteredBookings.length,
      revenue: totalRevenue,
      pending,
      accepted,
      cancelled,
      completed
    };
  }, [bookings, reportPeriod]);

  // Generate some mock historical data based on current stats for charts
  const lineChartData = [
    { name: 'Jan', revenue: Math.random() * 5000, bookings: Math.floor(Math.random() * 50) },
    { name: 'Feb', revenue: Math.random() * 6000, bookings: Math.floor(Math.random() * 60) },
    { name: 'Mar', revenue: Math.random() * 7000, bookings: Math.floor(Math.random() * 70) },
    { name: 'Apr', revenue: Math.random() * 8000, bookings: Math.floor(Math.random() * 80) },
    { name: 'May', revenue: stats.revenue || 5000, bookings: stats.totalBookings || 40 },
  ];

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Accepted', value: stats.accepted, color: '#3b82f6' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (pieData.length === 0) pieData.push({ name: 'Empty', value: 1, color: '#4b5563' });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <div className="flex bg-[#181423] p-1 rounded-xl border border-white/5">
              {['7days', '30days', 'yearly'].map(period => (
                 <button
                   key={period}
                   onClick={() => setReportPeriod(period)}
                   className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${reportPeriod === period ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                 >
                   {period === '7days' ? '7 Days' : period === '30days' ? '30 Days' : 'Yearly'}
                 </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-purple-900/40 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
           <p className="text-gray-400 font-medium mb-1 text-sm">Users</p>
           <h3 className="text-3xl font-bold">{stats.users}</h3>
        </div>
        <div className="bg-gradient-to-br from-blue-900/40 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
           <p className="text-gray-400 font-medium mb-1 text-sm">Bookings</p>
           <h3 className="text-3xl font-bold">{stats.totalBookings}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-900/40 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
           <p className="text-gray-400 font-medium mb-1 text-sm">Revenue</p>
           <h3 className="text-3xl font-bold">₹{stats.revenue}</h3>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
           <p className="text-gray-400 font-medium mb-1 text-sm">Pending</p>
           <h3 className="text-2xl font-bold">{stats.pending}</h3>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
           <p className="text-gray-400 font-medium mb-1 text-sm">Accepted</p>
           <h3 className="text-2xl font-bold">{stats.accepted}</h3>
        </div>
        <div className="bg-gradient-to-br from-red-900/40 to-[#181423] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
           <p className="text-gray-400 font-medium mb-1 text-sm">Cancelled</p>
           <h3 className="text-2xl font-bold">{stats.cancelled}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#181423] p-6 rounded-2xl border border-white/5">
           <h3 className="font-bold text-lg mb-6 text-gray-200">Revenue Growth</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={lineChartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                 <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                 <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                 <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                 <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-[#181423] p-6 rounded-2xl border border-white/5">
           <h3 className="font-bold text-lg mb-6 text-gray-200">Bookings by Status</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#090514', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-[#181423] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
           <h3 className="font-bold text-lg text-gray-200">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Customer</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date & Time</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Service Count</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.slice(0, 5).map(b => (
                 <tr key={b.id} className="hover:bg-white/5 transition-colors">
                   <td className="px-6 py-4">
                     <div className="font-medium text-white">{b.name}</div>
                     <div className="text-gray-400 text-xs">{b.email}</div>
                   </td>
                   <td className="px-6 py-4">
                     <div>{b.date}</div>
                     <div className="text-gray-400 text-xs">{b.time}</div>
                   </td>
                   <td className="px-6 py-4 text-gray-300">
                     {b.services?.length || 0} selected
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
                 </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

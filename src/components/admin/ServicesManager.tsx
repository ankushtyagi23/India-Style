import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Save } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function ServicesManager() {
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Forms
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    maxPrice: '',
    duration: '30 mins',
    category: 'Haircuts',
    status: 'Active',
    image: '',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
       setServicesData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (svc: any) => {
     setIsEditing(svc.id);
     setFormData({
       title: svc.title || '',
       description: svc.description || '',
       basePrice: svc.basePrice || '',
       maxPrice: svc.maxPrice || '',
       duration: svc.duration || '30 mins',
       category: svc.category || 'Haircuts',
       status: svc.status || 'Active',
       image: svc.image || '',
     });
     setIsAdding(false);
  };

  const handleAddNew = () => {
     setIsAdding(true);
     setIsEditing(null);
     setFormData({
       title: '', description: '', basePrice: '', maxPrice: '', duration: '30 mins', category: 'Haircuts', status: 'Active', image: ''
     });
  };

  const handleSave = async (e: React.FormEvent) => {
     e.preventDefault();
     const payload = {
        ...formData,
        basePrice: parseInt(formData.basePrice) || 0,
        maxPrice: parseInt(formData.maxPrice) || 0,
     };
     
     try {
       if (isEditing) {
         await updateDoc(doc(db, 'services', isEditing), payload);
       } else {
         await addDoc(collection(db, 'services'), payload);
       }
       setIsAdding(false);
       setIsEditing(null);
     } catch (err) {
       console.error("Error saving service", err);
     }
  };

  const handleDelete = async (id: string) => {
     try {
       await deleteDoc(doc(db, 'services', id));
     } catch (err) {
       console.error(err);
     }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-[#181423] p-4 rounded-2xl border border-white/5">
          <div className="flex gap-2">
             <button onClick={() => setViewMode('grid')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>Grid View</button>
             <button onClick={() => setViewMode('table')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>Table View</button>
          </div>
          <button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center">
             <Plus className="w-4 h-4 mr-2" /> Add Service
          </button>
       </div>

       {(isAdding || isEditing) && (
         <div className="bg-[#181423] p-6 rounded-2xl border border-purple-500/50 mb-8 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
               <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Service Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none">
                       <option>Haircuts</option><option>Styling</option><option>Coloring</option><option>Beard Grooming</option><option>Spa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Base Price (₹)</label>
                    <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Max Price (₹)</label>
                    <input required type="number" name="maxPrice" value={formData.maxPrice} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Duration</label>
                    <input required name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white">
                       <option>Active</option><option>Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-gray-400 mb-1">Image URL</label>
                    <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                    {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-white/10" />}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-gray-400 mb-1">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
               </div>
               <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 px-6 rounded-xl transition-colors flex items-center">
                 <Save className="w-4 h-4 mr-2" /> Save Service
               </button>
            </form>
         </div>
       )}

       {viewMode === 'grid' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map(svc => (
               <div key={svc.id} className="bg-[#181423] rounded-2xl border border-white/5 overflow-hidden group">
                  <div className="h-48 bg-[#090514] relative">
                     {svc.image ? (
                        <img src={svc.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={40} /></div>
                     )}
                     <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => handleEdit(svc)} className="p-2 bg-black/50 hover:bg-black/80 backdrop-blur rounded-lg text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(svc.id)} className="p-2 bg-black/50 hover:bg-red-500/80 backdrop-blur rounded-lg text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                  <div className="p-5">
                     <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-lg leading-tight">{svc.title}</h4>
                         <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${svc.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{svc.status}</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-4 line-clamp-2">{svc.description}</p>
                     <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-purple-400">₹{svc.basePrice} - ₹{svc.maxPrice}</span>
                        <span className="text-gray-500">{svc.duration}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
       ) : (
         <div className="bg-[#181423] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Service</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Category</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Price Range</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {servicesData.map(svc => (
                       <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center">
                               {svc.image ? <img src={svc.image} className="w-10 h-10 rounded-lg object-cover mr-3" /> : <div className="w-10 h-10 bg-white/5 rounded-lg mr-3"></div>}
                               <div>
                                  <div className="font-medium text-white">{svc.title}</div>
                                  <div className="text-gray-400 text-xs">{svc.duration}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-gray-300">{svc.category}</td>
                         <td className="px-6 py-4 text-purple-400 font-medium">₹{svc.basePrice} - {svc.maxPrice}</td>
                         <td className="px-6 py-4">
                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${svc.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{svc.status}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => handleEdit(svc)} className="p-2 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(svc.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                         </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
       )}
    </div>
  );
}

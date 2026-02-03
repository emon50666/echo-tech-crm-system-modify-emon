
import React, { useState, useEffect } from 'react';
import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  onAddClientWithProject: (data: { client: Omit<Client, 'id' | 'createdAt'>, project: { title: string, budget: number, advance: number, startDate: string, endDate: string } }) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onAddClientWithProject, onUpdateClient, onDeleteClient }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '',
    registrationDate: new Date().toISOString().split('T')[0],
    projectTitle: '',
    budget: 0,
    advance: 0,
    projectStartDate: new Date().toISOString().split('T')[0],
    projectEndDate: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClientWithProject({
      client: { 
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone, 
        company: formData.company,
        registrationDate: formData.registrationDate
      },
      project: { 
        title: formData.projectTitle, 
        budget: formData.budget, 
        advance: formData.advance,
        startDate: formData.projectStartDate,
        endDate: formData.projectEndDate
      }
    });
    closeAddModal();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      onUpdateClient(editingClient);
      setEditingClient(null);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      registrationDate: new Date().toISOString().split('T')[0],
      projectTitle: '', 
      budget: 0, 
      advance: 0,
      projectStartDate: new Date().toISOString().split('T')[0],
      projectEndDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Clients & Sales</h1>
          <p className="text-slate-500">Managing {clients.length} business relationships.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-2 font-bold transition">
          <i className="fa-solid fa-plus"></i> Add New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setEditingClient({ ...client })} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition"><i className="fa-solid fa-pencil text-xs"></i></button>
              <button onClick={() => onDeleteClient(client.id)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition"><i className="fa-solid fa-trash text-xs"></i></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">
                {client.company[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-tighter">{client.company}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{client.name}</p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <i className="fa-solid fa-envelope w-4 opacity-40"></i>
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <i className="fa-solid fa-calendar-day w-4 opacity-40"></i>
                <span className="font-medium">Joined: {client.registrationDate || new Date(client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in flex flex-col">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold uppercase tracking-tighter">Client Registration & Project Launcher</h3>
              <button onClick={closeAddModal}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2 tracking-widest">Section 1: Identity</h4></div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Company / Brand</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Contact Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Business Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Phone Number</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Joining Date</label>
                  <input required type="date" value={formData.registrationDate} onChange={e => setFormData({...formData, registrationDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-indigo-600" />
                </div>
                
                <div className="col-span-2 pt-4"><h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2 tracking-widest">Section 2: First Project Deployment</h4></div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Initial Project Name</label>
                  <input required value={formData.projectTitle} onChange={e => setFormData({...formData, projectTitle: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Total Project Price (৳)</label>
                  <input required type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Advance Amount (৳)</label>
                  <input required type="number" value={formData.advance} onChange={e => setFormData({...formData, advance: Number(e.target.value)})} className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl outline-none font-black text-emerald-700" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Project Start Date</label>
                  <input required type="date" value={formData.projectStartDate} onChange={e => setFormData({...formData, projectStartDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expected Delivery</label>
                  <input required type="date" value={formData.projectEndDate} onChange={e => setFormData({...formData, projectEndDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-orange-600" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 mt-6 uppercase tracking-widest text-xs">Register Client & Deploy Build</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center rounded-t-3xl">
              <h3 className="font-bold">Edit Client Profile</h3>
              <button onClick={() => setEditingClient(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Company</label>
                <input required value={editingClient.company} onChange={e => setEditingClient({...editingClient, company: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Contact Name</label>
                <input required value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Email</label>
                <input required type="email" value={editingClient.email} onChange={e => setEditingClient({...editingClient, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Phone</label>
                <input required value={editingClient.phone} onChange={e => setEditingClient({...editingClient, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Joining Date</label>
                <input required type="date" value={editingClient.registrationDate || ''} onChange={e => setEditingClient({...editingClient, registrationDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;

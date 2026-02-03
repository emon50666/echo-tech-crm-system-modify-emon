
import React, { useState } from 'react';
import { Client, WebsiteAccess } from '../types';

interface AccessDetailsProps {
  clients: Client[];
  onUpdateClientAccess: (clientId: string, access: WebsiteAccess) => void;
}

const AccessDetails: React.FC<AccessDetailsProps> = ({ clients, onUpdateClientAccess }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<WebsiteAccess>({ url: '', username: '', password: '' });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    onUpdateClientAccess(selectedClientId, formData);
    setFormData({ url: '', username: '', password: '' });
    setSelectedClientId('');
  };

  const togglePass = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Access Management</h1>
          <p className="text-slate-500">Secure storage for client website credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD FORM */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-indigo-600"></i>
            Assign Credentials
          </h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Target Client</label>
              <select 
                required 
                value={selectedClientId} 
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
              >
                <option value="">Select a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Website URL</label>
              <input 
                required 
                type="url" 
                placeholder="https://example.com"
                value={formData.url} 
                onChange={e => setFormData({...formData, url: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Username / Email</label>
              <input 
                required 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Password</label>
              <input 
                required 
                type="text"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
              Save Access Keys
            </button>
          </form>
        </div>

        {/* LIST VIEW */}
        <div className="lg:col-span-2 space-y-4">
          {clients.filter(c => c.access).map(client => (
            <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex-1">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{client.company}</p>
                <h4 className="font-bold text-slate-900 text-lg">{client.name}</h4>
                <a href={client.access?.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline font-medium mt-1 inline-block hover:text-blue-800 transition">
                  <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i> {client.access?.url}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Username</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{client.access?.username}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group/pass">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Password</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-bold text-slate-700">
                      {showPasswords[client.id] ? client.access?.password : '••••••••'}
                    </p>
                    <button onClick={() => togglePass(client.id)} className="text-slate-400 hover:text-indigo-600 transition">
                      <i className={`fa-solid ${showPasswords[client.id] ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {clients.filter(c => c.access).length === 0 && (
            <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 italic">
              No access credentials stored yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDetails;

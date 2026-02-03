
import React, { useState } from 'react';
import { Project, ProjectStatus, Client, PaymentStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ProjectListProps {
  projects: Project[];
  clients: Client[];
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, clients, onUpdateStatus, onAddProject, onDeleteProject, onUpdateProject }) => {
  const [filter, setFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    description: '',
    price: 0,
    advancePaid: 0,
    status: ProjectStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    startDate: new Date().toISOString().split('T')[0],
    estDeliveryDate: '',
    notes: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject(formData);
    setIsAddModalOpen(false);
    setFormData({
      title: '', 
      clientId: '', 
      description: '', 
      price: 0, 
      advancePaid: 0,
      status: ProjectStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      startDate: new Date().toISOString().split('T')[0],
      estDeliveryDate: '',
      notes: ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      onUpdateProject(editingProject);
      setEditingProject(null);
    }
  };

  const filteredProjects = projects.filter(p => filter === 'All' || p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project Hub</h1>
          <p className="text-slate-500">Managing {projects.length} development cycles.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition text-sm">
          <i className="fa-solid fa-rocket"></i> Launch Project
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', ...Object.values(ProjectStatus)].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map(project => {
          const client = clients.find(c => c.id === project.clientId);
          const due = project.price - project.advancePaid;
          return (
            <div key={project.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-200 transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tighter">{project.title}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-black border ${STATUS_COLORS[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>{client?.company || 'Unknown Client'}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-indigo-500">Timeline: {project.startDate} to {project.estDeliveryDate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Price</p>
                   <p className="text-sm font-black text-slate-900">৳{project.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Due Balance</p>
                   <p className="text-sm font-black text-orange-600">৳{due.toLocaleString()}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <select 
                    value={project.status} 
                    onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                    className="text-xs border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setEditingProject(project)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button onClick={() => onDeleteProject(project.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">New Project Launch</h3>
              <button onClick={() => setIsAddModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Project Name</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Project Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estimated Delivery</label>
                  <input required type="date" value={formData.estDeliveryDate} onChange={e => setFormData({...formData, estDeliveryDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-indigo-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Total Project Price (৳)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Advance Amount (৳)</label>
                  <input required type="number" value={formData.advancePaid} onChange={e => setFormData({...formData, advancePaid: Number(e.target.value)})} className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl outline-none font-black text-emerald-700" />
                </div>
                <div className="col-span-2">
                   <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Client Business</label>
                   <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                     <option value="">Choose client...</option>
                     {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                   </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl mt-4">Initiate Build</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Edit Project Configuration</h3>
              <button onClick={() => setEditingProject(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Project Name</label>
                  <input required value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Start Date</label>
                  <input required type="date" value={editingProject.startDate} onChange={e => setEditingProject({...editingProject, startDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expected Delivery</label>
                  <input required type="date" value={editingProject.estDeliveryDate} onChange={e => setEditingProject({...editingProject, estDeliveryDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Total Project Price (৳)</label>
                  <input required type="number" value={editingProject.price} onChange={e => setEditingProject({...editingProject, price: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Advance Amount (৳)</label>
                  <input required type="number" value={editingProject.advancePaid} onChange={e => setEditingProject({...editingProject, advancePaid: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl mt-4">Save Configuration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

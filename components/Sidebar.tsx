
import React from 'react';
import { NavIcons } from '../constants';
import { AgencyProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agency: AgencyProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, agency }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: NavIcons.Dashboard },
    { id: 'projects', label: 'Projects', icon: NavIcons.Projects },
    { id: 'clients', label: 'Clients', icon: NavIcons.Clients },
    { id: 'access', label: 'Access Details', icon: <i className="fa-solid fa-key"></i> },
    { id: 'invoices', label: 'Invoices', icon: NavIcons.Invoices },
    { id: 'completed', label: 'Completed Payments', icon: <i className="fa-solid fa-circle-check"></i> },
    { id: 'activity', label: 'Activity Logs', icon: NavIcons.Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col transition-all duration-300 print:hidden z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <i className="fa-solid fa-code text-xl"></i>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">{agency.name}</span>
      </div>
      
      <nav className="flex-1 mt-6 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg w-6 flex justify-center">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-4 ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
          <span className="text-lg">{NavIcons.Settings}</span>
          <span className="font-medium">Settings</span>
        </button>
        <div className="flex items-center gap-3 px-4 py-2 border-t border-slate-800 pt-4">
          <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-indigo-400">E</div>
          <div className="text-[10px]">
            <p className="font-semibold text-white uppercase">{agency.ownerName}</p>
            <p className="text-slate-500 uppercase tracking-widest">{agency.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

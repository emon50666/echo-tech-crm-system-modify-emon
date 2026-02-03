
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, ProjectStatus, Client, Invoice } from '../types';

interface DashboardProps {
  projects: Project[];
  clients: Client[];
  invoices: Invoice[];
}

const data = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Feb', revenue: 65000 },
  { month: 'Mar', revenue: 95000 },
  { month: 'Apr', revenue: 80000 },
];

const Dashboard: React.FC<DashboardProps> = ({ projects, clients, invoices }) => {
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
  const totalProjectValue = projects.reduce((acc, p) => acc + p.price, 0);
  const invoicedAmount = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: `৳${totalProjectValue.toLocaleString()}`, icon: 'fa-bangladeshi-taka-sign', color: 'bg-indigo-500' },
          { label: 'Revenue Invoiced', value: `৳${invoicedAmount.toLocaleString()}`, icon: 'fa-file-invoice-dollar', color: 'bg-emerald-500' },
          { label: 'Active Projects', value: activeProjects, icon: 'fa-rocket', color: 'bg-blue-500' },
          { label: 'Total Clients', value: clients.length, icon: 'fa-users', color: 'bg-violet-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`${stat.color} w-10 h-10 rounded-xl text-white flex items-center justify-center mb-4`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Financial Growth (৳)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Work Pipeline</h3>
            <div className="space-y-4">
              {Object.values(ProjectStatus).map(status => {
                const count = projects.filter(p => p.status === status).length;
                const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                      <span className="text-slate-400">{status}</span>
                      <span className="text-slate-900">{count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
             <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Owner Action Required</p>
             <p className="text-sm font-medium">
               {projects.length < 3 ? "Pipeline is thin. Draft 3 new proposals for potential leads." : "Delivery high! Review QA for pending projects."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

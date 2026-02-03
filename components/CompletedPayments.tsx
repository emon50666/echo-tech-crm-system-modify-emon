
import React from 'react';
import { Project, Client, Invoice, PaymentStatus } from '../types';

interface CompletedPaymentsProps {
  projects: Project[];
  clients: Client[];
  invoices: Invoice[];
}

const CompletedPayments: React.FC<CompletedPaymentsProps> = ({ projects, clients, invoices }) => {
  const completedProjects = projects.filter(p => p.paymentStatus === PaymentStatus.PAID);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700">Completed Payments Dashboard</h1>
          <p className="text-slate-500">Archive of all projects that reached 100% financial settlement.</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Settled Value</p>
           <p className="text-xl font-black text-emerald-800">৳{completedProjects.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Client / Project</th>
              <th className="px-6 py-4">Total Budget</th>
              <th className="px-6 py-4">Advance Paid</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Settlement Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {completedProjects.map(p => {
              const client = clients.find(c => c.id === p.clientId);
              return (
                <tr key={p.id} className="hover:bg-emerald-50/20 transition group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 uppercase tracking-tighter">{client?.company || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-900">৳{p.price.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-emerald-600">৳{p.advancePaid.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-200 shadow-sm shadow-emerald-100/50">Fully Paid</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-bold text-slate-400">{new Date().toDateString()}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {completedProjects.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <i className="fa-solid fa-sack-dollar text-2xl"></i>
            </div>
            <p className="text-slate-400 font-medium italic">No fully settled accounts recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedPayments;

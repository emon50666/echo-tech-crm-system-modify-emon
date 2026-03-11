
import React, { useState } from 'react';
import { Invoice, Project, Client, AgencyProfile } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  projects: Project[];
  clients: Client[];
  agency: AgencyProfile;
  onAddInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onDeleteInvoice: (id: string) => void;
  onUpdateInvoiceStatus: (id: string, status: 'Paid' | 'Unpaid') => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, projects, clients, agency, onAddInvoice, onDeleteInvoice, onUpdateInvoiceStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({ projectId: '', amount: 0, status: 'Unpaid' as any, dueDate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInvoice(formData);
    setIsModalOpen(false);
    setFormData({ projectId: '', amount: 0, status: 'Unpaid', dueDate: '' });
  };

  const getClientForInvoice = (inv: Invoice) => {
    const project = projects.find(p => p.id === inv.projectId);
    return clients.find(c => c.id === project?.clientId);
  };

  const getCalculations = (inv: Invoice) => {
    const project = projects.find(p => p.id === inv.projectId);
    if (!project) return { total: 0, advance: 0, totalDue: 0, paidInstallments: 0, netPaid: 0, remaining: 0, current: 0 };

    const totalBudget = project.price;
    const advance = project.advancePaid;
    
    // Total Due as per user request: Price - Advance
    const totalDue = totalBudget - advance;
    
    // Sum of all PAID installment invoices
    // NOTE: To fix the double-counting, we filter out any invoices that might have been created to represent the advance
    const paidInstallments = invoices
      .filter(i => i.projectId === project.id && i.status === 'Paid' && i.amount !== advance)
      .reduce((sum, i) => sum + i.amount, 0);

    const netPaidSoFar = advance + paidInstallments;
    const remainingBalance = totalBudget - netPaidSoFar;

    return {
      total: totalBudget,
      advance: advance,
      totalDue: totalDue, // Total - Advance
      paidInstallments: paidInstallments,
      netPaid: netPaidSoFar,
      remaining: Math.max(0, remainingBalance),
      current: inv.amount
    };
  };

  const handleWhatsAppShare = (inv: Invoice) => {
    const project = projects.find(p => p.id === inv.projectId);
    const client = getClientForInvoice(inv);
    if (!client || !project) return;
    
    const calcs = getCalculations(inv);
    
    const message = `*INVOICE FROM ${agency.name}* ✅\n` +
      `--------------------------\n` +
      `*MD EMON TALUKDAR*\n` +
      `--------------------------\n` +
      `*Invoice #:* INV-${inv.id.slice(-6).toUpperCase()}\n` +
      `*Project:* ${project.title}\n` +
      `*Timeline:* ${project.startDate} to ${project.estDeliveryDate}\n\n` +
      `*Total Project Price:* ৳${calcs.total.toLocaleString()}\n` +
      `*Advance Payment Amount:* ৳${calcs.advance.toLocaleString()}\n` +
      `*Total Due (Price - Advance):* ৳${calcs.totalDue.toLocaleString()}\n` +
      `*Current Installment:* ৳${inv.amount.toLocaleString()}\n` +
      `*Final Remaining Balance:* ৳${calcs.remaining.toLocaleString()}\n\n` +
      `Thank you for your business!`;
      
    const encodedMsg = encodeURIComponent(message);
    
    let phone = client.phone.replace(/[^0-9]/g, '');
    if (phone.length === 11 && phone.startsWith('0')) {
      phone = '88' + phone;
    }
    
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  const handleEmailShare = (inv: Invoice) => {
    const project = projects.find(p => p.id === inv.projectId);
    const client = getClientForInvoice(inv);
    if (!client || !project) return;
    
    const calcs = getCalculations(inv);
    
    const subject = `Invoice INV-${inv.id.slice(-6).toUpperCase()} from ${agency.name}`;
    const message = `INVOICE FROM ${agency.name}\n` +
      `--------------------------\n` +
      `MD EMON TALUKDAR\n` +
      `--------------------------\n` +
      `Invoice #: INV-${inv.id.slice(-6).toUpperCase()}\n` +
      `Project: ${project.title}\n` +
      `Timeline: ${project.startDate} to ${project.estDeliveryDate}\n\n` +
      `Total Project Price: ৳${calcs.total.toLocaleString()}\n` +
      `Advance Payment Amount: ৳${calcs.advance.toLocaleString()}\n` +
      `Total Due (Price - Advance): ৳${calcs.totalDue.toLocaleString()}\n` +
      `Current Installment: ৳${inv.amount.toLocaleString()}\n` +
      `Final Remaining Balance: ৳${calcs.remaining.toLocaleString()}\n\n` +
      `Thank you for your business!`;
      
    const encodedSubject = encodeURIComponent(subject);
    const encodedMsg = encodeURIComponent(message);
    
    window.open(`mailto:${client.email}?subject=${encodedSubject}&body=${encodedMsg}`, '_blank');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Billing & Invoices</h1>
          <p className="text-slate-500">Managing project cashflow and installments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition">
          <i className="fa-solid fa-file-invoice-dollar"></i> Generate Installment
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(inv => {
              const project = projects.find(p => p.id === inv.projectId);
              return (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">#{inv.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 uppercase tracking-tighter">{project?.title || 'Unknown Build'}</td>
                  <td className="px-6 py-4 font-black text-slate-900">৳{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {inv.status !== 'Paid' && (
                      <button onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg hover:bg-emerald-600 hover:text-white transition">Mark Paid</button>
                    )}
                    <button onClick={() => setPreviewInvoice(inv)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"><i className="fa-solid fa-eye text-xs"></i></button>
                    <button onClick={() => onDeleteInvoice(inv.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-red-500 transition"><i className="fa-solid fa-trash text-xs"></i></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {invoices.length === 0 && <div className="p-20 text-center text-slate-400 font-medium italic uppercase tracking-widest text-[10px]">No billing records found</div>}
      </div>

      {previewInvoice && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 print:p-0 print:bg-white print:static print:flex-col">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in print:h-auto print:shadow-none print:rounded-none print:w-full print:static">
            
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0 print:hidden">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-file-invoice"></i></div>
                 <h3 className="font-bold tracking-tight uppercase text-sm">Invoice Preview</h3>
               </div>
               <div className="flex gap-3">
                 <button onClick={handleDownloadPDF} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                   <i className="fa-solid fa-print"></i> Print / PDF
                 </button>
                 <button onClick={() => handleEmailShare(previewInvoice)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                   <i className="fa-solid fa-envelope"></i> Email
                 </button>
                 <button onClick={() => handleWhatsAppShare(previewInvoice)} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                   <i className="fa-brands fa-whatsapp"></i> WhatsApp
                 </button>
                 <button onClick={() => setPreviewInvoice(null)} className="p-2 hover:bg-white/10 rounded-lg"><i className="fa-solid fa-xmark"></i></button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-100 p-8 sm:p-12 print:bg-white print:p-0">
              <div id="invoice-pdf-view" className="bg-white max-w-3xl mx-auto shadow-xl p-12 text-slate-800 min-h-[1000px] flex flex-col print:shadow-none print:border-none print:w-full print:p-10">
                
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h1 className="text-4xl font-black text-indigo-600 tracking-tighter uppercase">{agency.name}</h1>
                    <p className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase mt-1">{agency.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">INVOICE</h2>
                    <p className="text-sm font-bold text-slate-700 tracking-widest">#INV-{previewInvoice.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Date: {new Date(previewInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-20 mb-12 border-t border-slate-100 pt-10">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 inline-block">From:</h4>
                    <p className="text-lg font-black text-slate-900 mb-1">{agency.ownerName}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{agency.address}</p>
                    <p className="text-sm text-slate-500">{agency.phone}</p>
                    <p className="text-sm text-indigo-600 font-bold underline">{agency.email}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 inline-block">Bill To:</h4>
                    {(() => {
                      const client = getClientForInvoice(previewInvoice);
                      return (
                        <div>
                          <p className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tighter">{client?.company}</p>
                          <p className="text-sm text-slate-500 font-bold">{client?.name}</p>
                          <p className="text-sm text-indigo-600 font-bold underline">{client?.email}</p>
                          <p className="text-sm text-slate-500">{client?.phone}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                   {(() => {
                     const project = projects.find(p => p.id === previewInvoice.projectId);
                     return (
                       <>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Project Start</p>
                            <p className="text-sm font-black text-slate-900">{project?.startDate || 'N/A'}</p>
                         </div>
                         <div className="flex-1 px-8 text-center">
                            <div className="h-0.5 bg-slate-200 w-full relative">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[8px] font-black text-indigo-500 uppercase tracking-widest">Project Duration</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expected End</p>
                            <p className="text-sm font-black text-indigo-600 italic">{project?.estDeliveryDate || 'N/A'}</p>
                         </div>
                       </>
                     );
                   })()}
                </div>

                <div className="mb-16">
                   <table className="w-full">
                     <thead className="border-b-4 border-slate-900">
                       <tr>
                         <th className="py-4 text-[10px] font-black uppercase tracking-widest text-left">Description</th>
                         <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">Amount (৳)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 font-bold">
                       {(() => {
                         const calcs = getCalculations(previewInvoice);
                         const project = projects.find(p => p.id === previewInvoice.projectId);
                         return (
                           <>
                             <tr>
                               <td className="py-6">
                                 <p className="text-sm font-black text-slate-900 uppercase">Total Project Price</p>
                                 <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-widest">Build Title: {project?.title}</p>
                               </td>
                               <td className="py-6 text-right text-lg font-black text-slate-900">৳{calcs.total.toLocaleString()}</td>
                             </tr>
                             <tr>
                               <td className="py-4 text-slate-500">Advance Payment Amount</td>
                               <td className="py-4 text-right text-emerald-600">(-) ৳{calcs.advance.toLocaleString()}</td>
                             </tr>
                             <tr className="bg-indigo-50/50">
                               <td className="py-8 px-4 text-indigo-600 uppercase font-black">Current Installment Bill</td>
                               <td className="py-8 px-4 text-right text-4xl font-black text-indigo-600">৳{previewInvoice.amount.toLocaleString()}</td>
                             </tr>
                           </>
                         );
                       })()}
                     </tbody>
                   </table>
                </div>

                <div className="mt-auto pt-10 border-t-4 border-slate-900 flex justify-between items-start">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 inline-block">Financial Calculation:</h4>
                    {(() => {
                      const calcs = getCalculations(previewInvoice);
                      return (
                        <div className="space-y-1 text-xs font-bold text-slate-600">
                          <p>Total Project Price: <span className="text-slate-900">৳{calcs.total.toLocaleString()}</span></p>
                          <p>Advance Payment: <span className="text-emerald-600">৳{calcs.advance.toLocaleString()}</span></p>
                          <p className="pt-2 border-t border-slate-100 font-black text-slate-900">Total Due (Price - Advance): ৳{calcs.totalDue.toLocaleString()}</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-right w-64 pt-4">
                    {(() => {
                      const calcs = getCalculations(previewInvoice);
                      return (
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Balance Statement</p>
                           <div className="space-y-3">
                             
                              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-2">
                                 <span className="text-slate-400">Net Paid So Far</span>
                                 <span className="text-emerald-400 font-black">৳{calcs.netPaid.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between pt-1">
                                 <span className="text-xs uppercase font-black text-slate-400">Final Balance</span>
                                 <span className="text-xl font-black text-orange-400 italic">৳{calcs.remaining.toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="text-center pt-20 border-t border-slate-50 mt-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">
                    Powered by MD Emon Talukdar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 print:hidden">
          <div className="bg-white rounded-3xl w-full max-md shadow-2xl animate-in zoom-in">
            <div className="p-6 bg-emerald-600 text-white rounded-t-3xl flex justify-between items-center">
              <h3 className="font-bold uppercase tracking-tight">Create Billing Installment</h3>
              <button onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Select Target Project</label>
                <select required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700">
                  <option value="">Choose active build...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title} (Price: ৳{p.price.toLocaleString()})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Installment Amount (৳)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-indigo-600 text-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Payment Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition uppercase tracking-widest text-[10px]">Confirm Billing Creation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

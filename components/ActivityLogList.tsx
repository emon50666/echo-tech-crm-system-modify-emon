
import React, { useState } from 'react';
import { ActivityLog } from '../types';

interface ActivityLogListProps {
  logs: ActivityLog[];
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900">Agency Pulse</h1>
        <p className="text-slate-500 mt-2">Every lifecycle event, tracked and verified.</p>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <button 
            key={log.id} 
            onClick={() => setSelectedLog(log)}
            className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition group flex items-start gap-4"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
              log.type.includes('Client') ? 'bg-violet-500' : 
              log.type.includes('Project') ? 'bg-blue-500' :
              log.type.includes('Email') ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}>
              <i className={`fa-solid ${
                log.type.includes('Client') ? 'fa-user' : 
                log.type.includes('Project') ? 'fa-diagram-project' :
                log.type.includes('Email') ? 'fa-paper-plane' : 'fa-receipt'
              } text-sm`}></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{log.type}</span>
                <span className="text-[10px] font-bold text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-800 font-bold group-hover:text-indigo-600 transition">{log.description}</p>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                <i className="fa-solid fa-clock-rotate-left opacity-30"></i>
                {new Date(log.timestamp).toDateString()} • Action by {log.user}
              </p>
            </div>
          </button>
        ))}
        {logs.length === 0 && <div className="p-20 text-center text-slate-400 italic">No activity recorded yet. Start by adding a client or project.</div>}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <h3 className="font-black text-sm uppercase tracking-tighter">Event Technical Metadata</h3>
                <button onClick={() => setSelectedLog(null)}><i className="fa-solid fa-xmark"></i></button>
             </div>
             <div className="p-8">
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Log ID</p>
                      <p className="font-mono text-xs text-slate-800">{selectedLog.id}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">User Context</p>
                      <p className="text-xs font-bold text-slate-800">{selectedLog.user}</p>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Raw Payload</p>
                    <pre className="text-[10px] font-mono text-slate-600 bg-white p-4 rounded-xl border border-slate-100 max-h-64 overflow-y-auto">
                      {JSON.stringify(selectedLog.details || { "status": "Success", "message": "No extended metadata available for this event." }, null, 2)}
                    </pre>
                 </div>
                 <button onClick={() => setSelectedLog(null)} className="w-full py-4 bg-slate-100 text-slate-800 font-bold rounded-2xl hover:bg-slate-200 transition">Close Inspector</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogList;

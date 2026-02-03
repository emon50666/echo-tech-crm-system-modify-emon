
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ClientList from './components/ClientList';
import AccessDetails from './components/AccessDetails';
import InvoiceList from './components/InvoiceList';
import ActivityLogList from './components/ActivityLogList';
import CompletedPayments from './components/CompletedPayments';
import Profile from './components/Profile';
import Login from './components/Login';
import { Project, Client, ProjectStatus, PaymentStatus, Invoice, ActivityLog, AgencyProfile, WebsiteAccess } from './types';

// Storage keys
const STORAGE_KEYS = {
  AGENCY: 'devflow_agency',
  CLIENTS: 'devflow_clients',
  PROJECTS: 'devflow_projects',
  INVOICES: 'devflow_invoices',
  LOGS: 'devflow_logs',
  IS_LOGGED_IN: 'devflow_is_logged_in'
};

const INITIAL_AGENCY: AgencyProfile = {
  name: 'DEVFLOW BD',
  subtitle: 'MD EMON TALUKDAR',
  ownerName: 'MD Emon Talukdar',
  email: 'emon50666@gmail.com',
  phone: '+880 1864 833 864',
  whatsapp: '+880 1864 833 864',
  address: 'Dhaka, Bangladesh',
  logoUrl: 'https://i.ibb.co/3ykGMMv/emon-logo.png' 
};

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 border print:hidden ${
      type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
    }`}>
      <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

const App: React.FC = () => {
  // Persistence Loading
  const loadStored = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    try {
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadStored(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agency, setAgency] = useState<AgencyProfile>(() => loadStored(STORAGE_KEYS.AGENCY, INITIAL_AGENCY));
  const [clients, setClients] = useState<Client[]>(() => loadStored(STORAGE_KEYS.CLIENTS, []));
  const [projects, setProjects] = useState<Project[]>(() => loadStored(STORAGE_KEYS.PROJECTS, []));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStored(STORAGE_KEYS.INVOICES, []));
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadStored(STORAGE_KEYS.LOGS, []));
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Sync with Storage
  useEffect(() => localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(isLoggedIn)), [isLoggedIn]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.AGENCY, JSON.stringify(agency)), [agency]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs)), [logs]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const addLog = (type: ActivityLog['type'], description: string, details?: any) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      description,
      user: agency.ownerName,
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateClientAccess = (clientId: string, access: WebsiteAccess) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, access } : c));
    showToast('Credentials updated successfully!');
    addLog('Status Change', `Access details updated for client ID:${clientId}`);
  };

  const handleAddClientWithProject = async (data: { 
    client: Omit<Client, 'id' | 'createdAt'>, 
    project: { title: string, budget: number, advance: number, startDate: string, endDate: string } 
  }) => {
    const clientId = `c${Date.now()}`;
    const newClient: Client = { ...data.client, id: clientId, createdAt: new Date().toISOString() };
    
    const newProject: Project = {
      id: `p${Date.now()}`,
      clientId: clientId,
      title: data.project.title,
      description: 'Project launched via registration.',
      price: data.project.budget,
      advancePaid: data.project.advance,
      status: ProjectStatus.PENDING,
      paymentStatus: data.project.advance >= data.project.budget ? PaymentStatus.PAID : (data.project.advance > 0 ? PaymentStatus.PARTIAL : PaymentStatus.UNPAID),
      startDate: data.project.startDate,
      estDeliveryDate: data.project.endDate,
      notes: 'Initial registration build.'
    };

    setClients(prev => [...prev, newClient]);
    setProjects(prev => [...prev, newProject]);
    
    addLog('Client Added', `New client ${newClient.name} added with ৳${newProject.advancePaid} advance.`);
    showToast(`Client & Project successfully launched!`);

    if (data.project.advance > 0) {
      handleAddInvoice({
        projectId: newProject.id,
        amount: data.project.advance,
        status: 'Paid',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleUpdateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
    addLog('Status Change', `Client ${client.name} profile updated.`);
    showToast('Client updated!');
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    addLog('Client Deleted', `Client record ID:${id} removed.`);
    showToast('Client deleted.');
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    addLog('Status Change', `Project "${updatedProject.title}" updated.`);
    showToast('Project updated!');
  };

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...projectData, id: `p${Date.now()}` };
    setProjects(prev => [...prev, newProject]);
    addLog('Project Created', `Project "${newProject.title}" started.`);
    showToast(`Project created!`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    addLog('Project Deleted', `Project ID:${id} removed.`);
    showToast('Project deleted.');
  };

  const handleUpdateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        addLog('Status Change', `Project status update: ${newStatus}`);
        showToast(`Project marked as ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleAddInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = { ...invoiceData, id: `inv${Date.now()}`, createdAt: new Date().toISOString() };
    setInvoices(prev => [...prev, newInvoice]);
    addLog('Payment Received', `Invoice generated for ৳${newInvoice.amount.toLocaleString()}.`);
    showToast('Invoice created!');
  };

  const handleUpdateInvoiceStatus = (id: string, status: 'Paid' | 'Unpaid') => {
    setInvoices(prev => {
      const updatedInvoices = prev.map(inv => {
        if (inv.id === id) {
          return { ...inv, status };
        }
        return inv;
      });
      
      const targetInvoice = updatedInvoices.find(i => i.id === id);
      if (targetInvoice && status === 'Paid') {
          setTimeout(() => {
              setProjects(currentProjects => currentProjects.map(p => {
                  if (p.id === targetInvoice.projectId) {
                      const totalPaidInvoices = updatedInvoices
                          .filter(i => i.projectId === p.id && i.status === 'Paid')
                          .reduce((sum, i) => sum + i.amount, 0);
                      
                      const totalPaidSoFar = p.advancePaid + totalPaidInvoices;
                      
                      if (totalPaidSoFar >= p.price) {
                          showToast('Full payment received! Account settled.');
                          addLog('Status Change', `Project "${p.title}" fully settled (100% budget paid).`);
                          return { ...p, paymentStatus: PaymentStatus.PAID, status: ProjectStatus.DELIVERED };
                      } else {
                          return { ...p, paymentStatus: PaymentStatus.PARTIAL };
                      }
                  }
                  return p;
              }));
          }, 0);
          showToast('Payment marked as confirmed!');
      }
      
      return updatedInvoices;
    });
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    addLog('Status Change', `Invoice deleted.`);
    showToast('Invoice removed.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard projects={projects} clients={clients} invoices={invoices} />;
      case 'projects': return <ProjectList projects={projects} clients={clients} onUpdateStatus={handleUpdateProjectStatus} onAddProject={handleAddProject} onDeleteProject={handleDeleteProject} onUpdateProject={handleUpdateProject} />;
      case 'clients': return <ClientList clients={clients} onAddClientWithProject={handleAddClientWithProject} onUpdateClient={handleUpdateClient} onDeleteClient={handleDeleteClient} />;
      case 'access': return <AccessDetails clients={clients} onUpdateClientAccess={handleUpdateClientAccess} />;
      case 'invoices': return <InvoiceList invoices={invoices} projects={projects} clients={clients} agency={agency} onAddInvoice={handleAddInvoice} onDeleteInvoice={handleDeleteInvoice} onUpdateInvoiceStatus={handleUpdateInvoiceStatus} />;
      case 'completed': return <CompletedPayments projects={projects} clients={clients} invoices={invoices} />;
      case 'activity': return <ActivityLogList logs={logs} />;
      case 'settings': return <Profile profile={agency} onUpdate={setAgency} />;
      default: return <Dashboard projects={projects} clients={clients} invoices={invoices} />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} agency={agency} />
      <main className="flex-1 ml-64 p-8 print:p-0 print:ml-0 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-10 print:hidden">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><i className="fa-solid fa-house-laptop"></i></div>
             <h2 className="font-bold text-slate-800 uppercase tracking-tighter">{agency.name} Hub</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('settings')} className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-xl transition text-left">
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">{agency.ownerName}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest">{agency.subtitle}</p>
              </div>
              <img src="https://picsum.photos/40/40?seed=owner" className="w-9 h-9 rounded-full border border-slate-200" />
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="text-slate-400 hover:text-red-500 transition"><i className="fa-solid fa-power-off"></i></button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </main>
    </div>
  );
};

export default App;

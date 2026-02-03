
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Simple simulation
      onLogin();
    } else {
      setError('Invalid owner credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-code text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white">DevFlow CRM</h1>
          <p className="text-slate-500 mt-2">Owner Dashboard Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Access Key</label>
            <input 
              type="password" 
              placeholder="Enter your owner key..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-900/20 transition-all transform active:scale-95">
            Log In as Owner
          </button>
        </form>
        <p className="text-center text-slate-600 text-xs mt-8">Default Key: <span className="text-slate-400 font-mono">admin</span></p>
      </div>
    </div>
  );
};

export default Login;

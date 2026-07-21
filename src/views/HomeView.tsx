import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const HomeView: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10 text-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">¡Panel de Control!</h1>
          <p className="text-sm text-slate-400">Has iniciado sesión correctamente.</p>
        </div>
      </div>
    </div>
    );
};
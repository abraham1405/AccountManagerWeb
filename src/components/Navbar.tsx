import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-slate-950/40 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
        <LayoutDashboard className="h-5 w-5 text-sky-500" />
        <span className="text-white font-semibold tracking-wider text-base">DASHBOARD</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300 font-medium hidden sm:inline-flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
          Bienvenido, <strong className="text-sky-400 font-semibold">{user?.username || 'Usuario'}</strong>
          <User className="h-4 w-4 text-sky-400" />
        </span>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-bold text-sm shadow-md hover:scale-105 transition-transform outline-none focus:ring-2 focus:ring-sky-500"
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </button>

          {/* Menú Flotante */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-800 mb-1">
                {user?.email}
              </div>
              
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 w-full text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Mi Perfil
              </Link>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 w-full text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
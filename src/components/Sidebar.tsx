import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Calendar, 
  Database, 
  BookOpen, 
  Settings as SettingsIcon, 
  LogOut,
  Trophy,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Gamepad2, label: 'Quiz', path: '/quiz' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Database, label: 'Database', path: '/database' },
    { icon: BookOpen, label: 'Wiki', path: '/wiki' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden relative h-16 bg-white border-b-4 border-black z-50 flex items-center justify-between px-4 shrink-0">
        <h1 className="text-xl font-black tracking-tighter">
          <span className="font-extrabold">carbon</span>
          <span className="font-normal">scio</span>
        </h1>
        <button 
          onClick={toggleSidebar}
          className="brutal-btn bg-brutal-yellow p-2"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-64 border-r-4 border-black flex flex-col bg-white z-40 transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b-4 border-black hidden lg:block">
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="font-extrabold">carbon</span>
            <span className="font-normal">scio</span>
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-16 lg:mt-0">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 font-bold border-4 border-transparent transition-all",
                  isActive 
                    ? "bg-brutal-yellow border-black shadow-brutal translate-x-[-2px] translate-y-[-2px]" 
                    : "hover:bg-gray-100"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-4 border-black space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 font-bold hover:bg-red-100 text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

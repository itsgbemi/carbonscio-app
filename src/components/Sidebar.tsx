import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Calendar, 
  Database, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut,
  Trophy
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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Gamepad2, label: 'Quiz', path: '/quiz' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Database, label: 'Database', path: '/database' },
    { icon: MessageSquare, label: 'Ask AI', path: '/ask-ai' },
    { icon: BookOpen, label: 'Wiki', path: '/wiki' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen border-r-4 border-black flex flex-col bg-white sticky top-0">
      <div className="p-6 border-bottom-4 border-black">
        <h1 className="text-2xl font-black tracking-tighter">
          <span className="font-extrabold">carbon</span>
          <span className="font-normal">scio</span>
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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

      <div className="p-4 border-t-4 border-black">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 font-bold hover:bg-red-100 text-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Shield, User } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Settings</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Customize your experience while the ecosystem collapses."</p>
      </header>

      <div className="space-y-6">
        <section className="brutal-card">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Sun /> Appearance
          </h3>
          <div className="flex items-center justify-between p-4 border-4 border-black bg-gray-50">
            <div>
              <p className="font-black uppercase text-sm">Dark Mode</p>
              <p className="font-bold text-gray-500">Save your eyes (and maybe 0.0001% battery).</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-16 h-8 border-4 border-black relative transition-all",
                darkMode ? "bg-brutal-yellow" : "bg-gray-200"
              )}
            >
              <div className={cn(
                "absolute top-0 bottom-0 w-6 bg-black transition-all",
                darkMode ? "right-0" : "left-0"
              )} />
            </button>
          </div>
        </section>

        <section className="brutal-card">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Globe /> Language
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang.toLowerCase().substring(0, 2))}
                className={cn(
                  "brutal-btn text-center",
                  language === lang.toLowerCase().substring(0, 2) ? "bg-brutal-yellow" : "bg-white"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <p className="mt-4 font-bold text-sm text-gray-500 italic text-center">
            *Translation quality may vary. We mostly just use Google Translate and hope for the best.
          </p>
        </section>

        <section className="brutal-card">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Shield /> Privacy & Data
          </h3>
          <div className="space-y-4">
            <button className="brutal-btn w-full text-left bg-white">Export My Data (to show your grandkids what you did)</button>
            <button className="brutal-btn w-full text-left bg-red-100 text-red-600">Delete Account (the ultimate carbon offset)</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

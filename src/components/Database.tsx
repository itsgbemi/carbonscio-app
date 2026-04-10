import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ExternalLink, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  status: 'funding' | 'not_funding' | 'climate_focused';
  description: string;
  roast_comment: string;
  website_url: string;
}

export default function Database() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*');
    if (data) setCompanies(data);
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'funding': return <CheckCircle className="text-green-600" />;
      case 'not_funding': return <AlertCircle className="text-red-600" />;
      case 'climate_focused': return <Leaf className="text-blue-600" />;
      default: return <HelpCircle />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding': return 'bg-brutal-green border-black text-black';
      case 'not_funding': return 'bg-brutal-pink border-black text-black';
      case 'climate_focused': return 'bg-brutal-blue border-black text-black';
      default: return 'bg-gray-100 border-black';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-5xl font-black tracking-tighter mb-2">Company Database</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Discover companies leading the charge towards a sustainable future."</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a company to roast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brutal-input w-full pl-12"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="brutal-input font-bold"
        >
          <option value="all">All Statuses</option>
          <option value="funding">Funding Sustainability</option>
          <option value="not_funding">Not Funding (The Villains)</option>
          <option value="climate_focused">Climate Organizations</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map(company => (
          <div key={company.id} className="brutal-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black">{company.name}</h3>
                <div className={cn("px-3 py-1 border-2 font-black text-xs uppercase", getStatusColor(company.status))}>
                  {company.status.replace('_', ' ')}
                </div>
              </div>
              <p className="font-bold text-gray-600 mb-4">{company.description}</p>
              <div className="bg-brutal-pink/10 border-l-4 border-brutal-pink p-4 mb-6 italic font-bold">
                <p className="text-sm uppercase font-black text-brutal-pink mb-1">The Roast:</p>
                <span>"{company.roast_comment}"</span>
              </div>
            </div>
            <a
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn-primary flex items-center justify-center gap-2 mt-auto"
            >
              Visit Website <ExternalLink size={18} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Leaf } from 'lucide-react';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

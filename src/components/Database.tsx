import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, AlertCircle, CheckCircle, Flame, Heart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Funder {
  Name: string;
  How: string;
  'Fact Check': string;
  Type: string;
}

interface Polluter {
  Name: string;
  'CO2 Emissions in Billion Tonnes': number;
  Sector: string;
  'Fact Check': string;
}

const FUNDERS_URL = 'https://script.google.com/macros/s/AKfycby-ZKPYiSlAw6_F_8t4GAWIjD6HS92LmwxrttLurP7JGaS4xsvgukRYSvVTTTpg_nGRvw/exec';
const POLLUTERS_URL = 'https://script.google.com/macros/s/AKfycbylRA-zFQUwgwtoQkKRH7ZIgS_sgwKFXyNnMcmAJU17CoO3tCLyuFV2hVCjV_cCz6U9/exec';

export default function Database() {
  const [funders, setFunders] = useState<Funder[]>([]);
  const [polluters, setPolluters] = useState<Polluter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'funders' | 'polluters'>('polluters');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fundersRes, pollutersRes] = await Promise.all([
        fetch(FUNDERS_URL),
        fetch(POLLUTERS_URL)
      ]);
      
      const fundersData = await fundersRes.json();
      const pollutersData = await pollutersRes.json();
      
      setFunders(Array.isArray(fundersData) ? fundersData : []);
      setPolluters(Array.isArray(pollutersData) ? pollutersData : []);
    } catch (error) {
      console.error('Error fetching database:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = activeTab === 'funders' 
    ? funders.filter(f => f.Name.toLowerCase().includes(search.toLowerCase()))
    : polluters.filter(p => p.Name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-5xl font-black tracking-tighter mb-2">The Hall of Shame & Fame</h2>
        <p className="text-xl font-bold text-gray-600 italic">
          {activeTab === 'polluters' 
            ? "Meet the entities currently winning the race to bake the planet."
            : "The people throwing money at the problem. Better late than never, I guess."}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex border-4 border-black p-1 bg-white w-full md:w-auto">
          <button
            onClick={() => setActiveTab('polluters')}
            className={cn(
              "px-6 py-2 font-black uppercase text-sm flex items-center gap-2 transition-all",
              activeTab === 'polluters' ? "bg-brutal-pink text-black" : "hover:bg-gray-100"
            )}
          >
            <Flame size={18} /> The Bakers
          </button>
          <button
            onClick={() => setActiveTab('funders')}
            className={cn(
              "px-6 py-2 font-black uppercase text-sm flex items-center gap-2 transition-all",
              activeTab === 'funders' ? "bg-brutal-green text-black" : "hover:bg-gray-100"
            )}
          >
            <Heart size={18} /> The Saviors
          </button>
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search for a ${activeTab === 'polluters' ? 'polluter' : 'funder'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brutal-input w-full pl-12"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-4xl font-black animate-pulse">LOADING THE TRUTH...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item, i) => (
            <div key={i} className="brutal-card flex flex-col justify-between bg-white">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black">{item.Name}</h3>
                  {activeTab === 'polluters' ? (
                    <div className="bg-brutal-pink px-3 py-1 border-2 border-black font-black text-xs uppercase">
                      {(item as Polluter)['CO2 Emissions in Billion Tonnes']}B Tonnes
                    </div>
                  ) : (
                    <div className="bg-brutal-green px-3 py-1 border-2 border-black font-black text-xs uppercase">
                      {(item as Funder).Type}
                    </div>
                  )}
                </div>
                
                <p className="font-bold text-gray-600 mb-6">
                  {activeTab === 'polluters' 
                    ? `Sector: ${(item as Polluter).Sector}`
                    : (item as Funder).How}
                </p>

                <div className="bg-gray-50 border-l-4 border-black p-4 mb-6 italic font-bold text-sm">
                  {activeTab === 'polluters' 
                    ? "Winning the race to 2 degrees Celsius. Impressive commitment to destruction."
                    : "Trying to buy back their conscience. We'll take the money, though."}
                </div>
              </div>

              <a
                href={item['Fact Check']}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn-primary flex items-center justify-center gap-2 mt-auto"
              >
                Fact Check <ExternalLink size={18} />
              </a>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl font-black text-gray-400">NOTHING FOUND. THEY'RE HIDING.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Leaf, Zap, AlertTriangle, Users } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    score: 0,
    offset: 0,
    referrals: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setStats({
          score: profile.climate_literacy_score,
          offset: profile.carbon_offset_total,
          referrals: profile.referrals_count || 0
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-5xl font-black tracking-tighter mb-2">Dashboard</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Look at you, trying to save the world from your couch."</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="brutal-card bg-gradient-pastel">
          <div className="flex items-center gap-4 mb-4">
            <Zap className="bg-white p-2 border-4 border-black" size={48} />
            <div>
              <p className="font-black uppercase text-sm">Literacy Score</p>
              <p className="text-4xl font-black">{stats.score}</p>
            </div>
          </div>
          <p className="font-bold text-sm">You're basically a climate scientist. Or just good at guessing.</p>
        </div>

        <div className="brutal-card bg-gradient-sky">
          <div className="flex items-center gap-4 mb-4">
            <Leaf className="bg-white p-2 border-4 border-black" size={48} />
            <div>
              <p className="font-black uppercase text-sm">Carbon Offset</p>
              <p className="text-4xl font-black">{stats.offset}kg</p>
            </div>
          </div>
          <p className="font-bold text-sm">That's like... 3 trees. Don't quit your day job yet.</p>
        </div>

        <div className="brutal-card bg-gradient-sunset">
          <div className="flex items-center gap-4 mb-4">
            <Users className="bg-white p-2 border-4 border-black" size={48} />
            <div>
              <p className="font-black uppercase text-sm">Referrals</p>
              <p className="text-4xl font-black">{stats.referrals}</p>
            </div>
          </div>
          <p className="font-bold text-sm">Spreading the word? Or just annoying your friends?</p>
        </div>

        <div className="brutal-card bg-brutal-green">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="bg-white p-2 border-4 border-black" size={48} />
            <div>
              <p className="font-black uppercase text-sm">Global Rank</p>
              <p className="text-4xl font-black">#420</p>
            </div>
          </div>
          <p className="font-bold text-sm">Top 99%. Technically true.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="brutal-card bg-brutal-yellow">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <AlertTriangle /> Climate Roast
          </h3>
          <div className="space-y-4 font-bold text-lg">
            <p>"Your carbon footprint is so big, it has its own zip code."</p>
            <p>"Recycling one plastic bottle doesn't make you Captain Planet, Brenda."</p>
            <p>"If the ice caps melt any faster, your beach house will just be a 'house'."</p>
          </div>
          <button className="brutal-btn bg-white mt-8 w-full">Get Another Roast</button>
        </section>
      </div>
    </div>
  );
}

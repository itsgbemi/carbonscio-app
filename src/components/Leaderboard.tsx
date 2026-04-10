import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, UserPlus, Share2, Check, Copy } from 'lucide-react';

interface Profile {
  username: string;
  climate_literacy_score: number;
  carbon_offset_total: number;
  referrals_count: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    generateReferralLink();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('climate_literacy_score', { ascending: false });
    
    if (data) setLeaderboard(data);
    setLoading(false);
  };

  const generateReferralLink = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setReferralLink(`${window.location.origin}/signup?ref=${data.username}`);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-5xl font-black tracking-tighter mb-2">Leaderboard</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Celebrating the champions of climate action and literacy."</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <section className="brutal-card bg-white">
            <div className="space-y-4">
              {leaderboard.map((user, i) => (
                <div 
                  key={user.username} 
                  className={`flex items-center justify-between p-4 border-4 border-black transition-all ${
                    i === 0 ? 'bg-brutal-yellow scale-105 shadow-brutal-lg' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black w-12">
                      {i === 0 ? '👑' : i + 1}
                    </span>
                    <div>
                      <span className="text-xl font-black block">{user.username}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {user.referrals_count || 0} Referrals
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{user.climate_literacy_score} pts</p>
                    <p className="text-sm font-bold text-gray-600">{user.carbon_offset_total}kg offset</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="brutal-card bg-gradient-sky">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <UserPlus /> Invite Friends
            </h3>
            <p className="font-bold mb-6">
              Invite your friends to join the literacy revolution. For every person who joins, you get 50 points and a sense of moral superiority.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="brutal-input w-full pr-12 text-sm"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {copied ? <Check className="text-green-600" size={20} /> : <Copy size={20} />}
                </button>
              </div>
              
              <button 
                onClick={copyToClipboard}
                className="brutal-btn-primary w-full flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                {copied ? "Copied!" : "Copy Referral Link"}
              </button>
            </div>
          </section>

          <section className="brutal-card bg-brutal-pink">
            <h3 className="text-xl font-black mb-2">Why Refer?</h3>
            <ul className="font-bold space-y-2 text-sm">
              <li>• Climb the leaderboard faster</li>
              <li>• Unlock exclusive "Captain Planet" badges</li>
              <li>• Guilt your friends into recycling</li>
              <li>• Actually help save the planet (maybe)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Plus, Trash2, Leaf } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Activity {
  id: string;
  activity_date: string;
  activity_type: string;
  carbon_saved: number;
}

const ACTIVITY_TYPES = [
  { label: 'Cycling', value: 'cycling', saved: 0.5 },
  { label: 'Vegan Meal', value: 'vegan_meal', saved: 1.2 },
  { label: 'Recycling', value: 'recycling', saved: 0.2 },
  { label: 'Public Transport', value: 'public_transport', saved: 0.8 },
  { label: 'No Plastic', value: 'no_plastic', saved: 0.1 },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [currentDate]);

  const fetchActivities = async () => {
    const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    
    const { data } = await supabase
      .from('daily_activities')
      .select('*')
      .gte('activity_date', start)
      .lte('activity_date', end);
    
    if (data) setActivities(data);
  };

  const addActivity = async (type: string, saved: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('daily_activities')
      .insert([{
        user_id: user.id,
        activity_date: format(selectedDate, 'yyyy-MM-dd'),
        activity_type: type,
        carbon_saved: saved
      }]);

    if (!error) {
      fetchActivities();
      setShowAddModal(false);
      updateTotalOffset(saved);
    }
  };

  const updateTotalOffset = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('carbon_offset_total')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ carbon_offset_total: profile.carbon_offset_total + amount })
          .eq('id', user.id);
      }
    }
  };

  const deleteActivity = async (id: string, amount: number) => {
    const { error } = await supabase.from('daily_activities').delete().eq('id', id);
    if (!error) {
      fetchActivities();
      updateTotalOffset(-amount);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const totalSaved = activities.reduce((acc, curr) => acc + curr.carbon_saved, 0);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Offset Tracker</h2>
          <p className="text-xl font-bold text-gray-600 italic">"Tracking your tiny wins while the world burns."</p>
        </div>
        <div className="brutal-card bg-gradient-sky py-2 px-6">
          <p className="font-black text-2xl">{totalSaved.toFixed(1)}kg CO2 Saved</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 brutal-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase">{format(currentDate, 'MMMM yyyy')}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="brutal-btn py-1 px-3">Prev</button>
              <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="brutal-btn py-1 px-3">Next</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center font-black text-xs uppercase mb-2">{d}</div>
            ))}
            {days.map(day => {
              const dayActivities = activities.filter(a => isSameDay(new Date(a.activity_date), day));
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square border-2 border-black p-1 flex flex-col items-center justify-center transition-all",
                    isSelected ? "bg-brutal-yellow translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-gray-50",
                    dayActivities.length > 0 && !isSelected ? "bg-brutal-green/20" : ""
                  )}
                >
                  <span className="text-xs font-bold">{format(day, 'd')}</span>
                  {dayActivities.length > 0 && (
                    <div className="w-2 h-2 bg-brutal-green rounded-full border border-black mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="brutal-card bg-white">
          <h3 className="text-xl font-black uppercase mb-6">Activities for {format(selectedDate, 'MMM d')}</h3>
          
          <div className="space-y-4 mb-8">
            {activities.filter(a => isSameDay(new Date(a.activity_date), selectedDate)).map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 border-2 border-black bg-gray-50">
                <div>
                  <p className="font-bold capitalize">{activity.activity_type.replace('_', ' ')}</p>
                  <p className="text-xs font-bold text-gray-500">{activity.carbon_saved}kg saved</p>
                </div>
                <button onClick={() => deleteActivity(activity.id, activity.carbon_saved)} className="text-red-500 hover:scale-110 transition-transform">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {activities.filter(a => isSameDay(new Date(a.activity_date), selectedDate)).length === 0 && (
              <p className="text-center py-8 font-bold text-gray-400 italic">Nothing here. Lazy much?</p>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="brutal-btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Activity
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="brutal-card max-w-md w-full bg-white">
            <h3 className="text-2xl font-black uppercase mb-6">What did you do?</h3>
            <div className="grid grid-cols-1 gap-3">
              {ACTIVITY_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => addActivity(type.value, type.saved)}
                  className="brutal-btn text-left flex items-center justify-between hover:bg-brutal-green"
                >
                  <span className="font-bold">{type.label}</span>
                  <span className="text-xs font-black">+{type.saved}kg</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-6 w-full font-bold hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Check, Flame, Plus, Trash2 } from 'lucide-react';
import { calculateHabitStreak } from '../lib/dateUtils';

export function Habits({ data, todayKey, updateData }) {
  const { habits, habitLogs } = data;
  const todayHabits = habitLogs[todayKey] || [];
  
  const [newHabitName, setNewHabitName] = useState('');

  const toggleHabit = (habitId) => {
    const isCompleted = todayHabits.includes(habitId);
    let newToday = [];
    if (isCompleted) {
      newToday = todayHabits.filter(id => id !== habitId);
    } else {
      newToday = [...todayHabits, habitId];
    }
    
    updateData('habitLogs', {
      ...habitLogs,
      [todayKey]: newToday
    });
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName.trim()
    };
    
    updateData('habits', [...habits, newHabit]);
    setNewHabitName('');
  };

  const handleDeleteHabit = (e, habitId) => {
    e.stopPropagation();
    updateData('habits', habits.filter(h => h.id !== habitId));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Daily Habits</h1>
        <p className="text-secondary text-sm">Consistency is the key to growth.</p>
      </div>

      <Card>
        <h3 className="text-sm font-bold mb-2">Configure Your Flow</h3>
        <form onSubmit={handleAddHabit} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Add a new habit..." 
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
          />
          <button type="submit" className="p-3 font-bold" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-dark)', borderRadius: 'var(--radius-md)' }}>
            <Plus size={20} />
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3 mt-2">
        {habits.map(habit => {
          const isCompleted = todayHabits.includes(habit.id);
          const streak = calculateHabitStreak(habitLogs, habit.id);

          return (
            <Card 
              key={habit.id} 
              onClick={() => toggleHabit(habit.id)}
              className="flex items-center justify-between"
              style={{
                borderColor: isCompleted ? 'var(--accent-green)' : 'var(--border-color)',
                transition: 'all 0.2s',
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    border: `2px solid ${isCompleted ? 'var(--accent-green)' : 'var(--border-color)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isCompleted ? 'var(--accent-green)' : 'transparent',
                    color: 'var(--bg-dark)'
                  }}
                >
                  {isCompleted && <Check size={16} strokeWidth={3} />}
                </div>
                <span className={`text-lg ${isCompleted ? 'font-medium' : ''}`} style={{ color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)'}}>
                  {habit.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm font-bold" style={{ color: streak > 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                  {streak > 0 && <Flame size={16} />}
                  {streak}
                </div>
                <button 
                  onClick={(e) => handleDeleteHabit(e, habit.id)} 
                  style={{ padding: '6px', color: 'var(--text-muted)', borderRadius: '50%', ':hover': { color: 'var(--accent-red)' } }}
                  aria-label="Delete habit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          )
        })}
        {habits.length === 0 && (
          <p className="text-secondary text-sm text-center py-4">No habits yet. Add some above to start building momentum!</p>
        )}
      </div>
    </div>
  );
}

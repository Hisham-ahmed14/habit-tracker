import React from 'react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Flame, CheckCircle, Apple, Dumbbell, CheckSquare } from 'lucide-react';
import { calculateAppStreak } from '../lib/dateUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export function Dashboard({ data, todayKey }) {
  const { userData, nutritionLogs, habitLogs, habits, workoutLogs } = data;
  
  const todayNutrition = nutritionLogs[todayKey] || { calories: 0, protein: 0 };
  const todayWorkout = workoutLogs[todayKey];
  const todayHabits = habitLogs[todayKey] || [];
  
  const currentStreak = calculateAppStreak(habitLogs, habits.length);

  // Generate Habit Trend Data (last 14 days)
  const numDays = 14;
  const habitTrendData = [];
  for (let i = numDays - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const key = format(date, 'yyyy-MM-dd');
      const count = habitLogs[key] ? habitLogs[key].length : 0;
      habitTrendData.push({
          dateKey: key,
          displayDate: format(date, 'MMM d'),
          completed: count
      });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded shadow-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <p className="text-secondary text-xs mb-1">{label}</p>
          <p className="font-bold" style={{ color: 'var(--accent-red)' }}>{payload[0].value} Habits Completed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-secondary text-sm">Discipline equals freedom.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <Flame size={20} color="var(--accent-red)" />
          <span className="font-bold text-accent-red">{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
        {/* Nutrition */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Apple size={18} color="var(--accent-blue)" />
            <h3 className="font-bold text-sm">Nutrition</h3>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-secondary">Cals</span>
              <span className="font-bold">{todayNutrition.calories} / {userData.calorieTarget || 2500}</span>
            </div>
            <ProgressBar current={todayNutrition.calories} max={userData.calorieTarget || 2500} color="var(--accent-blue)" height="6px" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-secondary">Protein</span>
              <span className="font-bold">{todayNutrition.protein}g / {userData.proteinTarget || 150}g</span>
            </div>
            <ProgressBar current={todayNutrition.protein} max={userData.proteinTarget || 150} color="var(--accent-blue)" height="6px" />
          </div>
        </Card>

        {/* Action Items */}
        <div className="flex flex-col gap-4">
          <Card 
            className="flex-1 flex flex-col justify-center items-center gap-2"
            style={{ 
              borderColor: todayWorkout ? 'var(--accent-green)' : 'var(--border-color)',
              backgroundColor: todayWorkout ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
            }}
          >
            <Dumbbell size={24} color={todayWorkout ? "var(--accent-green)" : "var(--text-muted)"} />
            <h3 className="font-bold text-sm text-center" style={{ color: todayWorkout ? 'var(--accent-green)' : 'var(--text-primary)' }}>
              {todayWorkout ? 'Workout Done' : 'Pending Workout'}
            </h3>
          </Card>

          <Card 
            className="flex-1 flex flex-col justify-center items-center gap-2"
            style={{ 
               borderColor: todayHabits.length > 0 && todayHabits.length >= habits.length ? 'var(--accent-red)' : 'var(--border-color)',
               backgroundColor: todayHabits.length > 0 && todayHabits.length >= habits.length ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)'
            }}
          >
            <CheckSquare size={24} color={todayHabits.length > 0 && todayHabits.length >= habits.length ? "var(--accent-red)" : "var(--text-muted)"} />
            <h3 className="font-bold text-sm text-center" style={{ color: todayHabits.length > 0 && todayHabits.length >= habits.length ? 'var(--accent-red)' : 'var(--text-primary)'}}>
              {todayHabits.length} / {habits.length || 0} Habits
            </h3>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-bold mb-4">Habit Consistency (14 Days)</h3>
        <div style={{ height: '220px', width: '100%', marginLeft: '-15px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={habitTrendData}>
              <XAxis 
                dataKey="displayDate" 
                stroke="var(--text-secondary)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--text-secondary)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="var(--accent-red)" 
                strokeWidth={3}
                dot={{ fill: 'var(--accent-red)', strokeWidth: 2, r: 4, stroke: 'var(--bg-dark)' }}
                activeDot={{ r: 6, fill: 'var(--accent-red)', stroke: 'var(--bg-dark)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
    </div>
  );
}

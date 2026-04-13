import React, { useState, useEffect } from 'react';
import { storage } from './lib/storage';
import { getTodayKey } from './lib/dateUtils';

import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { GymTracker } from './pages/GymTracker';
import { Nutrition } from './pages/Nutrition';
import { Habits } from './pages/Habits';
import { WeightProgress } from './pages/WeightProgress';
import { Tasks } from './pages/Tasks';

function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [todayKey, setTodayKey] = useState(getTodayKey());

  useEffect(() => {
    const loadAppData = async () => {
      const allData = await storage.getAllData();
      
      if (allData.workoutSplit.length === 0 || (allData.workoutSplit.length === 3 && allData.workoutSplit[0].name === 'Push Day')) {
        allData.workoutSplit = [
          { id: '1', name: 'Day 1: Chest + Triceps', exercises: [{name: 'Bench Press', sets: 4, reps: 8}, {name: 'Incline Dumbbell Press', sets: 3, reps: 10}, {name: 'Tricep Pushdowns', sets: 3, reps: 12}] },
          { id: '2', name: 'Day 2: Back + Biceps', exercises: [{name: 'Pull-Ups', sets: 3, reps: 10}, {name: 'Barbell Rows', sets: 3, reps: 10}, {name: 'Bicep Curls', sets: 3, reps: 12}] },
          { id: '3', name: 'Day 3: Rest', exercises: [] },
          { id: '4', name: 'Day 4: Legs', exercises: [{name: 'Squats', sets: 4, reps: 8}, {name: 'Leg Press', sets: 3, reps: 10}, {name: 'Leg Extensions', sets: 3, reps: 15}] },
          { id: '5', name: 'Day 5: Shoulders', exercises: [{name: 'Overhead Press', sets: 4, reps: 8}, {name: 'Lateral Raises', sets: 4, reps: 15}, {name: 'Face Pulls', sets: 3, reps: 15}] },
          { id: '6', name: 'Day 6: Rest', exercises: [] },
          { id: '7', name: 'Day 7: Rest', exercises: [] }
        ];
        storage.set('workoutSplit', allData.workoutSplit);
      }
      
      setData(allData);

      // Morning notification logic
      const currentHour = new Date().getHours();
      const lastNotified = localStorage.getItem('lastNotifiedDate');

      if (currentHour >= 5 && lastNotified !== todayKey) {
        if (Notification.permission === 'granted') {
          new Notification('Discipline Tracker', { body: "Good morning! What's your plan for today? Let's make it count." });
          localStorage.setItem('lastNotifiedDate', todayKey);
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Discipline Tracker', { body: "Good morning! What's your plan for today? Let's make it count." });
              localStorage.setItem('lastNotifiedDate', todayKey);
            }
          });
        }
      }
    };
    
    loadAppData();

    const interval = setInterval(() => {
      setTodayKey(getTodayKey());
    }, 60000);
    return () => clearInterval(interval);
  }, [todayKey]);

  // Dedicated Notification Tick for Tasks
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      const today = getTodayKey();
      const pTasks = (data.dailyTasks && data.dailyTasks[today]) || [];
      
      let updated = false;
      const currTasks = pTasks.map(t => {
          if (t.reminderTime && !t.notified && !t.isCompleted) {
              const now = new Date();
              const hours = now.getHours().toString().padStart(2, '0');
              const mins = now.getMinutes().toString().padStart(2, '0');
              const currentTimeStr = `${hours}:${mins}`;
              
              if (t.reminderTime === currentTimeStr) {
                  if (Notification.permission === 'granted') {
                      new Notification('Task Reminder', { body: t.text, icon: '/favicon.ico' });
                  }
                  updated = true;
                  return { ...t, notified: true };
              }
          }
          return t;
      });

      if (updated) {
          updateData('dailyTasks', { ...data.dailyTasks, [today]: currTasks });
      }

    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [data]);

  const updateData = (key, value) => {
    setData(prev => {
      const newData = { ...prev, [key]: value };
      storage.set(key, value);
      return newData;
    });
  };

  if (!data) {
    return <div className="flex h-screen items-center justify-center">Loading your discipline path...</div>;
  }

  const renderView = () => {
    const commonProps = { data, todayKey, updateData };
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'gym':
        return <GymTracker {...commonProps} />;
      case 'nutrition':
        return <Nutrition {...commonProps} />;
      case 'habits':
        return <Habits {...commonProps} />;
      case 'tasks':
        return <Tasks {...commonProps} />;
      case 'weight':
        return <WeightProgress {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <>
      <div className="p-4 safe-area-top pb-24" style={{ WebkitTapHighlightColor: 'transparent' }}>
        {renderView()}
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;

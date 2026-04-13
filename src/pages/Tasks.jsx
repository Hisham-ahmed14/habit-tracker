import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Check, Trash2, Plus, Bell } from 'lucide-react';

export function Tasks({ data, todayKey, updateData }) {
  const { dailyTasks } = data;
  const todayTasks = (dailyTasks && dailyTasks[todayKey]) || [];

  const [newTaskText, setNewTaskText] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    // Ask for Notification permission playfully when they use a time
    if (reminderTime && Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      isCompleted: false,
      reminderTime: reminderTime || null, 
      notified: false
    };

    const updatedTasks = [...todayTasks, newTask];
    const newDailyTasks = { ...dailyTasks, [todayKey]: updatedTasks };
    updateData('dailyTasks', newDailyTasks);

    setNewTaskText('');
    setReminderTime('');
  };

  const toggleTask = (id) => {
    const updatedTasks = todayTasks.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    updateData('dailyTasks', { ...dailyTasks, [todayKey]: updatedTasks });
  };

  const deleteTask = (id) => {
    const updatedTasks = todayTasks.filter(t => t.id !== id);
    updateData('dailyTasks', { ...dailyTasks, [todayKey]: updatedTasks });
  };

  const pendingTasks = todayTasks.filter(t => !t.isCompleted);
  const completedTasks = todayTasks.filter(t => t.isCompleted);

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Daily Tasks</h1>
        <p className="text-secondary text-sm">Win the day.</p>
      </div>

      <Card style={{ borderStyle: 'dashed' }}>
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="What needs to get done today?" 
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            className="w-full text-base"
          />
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 flex-1 border rounded p-2 bg-bg-dark" style={{ borderColor: 'var(--border-color)' }}>
               <Bell size={16} color="var(--text-secondary)" />
               <input 
                 type="time" 
                 value={reminderTime}
                 onChange={e => setReminderTime(e.target.value)}
                 className="bg-transparent border-0 outline-none w-full text-sm flex-1 text-secondary"
               />
            </div>
            <button type="submit" className="btn-primary w-auto h-full px-4" style={{ backgroundColor: 'var(--accent-blue)', color: '#fff' }}>
              <Plus size={20} />
            </button>
          </div>
        </form>
      </Card>

      {todayTasks.length === 0 && (
        <p className="text-secondary text-sm text-center py-8">No tasks for today. Enjoy the peace.</p>
      )}

      {pendingTasks.length > 0 && (
        <div className="flex flex-col gap-2">
           <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mt-2">Pending</h3>
           {pendingTasks.map(task => (
             <Card 
               key={task.id} 
               className="flex items-center gap-3 p-4 cursor-pointer transition-colors"
               style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
               onClick={() => toggleTask(task.id)}
             >
               <div style={{
                 width: '24px', height: '24px',
                 borderRadius: '50%',
                 border: `2px solid var(--border-color)`,
                 flexShrink: 0
               }}></div>
               <div className="flex-1 flex justify-between items-center">
                  <div>
                    <span className="font-medium block">{task.text}</span>
                    {task.reminderTime && (
                       <span className="text-xs text-accent-blue font-bold flex items-center gap-1 mt-1">
                          <Bell size={10} /> {task.reminderTime}
                       </span>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-2 text-muted hover:text-red-500">
                    <Trash2 size={18} color="var(--accent-red)" />
                  </button>
               </div>
             </Card>
           ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
           <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Completed</h3>
           {completedTasks.map(task => (
             <Card 
               key={task.id} 
               className="flex items-center gap-3 p-4 cursor-pointer opacity-60"
               style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
               onClick={() => toggleTask(task.id)}
             >
               <div style={{
                 width: '24px', height: '24px',
                 borderRadius: '50%',
                 border: `2px solid var(--accent-green)`,
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 backgroundColor: 'var(--accent-green)',
                 color: 'var(--bg-dark)',
                 flexShrink: 0
               }}>
                 <Check size={14} strokeWidth={4} />
               </div>
               <div className="flex-1 flex justify-between items-center">
                  <div>
                    <span className="font-medium block line-through">{task.text}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-2 text-muted">
                    <Trash2 size={18} />
                  </button>
               </div>
             </Card>
           ))}
        </div>
      )}
    </div>
  );
}

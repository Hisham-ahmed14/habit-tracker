import React, { useState } from 'react';
import { Card } from './Card';

export function NotificationModal({ isOpen, onClose, defaultWorkouts = [], onSavePlan }) {
  const [planText, setPlanText] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planText.trim()) return;
    onSavePlan({ text: planText, workoutId: selectedWorkout });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 'var(--spacing-4)'
    }}>
      <Card style={{ width: '100%', maxWidth: '360px', padding: 'var(--spacing-6)' }}>
        <h2 className="text-xl font-bold" style={{ marginBottom: 'var(--spacing-2)' }}>Good Morning! 🌅</h2>
        <p className="text-secondary text-sm" style={{ marginBottom: 'var(--spacing-5)' }}>
          What's your plan for today? Let's make it count.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '4px' }}>Main Focus / Plan</label>
            <input 
              type="text" 
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              placeholder="E.g., Crush leg day and study"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '4px' }}>Today's Workout</label>
            <select 
              value={selectedWorkout}
              onChange={(e) => setSelectedWorkout(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <option value="">Rest Day (or decide later)</option>
              {defaultWorkouts.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 'var(--spacing-4)' }} disabled={!planText.trim()}>
            Set Day's Intent
          </button>
        </form>
      </Card>
    </div>
  );
}

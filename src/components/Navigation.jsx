import React from 'react';
import { LayoutDashboard, Dumbbell, Apple, CheckSquare, LineChart, ListTodo } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'gym', icon: Dumbbell, label: 'Gym' },
  { id: 'nutrition', icon: Apple, label: 'Food' },
  { id: 'habits', icon: CheckSquare, label: 'Habits' },
  { id: 'tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'weight', icon: LineChart, label: 'Weight' }, // Added weight specific tab or could keep it in habits/home
];

export function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: 'var(--spacing-2) var(--spacing-4)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50,
      paddingBottom: 'max(var(--spacing-2), env(safe-area-inset-bottom))'
    }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '400px', margin: '0 auto', justifyContent: 'space-between' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                transition: 'color 0.2s',
                padding: 'var(--spacing-2)'
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

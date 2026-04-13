import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Check, Edit2, Play, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

export function GymTracker({ data, todayKey, updateData }) {
  const { workoutSplit, workoutLogs } = data;
  const todayWorkout = workoutLogs[todayKey];

  const [view, setView] = useState('list'); // 'list' | 'active' | 'manage_exercises'
  const [activeSplitId, setActiveSplitId] = useState(null);
  
  const [notes, setNotes] = useState('');
  const [newSplitName, setNewSplitName] = useState('');
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('');
  const [newExReps, setNewExReps] = useState('');

  // active workout state
  const [completedExercises, setCompletedExercises] = useState({});

  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSets, setEditSets] = useState('');
  const [editReps, setEditReps] = useState('');

  const handleFinishWorkout = (e) => {
    e.preventDefault();
    const newLogs = { ...workoutLogs };
    newLogs[todayKey] = {
      notes,
      completedAt: new Date().toISOString()
    };
    updateData('workoutLogs', newLogs);
    setView('list');
    setActiveSplitId(null);
    setCompletedExercises({});
  };

  const renderManageExercises = () => {
    const split = workoutSplit.find(w => w.id === activeSplitId);
    if (!split) return null;

    const handleAddEx = (e) => {
      e.preventDefault();
      if (!newExName.trim() || !newExSets || !newExReps) return;

      const newEx = {
          name: newExName.trim(), sets: parseInt(newExSets), reps: parseInt(newExReps)
      };

      const updatedSplits = workoutSplit.map(w => {
          if (w.id === split.id) {
            return { ...w, exercises: [...w.exercises, newEx] };
          }
          return w;
      });

      updateData('workoutSplit', updatedSplits);
      setNewExName(''); setNewExSets(''); setNewExReps('');
    };

    const handleDeleteEx = (index) => {
      const updatedSplits = workoutSplit.map(w => {
          if (w.id === split.id) {
            return { ...w, exercises: w.exercises.filter((_, i) => i !== index) };
          }
          return w;
      });
      updateData('workoutSplit', updatedSplits);
    };

    const startEdit = (index, ex) => {
      setEditIndex(index);
      setEditName(ex.name);
      setEditSets(ex.sets);
      setEditReps(ex.reps);
    };

    const saveEdit = (index) => {
       if (!editName.trim() || !editSets || !editReps) return;
       const updatedSplits = workoutSplit.map(w => {
           if (w.id === split.id) {
               const newExs = [...w.exercises];
               newExs[index] = { name: editName.trim(), sets: parseInt(editSets), reps: parseInt(editReps) };
               return { ...w, exercises: newExs };
           }
           return w;
       });
       updateData('workoutSplit', updatedSplits);
       setEditIndex(null);
    };

    const handleNameChange = (e) => {
      const updatedSplits = workoutSplit.map(w => {
         if(w.id === split.id) return { ...w, name: e.target.value };
         return w;
      });
      updateData('workoutSplit', updatedSplits);
    };

    const handleDeleteSplit = () => {
      if (!window.confirm("Delete this entire day from your routine?")) return;
      updateData('workoutSplit', workoutSplit.filter(s => s.id !== split.id));
      setView('list');
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setView('active')} className="p-2 -ml-2" style={{ color: 'var(--accent-blue)' }}><ArrowLeft size={24}/></button>
          <input 
            value={split.name} 
            onChange={handleNameChange}
            className="text-2xl font-bold bg-transparent border-0 outline-none flex-1 w-full"
            style={{ padding: 0 }}
          />
          <button onClick={handleDeleteSplit} className="p-2 text-accent-red rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
             <Trash2 size={20} color="var(--accent-red)" />
          </button>
        </div>
        
        <Card>
          <h3 className="text-sm font-bold mb-3">Add New Exercise</h3>
          <form onSubmit={handleAddEx} className="flex flex-col gap-3">
              <input type="text" placeholder="Exercise Name" value={newExName} onChange={e => setNewExName(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" placeholder="Sets" value={newExSets} onChange={e => setNewExSets(e.target.value)} min="1"/>
                <input type="number" placeholder="Reps" value={newExReps} onChange={e => setNewExReps(e.target.value)} min="1"/>
              </div>
              <button type="submit" className="btn-primary mt-1" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>Add Exercise</button>
          </form>
        </Card>

        <h3 className="text-lg font-bold mt-2">Current Routine</h3>
        <div className="flex flex-col gap-2">
          {split.exercises.map((ex, i) => (
            <Card key={i} className="flex flex-col gap-2 py-3" style={{ borderRadius: 'var(--radius-sm)' }}>
              {editIndex === i ? (
                <div className="flex flex-col gap-2">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                  <div className="flex gap-2">
                    <input type="number" value={editSets} onChange={e => setEditSets(e.target.value)} min="1" className="w-full"/>
                    <input type="number" value={editReps} onChange={e => setEditReps(e.target.value)} min="1" className="w-full"/>
                  </div>
                  <div className="flex gap-2 mt-1 justify-end">
                    <button onClick={() => setEditIndex(null)} className="btn-ghost" style={{ padding: '4px 12px' }}>Cancel</button>
                    <button onClick={() => saveEdit(i)} className="text-accent-green flex gap-1 items-center font-bold px-2 py-1"><Save size={16}/> Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-bold">{ex.name}</div>
                    <div className="text-sm text-secondary">{ex.sets} sets × {ex.reps} reps</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(i, ex)} className="p-2 text-blue-400">
                      <Edit2 size={18} color="var(--accent-blue)" />
                    </button>
                    <button onClick={() => handleDeleteEx(i)} className="p-2 text-muted hover:text-red-500">
                      <Trash2 size={18} color="var(--accent-red)" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          {split.exercises.length === 0 && <p className="text-secondary text-sm text-center py-8">No exercises. Use the form above to add some!</p>}
        </div>
      </div>
    );
  };

  const renderActiveWorkout = () => {
    const workout = workoutSplit.find(w => w.id === activeSplitId) || { name: 'Custom Session', exercises: [] };
    
    return (
      <div className="flex flex-col gap-4">
        <div className="mb-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-secondary text-sm">Time to crush it.</p>
          </div>
          {workout.id !== 'custom' && (
             <button onClick={() => setView('manage_exercises')} className="p-2 btn-ghost text-accent-blue" style={{ color: 'var(--accent-blue)', display: 'flex', gap: '4px', alignItems: 'center' }}>
               <Edit2 size={16} /> <span className="text-sm font-bold">Edit Routine</span>
             </button>
          )}
        </div>

        <form onSubmit={handleFinishWorkout} className="flex flex-col gap-4">
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div className="p-4 bg-bg-card border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h3 className="font-bold">{workout.name === 'Custom Session' ? 'Notes / Routine' : 'Routine'}</h3>
            </div>
            {workout.exercises.map((ex, i) => {
              const isDone = completedExercises[i];
              return (
                <div 
                  key={i} 
                  onClick={(e) => {
                    // Quick fix: Don't toggle check if they are trying to select text or drag
                    setCompletedExercises(prev => ({...prev, [i]: !prev[i]}));
                  }}
                  className="flex items-center gap-3 p-4 border-b cursor-pointer transition-colors" 
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    opacity: isDone ? 0.7 : 1
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${isDone ? 'var(--accent-green)' : 'var(--border-color)'}`,
                    display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                    backgroundColor: isDone ? 'var(--accent-green)' : 'transparent',
                    color: 'var(--bg-dark)'
                  }}>
                    {isDone && <Check size={14} strokeWidth={4} />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium block" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{ex.name}</span>
                    <span className="text-secondary text-sm">{ex.sets} sets × {ex.reps}</span>
                  </div>
                </div>
              );
            })}
            {workout.exercises.length === 0 && <p className="text-secondary text-sm p-4 text-center">Rest and recover. Feel free to log notes below.</p>}
          </Card>

          <Card>
            <h3 className="font-bold mb-2">Session Notes</h3>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did it feel? Any PRs?"
              rows={4}
            />
          </Card>

          <button type="submit" className="btn-primary py-4 mt-2" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>
            Complete Session
          </button>
          <button type="button" onClick={() => setView('list')} className="btn-ghost">
            Cancel & Go Back
          </button>
        </form>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Gym Tracker</h1>
          <p className="text-secondary text-sm">{todayWorkout ? 'You did the hard work today.' : 'Log your training sessions.'}</p>
        </div>

        {todayWorkout && (
          <Card className="flex flex-col items-center py-6 text-center" style={{ borderColor: 'var(--accent-green)', marginBottom: 'var(--spacing-2)' }}>
            <div className="w-16 h-16 rounded-full bg-accent-green mb-4 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)' }}>
              <Check size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Workout Completed!</h2>
            {todayWorkout.notes && (
              <p className="text-secondary text-sm italic mt-2">"{todayWorkout.notes}"</p>
            )}
            <button 
               className="text-sm font-bold mt-4 p-2 rounded" 
               style={{ color: 'var(--accent-red)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
               onClick={(e) => {
                   e.stopPropagation();
                   if(window.confirm("Undo today's workout log?")) {
                       const newLogs = {...workoutLogs};
                       delete newLogs[todayKey];
                       updateData('workoutLogs', newLogs);
                   }
               }}
            >
               Undo Today's Log
            </button>
          </Card>
        )}

        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mt-2">{todayWorkout ? 'Your Routines' : 'Start a Session'}</h3>
        
        {workoutSplit.map(w => (
          <Card 
            key={w.id} 
            onClick={() => { setActiveSplitId(w.id); setView('active'); setCompletedExercises({}); }}
            className="flex justify-between items-center"
            style={{ cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--bg-card-hover)' } }}
          >
            <div>
              <h4 className="font-bold text-lg">{w.name}</h4>
              <span className="text-sm text-secondary">{w.exercises.length} Exercises {w.exercises.length === 0 ? '(Rest day)' : ''}</span>
            </div>
            <div style={{ backgroundColor: todayWorkout ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '50%' }}>
               {todayWorkout ? <Edit2 size={20} color="var(--accent-blue)" /> : <Play size={20} color="var(--accent-purple)" />}
            </div>
          </Card>
        ))}

        <Card style={{ borderStyle: 'dashed' }}>
          <form onSubmit={(e) => {
             e.preventDefault();
             if(!newSplitName.trim()) return;
             updateData('workoutSplit', [...workoutSplit, { id: Date.now().toString(), name: newSplitName.trim(), exercises: [] }]);
             setNewSplitName('');
          }} className="flex gap-2 items-center">
             <input type="text" placeholder="Add custom day (e.g. Day 8)" value={newSplitName} onChange={e => setNewSplitName(e.target.value)} className="flex-1 w-full" />
             <button type="submit" className="p-3 font-bold flex items-center justify-center rounded" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-dark)', minWidth: '48px' }}>
                <Plus size={20} />
             </button>
          </form>
        </Card>
      </div>
    );
  };

  switch(view) {
    case 'manage_exercises': return renderManageExercises();
    case 'active': return renderActiveWorkout();
    default: return renderList();
  }
}

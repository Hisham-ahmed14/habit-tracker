import React, { useState } from 'react';
import { Card } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Calculator } from 'lucide-react';
import { calculateMacros } from '../lib/calculator';

export function WeightProgress({ data, todayKey, updateData }) {
  const { weightHistory, userData } = data;
  // Auto-Calc States
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcTargetWeight, setCalcTargetWeight] = useState(userData.weightTarget || '');
  const [calcMonths, setCalcMonths] = useState(userData.targetMonths || '');
  const [calcHeight, setCalcHeight] = useState(userData.height || '');
  const [calcAge, setCalcAge] = useState(userData.age || '');
  const [calcGender, setCalcGender] = useState(userData.gender || 'Male');
  const [calcActivity, setCalcActivity] = useState(userData.activityLevel || '1.2');

  const [calcResult, setCalcResult] = useState(null);

  const sortedHistory = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentWeight = sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].weight : null;

  const [editingWeight, setEditingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState('');

  const startEditingWeight = () => {
    setTempWeight(currentWeight || '');
    setEditingWeight(true);
  };

  const saveCurrentWeight = () => {
    setEditingWeight(false);
    if (!tempWeight) return;
    
    const index = weightHistory.findIndex(entry => entry.date === todayKey);
    let newHistory = [...weightHistory];
    
    if (index >= 0) {
      newHistory[index].weight = parseFloat(tempWeight);
    } else {
      newHistory.push({ date: todayKey, weight: parseFloat(tempWeight) });
    }
    
    updateData('weightHistory', newHistory);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!currentWeight) {
      alert("Please log your current weight first before calculating your limits.");
      return;
    }

    const result = calculateMacros({
      currentWeight,
      targetWeight: parseFloat(calcTargetWeight),
      months: parseFloat(calcMonths),
      height: parseFloat(calcHeight),
      age: parseInt(calcAge),
      gender: calcGender,
      activityLevel: calcActivity
    });

    if (!result) return;

    setCalcResult(result);

    // Save profile metrics globally and OVERRIDE current max calorie targets
    updateData('userData', {
      ...userData,
      weightTarget: calcTargetWeight,
      targetMonths: calcMonths,
      height: calcHeight,
      age: calcAge,
      gender: calcGender,
      activityLevel: calcActivity,
      calorieTarget: result.calorieTarget,
      proteinTarget: result.proteinTarget
    });
  };

  const chartData = sortedHistory.map(entry => ({
    ...entry,
    displayDate: format(parseISO(entry.date), 'MMM d'),
    weight: parseFloat(entry.weight) // Ensure it is a number for recharts
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-card p-3 rounded shadow-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <p className="text-secondary mb-1">{label}</p>
          <p className="font-bold text-accent-blue">{payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Body Composition</h1>
        <p className="text-secondary text-sm">Measure exactly what you manage.</p>
      </div>

      <Card>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
               <h3 className="text-sm font-bold text-secondary">Current Weight</h3>
               {!editingWeight && <span className="text-xs text-secondary bg-bg-dark px-2 rounded-full" style={{ border: '1px solid var(--border-color)', fontSize: '10px' }}>Tap to edit</span>}
            </div>
            {editingWeight ? (
               <input 
                 type="number"
                 step="0.1"
                 autoFocus
                 value={tempWeight}
                 onChange={e => setTempWeight(e.target.value)}
                 onBlur={saveCurrentWeight}
                 onKeyDown={e => e.key === 'Enter' && saveCurrentWeight()}
                 className="text-3xl font-bold mt-1 text-accent-blue bg-transparent p-0 outline-none w-32"
                 style={{ border: 'none', borderBottom: '2px solid var(--accent-blue)', borderRadius: 0 }}
               />
            ) : (
               <div className="text-3xl font-bold mt-1 text-accent-blue cursor-pointer" onClick={startEditingWeight}>
                 {currentWeight ? `${currentWeight} kg` : '-- kg'}
               </div>
            )}
          </div>
          {userData.weightTarget && (
             <div className="text-right">
               <h3 className="text-sm font-bold text-secondary">Target</h3>
               <div className="text-xl font-bold mt-1">{userData.weightTarget} kg</div>
             </div>
          )}
        </div>
      </Card>

      <Card style={{ borderColor: isCalcOpen ? 'var(--accent-purple)' : 'var(--border-color)' }}>
        <div className="flex justify-between items-center text-accent-purple" style={{ cursor: 'pointer', color: 'var(--accent-purple)' }} onClick={() => setIsCalcOpen(!isCalcOpen)}>
          <div className="flex items-center gap-2">
            <Calculator size={20} />
            <h3 className="font-bold">Smart Goal Calculator</h3>
          </div>
          <span className="text-sm font-bold">{isCalcOpen ? 'Close' : 'Open'}</span>
        </div>

        {isCalcOpen && (
          <form onSubmit={handleCalculate} className="flex flex-col gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex gap-2">
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Goal Weight (kg)</label>
                 <input type="number" required step="0.1" value={calcTargetWeight} onChange={e => setCalcTargetWeight(e.target.value)} />
               </div>
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Timeline (Months)</label>
                 <input type="number" required step="0.5" value={calcMonths} onChange={e => setCalcMonths(e.target.value)} />
               </div>
            </div>
            <div className="flex gap-2">
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Height (cm)</label>
                 <input type="number" required value={calcHeight} onChange={e => setCalcHeight(e.target.value)} />
               </div>
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Age</label>
                 <input type="number" required value={calcAge} onChange={e => setCalcAge(e.target.value)} />
               </div>
            </div>
            <div className="flex gap-2">
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Biological Gender</label>
                 <select required value={calcGender} onChange={e => setCalcGender(e.target.value)} className="w-full bg-bg-dark border rounded p-3 text-text-primary" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                 </select>
               </div>
               <div className="flex-[1]">
                 <label className="text-xs text-secondary mb-1 block">Activity Level</label>
                 <select required value={calcActivity} onChange={e => setCalcActivity(e.target.value)} className="w-full bg-bg-dark border rounded p-3 text-text-primary" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
                   <option value="1.2">Sedentary</option>
                   <option value="1.375">Lightly Active</option>
                   <option value="1.55">Moderately Active</option>
                   <option value="1.725">Very Active</option>
                   <option value="1.9">Extra Active</option>
                 </select>
               </div>
            </div>

            <button type="submit" className="btn-primary mt-2" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>
              Calculate & Update Macros
            </button>

            {calcResult && (
              <div className="mt-4 p-4 rounded bg-bg-dark border" style={{ borderColor: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                 <p className="text-accent-green font-bold text-center mb-2">Nutrition Targets Auto-Updated!</p>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-secondary">Daily Calories:</span>
                   <span className="font-bold">{calcResult.calorieTarget} kcal</span>
                 </div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-secondary">Daily Protein:</span>
                   <span className="font-bold">{calcResult.proteinTarget} g</span>
                 </div>
                 <div className="flex justify-between text-xs mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)'}}>
                   <span className="text-secondary">Est. Maintenance:</span>
                   <span>{calcResult.tdee} kcal</span>
                 </div>
              </div>
            )}
          </form>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-bold mb-4">History</h3>
        {chartData.length > 0 ? (
          <div style={{ height: '250px', width: '100%', marginLeft: '-15px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="displayDate" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--accent-blue)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <p className="text-secondary text-sm text-center py-8">Log your weight to see progress.</p>
        )}
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Plus, Edit2, Check, Search } from 'lucide-react';
import { foodDatabase } from '../lib/foodDatabase';

export function Nutrition({ data, todayKey, updateData }) {
  const { nutritionLogs, userData } = data;
  const todayNutrition = nutritionLogs[todayKey] || { calories: 0, protein: 0 };

  const [addCals, setAddCals] = useState('');
  const [addProtein, setAddProtein] = useState('');

  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [editCalTarget, setEditCalTarget] = useState(userData?.calorieTarget || 2500);
  const [editProTarget, setEditProTarget] = useState(userData?.proteinTarget || 150);

  const [foodSearch, setFoodSearch] = useState('');
  const [foodAmount, setFoodAmount] = useState('100');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showMacroCalc, setShowMacroCalc] = useState(false);
  
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFoodSearch(val);
    if (!val) {
      setFilteredFoods([]);
      setSelectedFood(null);
      return;
    }
    
    const matches = foodDatabase.filter(f => f.name.toLowerCase().includes(val.toLowerCase()));
    setFilteredFoods(matches);
    if (selectedFood && !selectedFood.name.toLowerCase().includes(val.toLowerCase())) {
        setSelectedFood(null);
    }
  };

  const selectSuggestedFood = (food) => {
      setSelectedFood(food);
      setFoodSearch(food.name);
      setFilteredFoods([]);
  };

  const calculatedCals = selectedFood && foodAmount ? Math.round((selectedFood.calories / 100) * parseFloat(foodAmount)) : 0;
  const calculatedPro = selectedFood && foodAmount ? Math.round((selectedFood.protein / 100) * parseFloat(foodAmount)) : 0;

  const handleAddFromMacro = (e) => {
    e.preventDefault();
    if (calculatedCals <= 0) return;

    const currentCals = todayNutrition.calories;
    const currentProtein = todayNutrition.protein;

    const newLogs = { ...nutritionLogs };
    newLogs[todayKey] = {
      calories: currentCals + calculatedCals,
      protein: currentProtein + calculatedPro,
    };

    updateData('nutritionLogs', newLogs);
    setFoodSearch('');
    setFoodAmount('100');
    setSelectedFood(null);
    setShowMacroCalc(false);
  };

  // Sync state if userData somehow magically updates in background
  useEffect(() => {
    if (userData) {
      setEditCalTarget(userData.calorieTarget || 2500);
      setEditProTarget(userData.proteinTarget || 150);
    }
  }, [userData]);

  const handleAdd = (e, type) => {
    e.preventDefault();
    if (type === 'cals' && !addCals) return;
    if (type === 'protein' && !addProtein) return;

    const currentCals = todayNutrition.calories;
    const currentProtein = todayNutrition.protein;

    const newLogs = { ...nutritionLogs };
    newLogs[todayKey] = {
      calories: currentCals + (type === 'cals' ? parseInt(addCals) : 0),
      protein: currentProtein + (type === 'protein' ? parseInt(addProtein) : 0),
    };

    updateData('nutritionLogs', newLogs);
    if (type === 'cals') setAddCals('');
    if (type === 'protein') setAddProtein('');
  };

  const handleSaveTargets = (e) => {
    e.preventDefault();
    updateData('userData', { 
       ...userData, 
       calorieTarget: parseInt(editCalTarget) || 2500, 
       proteinTarget: parseInt(editProTarget) || 150 
    });
    setIsEditingTargets(false);
  };

  const calsRemaining = Math.max(0, (userData?.calorieTarget || 2500) - todayNutrition.calories);
  const proteinRemaining = Math.max(0, (userData?.proteinTarget || 150) - todayNutrition.protein);

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Nutrition</h1>
        <p className="text-secondary text-sm">Fuel your body right.</p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Today's Intake</h3>
          <button onClick={() => setIsEditingTargets(!isEditingTargets)} className="text-sm font-bold flex gap-1 items-center px-2 py-1 rounded" style={{ color: 'var(--accent-blue)', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
             <Edit2 size={16} /> {isEditingTargets ? 'Cancel' : 'Edit Targets'}
          </button>
        </div>

        {isEditingTargets && (
           <form onSubmit={handleSaveTargets} className="flex flex-col gap-3 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--accent-blue)' }}>
              <div>
                 <label className="text-xs text-secondary mb-1 block">Daily Calorie Target (kcal)</label>
                 <input type="number" value={editCalTarget} onChange={e => setEditCalTarget(e.target.value)} min="500" />
              </div>
              <div>
                 <label className="text-xs text-secondary mb-1 block">Daily Protein Target (g)</label>
                 <input type="number" value={editProTarget} onChange={e => setEditProTarget(e.target.value)} min="10" />
              </div>
              <button type="submit" className="btn-primary mt-2 flex justify-center items-center gap-2" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                 <Check size={18} /> Save & Apply
              </button>
           </form>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs text-secondary block">Calories</span>
              <span className="text-2xl font-bold text-accent-green">{todayNutrition.calories}</span>
              <span className="text-sm text-muted"> / {userData?.calorieTarget || 2500} kcal</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-secondary">Remaining: </span>
              <span className="font-bold">{calsRemaining}</span>
            </div>
          </div>
          <ProgressBar current={todayNutrition.calories} max={userData?.calorieTarget || 2500} color="var(--accent-green)" height="12px" />
          
          <form onSubmit={(e) => handleAdd(e, 'cals')} className="mt-3 flex gap-2">
            <input 
              type="number" 
              placeholder="Add Calories (e.g. 350)" 
              value={addCals} 
              onChange={e => setAddCals(e.target.value)} 
              min="1"
            />
            <button type="submit" className="p-4 flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent-green)', borderRadius: 'var(--radius-md)', color: '#000', minWidth: '56px' }}>
              <Plus size={20} />
            </button>
          </form>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs text-secondary block">Protein</span>
              <span className="text-2xl font-bold text-accent-blue" style={{color: 'var(--accent-blue)'}}>{todayNutrition.protein}</span>
              <span className="text-sm text-muted"> / {userData?.proteinTarget || 150} g</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-secondary">Remaining: </span>
              <span className="font-bold">{proteinRemaining}</span>
            </div>
          </div>
          <ProgressBar current={todayNutrition.protein} max={userData?.proteinTarget || 150} color="var(--accent-blue)" height="12px" />

          <form onSubmit={(e) => handleAdd(e, 'protein')} className="mt-3 flex gap-2">
            <input 
              type="number" 
              placeholder="Add Protein (g)" 
              value={addProtein} 
              onChange={e => setAddProtein(e.target.value)} 
              min="1"
            />
            <button type="submit" className="p-4 flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent-blue)', borderRadius: 'var(--radius-md)', color: '#fff', minWidth: '56px' }}>
              <Plus size={20} />
            </button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div 
            className="flex justify-between items-center" 
            style={{ cursor: 'pointer', color: showMacroCalc ? 'var(--text-muted)' : 'var(--accent-blue)', padding: '8px 0' }} 
            onClick={() => setShowMacroCalc(!showMacroCalc)}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Food Calorie Calculator</h3>
            </div>
            <span className="text-sm font-bold">{showMacroCalc ? 'Close' : 'Open'}</span>
          </div>
          
          {showMacroCalc && (
            <form onSubmit={handleAddFromMacro} className="mt-4 p-4 rounded-lg border flex flex-col gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
               
               <div className="relative">
                 <label className="text-xs text-secondary mb-1 block">Search Food Item</label>
                 <div className="flex items-center border rounded p-2 bg-bg-dark" style={{ borderColor: 'var(--border-color)' }}>
                    <Search size={16} color="var(--text-secondary)" className="mr-2" />
                    <input 
                      type="text" 
                      placeholder="e.g. Chicken Breast" 
                      value={foodSearch} 
                      onChange={handleSearchChange} 
                      className="bg-transparent border-0 outline-none w-full p-0"
                    />
                 </div>
                 {filteredFoods.length > 0 && !selectedFood && (
                    <div className="absolute w-full mt-1 rounded border z-10 max-h-40 overflow-y-auto" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                       {filteredFoods.map(f => (
                         <div 
                           key={f.name} 
                           className="p-3 text-sm cursor-pointer border-b last:border-b-0 hover:text-accent-blue" 
                           onClick={() => selectSuggestedFood(f)}
                           style={{ borderColor: 'var(--border-color)' }}
                         >
                           {f.name} <span className="text-xs text-secondary ml-2">{f.calories} kcal / 100g</span>
                         </div>
                       ))}
                    </div>
                 )}
               </div>

               <div>
                 <label className="text-xs text-secondary mb-1 block">Amount (grams)</label>
                 <input type="number" min="1" value={foodAmount} onChange={e => setFoodAmount(e.target.value)} />
               </div>
               
               <div className="flex justify-between items-end my-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                 <span className="text-sm font-bold text-secondary">Calculated:</span>
                 <div className="text-right">
                    <span className="text-2xl font-bold">{calculatedCals} <span className="text-xs text-secondary">kcal</span></span>
                    <div className="text-sm text-accent-blue font-bold">{calculatedPro}g Protein</div>
                 </div>
               </div>
               
               <button type="submit" disabled={calculatedCals <= 0} className="p-3 w-full flex items-center justify-center gap-2 rounded-lg font-bold" style={{ backgroundColor: calculatedCals > 0 ? 'var(--accent-green)' : 'var(--bg-dark)', color: calculatedCals > 0 ? '#000' : 'var(--text-muted)', border: calculatedCals > 0 ? 'none' : '1px solid var(--border-color)' }}>
                  <Plus size={18} /> Add {calculatedCals} Cals & {calculatedPro}g Prot
               </button>
            </form>
          )}
        </div>
      </Card>
      
      <Card style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)', marginTop: 'var(--spacing-4)' }}>
         <h4 className="font-bold mb-1" style={{color: 'var(--accent-blue)'}}>Quick Tip</h4>
         <p className="text-sm text-secondary">To build muscle efficiently, ensure you hit your protein target within +/- 10g and maintain a slight caloric surplus daily.</p>
      </Card>
    </div>
  );
}

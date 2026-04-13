// Calculate Daily Calories and Protein based on Mifflin-St Jeor formula
export const calculateMacros = ({ currentWeight, targetWeight, months, height, age, gender, activityLevel }) => {
  if (!currentWeight || !targetWeight || !months || !height || !age || !gender || !activityLevel) {
    return null;
  }

  // 1. Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor
  let bmr = (10 * currentWeight) + (6.25 * height) - (5 * age);
  if (gender === 'Male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // 2. Calculate Total Daily Energy Expenditure (TDEE)
  const tdee = bmr * parseFloat(activityLevel);

  // 3. Calculate Daily Calorie Adjustment needed to hit goal
  // Total weight difference to achieve
  const weightDiff = targetWeight - currentWeight; 
  // 1kg of weight is ~7700 kcal
  const totalCalorieDiff = weightDiff * 7700;
  // Convert months to approximate days
  const days = months * 30.44; 
  const dailyDiff = totalCalorieDiff / days;

  // 4. Final Targets
  let targetCalories = Math.round(tdee + dailyDiff);
  
  // Floor calories to at least 1200 for health baseline safety
  if (targetCalories < 1200) targetCalories = 1200;

  // Protein baseline: 2g per kg of bodyweight, ideal for muscle synthesis
  let targetProtein = Math.round(currentWeight * 2.0);

  return {
    calorieTarget: targetCalories,
    proteinTarget: targetProtein,
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
    dailyAdjustment: Math.round(dailyDiff)
  };
};

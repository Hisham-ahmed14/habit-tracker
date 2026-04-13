// Static Food Database (Nutrition facts per 100g)
export const foodDatabase = [
  // Meats & Proteins
  { name: 'Chicken Breast (Cooked)', calories: 165, protein: 31 },
  { name: 'Chicken Thigh (Cooked)', calories: 209, protein: 26 },
  { name: 'Beef (Lean, Cooked)', calories: 250, protein: 26 },
  { name: 'Salmon (Cooked)', calories: 206, protein: 22 },
  { name: 'Tuna (Canned in Water)', calories: 86, protein: 19 },
  { name: 'Eggs (Whole, Boiled)', calories: 155, protein: 13 },
  { name: 'Egg Whites', calories: 52, protein: 11 },
  { name: 'Whey Protein Powder', calories: 350, protein: 80 },

  // Carbs & Grains
  { name: 'White Rice (Cooked)', calories: 130, protein: 2.7 },
  { name: 'Brown Rice (Cooked)', calories: 111, protein: 2.6 },
  { name: 'Oats (Raw)', calories: 389, protein: 16.9 },
  { name: 'Pasta (Cooked)', calories: 131, protein: 5 },
  { name: 'Sweet Potato (Cooked)', calories: 86, protein: 1.6 },
  { name: 'Potato (Cooked)', calories: 87, protein: 1.9 },
  { name: 'Whole Wheat Bread (1 Slice = 30gi)', calories: 250, protein: 12 }, // Normalized to 100g equivalent approx

  // Dairy
  { name: 'Whole Milk', calories: 61, protein: 3.2 },
  { name: 'Skim Milk', calories: 34, protein: 3.4 },
  { name: 'Greek Yogurt (Non-fat)', calories: 59, protein: 10 },
  { name: 'Cheddar Cheese', calories: 402, protein: 25 },
  { name: 'Paneer', calories: 265, protein: 18 },

  // Fruits & Veg
  { name: 'Banana', calories: 89, protein: 1.1 },
  { name: 'Apple', calories: 52, protein: 0.3 },
  { name: 'Broccoli', calories: 34, protein: 2.8 },
  { name: 'Spinach (Raw)', calories: 23, protein: 2.9 },
  
  // Fats & Nuts
  { name: 'Almonds', calories: 579, protein: 21 },
  { name: 'Peanut Butter', calories: 588, protein: 25 },
  { name: 'Avocado', calories: 160, protein: 2 },
  { name: 'Olive Oil', calories: 884, protein: 0 }
].sort((a,b) => a.name.localeCompare(b.name));

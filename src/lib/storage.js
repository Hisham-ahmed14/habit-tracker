import localforage from 'localforage';

// Configure localforage to use IndexedDB primarily, fallback to localStorage
localforage.config({
  name: 'DisciplineTracker',
  version: 1.0,
  storeName: 'app_data',
});

// App data schema standard
const defaultData = {
  userData: {
    weightTarget: null,
    calorieTarget: 2500,
    proteinTarget: 150,
    height: '',
    age: '',
    gender: 'Male',
    activityLevel: '1.2',
    targetMonths: ''
  },
  weightHistory: [], // { date: 'YYYY-MM-DD', weight: Number }
  workoutSplit: [], // { id, name, exercises: [{ name, sets, reps }] }
  workoutLogs: {}, // { 'YYYY-MM-DD': { notes, exercises: [...] } }
  nutritionLogs: {}, // { 'YYYY-MM-DD': { calories: Number, protein: Number } }
  habits: [
    { id: '1', name: 'Completed Workout', icon: 'Dumbbell' },
    { id: '2', name: 'Ate enough calories', icon: 'Utensils' },
    { id: '3', name: 'Slept 7+ hours', icon: 'Moon' }
  ],
  habitLogs: {}, // { 'YYYY-MM-DD': ['1', '2'] } // array of completed habit IDs
  dailyPlans: {}, // { 'YYYY-MM-DD': { text: '', workoutId: '' } }
  dailyTasks: {}, // { 'YYYY-MM-DD': [ { id: 'uuid', text: 'Task', isCompleted: false, reminderTime: '14:30', notified: false } ] }
};

export const storage = {
  async get(key) {
    try {
      const value = await localforage.getItem(key);
      if (value === null && defaultData[key] !== undefined) {
        return defaultData[key];
      }
      return value;
    } catch (err) {
      console.error('Error getting data', err);
      return defaultData[key];
    }
  },

  async set(key, value) {
    try {
      await localforage.setItem(key, value);
    } catch (err) {
      console.error('Error setting data', err);
    }
  },

  async getAllData() {
    const data = {};
    for (const key of Object.keys(defaultData)) {
      data[key] = await this.get(key);
    }
    return data;
  }
};

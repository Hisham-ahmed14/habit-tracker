import { format, differenceInDays, parseISO, subDays } from 'date-fns';

export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(parseISO(dateString), 'MMM d, yyyy');
};

/**
 * Calculates current streak of habit tracking.
 * A streak is maintained if the habit was logged at least once on consecutive days.
 * @param {Object} habitLogs - { 'YYYY-MM-DD': ['habitId'] }
 * @param {string} habitId - The ID of the habit to check.
 * @returns {number} The current streak in days.
 */
export const calculateHabitStreak = (habitLogs, habitId) => {
  let streak = 0;
  let currentDate = new Date(); // Start checking from today

  while (true) {
    const key = format(currentDate, 'yyyy-MM-dd');
    const logsForDay = habitLogs[key] || [];

    if (logsForDay.includes(habitId)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      // If it's today and we haven't done it yet, don't break the streak immediately,
      // just look at yesterday.
      if (streak === 0 && key === getTodayKey()) {
         currentDate = subDays(currentDate, 1);
      } else {
         break;
      }
    }
  }
  
  return streak;
};

/**
 * Strict Global Streak: Requires completing ALL active habits for a day.
 */
export const calculateAppStreak = (habitLogs, totalHabitsCount) => {
  let streak = 0;
  let currentDate = new Date();
  
  while (true) {
    const key = format(currentDate, 'yyyy-MM-dd');
    const logs = habitLogs[key] || [];
    
    // Streak only counts if they completed at least the total number of currently active habits.
    const completedAllHabits = totalHabitsCount > 0 && logs.length >= totalHabitsCount;

    if (completedAllHabits) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      if (streak === 0 && key === getTodayKey()) {
        // Allow streak to show current value even if today isn't completed yet
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
  }
  return streak;
};

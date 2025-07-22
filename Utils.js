// Utils.js - All calculation and utility functions
import { foodDatabase } from './foodDatabase.js';

// ========================
// TIME GENERATION FUNCTIONS
// ========================

export const generateMealTimes = (startHour, endHour) => {
  const times = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    let displayHour = hour;
    let ampm = 'AM';
    
    if (hour === 12) {
      displayHour = 12;
      ampm = 'PM';
    } else if (hour > 12) {
      displayHour = hour - 12;
      ampm = 'PM';
    } else if (hour === 0) {
      displayHour = 12;
      ampm = 'AM';
    }
    
    times.push(`${displayHour}:00 ${ampm}`);
    if (hour !== endHour) times.push(`${displayHour}:30 ${ampm}`);
  }
  return times;
};

export const generateHourlyTimes = (startHour, endHour) => {
  const times = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    let displayHour = hour;
    let ampm = 'AM';
    
    if (hour === 12) {
      displayHour = 12;
      ampm = 'PM';
    } else if (hour > 12) {
      displayHour = hour - 12;
      ampm = 'PM';
    } else if (hour === 0) {
      displayHour = 12;
      ampm = 'AM';
    }
    
    times.push(`${displayHour}:00 ${ampm}`);
  }
  return times;
};

// ========================
// NUTRITION CALCULATIONS
// ========================

export const calculateTotals = (foodItems) => {
  return foodItems.reduce((totals, item) => {
    if (item.category && item.food && foodDatabase[item.category][item.food]) {
      const foodData = foodDatabase[item.category][item.food];
      const multiplier = item.serving;
      
      totals.protein += foodData.protein * multiplier;
      totals.carbs += foodData.carbs * multiplier;
      totals.fat += foodData.fat * multiplier;
      totals.sugar += foodData.sugar * multiplier;
      totals.calories += foodData.calories * multiplier;
    }
    return totals;
  }, { protein: 0, carbs: 0, fat: 0, sugar: 0, calories: 0 });
};

export const preparePieData = (totals) => {
  const totalMacros = totals.protein + totals.carbs + totals.fat;
  
  return [
    { 
      name: 'Protein', 
      value: Math.round(totals.protein), 
      color: '#3B82F6',
      percentage: totalMacros > 0 ? Math.round((totals.protein / totalMacros) * 100) : 0
    },
    { 
      name: 'Carbs', 
      value: Math.round(totals.carbs), 
      color: '#10B981',
      percentage: totalMacros > 0 ? Math.round((totals.carbs / totalMacros) * 100) : 0
    },
    { 
      name: 'Fat', 
      value: Math.round(totals.fat), 
      color: '#F59E0B',
      percentage: totalMacros > 0 ? Math.round((totals.fat / totalMacros) * 100) : 0
    }
  ];
};

// ========================
// TDEE & CALORIE CALCULATIONS
// ========================

export const calculateTDEE = (userProfile) => {
  const { heightFeet, heightInches, weight, exerciseLevel, goal } = userProfile;
  
  if (!heightFeet || !heightInches || !weight || !exerciseLevel) return null;
  
  const totalInches = (parseFloat(heightFeet) * 12) + parseFloat(heightInches);
  const heightCm = totalInches * 2.54;
  const weightKg = parseFloat(weight) * 0.453592;
  
  // Using Mifflin-St Jeor equation (for men - could be enhanced for gender)
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * 25) - 78;
  
  const activityMultipliers = {
    'sedentary': 1.2, 
    'light': 1.375, 
    'moderate': 1.55, 
    'active': 1.725, 
    'very-active': 1.9
  };
  
  const tdee = bmr * (activityMultipliers[exerciseLevel] || 1.2);
  
  const goalAdjustments = {
    'maintain': 0, 
    'lose': -500, 
    'gain-muscle': 300, 
    'dirty-bulk': 500
  };
  
  const targetCalories = tdee + (goalAdjustments[goal] || 0);
  
  return { 
    bmr: Math.round(bmr), 
    tdee: Math.round(tdee), 
    targetCalories: Math.round(targetCalories) 
  };
};

// ========================
// WARNING & VALIDATION FUNCTIONS
// ========================

export const getServingWarnings = (items, mealType, userProfile) => {
  const eggItems = ['eggs (whole)', 'egg whites'];
  return items.map(item => {
    const isRidiculous = item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()));
    
    const calories = item.category && item.food && foodDatabase[item.category][item.food] 
      ? Math.round(foodDatabase[item.category][item.food].calories * item.serving)
      : 0;
    
    return {
      ...item,
      isRidiculous,
      totalCalories: calories,
      showWarning: isRidiculous && userProfile.firstName && userProfile.firstName.length > 0
    };
  });
};

// ========================
// SUGAR WARNING FUNCTIONS
// ========================

export const getSugarWarningStyle = (dailyTotals, userProfile) => {
  // Goal-specific thresholds
  let greenLimit, yellowLimit;
  switch(userProfile.goal) {
    case 'maintain':
      greenLimit = 45; // +20g
      yellowLimit = 80; // +20g
      break;
    case 'lose':
      greenLimit = 25; // baseline
      yellowLimit = 60; // baseline  
      break;
    case 'gain-muscle':
      greenLimit = 25; // same as lose
      yellowLimit = 60; // same as lose
      break;
    case 'dirty-bulk':
      greenLimit = 50; // +25g
      yellowLimit = 85; // +25g
      break;
    default:
      greenLimit = 25;
      yellowLimit = 60;
  }
  
  if (dailyTotals.sugar <= greenLimit) return 'bg-green-100 border-green-300';
  if (dailyTotals.sugar <= yellowLimit) return 'bg-yellow-100 border-black border-2';
  return 'bg-red-100 border-red-300';
};

export const getSugarWarningMessage = (dailyTotals, userProfile) => {
  // Goal-specific thresholds
  let greenLimit, yellowLimit;
  switch(userProfile.goal) {
    case 'maintain':
      greenLimit = 45;
      yellowLimit = 80;
      break;
    case 'lose':
      greenLimit = 25;
      yellowLimit = 60;
      break;
    case 'gain-muscle':
      greenLimit = 25;
      yellowLimit = 60;
      break;
    case 'dirty-bulk':
      greenLimit = 50;
      yellowLimit = 85;
      break;
    default:
      greenLimit = 25;
      yellowLimit = 60;
  }

  if (dailyTotals.sugar <= greenLimit) {
    return (
      <>
        <span className="text-2xl">😊</span>
        <span className="text-green-700 font-semibold">
          Total Daily Sugar: {Math.round(dailyTotals.sugar)}g
          {userProfile.goal && ` (${userProfile.goal} goal)`}
        </span>
      </>
    );
  } else if (dailyTotals.sugar <= yellowLimit) {
    return (
      <>
        <span className="text-xl">⚠️</span>
        <span className="text-black font-semibold">
          Total Daily Sugar: {Math.round(dailyTotals.sugar)}g
          {userProfile.goal && ` (${userProfile.goal} goal)`}
        </span>
        {userProfile.goal === 'gain-muscle' && (
          <span className="text-xs text-black ml-2">
            😉 I thought you wanted "lean" muscle not dirty bulk!
          </span>
        )}
      </>
    );
  } else {
    return (
      <>
        <span className="text-2xl">☢️</span>
        <span className="text-red-700 font-semibold">
          Total Daily Sugar: {Math.round(dailyTotals.sugar)}g - DANGER ZONE!
          {userProfile.goal && ` (${userProfile.goal} goal)`}
        </span>
      </>
    );
  }
};

// ========================
// CALORIE PROGRESS FUNCTIONS
// ========================

export const getCalorieProgressMessage = (dailyTotals, calorieData) => {
  if (!calorieData) return null;
  
  const remaining = calorieData.targetCalories - dailyTotals.calories;
  const percentageOfTarget = (dailyTotals.calories / calorieData.targetCalories) * 100;
  
  if (dailyTotals.calories > calorieData.targetCalories) {
    return {
      message: `+${Math.round(dailyTotals.calories - calorieData.targetCalories)} over`,
      className: 'text-yellow-200 font-medium'
    };
  } else if (percentageOfTarget >= 90) {
    return {
      message: `${Math.round(remaining)} remaining - almost there!`,
      className: 'text-green-200 font-medium'
    };
  } else if (percentageOfTarget >= 75) {
    return {
      message: `${Math.round(remaining)} remaining`,
      className: 'text-blue-200 font-medium'
    };
  } else if (percentageOfTarget >= 50) {
    return {
      message: `${Math.round(remaining)} remaining - keep going!`,
      className: 'text-white font-medium'
    };
  } else {
    return {
      message: `${Math.round(remaining)} remaining - long way to go!`,
      className: 'text-gray-200 font-medium'
    };
  }
};

// ========================
// DAILY TOTALS CALCULATION
// ========================

export const calculateDailyTotals = (mealTotals) => {
  return {
    protein: Object.values(mealTotals).reduce((sum, meal) => sum + meal.protein, 0),
    carbs: Object.values(mealTotals).reduce((sum, meal) => sum + meal.carbs, 0),
    fat: Object.values(mealTotals).reduce((sum, meal) => sum + meal.fat, 0),
    sugar: Object.values(mealTotals).reduce((sum, meal) => sum + meal.sugar, 0),
    calories: Object.values(mealTotals).reduce((sum, meal) => sum + meal.calories, 0)
  };
};

// ========================
// MACRO PERCENTAGE HELPERS
// ========================

export const getMacroPercentages = (totals) => {
  const totalMacros = totals.protein + totals.carbs + totals.fat;
  if (totalMacros === 0) return { protein: 0, carbs: 0, fat: 0 };
  
  return {
    protein: Math.round((totals.protein / totalMacros) * 100),
    carbs: Math.round((totals.carbs / totalMacros) * 100),
    fat: Math.round((totals.fat / totalMacros) * 100)
  };
};

// ========================
// VALIDATION HELPERS
// ========================

export const validateUserProfile = (userProfile) => {
  const errors = [];
  
  if (!userProfile.heightFeet) errors.push('Height (feet) is required');
  if (!userProfile.heightInches) errors.push('Height (inches) is required');
  if (!userProfile.weight) errors.push('Weight is required');
  if (!userProfile.exerciseLevel) errors.push('Exercise level is required');
  if (!userProfile.goal) errors.push('Goal is required');
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
// TimeAwareMessaging.js - Smart chronological meal analysis

// ========================
// TIME UTILITIES
// ========================

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  return hour24 * 60 + minutes;
};

// ========================
// CHRONOLOGICAL MEAL ANALYSIS
// ========================

export const getChronologicalMealOrder = (allMeals, currentMealType) => {
  // Convert all meals to time-sortable format
  const mealEntries = Object.entries(allMeals).map(([mealType, mealData]) => ({
    mealType,
    time: mealData.time,
    timeMinutes: timeToMinutes(mealData.time),
    totals: mealData.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 },
    items: mealData.items || [],
    pieData: mealData.pieData || []
  }));

  // Sort by time
  const chronologicalOrder = mealEntries.sort((a, b) => a.timeMinutes - b.timeMinutes);

  // Find current meal index
  const currentMealIndex = chronologicalOrder.findIndex(meal => meal.mealType === currentMealType);
  
  // Get meals that happened before current meal
  const mealsBefore = chronologicalOrder.slice(0, currentMealIndex);
  
  // Get current meal
  const currentMeal = chronologicalOrder[currentMealIndex];
  
  // Get meals that happen after current meal
  const mealsAfter = chronologicalOrder.slice(currentMealIndex + 1);

  return {
    mealsBefore,
    currentMeal,
    mealsAfter,
    chronologicalOrder
  };
};

// ========================
// CUMULATIVE NUTRITION CALCULATION
// ========================

export const calculateCumulativeNutrition = (mealsUpToNow) => {
  return mealsUpToNow.reduce((cumulative, meal) => {
    const totals = meal.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 };
    return {
      calories: cumulative.calories + totals.calories,
      protein: cumulative.protein + totals.protein,
      carbs: cumulative.carbs + totals.carbs,
      fat: cumulative.fat + totals.fat,
      sugar: cumulative.sugar + totals.sugar
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 });
};

// ========================
// SMART MEAL CONTEXT ANALYSIS
// ========================

export const analyzeMealContext = (allMeals, currentMealType, currentMealTotals, userProfile, calorieData) => {
  const { mealsBefore, currentMeal, mealsAfter } = getChronologicalMealOrder(allMeals, currentMealType);
  
  // Calculate nutrition consumed up to this meal (including current)
  const nutritionSoFar = calculateCumulativeNutrition([...mealsBefore, { totals: currentMealTotals }]);
  
  // Calculate what was consumed before this meal (excluding current)
  const nutritionBefore = calculateCumulativeNutrition(mealsBefore);
  
  // Analyze post-workout timing impact
  const postWorkoutMeal = mealsBefore.find(meal => meal.mealType === 'postWorkout');
  const hasPostWorkoutBefore = postWorkoutMeal && postWorkoutMeal.totals.calories > 0;
  
  // Calculate time-based progress targets
  const currentTimeMinutes = currentMeal?.timeMinutes || 0;
  const totalDayMinutes = 16 * 60; // Assume 16-hour active day (6 AM to 10 PM)
  const dayProgress = Math.min(currentTimeMinutes - (6 * 60), totalDayMinutes) / totalDayMinutes; // Start from 6 AM
  const expectedCalorieProgress = dayProgress * (calorieData?.targetCalories || 2500);
  const expectedProteinProgress = dayProgress * (getUserProteinTarget(userProfile) || 120);
  
  return {
    mealsBefore,
    currentMeal,
    mealsAfter,
    nutritionSoFar,
    nutritionBefore,
    hasPostWorkoutBefore,
    postWorkoutMeal,
    dayProgress,
    expectedCalorieProgress,
    expectedProteinProgress,
    timeBasedTargets: {
      calories: expectedCalorieProgress,
      protein: expectedProteinProgress
    }
  };
};

// ========================
// GOAL-SPECIFIC PROTEIN TARGETS
// ========================

export const getUserProteinTarget = (userProfile) => {
  switch(userProfile.goal) {
    case 'dirty-bulk':
      return 150;
    case 'gain-muscle':
      return 130;
    case 'maintain':
      return 100;
    case 'lose':
      return 120; // Higher protein when cutting
    default:
      return 120;
  }
};

// ========================
// INTELLIGENT RECOMMENDATION ENGINE
// ========================

export const getSmartRecommendations = (context, userProfile, currentMealType) => {
  const { nutritionSoFar, timeBasedTargets, hasPostWorkoutBefore, postWorkoutMeal } = context;
  
  const proteinTarget = getUserProteinTarget(userProfile);
  const proteinGap = proteinTarget - nutritionSoFar.protein;
  const calorieGap = timeBasedTargets.calories - nutritionSoFar.calories;
  
  let recommendations = [];
  
  // Post-workout context adjustments
  if (hasPostWorkoutBefore) {
    const postWorkoutProtein = postWorkoutMeal.totals.protein;
    recommendations.push({
      type: 'context',
      message: `Your earlier post-workout meal contributed ${Math.round(postWorkoutProtein)}g protein, which is factored into your current totals.`
    });
  }
  
  // Protein gap recommendations
  if (proteinGap > 20) {
    recommendations.push({
      type: 'protein',
      priority: 'high',
      message: `You need ${Math.round(proteinGap)}g more protein to hit your daily target.`,
      suggestions: getProteinSuggestions(proteinGap, userProfile.goal)
    });
  } else if (proteinGap > 10) {
    recommendations.push({
      type: 'protein',
      priority: 'medium',
      message: `You're close! Just ${Math.round(proteinGap)}g more protein needed.`,
      suggestions: getProteinSuggestions(proteinGap, userProfile.goal)
    });
  }
  
  // Calorie pacing recommendations
  if (calorieGap > 300) {
    recommendations.push({
      type: 'calories',
      priority: 'medium',
      message: `You're ${Math.round(calorieGap)} calories behind your time-based target.`,
      suggestions: getCalorieSuggestions(calorieGap, userProfile.goal)
    });
  }
  
  return recommendations;
};

// ========================
// SUGGESTION GENERATORS
// ========================

export const getProteinSuggestions = (proteinNeeded, goal) => {
  const suggestions = {
    'dirty-bulk': [
      { food: 'Whey Protein + Peanut Butter + Bagel', protein: 41, calories: 708 },
      { food: 'Fairlife Core Power 42g + Banana', protein: 43, calories: 319 },
      { food: 'Chicken Breast (6oz) + Rice', protein: 46, calories: 390 }
    ],
    'gain-muscle': [
      { food: 'Chicken Breast (5oz)', protein: 39, calories: 206 },
      { food: 'Greek Yogurt + Whey Protein', protein: 41, calories: 212 },
      { food: 'Tuna + Rice Cakes (3)', protein: 24, calories: 213 }
    ],
    'lose': [
      { food: 'Whey Protein Shake', protein: 24, calories: 120 },
      { food: 'Greek Yogurt (large)', protein: 20, calories: 130 },
      { food: 'Turkey Jerky (2oz)', protein: 22, calories: 140 }
    ]
  };
  
  const goalSuggestions = suggestions[goal] || suggestions['gain-muscle'];
  return goalSuggestions.filter(s => s.protein >= Math.min(proteinNeeded, 15));
};

export const getCalorieSuggestions = (caloriesNeeded, goal) => {
  const suggestions = {
    'dirty-bulk': [
      { food: 'Peanut Butter + Bread', calories: 400, protein: 16 },
      { food: 'Bagel + Cream Cheese', calories: 350, protein: 12 },
      { food: 'Almonds (2oz)', calories: 328, protein: 12 }
    ],
    'gain-muscle': [
      { food: 'Banana + Almonds', calories: 253, protein: 7 },
      { food: 'Apple + Peanut Butter', calories: 240, protein: 8 },
      { food: 'Rice Cakes (4) + Honey', calories: 200, protein: 3 }
    ]
  };
  
  const goalSuggestions = suggestions[goal] || suggestions['gain-muscle'];
  return goalSuggestions.filter(s => s.calories >= Math.min(caloriesNeeded, 200));
};

// ========================
// TIME-AWARE MESSAGE GENERATORS
// ========================

export const generateTimeAwareMessage = (allMeals, currentMealType, currentMealTotals, currentMealItems, userProfile, calorieData, selectedTime, pieData) => {
  const context = analyzeMealContext(allMeals, currentMealType, currentMealTotals, userProfile, calorieData);
  const recommendations = getSmartRecommendations(context, userProfile, currentMealType);
  
  // Get base message from existing system
  let message = getBaseMealMessage(currentMealType, pieData, selectedTime, currentMealItems, currentMealTotals, userProfile);
  
  // Add time-aware context
  const contextMessage = generateContextMessage(context, userProfile, currentMealType);
  if (contextMessage) {
    message = contextMessage + " " + (message || "");
  }
  
  // Add smart recommendations
  const recommendationMessage = generateRecommendationMessage(recommendations, userProfile);
  if (recommendationMessage) {
    message += " " + recommendationMessage;
  }
  
  return message;
};

export const generateContextMessage = (context, userProfile, currentMealType) => {
  const { nutritionSoFar, hasPostWorkoutBefore, postWorkoutMeal, dayProgress } = context;
  
  if (!userProfile.firstName) return null;
  
  let contextParts = [];
  
  // Post-workout acknowledgment
  if (hasPostWorkoutBefore) {
    const pwProtein = Math.round(postWorkoutMeal.totals.protein);
    const pwCalories = Math.round(postWorkoutMeal.totals.calories);
    contextParts.push(`Great job on that earlier post-workout fuel (${pwProtein}g protein, ${pwCalories} cals)!`);
  }
  
  // Daily progress context
  const totalProtein = Math.round(nutritionSoFar.protein);
  const totalCalories = Math.round(nutritionSoFar.calories);
  const progressPercentage = Math.round(dayProgress * 100);
  
  if (progressPercentage > 75) {
    contextParts.push(`You're ${progressPercentage}% through your day with ${totalProtein}g protein and ${totalCalories} calories - strong finish ahead!`);
  } else if (progressPercentage > 50) {
    contextParts.push(`Midday check: ${totalProtein}g protein and ${totalCalories} calories so far - solid progress, ${userProfile.firstName}!`);
  } else if (progressPercentage > 25) {
    contextParts.push(`Morning fuel: ${totalProtein}g protein and ${totalCalories} calories - you're building momentum!`);
  } else {
    contextParts.push(`Early start with ${totalProtein}g protein and ${totalCalories} calories - perfect foundation, ${userProfile.firstName}!`);
  }
  
  return contextParts.join(" ");
};

export const generateRecommendationMessage = (recommendations, userProfile) => {
  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
  
  if (highPriorityRecs.length > 0) {
    const rec = highPriorityRecs[0];
    if (rec.suggestions && rec.suggestions.length > 0) {
      const suggestion = rec.suggestions[0];
      return `${rec.message} Try adding ${suggestion.food} (${suggestion.protein}g protein, ${suggestion.calories} calories).`;
    }
    return rec.message;
  }
  
  if (mediumPriorityRecs.length > 0) {
    const rec = mediumPriorityRecs[0];
    return rec.message;
  }
  
  return "Keep up the great work with your nutrition timing!";
};

// ========================
// FALLBACK BASE MESSAGES
// ========================

export const getBaseMealMessage = (mealType, pieData, selectedTime, items, totals, userProfile) => {
  // This would call the existing meal-specific message functions as fallback
  // Implementation would depend on how you want to integrate with existing MealMessages
  return null;
};
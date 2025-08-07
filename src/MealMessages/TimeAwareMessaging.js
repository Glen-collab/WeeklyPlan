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

// REPLACE the getSmartRecommendations function in your TimeAwareMessaging.js with this:

export const getSmartRecommendations = (context, userProfile, currentMealType) => {
  const { nutritionSoFar, timeBasedTargets, hasPostWorkoutBefore, postWorkoutMeal } = context;
  
  const proteinTarget = getUserProteinTarget(userProfile);
  const proteinGap = proteinTarget - nutritionSoFar.protein;
  
  let recommendations = [];
  
  // Post-workout context (keep this)
  if (hasPostWorkoutBefore) {
    const postWorkoutProtein = postWorkoutMeal.totals.protein;
    recommendations.push({
      type: 'context',
      message: `Your earlier post-workout meal contributed ${Math.round(postWorkoutProtein)}g protein, which is factored into your current totals.`
    });
  }
  
  // MEAL-SPECIFIC PROTEIN RECOMMENDATIONS
  if (proteinGap > 15) {
    let suggestions = [];
    let mealContext = "";
    
    // SNACKS = SUPPLEMENTS
    if (['firstSnack', 'secondSnack', 'midAfternoon'].includes(currentMealType)) {
      const snackSuggestions = {
        'dirty-bulk': [
          { food: 'Fairlife Core Power 42g + Banana', protein: 43, calories: 319 },
          { food: 'Met-RX Big 100 Bar', protein: 30, calories: 410 },
          { food: 'Whey Protein + Bagel', protein: 33, calories: 365 },
          { food: 'Pure Protein RTD + Rice Cakes (2)', protein: 35, calories: 250 },
          { food: 'Quest Bar + Almonds', protein: 26, calories: 354 },
          { food: 'Ryse Protein + Peanut Butter', protein: 33, calories: 308 }
        ],
        'gain-muscle': [
          { food: 'Whey Protein Shake', protein: 24, calories: 120 },
          { food: 'Quest Protein Bar', protein: 20, calories: 190 },
          { food: 'Pure Protein RTD', protein: 35, calories: 160 },
          { food: 'Greek Yogurt + Whey Protein', protein: 41, calories: 212 },
          { food: 'Turkey Jerky (2oz)', protein: 22, calories: 140 },
          { food: 'Fairlife Core Power 26g', protein: 26, calories: 150 }
        ],
        'lose': [
          { food: 'Whey Protein Isolate', protein: 25, calories: 110 },
          { food: 'Turkey Jerky (1.5oz)', protein: 16, calories: 105 },
          { food: 'String Cheese (2) + Beef Jerky', protein: 21, calories: 220 },
          { food: 'Pure Protein Bar', protein: 20, calories: 180 },
          { food: 'Greek Yogurt (large)', protein: 20, calories: 130 },
          { food: 'Atkins RTD', protein: 15, calories: 160 }
        ]
      };
      
      suggestions = snackSuggestions[userProfile.goal] || snackSuggestions['gain-muscle'];
      mealContext = currentMealType === 'firstSnack' ? "first snack supplement" : 
                   currentMealType === 'secondSnack' ? "second snack fuel" : "afternoon protein boost";
                   
    // LUNCH/DINNER = REAL FOOD VARIETY
    } else if (['lunch', 'dinner'].includes(currentMealType)) {
      const mealSuggestions = {
        'dirty-bulk': [
          { food: 'Salmon (6oz) + Sweet Potato', protein: 40, calories: 506 },
          { food: 'Lean Beef (5oz) + Rice', protein: 43, calories: 456 },
          { food: 'Turkey Breast (6oz) + Pasta', protein: 58, calories: 401 },
          { food: 'Tuna Steak (6oz) + Brown Rice', protein: 54, calories: 352 },
          { food: 'Pork Tenderloin (5oz) + Potato', protein: 41, calories: 454 }
        ],
        'gain-muscle': [
          { food: 'Chicken Breast (4oz) + Rice', protein: 35, calories: 277 },
          { food: 'Salmon (4oz) + Quinoa', protein: 31, calories: 328 },
          { food: 'Turkey Breast (4oz) + Sweet Potato', protein: 39, calories: 221 },
          { food: 'Tuna (6oz) + Brown Rice', protein: 46, calories: 260 },
          { food: 'Lean Beef (4oz) + Vegetables', protein: 35, calories: 201 }
        ],
        'lose': [
          { food: 'Chicken Breast (4oz) + Vegetables', protein: 35, calories: 190 },
          { food: 'Tuna (5oz) + Large Salad', protein: 38, calories: 170 },
          { food: 'Turkey Breast (4oz) + Asparagus', protein: 39, calories: 175 },
          { food: 'Salmon (3oz) + Broccoli', protein: 25, calories: 183 },
          { food: 'Cod (5oz) + Green Beans', protein: 33, calories: 120 }
        ]
      };
      
      suggestions = mealSuggestions[userProfile.goal] || mealSuggestions['gain-muscle'];
      mealContext = `${currentMealType} protein powerhouse`;
      
    // LATE SNACK = EASY DIGESTION
    } else if (currentMealType === 'lateSnack') {
      const lateOptions = {
        'dirty-bulk': [
          { food: 'Greek Yogurt + Almonds', protein: 23, calories: 256 },
          { food: 'Cottage Cheese + Peanut Butter', protein: 19, calories: 286 },
          { food: 'Casein Protein Shake', protein: 24, calories: 120 },
          { food: 'Fairlife Milk + Quest Bar', protein: 33, calories: 300 }
        ],
        'gain-muscle': [
          { food: 'Greek Yogurt (large)', protein: 20, calories: 130 },
          { food: 'Cottage Cheese (1 cup)', protein: 22, calories: 196 },
          { food: 'Casein Protein', protein: 24, calories: 120 },
          { food: 'Atkins RTD', protein: 15, calories: 160 }
        ],
        'lose': [
          { food: 'Greek Yogurt (non-fat)', protein: 17, calories: 92 },
          { food: 'Cottage Cheese (1/2 cup)', protein: 11, calories: 98 },
          { food: 'Casein Protein (1/2 scoop)', protein: 12, calories: 60 },
          { food: 'Hard-Boiled Eggs (2)', protein: 12, calories: 140 }
        ]
      };
      
      suggestions = lateOptions[userProfile.goal] || lateOptions['gain-muscle'];
      mealContext = "late night easy-digestion option";
    }
    
    if (suggestions && suggestions.length > 0) {
      // Randomly pick one to avoid repetition
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      recommendations.push({
        type: 'protein',
        priority: 'high',
        message: `Perfect ${mealContext}: try ${randomSuggestion.food} (${randomSuggestion.protein}g protein, ${randomSuggestion.calories} calories).`,
        suggestion: randomSuggestion
      });
    }
  } else if (proteinGap > 5) {
    recommendations.push({
      type: 'protein',
      priority: 'low',
      message: `You're close! Just ${Math.round(proteinGap)}g more protein needed.`
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
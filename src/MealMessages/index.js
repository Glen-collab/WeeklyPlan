// Updated MealMessages/index.js - Integration with time-aware system

import { MorningMessages } from './MorningMessages.js';
import { EveningMessages } from './EveningMessages.js';
import { 
  analyzeMealContext, 
  getSmartRecommendations, 
  generateTimeAwareMessage,
  generateContextMessage,
  generateRecommendationMessage
} from './TimeAwareMessaging.js';

// ========================
// TIME-AWARE MEAL MESSAGES
// ========================

export const TimeAwareMealMessages = {
  
  // Universal message generator that works for any meal type
  getTimeAwareMessage: (allMeals, currentMealType, currentMealTotals, currentMealItems, userProfile, calorieData, selectedTime, pieData) => {
    
    console.log(`\n=== TimeAwareMealMessages.getTimeAwareMessage called for ${currentMealType} ===`);
    console.log(`Calories: ${Math.round(currentMealTotals.calories)}, Protein: ${Math.round(currentMealTotals.protein)}g`);
    console.log(`PieData: Protein ${pieData[0]?.percentage || 0}%, Carbs ${pieData[1]?.percentage || 0}%, Fat ${pieData[2]?.percentage || 0}%`);
    console.log(`UserProfile firstName: ${userProfile.firstName}`);
    
    // CORRECTED: Route EVERYTHING through the new carb detection system
    // This is the key fix - instead of routing to old individual systems
    return generateTimeAwareMessage(
      allMeals,           // All meals with their times and data
      currentMealType,    // Current meal type
      currentMealTotals,  // Current meal totals
      currentMealItems,   // Current meal items
      userProfile,        // User profile
      calorieData,        // TDEE data
      selectedTime,       // Current meal time
      pieData             // Current meal pie chart data
    );

    // OLD ROUTING (commented out - this was the problem!)
    /*
    // Use time-aware analysis
    const context = analyzeMealContext(allMeals, currentMealType, currentMealTotals, userProfile, calorieData);
    const recommendations = getSmartRecommendations(context, userProfile, currentMealType);
    
    // Get meal-specific base message from existing system
    let baseMessage = null;
    
    try {
      switch(currentMealType) {
        case 'breakfast':
          baseMessage = MorningMessages.getBreakfastMessage(pieData, selectedTime, currentMealItems, currentMealTotals, userProfile);
          break;
        case 'firstSnack':
          // Use time-aware context instead of hardcoded previous meals
          baseMessage = getTimeAwareSnackMessage('firstSnack', context, pieData, selectedTime, currentMealItems, currentMealTotals, userProfile, calorieData);
          break;
        case 'secondSnack':
          baseMessage = getTimeAwareSnackMessage('secondSnack', context, pieData, selectedTime, currentMealItems, currentMealTotals, userProfile, calorieData);
          break;
        case 'lunch':
          baseMessage = EveningMessages.getLunchMessage(pieData, selectedTime, currentMealItems, currentMealTotals, context.allMealsBefore, userProfile, calorieData);
          break;
        case 'midAfternoon':
          baseMessage = EveningMessages.getMidAfternoonMessage(pieData, selectedTime, currentMealItems, currentMealTotals, context.allMealsBefore, userProfile, calorieData);
          break;
        case 'dinner':
          baseMessage = EveningMessages.getDinnerMessage(pieData, selectedTime, currentMealItems, currentMealTotals, context.allMealsBefore, userProfile, calorieData);
          break;
        case 'lateSnack':
          baseMessage = EveningMessages.getLateSnackMessage(pieData, selectedTime, currentMealItems, currentMealTotals, context.allMealsBefore, userProfile, calorieData);
          break;
        case 'postWorkout':
          baseMessage = getTimeAwarePostWorkoutMessage(context, pieData, selectedTime, currentMealItems, currentMealTotals, userProfile, calorieData);
          break;
        default:
          baseMessage = "Keep up the great nutrition work!";
      }
    } catch (error) {
      console.warn(`Error getting base message for ${currentMealType}:`, error);
      baseMessage = "Looking good! Keep building on this nutrition foundation.";
    }
    
    // Generate time-aware context message
    const contextMessage = generateContextMessage(context, userProfile, currentMealType);
    
    // Generate smart recommendations
    const recommendationMessage = generateRecommendationMessage(recommendations, userProfile);
    
    // Combine messages intelligently
    let finalMessage = "";
    
    if (contextMessage) {
      finalMessage += contextMessage;
    }
    
    if (baseMessage && baseMessage !== contextMessage) {
      if (finalMessage) finalMessage += " ";
      finalMessage += baseMessage;
    }
    
    if (recommendationMessage && recommendationMessage !== "Keep up the great work with your nutrition timing!") {
      if (finalMessage) finalMessage += " ";
      finalMessage += recommendationMessage;
    }
    
    return finalMessage || null;
    */
  }
};

// ========================
// TIME-AWARE SNACK MESSAGES
// ========================

const getTimeAwareSnackMessage = (snackType, context, pieData, selectedTime, items, totals, userProfile, calorieData) => {
  if (totals.calories < 25 || !userProfile.firstName) return null;
  
  const { nutritionSoFar, nutritionBefore, hasPostWorkoutBefore, postWorkoutMeal, dayProgress } = context;
  const proteinPercent = pieData[0]?.percentage || 0;
  
  // Check for ridiculous servings
  const eggItems = ['eggs (whole)', 'egg whites'];
  const ridiculousItem = items.find(item => 
    item.food && 
    item.serving > 8 && 
    !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
  );
  
  if (ridiculousItem) {
    return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food}! Keep your ${snackType} reasonable.`;
  }
  
  let message = "";
  
  // PART 1: Time-aware progress assessment
  const proteinTarget = snackType === 'firstSnack' ? 50 : 75;
  const expectedCaloriesByNow = (calorieData?.targetCalories || 2500) * dayProgress;
  
  if (nutritionSoFar.protein >= proteinTarget && nutritionSoFar.calories >= expectedCaloriesByNow) {
    const excellentMessages = [
      `${userProfile.firstName}, CRUSHING IT! ${Math.round(nutritionSoFar.protein)}g protein and perfectly paced at ${Math.round(nutritionSoFar.calories)} calories!`,
      `PHENOMENAL progress, ${userProfile.firstName}! ${Math.round(nutritionSoFar.protein)}g protein puts you in elite territory!`,
      `${userProfile.firstName}, this is champion-level nutrition! ${Math.round(nutritionSoFar.calories)} calories perfectly timed for ${userProfile.goal} success!`
    ];
    message += excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
  } else if (nutritionSoFar.protein >= proteinTarget) {
    message += `${userProfile.firstName}, solid protein at ${Math.round(nutritionSoFar.protein)}g, but calories are light at ${Math.round(nutritionSoFar.calories)} for your ${userProfile.goal} goals.`;
  } else {
    message += `${userProfile.firstName}, only ${Math.round(nutritionSoFar.protein)}g protein by ${snackType}? We need to accelerate for ${userProfile.goal} success!`;
  }
  
  message += " ";
  
  // PART 2: Post-workout context and recommendations
  if (hasPostWorkoutBefore) {
    const pwProtein = Math.round(postWorkoutMeal.totals.protein);
    message += `Your earlier post-workout fuel contributed ${pwProtein}g protein, which is helping your daily totals! `;
  }
  
  // Smart supplementation based on gaps
  const proteinGap = proteinTarget - nutritionSoFar.protein;
  if (proteinGap > 15) {
    const suggestions = getProteinSuggestions(proteinGap, userProfile.goal);
    if (suggestions.length > 0) {
      const suggestion = suggestions[0];
      message += `Add ${suggestion.food} to reach ${Math.round(nutritionSoFar.protein + suggestion.protein)}g protein (${suggestion.calories} calories).`;
    }
  } else {
    message += "Keep this momentum going into your next meal - you're building excellent nutrition habits!";
  }
  
  return message;
};

// ========================
// TIME-AWARE POST-WORKOUT MESSAGE
// ========================

const getTimeAwarePostWorkoutMessage = (context, pieData, selectedTime, items, totals, userProfile, calorieData) => {
  if (totals.calories < 25 || !userProfile.firstName) return null;
  
  const { nutritionSoFar, mealsBefore, mealsAfter } = context;
  const proteinPercent = pieData[0]?.percentage || 0;
  const carbPercent = pieData[1]?.percentage || 0;
  const workoutHour = parseInt(selectedTime.split(':')[0]);
  
  let message = "";
  
  // PART 1: Post-workout window optimization
  if (proteinPercent >= 40 && carbPercent >= 30) {
    message += `${userProfile.firstName}, POST-WORKOUT PERFECTION! ${proteinPercent}% protein + ${carbPercent}% carbs is exactly what your muscles need for MAXIMUM recovery!`;
  } else if (proteinPercent >= 50) {
    message += `${userProfile.firstName}, PROTEIN POWERHOUSE! ${proteinPercent}% protein will dominate muscle protein synthesis!`;
  } else if (carbPercent >= 50) {
    message += `${userProfile.firstName}, GLYCOGEN REPLENISHMENT! ${carbPercent}% carbs will rapidly refuel your muscles!`;
  } else {
    message += `${userProfile.firstName}, solid post-workout fuel! This will support recovery and help maximize your training results.`;
  }
  
  message += " ";
  
  // PART 2: Daily nutrition context
  const totalProteinIncludingPW = Math.round(nutritionSoFar.protein);
  const totalCaloriesIncludingPW = Math.round(nutritionSoFar.calories);
  
  if (mealsBefore.length > 0) {
    message += `Combined with your earlier meals, you're at ${totalProteinIncludingPW}g protein and ${totalCaloriesIncludingPW} calories for the day. `;
  } else {
    message += `Starting your day with ${totalProteinIncludingPW}g protein and ${totalCaloriesIncludingPW} calories from post-workout fuel. `;
  }
  
  // PART 3: Timing and next meal guidance
  if (workoutHour <= 7) {
    message += `Early morning warrior! This post-workout fuel at ${selectedTime} sets you up for dominant energy all day - your remaining meals can be perfectly balanced!`;
  } else if (workoutHour >= 18) {
    message += `Evening training at ${selectedTime} means this fuel will work overnight to build muscle while you rest - perfect recovery timing!`;
  } else {
    message += `Perfect workout timing at ${selectedTime}! This recovery fuel ensures maximum gains from your training session.`;
  }
  
  return message;
};

// Helper function for protein suggestions (same as in TimeAwareMessaging.js)
const getProteinSuggestions = (proteinNeeded, goal) => {
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

// ========================
// EXPORT COMBINED SYSTEM
// ========================

// Export new time-aware system as primary
export const MealMessages = {
  // New time-aware method - USE THIS ONE
  getTimeAwareMessage: TimeAwareMealMessages.getTimeAwareMessage,
  
  // Legacy methods for backward compatibility
  ...MorningMessages,
  ...EveningMessages
};
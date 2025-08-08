// PersonalTrainerSummary.js - Complete Personal Trainer Analysis System

import { FoodDatabase } from './FoodDatabase.js';

// ========================
// UTILITY FUNCTIONS
// ========================

const getUserProteinTarget = (userProfile) => {
  switch(userProfile.goal) {
    case 'dirty-bulk': return 150;
    case 'gain-muscle': return 130;
    case 'maintain': return 100;
    case 'lose': return 120;
    default: return 120;
  }
};

const getSugarLimitForGoal = (goal) => {
  switch(goal) {
    case 'maintain': return 45;
    case 'lose': return 25;
    case 'gain-muscle': return 25;
    case 'dirty-bulk': return 50;
    default: return 25;
  }
};

const calculateDailyTotalsFromMeals = (allMeals) => {
  return Object.values(allMeals).reduce((totals, meal) => {
    const mealTotals = meal.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 };
    return {
      calories: totals.calories + mealTotals.calories,
      protein: totals.protein + mealTotals.protein,
      carbs: totals.carbs + mealTotals.carbs,
      fat: totals.fat + mealTotals.fat,
      sugar: totals.sugar + mealTotals.sugar
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 });
};

// ========================
// ANALYSIS FUNCTIONS
// ========================

const calculateOverallGrade = (dailyTotals, userProfile, calorieData) => {
  let score = 0;
  
  // Protein score (40 points)
  const proteinTarget = getUserProteinTarget(userProfile);
  const proteinScore = Math.min((dailyTotals.protein / proteinTarget) * 40, 40);
  score += proteinScore;
  
  // Calorie accuracy (30 points)
  const calorieTarget = calorieData?.targetCalories || 2500;
  const calorieAccuracy = 1 - Math.abs(dailyTotals.calories - calorieTarget) / calorieTarget;
  score += Math.max(calorieAccuracy * 30, 0);
  
  // Sugar control (20 points)
  const sugarLimit = getSugarLimitForGoal(userProfile.goal);
  const sugarScore = dailyTotals.sugar <= sugarLimit ? 20 : Math.max(20 - ((dailyTotals.sugar - sugarLimit) * 2), 0);
  score += sugarScore;
  
  // Macro balance (10 points)
  const totalMacros = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat;
  const proteinPercent = totalMacros > 0 ? (dailyTotals.protein / totalMacros) * 100 : 0;
  const macroScore = proteinPercent >= 35 ? 10 : proteinPercent >= 25 ? 7 : proteinPercent >= 20 ? 5 : 0;
  score += macroScore;
  
  // Convert to letter grade
  if (score >= 90) return { grade: 'A', score: Math.round(score) };
  if (score >= 80) return { grade: 'B', score: Math.round(score) };
  if (score >= 70) return { grade: 'C', score: Math.round(score) };
  if (score >= 60) return { grade: 'D', score: Math.round(score) };
  return { grade: 'F', score: Math.round(score) };
};

const identifyStrengths = (allMeals, userProfile, dailyTotals, calorieData) => {
  const strengths = [];
  
  // Check meal frequency
  const mealsWithFood = Object.values(allMeals).filter(meal => 
    meal.totals && meal.totals.calories > 50
  ).length;
  
  if (mealsWithFood >= 6) {
    strengths.push(`🔥 Outstanding meal frequency - ${mealsWithFood} meals keeps your metabolism firing all day!`);
  } else if (mealsWithFood >= 4) {
    strengths.push(`✅ Good meal consistency - ${mealsWithFood} meals shows you understand regular fueling!`);
  }
  
  // Check protein achievement
  const proteinTarget = getUserProteinTarget(userProfile);
  if (dailyTotals.protein >= proteinTarget) {
    strengths.push(`💪 PROTEIN CHAMPION - ${Math.round(dailyTotals.protein)}g crushes your ${proteinTarget}g target!`);
  } else if (dailyTotals.protein >= proteinTarget * 0.8) {
    strengths.push(`💪 Solid protein game - ${Math.round(dailyTotals.protein)}g shows commitment to muscle building!`);
  }
  
  // Check post-workout nutrition
  const postWorkoutMeal = allMeals.postWorkout;
  if (postWorkoutMeal && postWorkoutMeal.totals && postWorkoutMeal.totals.calories > 100) {
    strengths.push(`⚡ Smart post-workout nutrition - you understand recovery timing for gains!`);
  }
  
  // Goal-specific strengths
  if (userProfile.goal === 'dirty-bulk' && dailyTotals.calories >= 3000) {
    strengths.push(`🚀 BULK BEAST MODE - ${Math.round(dailyTotals.calories)} calories shows serious mass-building commitment!`);
  }
  
  if (userProfile.goal === 'lose' && dailyTotals.calories <= (calorieData?.targetCalories || 2000)) {
    strengths.push(`🎯 Calorie discipline - staying on target for fat loss while maintaining protein!`);
  }
  
  // Sugar control
  const sugarLimit = getSugarLimitForGoal(userProfile.goal);
  if (dailyTotals.sugar <= sugarLimit) {
    strengths.push(`🍎 Excellent sugar control - ${Math.round(dailyTotals.sugar)}g keeps you on track!`);
  }
  
  return strengths.length > 0 ? strengths.slice(0, 4) : [`✅ You're building healthy habits - consistency is your foundation!`];
};

const identifyCriticalIssues = (allMeals, userProfile, dailyTotals, calorieData) => {
  const issues = [];
  
  // Protein deficiency - CRITICAL
  const proteinTarget = getUserProteinTarget(userProfile);
  if (dailyTotals.protein < proteinTarget * 0.7) {
    issues.push(`🚨 PROTEIN CRISIS: Only ${Math.round(dailyTotals.protein)}g vs ${proteinTarget}g target - your muscles are starving for amino acids!`);
  }
  
  // Carb loading detection - scan all meals
  const highCarbMeals = Object.entries(allMeals).filter(([mealType, meal]) => {
    if (!meal.totals || meal.totals.calories < 100) return false;
    const totalMacroCalories = (meal.totals.protein * 4) + (meal.totals.carbs * 4) + (meal.totals.fat * 9);
    if (totalMacroCalories === 0) return false;
    
    const carbPercent = (meal.totals.carbs * 4) / totalMacroCalories * 100;
    const proteinPercent = (meal.totals.protein * 4) / totalMacroCalories * 100;
    return carbPercent > 60 && proteinPercent < 25;
  });
  
  if (highCarbMeals.length >= 2) {
    const mealNames = highCarbMeals.map(([name]) => name).join(', ');
    issues.push(`🍞 CARB OVERLOAD ALERT: ${highCarbMeals.length} meals (${mealNames}) are 60%+ carbs with low protein - this won't build the physique you want!`);
  }
  
  // Insufficient meal frequency
  const mealsWithFood = Object.values(allMeals).filter(meal => 
    meal.totals && meal.totals.calories > 50
  ).length;
  
  if (mealsWithFood < 4) {
    issues.push(`⏰ MEAL FREQUENCY WARNING: Only ${mealsWithFood} meals - you need consistent fuel every 3-4 hours for ${userProfile.goal} success!`);
  }
  
  // Sugar overload
  const sugarLimit = getSugarLimitForGoal(userProfile.goal);
  if (dailyTotals.sugar > sugarLimit * 1.5) {
    issues.push(`🍭 SUGAR DANGER ZONE: ${Math.round(dailyTotals.sugar)}g is WAY over your ${sugarLimit}g limit - this is sabotaging your ${userProfile.goal}!`);
  }
  
  // Extreme calorie issues
  const calorieTarget = calorieData?.targetCalories || 2500;
  if (dailyTotals.calories < calorieTarget * 0.6) {
    issues.push(`🔋 ENERGY EMERGENCY: ${Math.round(dailyTotals.calories)} calories is dangerously low - your metabolism will shut down!`);
  }
  
  if (userProfile.goal !== 'dirty-bulk' && dailyTotals.calories > calorieTarget * 1.3) {
    issues.push(`📊 CALORIE OVERFLOW: ${Math.round(dailyTotals.calories)} calories is way over target - this won't support ${userProfile.goal}!`);
  }
  
  return issues.slice(0, 4); // Max 4 critical issues
};

const analyzeProteinTiming = (allMeals) => {
  const meals = Object.entries(allMeals)
    .filter(([mealType, meal]) => meal.totals && meal.totals.calories > 50)
    .map(([mealType, meal]) => ({
      mealType,
      protein: meal.totals.protein,
      time: meal.time
    }));
  
  if (meals.length === 0) {
    return "❌ No meals with significant protein detected - this is a major problem for muscle building!";
  }
  
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const avgProteinPerMeal = totalProtein / meals.length;
  
  // Check for even distribution
  const evenlyDistributed = meals.every(meal => meal.protein >= 15);
  
  if (evenlyDistributed && avgProteinPerMeal >= 20) {
    return `🏆 ELITE protein timing! ${Math.round(avgProteinPerMeal)}g average per meal with consistent distribution - you're maximizing muscle protein synthesis all day!`;
  } else if (avgProteinPerMeal >= 15) {
    return `✅ Good protein consistency at ${Math.round(avgProteinPerMeal)}g per meal - aim for 20g+ in each meal for optimal muscle building!`;
  } else {
    return `⚠️ Protein timing needs work - only ${Math.round(avgProteinPerMeal)}g per meal average. Spread your protein more evenly throughout the day!`;
  }
};

const assessCarbStrategy = (allMeals, userProfile) => {
  const totalCarbs = Object.values(allMeals).reduce((sum, meal) => 
    sum + (meal.totals?.carbs || 0), 0
  );
  
  if (totalCarbs < 50) {
    return `🥖 Very low carb approach at ${Math.round(totalCarbs)}g - this can work for fat loss but may impact energy levels.`;
  }
  
  if (userProfile.goal === 'lose' && totalCarbs > 150) {
    return `🍞 High carb intake at ${Math.round(totalCarbs)}g may slow fat loss - consider reducing for better results.`;
  }
  
  if (userProfile.goal === 'dirty-bulk' && totalCarbs < 200) {
    return `🚀 Could use more carbs for bulk goals - ${Math.round(totalCarbs)}g might limit mass building potential.`;
  }
  
  return `✅ Reasonable carb intake at ${Math.round(totalCarbs)}g aligns with your ${userProfile.goal} goals.`;
};

const assessMealTiming = (allMeals) => {
  // Convert meal times to minutes for analysis
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    return hour24 * 60 + minutes;
  };
  
  const mealsWithTiming = Object.entries(allMeals)
    .filter(([mealType, meal]) => meal.totals && meal.totals.calories > 50)
    .map(([mealType, meal]) => ({
      mealType,
      timeMinutes: timeToMinutes(meal.time),
      calories: meal.totals.calories
    }))
    .sort((a, b) => a.timeMinutes - b.timeMinutes);
  
  if (mealsWithTiming.length < 3) {
    return `⏰ Only ${mealsWithTiming.length} substantial meals detected - you need more frequent fueling for optimal results!`;
  }
  
  // Check for long gaps
  const gaps = [];
  for (let i = 1; i < mealsWithTiming.length; i++) {
    const gapHours = (mealsWithTiming[i].timeMinutes - mealsWithTiming[i-1].timeMinutes) / 60;
    if (gapHours > 5) {
      gaps.push(gapHours);
    }
  }
  
  if (gaps.length > 0) {
    return `⚠️ Found ${gaps.length} gaps of 5+ hours between meals - these long periods can cause muscle breakdown and energy crashes!`;
  }
  
  return `✅ Good meal timing pattern with ${mealsWithTiming.length} well-spaced meals - you're keeping your metabolism active!`;
};

const assessGoalAlignment = (dailyTotals, userProfile, calorieData) => {
  const { goal } = userProfile;
  const totalCals = Math.round(dailyTotals.calories);
  const totalProtein = Math.round(dailyTotals.protein);
  const target = calorieData?.targetCalories || 2500;
  
  switch(goal) {
    case 'dirty-bulk':
      if (totalCals >= 3200 && totalProtein >= 140) {
        return `🚀 PERFECT bulk alignment! ${totalCals} calories and ${totalProtein}g protein = serious mass building mode!`;
      } else if (totalCals >= 2800) {
        return `✅ Good bulk calories at ${totalCals}, but ${totalProtein}g protein could be higher for maximum muscle building!`;
      } else {
        return `❌ ${totalCals} calories won't support dirty bulk goals - you need 3000+ calories with high protein for real mass gains!`;
      }
      
    case 'gain-muscle':
      if (totalProtein >= 120 && totalCals >= target * 0.9 && totalCals <= target * 1.1) {
        return `🎯 EXCELLENT lean muscle alignment! ${totalProtein}g protein with controlled ${totalCals} calories = quality gains!`;
      } else if (totalProtein >= 100) {
        return `✅ Decent protein at ${totalProtein}g, but calorie precision needs work for lean muscle building!`;
      } else {
        return `❌ Only ${totalProtein}g protein won't build lean muscle effectively - you need 120g+ with precise calorie control!`;
      }
      
    case 'lose':
      if (totalProtein >= 110 && totalCals <= target) {
        return `🔥 PERFECT fat loss setup! High protein (${totalProtein}g) with controlled calories (${totalCals}) = muscle-preserving fat loss!`;
      } else if (totalCals <= target) {
        return `✅ Good calorie control at ${totalCals}, but ${totalProtein}g protein should be higher to preserve muscle during fat loss!`;
      } else {
        return `❌ ${totalCals} calories is too high for fat loss goals - you need a deficit with high protein to lose fat, not muscle!`;
      }
      
    default:
      return `✅ Maintaining balance with ${totalCals} calories and ${totalProtein}g protein - consistency is key for maintenance!`;
  }
};

const getWeeklyConsistencyAdvice = (gradeInfo, userProfile) => {
  const { grade } = gradeInfo;
  const { firstName, goal } = userProfile;
  
  if (grade === 'A') {
    return `🏆 ${firstName}, this A-level performance repeated 5-6 days per week = GUARANTEED ${goal} success! You've cracked the code - now just stay consistent!`;
  } else if (grade === 'B') {
    return `📈 ${firstName}, solid B-level day! String together 5+ days like this per week and you'll see real ${goal} progress. You're building champion habits!`;
  } else if (grade === 'C') {
    return `📚 ${firstName}, C-level means you understand the basics but need more precision. Focus on 4-5 strong days this week to build momentum for ${goal}!`;
  } else {
    return `🔥 ${firstName}, every week is a fresh start! Use today's lessons to build 3-4 solid days this week. Consistency beats perfection for ${goal} success!`;
  }
};

const generateTopRecommendations = (allMeals, userProfile, dailyTotals) => {
  const recommendations = [];
  const proteinTarget = getUserProteinTarget(userProfile);
  
  // Protein recommendation (always important)
  if (dailyTotals.protein < proteinTarget * 0.8) {
    recommendations.push(`🥩 PROTEIN PRIORITY: Add 20g+ protein to 3 main meals. Try chicken breast, whey protein, or Greek yogurt to hit ${proteinTarget}g daily.`);
  } else if (dailyTotals.protein < proteinTarget) {
    recommendations.push(`🥩 PROTEIN BOOST: You're close! Add one protein-rich snack (whey shake, Greek yogurt, or jerky) to hit ${proteinTarget}g.`);
  }
  
  // Meal timing recommendation
  const mealsWithFood = Object.values(allMeals).filter(meal => 
    meal.totals && meal.totals.calories > 50
  ).length;
  
  if (mealsWithFood < 5) {
    recommendations.push(`⏰ MEAL FREQUENCY FIX: Add 1-2 protein-rich snacks between meals. Aim for fuel every 3-4 hours to keep metabolism firing.`);
  }
  
  // Goal-specific recommendation
  if (userProfile.goal === 'dirty-bulk' && dailyTotals.calories < 3000) {
    recommendations.push(`🚀 BULK BOOST: Add 400-600 calories through healthy fats (nuts, oils) and complex carbs (rice, oats) to reach mass-building zone.`);
  } else if (userProfile.goal === 'lose' && dailyTotals.sugar > 40) {
    recommendations.push(`🍭 SUGAR CUT: Replace high-sugar foods with protein + vegetables. Target under 25g daily sugar for faster fat loss.`);
  } else if (userProfile.goal === 'gain-muscle') {
    recommendations.push(`💪 LEAN PRECISION: Focus on lean proteins every 4 hours with controlled portions. Quality over quantity for muscle building.`);
  }
  
  // Add a general recommendation if we need more
  if (recommendations.length < 3) {
    recommendations.push(`💧 CONSISTENCY KEY: Plan tomorrow's meals tonight. Preparation prevents poor nutrition choices and builds lasting habits.`);
  }
  
  return recommendations.slice(0, 3);
};

// ========================
// MAIN EXPORT FUNCTION
// ========================

export const generatePersonalTrainerSummary = (allMeals, userProfile, calorieData) => {
  console.log('generatePersonalTrainerSummary called with:', { 
    allMeals: Object.keys(allMeals), 
    userProfile: userProfile.firstName,
    calorieData: calorieData?.targetCalories 
  });

  if (!userProfile.firstName) {
    return {
      title: "Complete Your Profile First",
      content: "Please fill out your profile information to get your personalized trainer analysis!"
    };
  }
  
  try {
    const dailyTotals = calculateDailyTotalsFromMeals(allMeals);
    console.log('Daily totals calculated:', dailyTotals);
    
    const gradeInfo = calculateOverallGrade(dailyTotals, userProfile, calorieData);
    console.log('Grade calculated:', gradeInfo);
    
    const strengths = identifyStrengths(allMeals, userProfile, dailyTotals, calorieData);
    const issues = identifyCriticalIssues(allMeals, userProfile, dailyTotals, calorieData);
    const proteinAnalysis = analyzeProteinTiming(allMeals);
    const carbAnalysis = assessCarbStrategy(allMeals, userProfile);
    const timingAnalysis = assessMealTiming(allMeals);
    const goalAlignment = assessGoalAlignment(dailyTotals, userProfile, calorieData);
    const weeklyAdvice = getWeeklyConsistencyAdvice(gradeInfo, userProfile);
    const recommendations = generateTopRecommendations(allMeals, userProfile, dailyTotals);
    
    // Personal bottom line
    let bottomLine = "";
    if (gradeInfo.grade === 'A') {
      bottomLine = `${userProfile.firstName}, you're operating at ELITE level! This precision repeated weekly = guaranteed results!`;
    } else if (gradeInfo.grade === 'B') {
      bottomLine = `${userProfile.firstName}, you're on the right track! Focus on the recommendations above and you'll reach A-level consistency!`;
    } else {
      bottomLine = `${userProfile.firstName}, there's huge potential here! Pick 1-2 key improvements and master them this week. You've got this!`;
    }
    
    const result = {
      title: `${userProfile.firstName}'s Personal Trainer Analysis`,
      grade: gradeInfo.grade,
      score: gradeInfo.score,
      strengths,
      issues,
      proteinAnalysis,
      carbAnalysis,  
      timingAnalysis,
      goalAlignment,
      weeklyAdvice,
      recommendations,
      bottomLine,
      dailyTotals: {
        calories: Math.round(dailyTotals.calories),
        protein: Math.round(dailyTotals.protein),
        carbs: Math.round(dailyTotals.carbs), 
        fat: Math.round(dailyTotals.fat),
        sugar: Math.round(dailyTotals.sugar)
      }
    };
    
    console.log('Final result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in generatePersonalTrainerSummary:', error);
    return {
      title: "Analysis Error",
      content: "There was an error analyzing your nutrition data. Please try again.",
      error: error.message
    };
  }
};
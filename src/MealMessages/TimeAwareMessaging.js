// TimeAwareMessaging.js - Complete Smart chronological meal analysis with improved messaging

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
// IMPROVED CONTEXT MESSAGE GENERATION
// ========================

export const generateContextMessage = (context, userProfile, currentMealType) => {
  const { nutritionSoFar, hasPostWorkoutBefore, postWorkoutMeal, dayProgress } = context;
  
  if (!userProfile.firstName) return null;
  
  // Only show messages if there's actual food (calories > 0)
  if (nutritionSoFar.calories <= 0) return null;
  
  let contextParts = [];
  
  // VARIED POST-WORKOUT ACKNOWLEDGMENT - Goal-specific and meal-specific
  if (hasPostWorkoutBefore) {
    const pwProtein = Math.round(postWorkoutMeal.totals.protein);
    const pwCalories = Math.round(postWorkoutMeal.totals.calories);
    
    // Different message based on current meal type and goal
    const postWorkoutMessages = {
      firstSnack: {
        'dirty-bulk': `That earlier post-workout fuel (${pwProtein}g protein) is already fueling your MASS BUILDING - keep this bulk momentum going!`,
        'gain-muscle': `Your post-workout ${pwProtein}g protein is working on muscle protein synthesis right now - smart timing!`,
        'lose': `Post-workout ${pwProtein}g protein without excess calories? Perfect for lean muscle preservation while cutting!`,
        'maintain': `Earlier post-workout nutrition (${pwProtein}g protein) shows you understand recovery - staying consistent!`
      },
      secondSnack: {
        'dirty-bulk': `Your post-workout ${pwProtein}g protein is building SIZE while you keep feeding the machine - this is BULK perfection!`,
        'gain-muscle': `That post-workout fuel is still working its magic - ${pwProtein}g protein supporting your lean gains perfectly!`,
        'lose': `Post-workout protein already in the bank means this snack can be strategic - nice fat loss approach!`,
        'maintain': `With post-workout nutrition handled (${pwProtein}g protein), you're maintaining that perfect balance!`
      },
      lunch: {
        'dirty-bulk': `Your earlier post-workout session (${pwProtein}g protein, ${pwCalories} cals) + this lunch = SERIOUS mass building formula!`,
        'gain-muscle': `Post-workout recovery nutrition already optimal - now lunch can focus on sustained muscle building!`,
        'lose': `Post-workout fueling was on point (${pwProtein}g protein) - lunch can stay controlled for fat loss goals!`,
        'maintain': `Earlier post-workout nutrition dialed in - you're managing recovery and maintenance perfectly!`
      },
      midAfternoon: {
        'dirty-bulk': `That morning post-workout fuel (${pwProtein}g protein) is STILL building mass - afternoon nutrition keeps the gains coming!`,
        'gain-muscle': `Post-workout protein synthesis from earlier is ongoing - this afternoon fuel supports continuous growth!`,
        'lose': `Morning post-workout nutrition handled the muscle preservation - afternoon can stay lean and focused!`,
        'maintain': `Post-workout recovery from earlier keeps you stable - perfect maintenance approach!`
      },
      dinner: {
        'dirty-bulk': `Your post-workout investment (${pwProtein}g protein) earlier is paying BULK dividends - dinner seals the mass-building day!`,
        'gain-muscle': `All-day protein synthesis started with that post-workout fuel - dinner completes the lean growth equation!`,
        'lose': `Post-workout muscle preservation locked in earlier - dinner can focus on satiety without excess!`,
        'maintain': `Post-workout foundation from earlier keeps everything balanced - consistent maintenance wins!`
      },
      lateSnack: {
        'dirty-bulk': `That post-workout nutrition earlier started the BULK process - late fuel keeps the mass machine running overnight!`,
        'gain-muscle': `Post-workout protein working all day - this evening nutrition supports overnight recovery perfectly!`,
        'lose': `Morning post-workout handled muscle needs - late snack stays strategic for fat loss goals!`,
        'maintain': `Post-workout timing earlier was smart - evening nutrition maintains that perfect balance!`
      }
    };
    
    const goalMessages = postWorkoutMessages[currentMealType] || postWorkoutMessages.lunch;
    const message = goalMessages[userProfile.goal] || goalMessages['maintain'];
    contextParts.push(message);
  }
  
  // DAILY PROGRESS CONTEXT - Avoid duplicate names
  if (!hasPostWorkoutBefore) {
    const totalProtein = Math.round(nutritionSoFar.protein);
    const totalCalories = Math.round(nutritionSoFar.calories);
    const progressPercentage = Math.round(dayProgress * 100);
    
    if (progressPercentage > 75) {
      contextParts.push(`You're ${progressPercentage}% through your day with ${totalProtein}g protein and ${totalCalories} calories - strong finish ahead!`);
    } else if (progressPercentage > 50) {
      contextParts.push(`Midday check: ${totalProtein}g protein and ${totalCalories} calories so far - solid progress building!`);
    } else if (progressPercentage > 25) {
      contextParts.push(`Morning fuel: ${totalProtein}g protein and ${totalCalories} calories - you're building momentum!`);
    } else {
      contextParts.push(`Early nutrition: ${totalProtein}g protein and ${totalCalories} calories - perfect foundation setting!`);
    }
  }
  
  return contextParts.join(" ");
};

// ========================
// PROTEIN-FOCUSED MEAL ANALYSIS
// ========================

export const getProteinFocusedMessage = (currentMealTotals, nutritionSoFar, currentMealType, userProfile) => {
  const currentProtein = Math.round(currentMealTotals.protein);
  const currentCalories = Math.round(currentMealTotals.calories);
  const totalDailyProtein = Math.round(nutritionSoFar.protein);
  
  // Calculate protein percentage for this meal
  const mealProteinPercent = currentCalories > 0 ? Math.round((currentProtein * 4 / currentCalories) * 100) : 0;
  
  // Main meal protein requirements (breakfast, lunch, dinner)
  const isMainMeal = ['breakfast', 'lunch', 'dinner'].includes(currentMealType);
  const mainMealProteinTarget = 20; // At least 20g for main meals
  
  // Snack context - check if daily protein is on track
  const isSnackMeal = ['firstSnack', 'secondSnack', 'midAfternoon', 'lateSnack'].includes(currentMealType);
  const dailyProteinTarget = getUserProteinTarget(userProfile);
  const dailyProteinProgress = totalDailyProtein / dailyProteinTarget;
  
  let message = "";
  
  // MAIN MEAL PROTEIN ANALYSIS - Be sarcastic about low protein
  if (isMainMeal && currentCalories > 100) {
    if (currentProtein < mainMealProteinTarget && mealProteinPercent < 25) {
      // Low protein + high carbs/fat = sarcasm time
      const sarcasticMessages = [
        `${userProfile.firstName}, really? ${currentProtein}g protein in a ${currentCalories}-calorie ${currentMealType}? Those carbs and fats won't build muscle by themselves!`,
        `Interesting ${currentMealType} strategy, ${userProfile.firstName} - ${currentProtein}g protein but ${currentCalories} calories total. Your muscles are confused!`,
        `${userProfile.firstName}, that's ${currentProtein}g protein in ${currentCalories} calories for ${currentMealType}. Are we building muscle or just storing energy?`,
        `Hold up, ${userProfile.firstName}! ${currentProtein}g protein in a ${currentCalories}-calorie ${currentMealType}? Your ${userProfile.goal} goals need MORE protein focus!`,
        `${userProfile.firstName}, ${currentProtein}g protein for ${currentMealType}? Those ${currentCalories} calories better start working harder for muscle building!`
      ];
      message = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];
      
    } else if (currentProtein >= mainMealProteinTarget && mealProteinPercent >= 35) {
      // Good protein in main meal
      const excellentMainMealMessages = [
        `EXCELLENT ${currentMealType}, ${userProfile.firstName}! ${currentProtein}g protein at ${mealProteinPercent}% - this is how you build muscle!`,
        `${currentMealType} PERFECTION! ${currentProtein}g protein dominates this ${currentCalories}-calorie meal - your ${userProfile.goal} goals are ON TRACK!`,
        `${userProfile.firstName}, PROTEIN POWERHOUSE ${currentMealType}! ${currentProtein}g at ${mealProteinPercent}% - this is elite nutrition!`,
        `CRUSHING IT! ${currentProtein}g protein in ${currentMealType} shows you understand ${userProfile.goal} nutrition - keep this standard!`,
        `${currentMealType} MASTERY, ${userProfile.firstName}! ${currentProtein}g protein at ${mealProteinPercent}% - this builds real results!`
      ];
      message = excellentMainMealMessages[Math.floor(Math.random() * excellentMainMealMessages.length)];
      
    } else if (currentProtein >= mainMealProteinTarget) {
      // Decent protein, could be better percentage
      const decentMainMealMessages = [
        `Solid ${currentMealType} protein at ${currentProtein}g, but ${mealProteinPercent}% could be higher for optimal ${userProfile.goal} results!`,
        `Good ${currentProtein}g protein foundation - just dial up that percentage for MAXIMUM ${userProfile.goal} impact!`,
        `${currentProtein}g protein hits the mark, but imagine the gains at 40%+ protein in your ${currentMealType}!`,
        `Decent protein game at ${currentProtein}g - push that percentage higher next time for superior results!`
      ];
      message = decentMainMealMessages[Math.floor(Math.random() * decentMainMealMessages.length)];
    }
  }
  
  // SNACK MEAL ANALYSIS - Context-aware based on daily progress
  else if (isSnackMeal && currentCalories > 25) {
    if (dailyProteinProgress >= 0.7) {
      // Daily protein is good, snack can be lower protein
      if (currentProtein < 10) {
        const lowProteinOkayMessages = [
          `${currentProtein}g protein for this snack is fine - you're crushing daily protein at ${totalDailyProtein}g total!`,
          `Low snack protein? No problem! Your daily total of ${totalDailyProtein}g has you covered for ${userProfile.goal}!`,
          `${currentProtein}g protein here works since you're dominating daily targets at ${totalDailyProtein}g - smart balance!`,
          `This snack can stay light on protein - ${totalDailyProtein}g daily total shows you understand the big picture!`
        ];
        message = lowProteinOkayMessages[Math.floor(Math.random() * lowProteinOkayMessages.length)];
      } else {
        // Good snack protein + good daily protein
        const excellentSnackMessages = [
          `BONUS protein at ${currentProtein}g! Already dominating with ${totalDailyProtein}g daily - this is next-level consistency!`,
          `${currentProtein}g snack protein on top of ${totalDailyProtein}g daily total? This is how you MAXIMIZE ${userProfile.goal} results!`,
          `Extra protein boost at ${currentProtein}g! Daily total of ${totalDailyProtein}g puts you in elite territory!`,
          `${currentProtein}g protein snack when daily is already strong? This separates champions from average people!`
        ];
        message = excellentSnackMessages[Math.floor(Math.random() * excellentSnackMessages.length)];
      }
    } else {
      // Daily protein is behind, even snacks need to contribute
      if (currentProtein < 10) {
        const snackProteinNeededMessages = [
          `${userProfile.firstName}, even snacks need protein focus! Only ${totalDailyProtein}g daily so far - every meal counts for ${userProfile.goal}!`,
          `Snack opportunity missed! ${currentProtein}g protein when daily total is only ${totalDailyProtein}g? Step up the protein game!`,
          `${totalDailyProtein}g daily protein is behind target - this snack could help bridge that gap with better choices!`,
          `Daily protein at ${totalDailyProtein}g needs help - even snacks should contribute to ${userProfile.goal} success!`
        ];
        message = snackProteinNeededMessages[Math.floor(Math.random() * snackProteinNeededMessages.length)];
      } else {
        // Good snack protein when daily needs help
        const helpfulSnackMessages = [
          `SMART snack protein at ${currentProtein}g! Daily total climbing to ${totalDailyProtein}g - this helps your ${userProfile.goal} goals!`,
          `${currentProtein}g protein snack when daily needs help? This is strategic nutrition for ${userProfile.goal}!`,
          `Perfect snack protein boost! ${totalDailyProtein}g daily total is improving thanks to choices like this!`,
          `${currentProtein}g protein helps rescue the daily total - this is how you course-correct for ${userProfile.goal}!`
        ];
        message = helpfulSnackMessages[Math.floor(Math.random() * helpfulSnackMessages.length)];
      }
    }
  }
  
  return message;
};

// ========================
// UPDATED RECOMMENDATION MESSAGE GENERATOR  
// ========================

export const generateRecommendationMessage = (recommendations, userProfile, currentMealTotals, currentMealType) => {
  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
  
  // Get protein-focused message first
  const proteinMessage = getProteinFocusedMessage(
    currentMealTotals, 
    { protein: currentMealTotals.protein }, // Pass current meal as context for now
    currentMealType, 
    userProfile
  );
  
  if (proteinMessage) {
    return proteinMessage;
  }
  
  if (highPriorityRecs.length > 0) {
    const rec = highPriorityRecs[0];
    return rec.message;
  }
  
  if (mediumPriorityRecs.length > 0) {
    const rec = mediumPriorityRecs[0];
    return rec.message;
  }
  
  // Varied positive reinforcement messages
  const positiveMessages = [
    "Solid nutrition choices building toward your goals!",
    "This meal timing and composition supports your progress!",
    "You're developing excellent nutrition habits!",
    "Smart food choices that align with your objectives!",
    "This kind of consistency separates successful people!",
    "Building the foundation for long-term results!"
  ];
  
  return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
};

// ========================
// SPECIFIC SUPPLEMENT RECOMMENDATION
// ========================

const getSpecificSupplementRecommendation = (proteinNeeded, goal, mealType) => {
  // SNACKS = SUPPLEMENTS
  if (['firstSnack', 'secondSnack', 'midAfternoon'].includes(mealType)) {
    const snackOptions = {
      'dirty-bulk': [
        "Add Fairlife Core Power 42g + Banana (43g protein, 319 calories) to fuel that bulk!",
        "Try Met-RX Big 100 Bar (30g protein, 410 calories) for serious mass building!",
        "Grab Whey Protein + Bagel (33g protein, 365 calories) - perfect bulk fuel!",
        "Pure Protein RTD + Rice Cakes (35g protein, 250 calories) keeps the gains coming!"
      ],
      'gain-muscle': [
        "Perfect time for Whey Protein Shake (24g protein, 120 calories) - lean and effective!",
        "Try Quest Protein Bar (20g protein, 190 calories) for portable muscle fuel!",
        "Pure Protein RTD (35g protein, 160 calories) delivers without excess calories!",
        "Greek Yogurt + Whey Protein (41g protein, 212 calories) = muscle building perfection!"
      ],
      'lose': [
        "Whey Protein Isolate (25g protein, 110 calories) maximizes protein while cutting!",
        "Turkey Jerky 1.5oz (16g protein, 105 calories) - pure protein, minimal calories!",
        "Pure Protein Bar (20g protein, 180 calories) satisfies without derailing fat loss!",
        "Greek Yogurt large (20g protein, 130 calories) keeps you full and lean!"
      ]
    };
    
    const options = snackOptions[goal] || snackOptions['gain-muscle'];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // LATE SNACK = EASY DIGESTION
  if (mealType === 'lateSnack') {
    const lateOptions = {
      'dirty-bulk': [
        "Greek Yogurt + Almonds (23g protein, 256 calories) digests easily for overnight gains!",
        "Casein Protein Shake (24g protein, 120 calories) feeds muscles all night!",
        "Cottage Cheese + Peanut Butter (19g protein, 286 calories) - slow-digesting perfection!"
      ],
      'gain-muscle': [
        "Greek Yogurt large (20g protein, 130 calories) - perfect pre-sleep protein!",
        "Casein Protein (24g protein, 120 calories) works while you sleep!",
        "Cottage Cheese 1 cup (22g protein, 196 calories) for overnight recovery!"
      ],
      'lose': [
        "Greek Yogurt non-fat (17g protein, 92 calories) - lean nighttime nutrition!",
        "Casein Protein half-scoop (12g protein, 60 calories) without excess calories!",
        "Cottage Cheese half-cup (11g protein, 98 calories) satisfies late hunger!"
      ]
    };
    
    const options = lateOptions[goal] || lateOptions['gain-muscle'];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  return null;
};

// ========================
// MAIN TIME-AWARE MESSAGE GENERATOR
// ========================

export const generateTimeAwareMessage = (allMeals, currentMealType, currentMealTotals, currentMealItems, userProfile, calorieData, selectedTime, pieData) => {
  
  // Use time-aware analysis
  const context = analyzeMealContext(allMeals, currentMealType, currentMealTotals, userProfile, calorieData);
  const recommendations = getSmartRecommendations(context, userProfile, currentMealType);
  
  // Only generate messages if there's actual food (calories > 0)
  if (currentMealTotals.calories <= 0) {
    return null;
  }
  
  let finalMessage = "";
  
  // PART 1: Time-aware context message (post-workout acknowledgment or daily progress)
  const contextMessage = generateContextMessage(context, userProfile, currentMealType);
  if (contextMessage) {
    finalMessage += contextMessage;
  }
  
  // PART 2: Protein-focused meal analysis (sarcasm for low protein, praise for good protein)
  const proteinMessage = getProteinFocusedMessage(
    currentMealTotals, 
    context.nutritionSoFar, 
    currentMealType, 
    userProfile
  );
  
  if (proteinMessage) {
    if (finalMessage) finalMessage += " ";
    finalMessage += proteinMessage;
  }
  
  // PART 3: Smart recommendations (only if protein analysis didn't provide direction)
  if (!proteinMessage) {
    const recommendationMessage = generateRecommendationMessage(
      recommendations, 
      userProfile, 
      currentMealTotals, 
      currentMealType
    );
    
    if (recommendationMessage && recommendationMessage !== "Keep up the great work with your nutrition timing!") {
      if (finalMessage) finalMessage += " ";
      finalMessage += recommendationMessage;
    }
  }
  
  // PART 4: Add specific supplement recommendations for protein gaps
  const proteinGap = getUserProteinTarget(userProfile) - context.nutritionSoFar.protein;
  if (proteinGap > 15 && !proteinMessage.includes("try ")) {
    const supplementRec = getSpecificSupplementRecommendation(proteinGap, userProfile.goal, currentMealType);
    if (supplementRec) {
      if (finalMessage) finalMessage += " ";
      finalMessage += supplementRec;
    }
  }
  
  return finalMessage || null;
};
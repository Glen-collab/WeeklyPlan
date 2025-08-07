// EveningMessages.js - Enhanced evening meal messages with 3-part system

export const EveningMessages = {

  // ========================
  // LUNCH MESSAGES - ENHANCED 3-PART SYSTEM
  // ========================
  getLunchMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 50) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Solid lunch selection! Your ${foodText} provides balanced nutrition to power you through the rest of your day.`;
      }
      return null;
    }

    const lunchHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;
    const fatPercent = pieData[2]?.percentage || 0;

    // Ridiculous serving check
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    if (ridiculousItem) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} at lunch! This is supposed to fuel your afternoon, not put you in a food coma!`;
    }

    // Calculate daily progress so far - WITH SAFE DEFAULTS
    const totalCaloriesSoFar = (previousMeals.breakfast?.totals?.calories || 0) + 
                              (previousMeals.firstSnack?.totals?.calories || 0) + 
                              (previousMeals.secondSnack?.totals?.calories || 0) + 
                              (previousMeals.postWorkout?.totals?.calories || 0) +
                              totals.calories;
                              
    const totalProteinSoFar = (previousMeals.breakfast?.totals?.protein || 0) + 
                             (previousMeals.firstSnack?.totals?.protein || 0) + 
                             (previousMeals.secondSnack?.totals?.protein || 0) + 
                             (previousMeals.postWorkout?.totals?.protein || 0) +
                             totals.protein;

    const targetDailyCalories = calorieData?.targetCalories || 2500;
    const targetCaloriesByNow = Math.round(targetDailyCalories * 0.65); // 65% by lunch
    const proteinTarget = ['gain-muscle', 'dirty-bulk'].includes(userProfile.goal) ? 100 : 75; // Higher by lunch

    let message = "";

    // ============ PART 1: DAILY PROGRESS ASSESSMENT ============
    
    if (userProfile.goal === 'dirty-bulk') {
      if (totalCaloriesSoFar >= targetCaloriesByNow) {
        const bulkLunchMessages = [
          `${userProfile.firstName}, BULK BEAST! ${Math.round(totalCaloriesSoFar)} calories down and ${Math.round(totalProteinSoFar)}g protein - you're CRUSHING the mass building game!`,
          `MASS MONSTER ALERT, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories by lunch - this is how you get HUGE!`,
          `${userProfile.firstName}, you're eating like a TRUE BULKING CHAMPION! ${Math.round(totalCaloriesSoFar)} calories - size is inevitable!`,
          `DIRTY BULK DOMINATION, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories and still going - you're building serious mass!`,
          `${userProfile.firstName}, CALORIE CRUSHING MACHINE! ${Math.round(totalCaloriesSoFar)} down - you're going to be MASSIVE!`
        ];
        message += bulkLunchMessages[Math.floor(Math.random() * bulkLunchMessages.length)];
      } else {
        const bulkCatchUpMessages = [
          `${userProfile.firstName}, only ${Math.round(totalCaloriesSoFar)} calories for dirty bulk? LUNCH IS YOUR CHANCE TO GO BIG!`,
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories isn't bulk territory - make this lunch COUNT!`,
          `Wake-up call, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories by lunch won't build the mass you want!`,
          `${userProfile.firstName}, BULK EMERGENCY! ${Math.round(totalCaloriesSoFar)} calories - you're eating like you're cutting!`
        ];
        message += bulkCatchUpMessages[Math.floor(Math.random() * bulkCatchUpMessages.length)];
      }
    } else {
      // Other goals assessment
      if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
        const excellentProgressMessages = [
          `${userProfile.firstName}, EXCEPTIONAL lunch game! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - you're DOMINATING your ${userProfile.goal} goals!`,
          `MASTERCLASS nutrition, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by lunch puts you in ELITE territory for ${userProfile.goal}!`,
          `${userProfile.firstName}, this is CHAMPION-LEVEL eating! ${Math.round(totalCaloriesSoFar)} calories perfectly paced for your ${userProfile.goal} success!`,
          `PHENOMENAL progress, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein and ${Math.round(totalCaloriesSoFar)} calories - you're CRUSHING this!`,
          `${userProfile.firstName}, ELITE PERFORMANCE! ${Math.round(totalCaloriesSoFar)} calories and protein on FIRE - this is how you achieve ${userProfile.goal}!`
        ];
        message += excellentProgressMessages[Math.floor(Math.random() * excellentProgressMessages.length)];
      } else if (totalProteinSoFar >= proteinTarget) {
        const goodProteinMessages = [
          `${userProfile.firstName}, SOLID protein game at ${Math.round(totalProteinSoFar)}g, but ${Math.round(totalCaloriesSoFar)} calories needs work for ${userProfile.goal}!`,
          `Nice protein discipline, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g shows you understand muscle building - just need more fuel!`,
          `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein is PRO-LEVEL, but ${Math.round(totalCaloriesSoFar)} calories won't support your goals!`,
          `Great protein consistency, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is perfect - just add more energy for ${userProfile.goal} success!`
        ];
        message += goodProteinMessages[Math.floor(Math.random() * goodProteinMessages.length)];
      } else {
        const catchUpMessages = [
          `${userProfile.firstName}, WAKE UP CALL! Only ${Math.round(totalProteinSoFar)}g protein by lunch for ${userProfile.goal}? Time to ACCELERATE!`,
          `RED ALERT, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by lunch won't cut it - your muscles are STARVING!`,
          `${userProfile.firstName}, URGENT ACTION NEEDED! ${Math.round(totalProteinSoFar)}g protein by now puts you WAY behind your ${userProfile.goal} goals!`,
          `PROTEIN EMERGENCY, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g by lunch - you're missing the muscle-building window!`
        ];
        message += catchUpMessages[Math.floor(Math.random() * catchUpMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: SMART AFTERNOON FUEL RECOMMENDATIONS ============
    
    if (totalProteinSoFar < proteinTarget) {
      const proteinNeeded = proteinTarget - totalProteinSoFar;
      const currentProteinGrams = totalProteinSoFar;
      const currentCalories = totalCaloriesSoFar;
      
      // Enhanced goal-specific afternoon recommendations
      let recommendedSupplements = [];
      
      if (userProfile.goal === 'dirty-bulk') {
        recommendedSupplements = [
          { name: 'Chicken Breast (6oz) + Sweet Potato + Olive Oil', protein: 52, calories: 520, type: 'bulk' },
          { name: 'Lean Beef (6oz) + Brown Rice + Avocado', protein: 45, calories: 650, type: 'bulk' },
          { name: 'Salmon (6oz) + Quinoa + Almonds', protein: 42, calories: 580, type: 'bulk' },
          { name: 'Turkey Breast (6oz) + Pasta + Peanut Butter', protein: 48, calories: 720, type: 'bulk' }
        ];
      } else if (userProfile.goal === 'gain-muscle') {
        recommendedSupplements = [
          { name: 'Chicken Breast (5oz) + Brown Rice', protein: 43, calories: 290, type: 'lean' },
          { name: 'Tuna (6oz) + Sweet Potato', protein: 46, calories: 260, type: 'lean' },
          { name: 'Turkey Breast (5oz) + Quinoa', protein: 41, calories: 315, type: 'lean' },
          { name: 'Lean Beef (4oz) + Rice Cakes (4)', protein: 35, calories: 316, type: 'lean' }
        ];
      } else { // maintain/lose
        recommendedSupplements = [
          { name: 'Chicken Breast (4oz) + Vegetables', protein: 35, calories: 190, type: 'lean' },
          { name: 'Tuna (5oz) + Salad', protein: 38, calories: 170, type: 'lean' },
          { name: 'Turkey Breast (4oz) + Asparagus', protein: 33, calories: 180, type: 'lean' },
          { name: 'Cod (5oz) + Broccoli', protein: 33, calories: 155, type: 'lean' }
        ];
      }
      
      // Find best match
      let bestSupplement = null;
      let bestMatch = Infinity;
      
      for (const supplement of recommendedSupplements) {
        const newTotalProtein = currentProteinGrams + supplement.protein;
        const newTotalCalories = currentCalories + supplement.calories;
        const newProteinPercent = (newTotalProtein * 4 / newTotalCalories) * 100;
        
        const proteinGapScore = Math.abs(supplement.protein - proteinNeeded);
        const proteinPercentScore = Math.abs(newProteinPercent - 40);
        const combinedScore = proteinGapScore + (proteinPercentScore * 0.5);
        
        if (combinedScore < bestMatch) {
          bestSupplement = supplement;
          bestMatch = combinedScore;
        }
      }
      
      if (bestSupplement) {
        const newTotalProtein = Math.round(currentProteinGrams + bestSupplement.protein);
        const newTotalCalories = Math.round(currentCalories + bestSupplement.calories);
        const newProteinPercent = Math.round((newTotalProtein * 4 / newTotalCalories) * 100);
        
        const lunchSupplementMessages = [
          `LUNCH POWER MOVE: Add ${bestSupplement.name} to hit ${newTotalProtein}g protein at ${newProteinPercent}% (${newTotalCalories} total calories) - PERFECT for ${userProfile.goal}!`,
          `This is your MOMENT, ${userProfile.firstName}! ${bestSupplement.name} brings you to ${newTotalProtein}g protein and DOMINATES your afternoon fuel needs!`,
          `LUNCH STRATEGY: ${bestSupplement.name} = ${newTotalProtein}g protein at ${newProteinPercent}% - this POWERS your entire afternoon for ${userProfile.goal}!`,
          `PERFECT lunch optimization: ${bestSupplement.name} gets you ${newTotalProtein}g protein in ${newTotalCalories} calories - your body will THANK YOU!`
        ];
        
        message += lunchSupplementMessages[Math.floor(Math.random() * lunchSupplementMessages.length)];
      }
    } else {
      // Protein is good, focus on afternoon energy
      const afternoonEnergyMessages = [
        "PROTEIN IS DIALED IN! This lunch will sustain you beautifully through the afternoon - your energy levels will be ROCK SOLID!",
        "PERFECT protein progression! Your body is primed to CRUSH the afternoon with this fuel - no energy crashes ahead!",
        "CHAMPION-LEVEL nutrition! This lunch powers you through afternoon meetings, workouts, and everything else - UNSTOPPABLE energy!",
        "TEXTBOOK lunch execution! Your afternoon performance will be PEAK thanks to this balanced fuel - productivity MAXIMIZED!"
      ];
      message += afternoonEnergyMessages[Math.floor(Math.random() * afternoonEnergyMessages.length)];
    }

    message += " ";

    // ============ PART 3: AFTERNOON TIMING & ENERGY MANAGEMENT ============
    
    if (lunchHour <= 11) {
      const earlyLunchMessages = [
        `Early lunch at ${selectedTime} means you'll need a SOLID afternoon snack around 3 PM - don't skip it or you'll crash hard!`,
        `${selectedTime} lunch timing? SMART! Early fuel means sustained energy, but plan your 3 PM refuel to maintain this momentum!`,
        `EARLY LUNCH ADVANTAGE! ${selectedTime} sets you up for consistent afternoon feeding - make that 3 PM snack COUNT!`,
        `Perfect early timing at ${selectedTime}! Your metabolism is FIRING - keep it going with strategic afternoon fuel!`
      ];
      message += earlyLunchMessages[Math.floor(Math.random() * earlyLunchMessages.length)];
    } else if (lunchHour >= 14) {
      const lateLunchMessages = [
        `Late lunch at ${selectedTime}? You can probably SKIP the afternoon snack and cruise straight to dinner - your timing works!`,
        `${selectedTime} lunch means you're set until dinner - no afternoon snack needed, just HYDRATE and stay focused!`,
        `LATE LUNCH STRATEGY! ${selectedTime} timing lets you go direct to dinner - perfect for ${userProfile.goal} calorie control!`,
        `Smart late lunch at ${selectedTime}! This bridges you perfectly to dinner without extra snacking - EFFICIENT nutrition!`
      ];
      message += lateLunchMessages[Math.floor(Math.random() * lateLunchMessages.length)];
    } else {
      // Perfect lunch timing
      const perfectTimingMessages = [
        `PERFECT lunch timing at ${selectedTime}! This fuels your PEAK afternoon hours - maximum productivity and energy ahead!`,
        `TEXTBOOK timing, ${userProfile.firstName}! ${selectedTime} lunch means OPTIMAL nutrient utilization for afternoon performance!`,
        `CHAMPION-LEVEL meal timing! ${selectedTime} lunch positions you for DOMINANT afternoon energy and focus!`,
        `IDEAL lunch window at ${selectedTime}! Your body is primed to USE every calorie for peak afternoon performance!`
      ];
      message += perfectTimingMessages[Math.floor(Math.random() * perfectTimingMessages.length)];
    }

    return message;
  },

  // ========================
  // MID-AFTERNOON MESSAGES - ENHANCED 3-PART SYSTEM
  // ========================
  getMidAfternoonMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Great afternoon snack choice! Your ${foodText} provides the right energy to carry you through to dinner without overdoing it.`;
      }
      return null;
    }

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    // Ridiculous serving check
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    if (ridiculousItem) {
      return `${userProfile.firstName}, seriously? Don't be ridiculous with the ${ridiculousItem.food} in your afternoon snack! You'll spoil dinner!`;
    }

    // Calculate daily progress so far
    const totalCaloriesSoFar = (previousMeals.breakfast?.totals?.calories || 0) + 
                              (previousMeals.firstSnack?.totals?.calories || 0) + 
                              (previousMeals.secondSnack?.totals?.calories || 0) + 
                              (previousMeals.lunch?.totals?.calories || 0) +
                              (previousMeals.postWorkout?.totals?.calories || 0) +
                              totals.calories;
                              
    const totalProteinSoFar = (previousMeals.breakfast?.totals?.protein || 0) + 
                             (previousMeals.firstSnack?.totals?.protein || 0) + 
                             (previousMeals.secondSnack?.totals?.protein || 0) + 
                             (previousMeals.lunch?.totals?.protein || 0) +
                             (previousMeals.postWorkout?.totals?.protein || 0) +
                             totals.protein;

    const targetDailyCalories = calorieData?.targetCalories || 2500;
    const targetCaloriesByNow = Math.round(targetDailyCalories * 0.75); // 75% by afternoon snack
    const proteinTarget = ['gain-muscle', 'dirty-bulk'].includes(userProfile.goal) ? 120 : 90; // Higher by afternoon

    let message = "";

    // ============ PART 1: LATE-DAY PROGRESS ASSESSMENT ============
    
    if (userProfile.goal === 'dirty-bulk') {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      if (totalCaloriesSoFar >= estimatedTDEE) {
        const bulkVictoryMessages = [
          `${userProfile.firstName}, BULK VICTORY! ${Math.round(totalCaloriesSoFar)} calories - you've CRUSHED your ${estimatedTDEE} target and then some!`,
          `MASS BUILDING COMPLETE, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories means MISSION ACCOMPLISHED - you're getting HUGE!`,
          `${userProfile.firstName}, DIRTY BULK DOMINATION! ${Math.round(totalCaloriesSoFar)} calories down - this is how champions build mass!`,
          `BULK BEAST MODE, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories - you've ANNIHILATED your daily target!`
        ];
        message += bulkVictoryMessages[Math.floor(Math.random() * bulkVictoryMessages.length)];
      } else {
        const remaining = estimatedTDEE - Math.round(totalCaloriesSoFar);
        const bulkPushMessages = [
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories down but need ${remaining} more for TRUE bulk success - dinner better be MASSIVE!`,
          `BULK PUSH NEEDED, ${userProfile.firstName}! ${remaining} calories remaining to hit ${estimatedTDEE} - time to get SERIOUS about dinner!`,
          `${userProfile.firstName}, only ${remaining} calories left for bulk success - make dinner and evening snack COUNT!`,
          `FINAL PUSH, ${userProfile.firstName}! ${remaining} more calories to DOMINATE your ${estimatedTDEE} bulk target!`
        ];
        message += bulkPushMessages[Math.floor(Math.random() * bulkPushMessages.length)];
      }
    } else {
      // Other goals - late-day assessment
      if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
        const lateExcellenceMessages = [
          `${userProfile.firstName}, LATE-DAY EXCELLENCE! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - you're DOMINATING ${userProfile.goal}!`,
          `PHENOMENAL afternoon game, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein puts you in ELITE ${userProfile.goal} territory!`,
          `${userProfile.firstName}, CHAMPION-LEVEL execution! ${Math.round(totalCaloriesSoFar)} calories perfectly paced - dinner will be the PERFECT finish!`,
          `MASTERCLASS performance, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by afternoon - this is how you ACHIEVE ${userProfile.goal}!`
        ];
        message += lateExcellenceMessages[Math.floor(Math.random() * lateExcellenceMessages.length)];
      } else if (totalProteinSoFar >= proteinTarget) {
        const proteinGoodMessages = [
          `${userProfile.firstName}, SOLID late-day protein at ${Math.round(totalProteinSoFar)}g, but ${Math.round(totalCaloriesSoFar)} calories needs dinner POWER!`,
          `Great protein discipline, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is PRO-LEVEL - just need evening fuel for ${userProfile.goal}!`,
          `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein shows COMMITMENT - add dinner energy and you're GOLDEN!`
        ];
        message += proteinGoodMessages[Math.floor(Math.random() * proteinGoodMessages.length)];
      } else {
        const afternoonUrgentMessages = [
          `${userProfile.firstName}, AFTERNOON WAKE-UP CALL! Only ${Math.round(totalProteinSoFar)}g protein - dinner MUST be protein-packed for ${userProfile.goal}!`,
          `RED ALERT, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by afternoon won't support ${userProfile.goal} - EMERGENCY dinner strategy needed!`,
          `URGENT ACTION, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein puts you BEHIND - make dinner a protein POWERHOUSE!`
        ];
        message += afternoonUrgentMessages[Math.floor(Math.random() * afternoonUrgentMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: EVENING PREP & DINNER STRATEGY ============
    
    const remainingCalories = targetDailyCalories - totalCaloriesSoFar;
    const remainingProtein = (userProfile.goal === 'dirty-bulk' ? 150 : 120) - totalProteinSoFar;
    
    if (remainingProtein > 30) {
      const dinnerProteinMessages = [
        `DINNER STRATEGY ALERT: You need ${Math.round(remainingProtein)}g more protein tonight - make it a PROTEIN POWERHOUSE meal!`,
        `${userProfile.firstName}, ${Math.round(remainingProtein)}g protein gap remaining - dinner needs to be LOADED with lean muscle fuel!`,
        `EVENING PROTEIN MISSION: ${Math.round(remainingProtein)}g more needed - think double protein portions at dinner!`,
        `DINNER MUST BE MASSIVE, ${userProfile.firstName}! ${Math.round(remainingProtein)}g protein gap - your evening meal determines success!`
      ];
      message += dinnerProteinMessages[Math.floor(Math.random() * dinnerProteinMessages.length)];
    } else if (remainingCalories > 400) {
      const dinnerCalorieMessages = [
        `DINNER FUEL NEEDED: ${Math.round(remainingCalories)} calories remaining - make it COUNT for your ${userProfile.goal} goals!`,
        `EVENING OPPORTUNITY, ${userProfile.firstName}! ${Math.round(remainingCalories)} calories left - perfect for a SUBSTANTIAL dinner!`,
        `DINNER PLANNING: ${Math.round(remainingCalories)} calories to work with - optimize this for MAXIMUM ${userProfile.goal} benefit!`,
        `${Math.round(remainingCalories)} calories remaining, ${userProfile.firstName} - your dinner can be GENEROUS and goal-supporting!`
      ];
      message += dinnerCalorieMessages[Math.floor(Math.random() * dinnerCalorieMessages.length)];
    } else {
      const dinnerBalanceMessages = [
        `PERFECT afternoon positioning! Dinner can be moderate and balanced - you're tracking beautifully for ${userProfile.goal}!`,
        `EXCELLENT pacing, ${userProfile.firstName}! Evening meals can focus on satisfaction and recovery - you're NAILING this!`,
        `CHAMPION-LEVEL execution! Dinner can be enjoyable without stress - you've earned this balance!`,
        `TEXTBOOK afternoon! Evening nutrition can be relaxed and satisfying - you're DOMINATING your goals!`
      ];
      message += dinnerBalanceMessages[Math.floor(Math.random() * dinnerBalanceMessages.length)];
    }

    message += " ";

    // ============ PART 3: ENERGY CRASH PREVENTION & EVENING TIMING ============
    
    if (snackHour >= 16) {
      const lateSnackMessages = [
        `Snacking at ${selectedTime}? PERFECT timing to prevent the 4 PM energy crash - your productivity will stay HIGH!`,
        `SMART late-afternoon fuel at ${selectedTime}! This prevents dinner overeating and keeps energy STEADY until evening!`,
        `STRATEGIC timing, ${userProfile.firstName}! ${selectedTime} snack means no afternoon slump - you'll CRUISE to dinner!`,
        `PERFECT crash prevention at ${selectedTime}! This snack powers you through evening activities without energy dips!`
      ];
      message += lateSnackMessages[Math.floor(Math.random() * lateSnackMessages.length)];
    } else if (snackHour <= 14) {
      const earlyAfternoonMessages = [
        `Early afternoon fuel at ${selectedTime}? EXCELLENT for sustained energy - you'll power through the whole afternoon!`,
        `SMART early refuel at ${selectedTime}! This prevents ANY afternoon energy crashes - PEAK performance ahead!`,
        `PERFECT early timing, ${userProfile.firstName}! ${selectedTime} fueling means DOMINANT afternoon energy levels!`,
        `CHAMPION-LEVEL timing at ${selectedTime}! Early afternoon fuel = ZERO energy crashes until dinner!`
      ];
      message += earlyAfternoonMessages[Math.floor(Math.random() * earlyAfternoonMessages.length)];
    } else {
      const perfectAfternoonMessages = [
        `TEXTBOOK afternoon timing at ${selectedTime}! Perfect balance between lunch and dinner - OPTIMAL energy management!`,
        `IDEAL afternoon refuel, ${userProfile.firstName}! ${selectedTime} timing prevents crashes AND dinner overeating!`,
        `PERFECT afternoon strategy at ${selectedTime}! This maintains PEAK energy without spoiling dinner appetite!`,
        `CHAMPION timing, ${userProfile.firstName}! ${selectedTime} snack = perfect afternoon energy bridge!`
      ];
      message += perfectAfternoonMessages[Math.floor(Math.random() * perfectAfternoonMessages.length)];
    }

    return message;
  },

  // ========================
  // DINNER MESSAGES - ENHANCED 3-PART SYSTEM
  // ========================
  getDinnerMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 50) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Perfect dinner selection! Your ${foodText} provides balanced nutrition to fuel recovery and prepare for tomorrow.`;
      }
      return null;
    }

    const dinnerHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;
    const fatPercent = pieData[2]?.percentage || 0;

    // Ridiculous serving check
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    if (ridiculousItem) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} at dinner! You'll be too full to sleep properly!`;
    }

    // Calculate FINAL daily totals including dinner
    const totalDailyCalories = (previousMeals.breakfast?.totals?.calories || 0) + 
                              (previousMeals.firstSnack?.totals?.calories || 0) + 
                              (previousMeals.secondSnack?.totals?.calories || 0) + 
                              (previousMeals.lunch?.totals?.calories || 0) + 
                              (previousMeals.midAfternoon?.totals?.calories || 0) + 
                              (previousMeals.postWorkout?.totals?.calories || 0) +
                              totals.calories;
                              
    const totalDailyProtein = (previousMeals.breakfast?.totals?.protein || 0) + 
                             (previousMeals.firstSnack?.totals?.protein || 0) + 
                             (previousMeals.secondSnack?.totals?.protein || 0) + 
                             (previousMeals.lunch?.totals?.protein || 0) + 
                             (previousMeals.midAfternoon?.totals?.protein || 0) +
                             (previousMeals.postWorkout?.totals?.protein || 0) +
                             totals.protein;

    const targetDailyCalories = calorieData?.targetCalories || 2500;
    const finalProteinTarget = ['gain-muscle', 'dirty-bulk'].includes(userProfile.goal) ? 150 : 120;

    let message = "";

    // ============ PART 1: FINAL DAILY ACHIEVEMENT ASSESSMENT ============
    
    if (userProfile.goal === 'dirty-bulk') {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      if (totalDailyCalories >= estimatedTDEE) {
        const bulkVictoryMessages = [
          `${userProfile.firstName}, BULK DOMINATION COMPLETE! ${Math.round(totalDailyCalories)} calories CRUSHED your ${estimatedTDEE} target - you're building SERIOUS MASS!`,
          `MASS BUILDING CHAMPION, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories and ${Math.round(totalDailyProtein)}g protein - this is how you get HUGE!`,
          `${userProfile.firstName}, DIRTY BULK PERFECTION! ${Math.round(totalDailyCalories)} calories - you've ANNIHILATED your daily goals!`,
          `BULK BEAST SUPREME, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories down - your gains are going to be LEGENDARY!`,
          `CALORIE CRUSHING MACHINE, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories - you've DOMINATED the bulk game today!`
        ];
        message += bulkVictoryMessages[Math.floor(Math.random() * bulkVictoryMessages.length)];
      } else {
        const remaining = estimatedTDEE - Math.round(totalDailyCalories);
        const bulkAlmostMessages = [
          `${userProfile.firstName}, SO CLOSE to bulk perfection! ${Math.round(totalDailyCalories)} calories - just ${remaining} more and you've DOMINATED!`,
          `ALMOST THERE, ${userProfile.firstName}! ${remaining} calories short of ${estimatedTDEE} - still a SOLID bulk day at ${Math.round(totalDailyCalories)}!`,
          `${userProfile.firstName}, STRONG bulk effort! ${Math.round(totalDailyCalories)} calories - maybe a small evening snack to hit ${estimatedTDEE}?`,
          `DECENT bulk progress, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories - you're ${remaining} away from TOTAL DOMINATION!`
        ];
        message += bulkAlmostMessages[Math.floor(Math.random() * bulkAlmostMessages.length)];
      }
    } else {
      // Other goals - final achievement assessment
      if (totalDailyCalories >= targetDailyCalories * 0.9 && totalDailyProtein >= finalProteinTarget) {
        const dailyVictoryMessages = [
          `${userProfile.firstName}, DAILY VICTORY! ${Math.round(totalDailyCalories)} calories and ${Math.round(totalDailyProtein)}g protein - you've CRUSHED your ${userProfile.goal} goals!`,
          `CHAMPION-LEVEL day, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g protein and perfect calorie pacing - this is ${userProfile.goal} EXCELLENCE!`,
          `${userProfile.firstName}, MASTERCLASS nutrition! ${Math.round(totalDailyCalories)} calories with ${Math.round(totalDailyProtein)}g protein - you've DOMINATED today!`,
          `PHENOMENAL execution, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g protein achievement - you're in ELITE ${userProfile.goal} territory!`,
          `DAILY DOMINATION COMPLETE, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories and protein ON FIRE - this is how you achieve ${userProfile.goal}!`
        ];
        message += dailyVictoryMessages[Math.floor(Math.random() * dailyVictoryMessages.length)];
      } else if (totalDailyProtein >= finalProteinTarget) {
        const proteinVictoryMessages = [
          `${userProfile.firstName}, PROTEIN CHAMPION! ${Math.round(totalDailyProtein)}g achieved - calories at ${Math.round(totalDailyCalories)} support your ${userProfile.goal} perfectly!`,
          `PROTEIN DOMINATION, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g shows SERIOUS commitment to ${userProfile.goal} - excellent work!`,
          `${userProfile.firstName}, ELITE protein game! ${Math.round(totalDailyProtein)}g is PRO-LEVEL nutrition for ${userProfile.goal} success!`,
          `PROTEIN POWERHOUSE, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g means your muscles are SET for ${userProfile.goal} results!`
        ];
        message += proteinVictoryMessages[Math.floor(Math.random() * proteinVictoryMessages.length)];
      } else if (totalDailyCalories >= targetDailyCalories * 0.8) {
        const calorieGoodMessages = [
          `${userProfile.firstName}, SOLID daily effort! ${Math.round(totalDailyCalories)} calories and ${Math.round(totalDailyProtein)}g protein - good progress toward ${userProfile.goal}!`,
          `DECENT day execution, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories with consistent nutrition choices - you're building habits!`,
          `${userProfile.firstName}, STEADY progress! ${Math.round(totalDailyProtein)}g protein shows commitment - tomorrow can be even BETTER!`,
          `CONSISTENT effort, ${userProfile.firstName}! ${Math.round(totalDailyCalories)} calories - you're moving toward ${userProfile.goal} success!`
        ];
        message += calorieGoodMessages[Math.floor(Math.random() * calorieGoodMessages.length)];
      } else {
        const needImprovementMessages = [
          `${userProfile.firstName}, TOMORROW IS YOUR COMEBACK! ${Math.round(totalDailyCalories)} calories isn't enough for ${userProfile.goal} - let's DOMINATE tomorrow!`,
          `LEARNING DAY, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g protein and ${Math.round(totalDailyCalories)} calories - tomorrow we CRUSH it!`,
          `${userProfile.firstName}, RESET TIME! Today's ${Math.round(totalDailyCalories)} calories teaches us what NOT to do - tomorrow is your VICTORY day!`,
          `COMEBACK OPPORTUNITY, ${userProfile.firstName}! ${Math.round(totalDailyProtein)}g protein shows effort - tomorrow we MULTIPLY this success!`
        ];
        message += needImprovementMessages[Math.floor(Math.random() * needImprovementMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: EVENING RECOVERY & OVERNIGHT OPTIMIZATION ============
    
    if (proteinPercent >= 40) {
      const recoveryProteinMessages = [
        `PERFECT dinner protein at ${proteinPercent}%! This will power OVERNIGHT muscle recovery and protein synthesis - you'll wake up STRONGER!`,
        `RECOVERY PERFECTION, ${userProfile.firstName}! ${proteinPercent}% protein optimizes overnight muscle building - tomorrow you'll feel AMAZING!`,
        `CHAMPION-LEVEL recovery fuel! ${proteinPercent}% protein ensures MAXIMUM overnight gains - your body will thank you!`,
        `OVERNIGHT MUSCLE BUILDING ACTIVATED! ${proteinPercent}% protein dinner = PEAK recovery while you sleep!`
      ];
      message += recoveryProteinMessages[Math.floor(Math.random() * recoveryProteinMessages.length)];
    } else if (carbPercent >= 50) {
      const recoveryBalanceMessages = [
        `High carbs at ${carbPercent}% will replenish glycogen stores - good for recovery, but consider more protein for overnight muscle building!`,
        `${carbPercent}% carbs will fuel recovery - just ensure you're getting enough protein for overnight muscle protein synthesis!`,
        `Energy-focused dinner with ${carbPercent}% carbs - great for refueling, but protein would optimize overnight recovery even more!`,
        `Carb-heavy recovery at ${carbPercent}% - excellent for energy stores, consider protein balance for muscle building overnight!`
      ];
      message += recoveryBalanceMessages[Math.floor(Math.random() * recoveryBalanceMessages.length)];
    } else {
      const recoveryGeneralMessages = [
        `SOLID recovery nutrition! This dinner combination will support overnight repair and prepare you for tomorrow's SUCCESS!`,
        `EXCELLENT evening fuel! Your body will efficiently use these nutrients for overnight recovery and muscle building!`,
        `PERFECT dinner balance! This supports both recovery and tomorrow's energy needs - OPTIMAL evening nutrition!`,
        `CHAMPION-LEVEL evening meal! This fuels overnight recovery while supporting your ${userProfile.goal} goals!`
      ];
      message += recoveryGeneralMessages[Math.floor(Math.random() * recoveryGeneralMessages.length)];
    }

    message += " ";

    // ============ PART 3: SLEEP TIMING & TOMORROW PREP ============
    
    if (dinnerHour >= 19 && totals.calories > 400) {
      const lateDinnerMessages = [
        `Late dinner at ${selectedTime} with ${Math.round(totals.calories)} calories - try to finish eating 2-3 hours before bed for OPTIMAL sleep quality!`,
        `${selectedTime} dinner timing means EARLY digestion focus - light evening activities and hydration will help process this fuel!`,
        `LATE FUEL WARNING, ${userProfile.firstName}! ${Math.round(totals.calories)} calories at ${selectedTime} - prioritize gentle movement and avoid heavy snacks!`,
        `${selectedTime} dinner requires SMART sleep prep - finish eating soon and allow digestion time for quality rest!`
      ];
      message += lateDinnerMessages[Math.floor(Math.random() * lateDinnerMessages.length)];
    } else if (dinnerHour <= 17) {
      const earlyDinnerMessages = [
        `EARLY dinner at ${selectedTime}? PERFECT for digestion and sleep quality - you might want a small evening snack later!`,
        `SMART early timing, ${userProfile.firstName}! ${selectedTime} dinner allows PERFECT digestion - consider light evening fuel if needed!`,
        `EXCELLENT dinner timing at ${selectedTime}! This optimizes digestion AND leaves room for evening snack if hunger strikes!`,
        `CHAMPION timing, ${userProfile.firstName}! ${selectedTime} dinner = OPTIMAL digestion and flexibility for evening nutrition!`
      ];
      message += earlyDinnerMessages[Math.floor(Math.random() * earlyDinnerMessages.length)];
    } else {
      const perfectDinnerMessages = [
        `TEXTBOOK dinner timing at ${selectedTime}! Perfect balance for digestion, sleep quality, and tomorrow's energy - OPTIMAL evening nutrition!`,
        `IDEAL dinner window, ${userProfile.firstName}! ${selectedTime} timing maximizes nutrient utilization while ensuring quality rest!`,
        `PERFECT evening timing at ${selectedTime}! This dinner supports both tonight's recovery and tomorrow's PEAK performance!`,
        `CHAMPION-LEVEL dinner timing, ${userProfile.firstName}! ${selectedTime} is the SWEET SPOT for evening nutrition success!`
      ];
      message += perfectDinnerMessages[Math.floor(Math.random() * perfectDinnerMessages.length)];
    }

    return message;
  },

  // ========================
  // LATE SNACK MESSAGES - ENHANCED 3-PART SYSTEM
  // ========================
  getLateSnackMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Smart late snack! Your ${foodText} provides the right fuel for overnight recovery.`;
      }
      return null;
    }

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    // Ridiculous serving check
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    if (ridiculousItem) {
      return `${userProfile.firstName}, seriously? Don't be ridiculous with the ${ridiculousItem.food} this late! You'll regret it tomorrow morning!`;
    }

    // Calculate ABSOLUTE FINAL daily totals including late snack
    const absoluteFinalCalories = (previousMeals.breakfast?.totals?.calories || 0) + 
                                 (previousMeals.firstSnack?.totals?.calories || 0) + 
                                 (previousMeals.secondSnack?.totals?.calories || 0) + 
                                 (previousMeals.lunch?.totals?.calories || 0) + 
                                 (previousMeals.midAfternoon?.totals?.calories || 0) + 
                                 (previousMeals.dinner?.totals?.calories || 0) +
                                 (previousMeals.postWorkout?.totals?.calories || 0) +
                                 totals.calories;
                                 
    const absoluteFinalProtein = (previousMeals.breakfast?.totals?.protein || 0) + 
                                (previousMeals.firstSnack?.totals?.protein || 0) + 
                                (previousMeals.secondSnack?.totals?.protein || 0) + 
                                (previousMeals.lunch?.totals?.protein || 0) + 
                                (previousMeals.midAfternoon?.totals?.protein || 0) + 
                                (previousMeals.dinner?.totals?.protein || 0) +
                                (previousMeals.postWorkout?.totals?.protein || 0) +
                                totals.protein;

    const targetDailyCalories = calorieData?.targetCalories || 2500;

    let message = "";

    // ============ PART 1: ABSOLUTE FINAL DAILY ACHIEVEMENT ============
    
    if (userProfile.goal === 'dirty-bulk') {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      if (absoluteFinalCalories >= estimatedTDEE + 200) {
        const ultimateBulkMessages = [
          `${userProfile.firstName}, ULTIMATE BULK DOMINATION! ${Math.round(absoluteFinalCalories)} calories - you've OBLITERATED your ${estimatedTDEE} target by ${Math.round(absoluteFinalCalories - estimatedTDEE)}!`,
          `MASS BUILDING LEGEND, ${userProfile.firstName}! ${Math.round(absoluteFinalCalories)} calories - this level of commitment will build SERIOUS SIZE!`,
          `${userProfile.firstName}, DIRTY BULK PERFECTION ACHIEVED! ${Math.round(absoluteFinalCalories)} calories - you're going to wake up BIGGER!`,
          `BULK BEAST ULTIMATE, ${userProfile.firstName}! ${Math.round(absoluteFinalCalories)} calories means MAXIMUM mass building potential!`
        ];
        message += ultimateBulkMessages[Math.floor(Math.random() * ultimateBulkMessages.length)];
      } else if (absoluteFinalCalories >= estimatedTDEE) {
        const bulkSuccessMessages = [
          `${userProfile.firstName}, BULK SUCCESS CONFIRMED! ${Math.round(absoluteFinalCalories)} calories hit your ${estimatedTDEE} target - MASS BUILDING MISSION ACCOMPLISHED!`,
          `DIRTY BULK VICTORY, ${userProfile.firstName}! ${Math.round(absoluteFinalCalories)} calories - you've CRUSHED the bulk game today!`,
          `${userProfile.firstName}, MASS BUILDING CHAMPION! ${Math.round(absoluteFinalCalories)} calories - your gains are going to be REAL!`
        ];
        message += bulkSuccessMessages[Math.floor(Math.random() * bulkSuccessMessages.length)];
      } else {
        const bulkCloseMessages = [
          `${userProfile.firstName}, SOLID bulk day! ${Math.round(absoluteFinalCalories)} calories - just ${Math.round(estimatedTDEE - absoluteFinalCalories)} short of PERFECT!`,
          `STRONG bulk effort, ${userProfile.firstName}! ${Math.round(absoluteFinalCalories)} calories - tomorrow we DOMINATE even more!`,
          `${userProfile.firstName}, DECENT bulk progress! ${Math.round(absoluteFinalCalories)} calories - consistency like this builds mass!`
        ];
        message += bulkCloseMessages[Math.floor(Math.random() * bulkCloseMessages.length)];
      }
    } else {
      // Other goals - absolute final assessment
      if (absoluteFinalCalories >= targetDailyCalories * 0.95 && absoluteFinalProtein >= 140) {
        const ultimateSuccessMessages = [
          `${userProfile.firstName}, ULTIMATE DAILY SUCCESS! ${Math.round(absoluteFinalCalories)} calories and ${Math.round(absoluteFinalProtein)}g protein - you've PERFECTED your ${userProfile.goal}!`,
          `DAILY DOMINATION COMPLETE, ${userProfile.firstName}! ${Math.round(absoluteFinalProtein)}g protein achievement - this is ELITE ${userProfile.goal} execution!`,
          `${userProfile.firstName}, CHAMPION-LEVEL DAY! ${Math.round(absoluteFinalCalories)} calories with PERFECT protein - you've CRUSHED every goal!`,
          `MASTERCLASS NUTRITION DAY, ${userProfile.firstName}! ${Math.round(absoluteFinalProtein)}g protein - this is how you achieve ${userProfile.goal} EXCELLENCE!`
        ];
        message += ultimateSuccessMessages[Math.floor(Math.random() * ultimateSuccessMessages.length)];
      } else if (absoluteFinalProtein >= 120) {
        const proteinWinMessages = [
          `${userProfile.firstName}, PROTEIN VICTORY! ${Math.round(absoluteFinalProtein)}g achieved - your muscles are SET for ${userProfile.goal} success!`,
          `PROTEIN CHAMPION, ${userProfile.firstName}! ${Math.round(absoluteFinalProtein)}g shows SERIOUS commitment to ${userProfile.goal}!`,
          `${userProfile.firstName}, ELITE protein execution! ${Math.round(absoluteFinalProtein)}g is PRO-LEVEL nutrition for ${userProfile.goal}!`
        ];
        message += proteinWinMessages[Math.floor(Math.random() * proteinWinMessages.length)];
      } else {
        const encouragementMessages = [
          `${userProfile.firstName}, SOLID daily effort! ${Math.round(absoluteFinalCalories)} calories and ${Math.round(absoluteFinalProtein)}g protein - tomorrow we ELEVATE this!`,
          `CONSISTENT work, ${userProfile.firstName}! ${Math.round(absoluteFinalProtein)}g protein shows dedication - let's MULTIPLY this tomorrow!`,
          `${userProfile.firstName}, BUILDING momentum! ${Math.round(absoluteFinalCalories)} calories - each day gets us closer to ${userProfile.goal} DOMINATION!`
        ];
        message += encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: OVERNIGHT RECOVERY OPTIMIZATION ============
    
    if (proteinPercent >= 60) {
      const overnightProteinMessages = [
        `OVERNIGHT RECOVERY PERFECTED! ${proteinPercent}% protein will MAXIMIZE muscle protein synthesis while you sleep - wake up STRONGER!`,
        `SLEEP GAINS ACTIVATED, ${userProfile.firstName}! ${proteinPercent}% protein fuels PEAK overnight muscle building - your body will thank you!`,
        `CHAMPION-LEVEL recovery fuel! ${proteinPercent}% protein ensures MAXIMUM overnight gains - tomorrow you'll feel INCREDIBLE!`,
        `OVERNIGHT MUSCLE BUILDING OPTIMIZED! ${proteinPercent}% protein = ELITE recovery while you sleep, ${userProfile.firstName}!`
      ];
      message += overnightProteinMessages[Math.floor(Math.random() * overnightProteinMessages.length)];
    } else if (totals.calories < 150) {
      const smartLateSnackMessages = [
        `SMART late snack strategy! ${Math.round(totals.calories)} calories won't disrupt sleep but will support overnight recovery - PERFECT timing!`,
        `INTELLIGENT evening fuel, ${userProfile.firstName}! Light ${Math.round(totals.calories)} calories optimize recovery without sleep interference!`,
        `TEXTBOOK late snack! ${Math.round(totals.calories)} calories support muscle recovery while maintaining sleep quality - BRILLIANT!`,
        `PERFECT late-night balance! ${Math.round(totals.calories)} calories fuel overnight repair without compromising rest quality!`
      ];
      message += smartLateSnackMessages[Math.floor(Math.random() * smartLateSnackMessages.length)];
    } else {
      const heavyLateWarnings = [
        `${Math.round(totals.calories)} calories this late might impact sleep quality - try to finish eating 2+ hours before bed, ${userProfile.firstName}!`,
        `HEAVY late snack at ${Math.round(totals.calories)} calories - prioritize hydration and light movement to aid digestion before sleep!`,
        `${userProfile.firstName}, ${Math.round(totals.calories)} calories at ${selectedTime} requires SMART sleep prep - allow time for digestion!`,
        `SUBSTANTIAL late fuel - ${Math.round(totals.calories)} calories means extra attention to sleep timing and digestion, ${userProfile.firstName}!`
      ];
      message += heavyLateWarnings[Math.floor(Math.random() * heavyLateWarnings.length)];
    }

    message += " ";

    // ============ PART 3: SLEEP QUALITY & TOMORROW SUCCESS PREP ============
    
    if (snackHour >= 21) {
      const veryLateMessages = [
        `VERY late snack at ${selectedTime} - make sure this is light and finish eating SOON for quality sleep and tomorrow's SUCCESS!`,
        `${selectedTime} is LATE for eating, ${userProfile.firstName} - prioritize sleep prep and hydration to process this fuel efficiently!`,
        `LATE-NIGHT fuel requires EXTRA sleep attention - try to finish eating and allow 2+ hours before bed for optimal rest!`,
        `${selectedTime} snacking means SMART bedtime prep - light activities and proper hydration will optimize recovery!`
      ];
      message += veryLateMessages[Math.floor(Math.random() * veryLateMessages.length)];
    } else if (snackHour <= 19) {
      const earlyEveningMessages = [
        `PERFECT late snack timing at ${selectedTime}! This allows proper digestion before sleep while supporting overnight recovery - OPTIMAL!`,
        `SMART evening timing, ${userProfile.firstName}! ${selectedTime} snack optimizes both recovery AND sleep quality - CHAMPION-LEVEL!`,
        `EXCELLENT timing at ${selectedTime}! This evening fuel supports overnight muscle building without sleep disruption!`,
        `TEXTBOOK evening snack timing, ${userProfile.firstName}! ${selectedTime} maximizes recovery benefits while ensuring quality rest!`
      ];
      message += earlyEveningMessages[Math.floor(Math.random() * earlyEveningMessages.length)];
    } else {
      const goodTimingMessages = [
        `SOLID late snack timing at ${selectedTime}! This balances recovery support with sleep quality - wake up ready for tomorrow's DOMINATION!`,
        `GOOD evening timing, ${userProfile.firstName}! ${selectedTime} snack supports overnight recovery while respecting sleep needs!`,
        `BALANCED timing at ${selectedTime}! This evening fuel optimizes recovery without compromising tomorrow's energy - SMART nutrition!`,
        `STRATEGIC evening snack, ${userProfile.firstName}! ${selectedTime} timing sets you up for PEAK recovery and tomorrow's success!`
      ];
      message += goodTimingMessages[Math.floor(Math.random() * goodTimingMessages.length)];
    }

    return message;
  },

  // ========================
  // POST-WORKOUT MESSAGES - ENHANCED 3-PART SYSTEM
  // ========================
  getPostWorkoutMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Solid post-workout nutrition! Your ${foodText} provides the fuel your muscles need for optimal recovery.`;
      }
      return null;
    }

    const workoutHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    // Ridiculous serving check
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    if (ridiculousItem) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} post-workout! You need recovery fuel, not a food coma!`;
    }

    let message = "";

    // ============ PART 1: POST-WORKOUT WINDOW OPTIMIZATION ============
    
    if (proteinPercent >= 40 && carbPercent >= 30) {
      const perfectPWOMessages = [
        `${userProfile.firstName}, POST-WORKOUT PERFECTION! ${proteinPercent}% protein + ${carbPercent}% carbs is EXACTLY what your muscles need for MAXIMUM recovery!`,
        `TEXTBOOK post-workout fuel, ${userProfile.firstName}! ${proteinPercent}% protein and ${carbPercent}% carbs = ELITE muscle protein synthesis activation!`,
        `CHAMPION-LEVEL recovery fuel! ${proteinPercent}% protein with ${carbPercent}% carbs optimizes the post-workout anabolic window - GAINS INCOMING!`,
        `POST-WORKOUT MASTERY, ${userProfile.firstName}! ${proteinPercent}% protein and ${carbPercent}% carbs = PEAK recovery and muscle building!`,
        `RECOVERY PERFECTION ACHIEVED! ${proteinPercent}% protein + ${carbPercent}% carbs will MAXIMIZE your workout results, ${userProfile.firstName}!`
      ];
      message += perfectPWOMessages[Math.floor(Math.random() * perfectPWOMessages.length)];
    } else if (proteinPercent >= 50) {
      const highProteinPWOMessages = [
        `${userProfile.firstName}, PROTEIN POWERHOUSE! ${proteinPercent}% protein will DOMINATE muscle protein synthesis - your recovery will be ELITE!`,
        `MUSCLE BUILDING MACHINE, ${userProfile.firstName}! ${proteinPercent}% protein maximizes post-workout recovery - SERIOUS gains ahead!`,
        `POST-WORKOUT PROTEIN CHAMPION! ${proteinPercent}% protein ensures PEAK muscle building - this is how you maximize training!`,
        `RECOVERY PROTEIN BEAST, ${userProfile.firstName}! ${proteinPercent}% protein will turn this workout into SERIOUS muscle growth!`
      ];
      message += highProteinPWOMessages[Math.floor(Math.random() * highProteinPWOMessages.length)];
    } else if (carbPercent >= 50) {
      const highCarbPWOMessages = [
        `${userProfile.firstName}, GLYCOGEN REPLENISHMENT FOCUS! ${carbPercent}% carbs will RAPIDLY refuel your muscles - great for high-intensity training days!`,
        `CARB REFUEL CHAMPION! ${carbPercent}% carbs optimizes glycogen restoration - perfect for INTENSE workout recovery, ${userProfile.firstName}!`,
        `ENERGY RESTORATION MASTER! ${carbPercent}% carbs ensures your muscles are FULLY fueled for the next session!`,
        `POST-WORKOUT CARB LOADING! ${carbPercent}% carbs will MAXIMIZE glycogen replenishment - smart for serious training!`
      ];
      message += highCarbPWOMessages[Math.floor(Math.random() * highCarbPWOMessages.length)];
    } else {
      const standardPWOMessages = [
        `${userProfile.firstName}, SOLID post-workout fuel! This combination will support recovery and help you get the MAXIMUM from your training session!`,
        `GOOD recovery nutrition, ${userProfile.firstName}! This post-workout fuel will help your muscles adapt and grow from today's work!`,
        `SMART post-workout choice! This nutrition timing will optimize your recovery and support your ${userProfile.goal} goals!`,
        `POST-WORKOUT SUCCESS, ${userProfile.firstName}! This fuel will help transform your training into real results!`
      ];
      message += standardPWOMessages[Math.floor(Math.random() * standardPWOMessages.length)];
    }

    message += " ";

    // ============ PART 2: GOAL-SPECIFIC POST-WORKOUT STRATEGY ============
    
    if (userProfile.goal === 'dirty-bulk') {
      if (totals.calories < 300) {
        const bulkPWONeedMoreMessages = [
          `${userProfile.firstName}, only ${Math.round(totals.calories)} calories post-workout? For DIRTY BULK, this recovery meal should be MUCH BIGGER!`,
          `BULK EMERGENCY, ${userProfile.firstName}! ${Math.round(totals.calories)} calories won't support mass building - this is your chance to GO BIG!`,
          `POST-WORKOUT BULK OPPORTUNITY MISSED! ${Math.round(totals.calories)} calories is maintenance eating - dirty bulk requires MASSIVE recovery fuel!`,
          `${userProfile.firstName}, ${Math.round(totals.calories)} calories post-workout for dirty bulk? You're leaving GAINS on the table - EAT MORE!`
        ];
        message += bulkPWONeedMoreMessages[Math.floor(Math.random() * bulkPWONeedMoreMessages.length)];
      } else {
        const bulkPWOGoodMessages = [
          `${userProfile.firstName}, BULK POST-WORKOUT BEAST! ${Math.round(totals.calories)} calories will fuel SERIOUS mass building - this is how you get HUGE!`,
          `DIRTY BULK RECOVERY CHAMPION! ${Math.round(totals.calories)} calories post-workout = MAXIMUM muscle building potential, ${userProfile.firstName}!`,
          `POST-WORKOUT MASS BUILDING! ${Math.round(totals.calories)} calories will turn this training into SERIOUS size gains!`,
          `BULK RECOVERY PERFECTION, ${userProfile.firstName}! ${Math.round(totals.calories)} calories ensures this workout builds REAL mass!`
        ];
        message += bulkPWOGoodMessages[Math.floor(Math.random() * bulkPWOGoodMessages.length)];
      }
    } else if (['lose', 'lose-fat'].includes(userProfile.goal)) {
      if (totals.calories > 250) {
        const fatLossPWOWarningMessages = [
          `${userProfile.firstName}, ${Math.round(totals.calories)} calories post-workout is getting heavy for ${userProfile.goal} goals - focus on LEAN protein and minimize fats!`,
          `POST-WORKOUT CALORIE CAUTION! ${Math.round(totals.calories)} calories might work against ${userProfile.goal} - prioritize protein efficiency!`,
          `${userProfile.firstName}, ${Math.round(totals.calories)} calories post-workout could slow ${userProfile.goal} progress - lean protein should dominate!`,
          `FAT LOSS FOCUS NEEDED! ${Math.round(totals.calories)} calories post-workout - make sure this is mostly LEAN protein for ${userProfile.goal}!`
        ];
        message += fatLossPWOWarningMessages[Math.floor(Math.random() * fatLossPWOWarningMessages.length)];
      } else {
        const fatLossPWOGoodMessages = [
          `${userProfile.firstName}, SMART post-workout fuel! ${Math.round(totals.calories)} calories with quality protein supports recovery while maintaining ${userProfile.goal} progress!`,
          `PERFECT ${userProfile.goal} recovery! ${Math.round(totals.calories)} calories optimizes muscle recovery without excess - LEAN gains ahead!`,
          `POST-WORKOUT PRECISION, ${userProfile.firstName}! ${Math.round(totals.calories)} calories supports muscle while advancing ${userProfile.goal} - SMART nutrition!`,
          `${userProfile.goal.toUpperCase()} RECOVERY CHAMPION! ${Math.round(totals.calories)} calories provides muscle fuel without compromising fat loss!`
        ];
        message += fatLossPWOGoodMessages[Math.floor(Math.random() * fatLossPWOGoodMessages.length)];
      }
    } else {
      // gain-muscle or maintain
      const balancedPWOMessages = [
        `${userProfile.firstName}, BALANCED post-workout approach! ${Math.round(totals.calories)} calories with quality macros supports ${userProfile.goal} perfectly!`,
        `SMART ${userProfile.goal} recovery! ${Math.round(totals.calories)} calories optimizes muscle building while supporting your goals!`,
        `POST-WORKOUT PRECISION, ${userProfile.firstName}! ${Math.round(totals.calories)} calories provides exactly what your muscles need for ${userProfile.goal}!`,
        `PERFECT recovery fuel! ${Math.round(totals.calories)} calories ensures this workout contributes to ${userProfile.goal} success!`
      ];
      message += balancedPWOMessages[Math.floor(Math.random() * balancedPWOMessages.length)];
    }

    message += " ";

    // ============ PART 3: TIMING & RECOVERY WINDOW OPTIMIZATION ============
    
    if (workoutHour <= 7) {
      const earlyWorkoutMessages = [
        `EARLY WARRIOR, ${userProfile.firstName}! Post-workout at ${selectedTime} means you're DOMINATING the day from the start - this fuel powers your ENTIRE day!`,
        `MORNING CHAMPION! ${selectedTime} post-workout fuel sets the tone for PEAK performance all day - you're ahead of everyone else!`,
        `EARLY BIRD GAINS, ${userProfile.firstName}! ${selectedTime} recovery fuel means your metabolism is FIRING hot all day long!`,
        `SUNRISE WARRIOR! Post-workout at ${selectedTime} means you've EARNED this fuel - your day will be UNSTOPPABLE!`
      ];
      message += earlyWorkoutMessages[Math.floor(Math.random() * earlyWorkoutMessages.length)];
    } else if (workoutHour >= 18) {
      const eveningWorkoutMessages = [
        `EVENING WARRIOR, ${userProfile.firstName}! ${selectedTime} post-workout means OVERNIGHT recovery optimization - you'll wake up STRONGER!`,
        `PRIME TIME TRAINING! ${selectedTime} post-workout fuel ensures MAXIMUM overnight muscle protein synthesis - SLEEP GAINS activated!`,
        `EVENING CHAMPION! ${selectedTime} recovery fuel will work ALL NIGHT to build muscle while you rest - PERFECT timing!`,
        `AFTER-HOURS BEAST, ${userProfile.firstName}! ${selectedTime} post-workout means your recovery will be OPTIMIZED while you sleep!`
      ];
      message += eveningWorkoutMessages[Math.floor(Math.random() * eveningWorkoutMessages.length)];
    } else {
      const midDayWorkoutMessages = [
        `MIDDAY CHAMPION, ${userProfile.firstName}! ${selectedTime} post-workout fuel perfectly bridges your day - sustained energy and recovery ahead!`,
        `PERFECT workout timing! ${selectedTime} post-workout means optimal nutrient utilization during peak metabolic hours!`,
        `PRIME TIME RECOVERY! ${selectedTime} post-workout fuel ensures your muscles get exactly what they need when they need it most!`,
        `TEXTBOOK timing, ${userProfile.firstName}! ${selectedTime} post-workout means MAXIMUM recovery efficiency during optimal hours!`
      ];
      message += midDayWorkoutMessages[Math.floor(Math.random() * midDayWorkoutMessages.length)];
    }

    return message;
  }
};
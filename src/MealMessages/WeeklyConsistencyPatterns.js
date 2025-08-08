// WeeklyConsistencyPatterns.js - New weekly focus messaging patterns

export const WeeklyConsistencyPatterns = {
  
  // Weekly momentum messages for dinner endings
  getWeeklyMomentumMessage: (userProfile, dailySuccess, currentMealType = 'dinner') => {
    const { firstName, goal } = userProfile;
    
    if (dailySuccess === 'excellent') {
      const excellentWeeklyMessages = [
        `This is the consistency that transforms physiques over weeks, ${firstName}!`,
        `Days like this repeated = ${goal} SUCCESS! Keep this weekly momentum going!`,
        `${firstName}, this daily precision builds into weekly DOMINATION of your goals!`,
        `Week after week of this quality = RESULTS! You're building champion habits, ${firstName}!`,
        `This level of consistency separates successful people from dreamers - keep going!`,
        `${firstName}, string together 5-6 days like this per week and you'll be UNSTOPPABLE!`,
        `ELITE-level execution! This repeated weekly = guaranteed ${goal} transformation!`
      ];
      return excellentWeeklyMessages[Math.floor(Math.random() * excellentWeeklyMessages.length)];
    }
    
    if (dailySuccess === 'good') {
      const goodWeeklyMessages = [
        `Solid day, ${firstName}! String together 5-6 days like this per week for serious ${goal} progress!`,
        `Good consistency building, ${firstName}! Weekly success comes from days exactly like this!`,
        `${firstName}, this is how you build sustainable habits - repeat this pattern all week!`,
        `Steady progress, ${firstName}! Consistency like this creates weekly momentum for ${goal}!`,
        `${firstName}, days like this are your building blocks - stack them into a powerful week!`,
        `Good foundation day! Keep this quality going 4-5 more days this week for ${goal} success!`
      ];
      return goodWeeklyMessages[Math.floor(Math.random() * goodWeeklyMessages.length)];
    }
    
    // Needs improvement
    const improvementWeeklyMessages = [
      `${firstName}, every week is a fresh start! Use this as learning for better consistency ahead!`,
      `Building weekly habits takes practice, ${firstName} - focus on 3-4 strong days this week!`,
      `${firstName}, consistent weeks start with committed days - you're learning what works!`,
      `Weekly success isn't about perfection, ${firstName} - it's about consistent effort! Keep building!`,
      `${firstName}, every day teaches you something - use this knowledge for stronger weekly patterns!`,
      `Weekly momentum starts with single days, ${firstName} - tomorrow is your chance to build!`
    ];
    return improvementWeeklyMessages[Math.floor(Math.random() * improvementWeeklyMessages.length)];
  },

  // Quick daily assessment for weekly context
  assessDailySuccess: (nutritionSoFar, userProfile, calorieData) => {
    const getUserProteinTarget = (profile) => {
      switch(profile.goal) {
        case 'dirty-bulk': return 150;
        case 'gain-muscle': return 130;
        case 'maintain': return 100;
        case 'lose': return 120;
        default: return 120;
      }
    };
    
    const proteinTarget = getUserProteinTarget(userProfile);
    const calorieTarget = calorieData?.targetCalories || 2500;
    
    const proteinHit = nutritionSoFar.protein >= proteinTarget * 0.85;
    const calorieHit = Math.abs(nutritionSoFar.calories - calorieTarget) <= calorieTarget * 0.2; // Within 20%
    
    if (proteinHit && calorieHit) return 'excellent';
    if (proteinHit || (nutritionSoFar.calories >= calorieTarget * 0.7)) return 'good';
    return 'needs-improvement';
  },

  // Shared goal-specific praise patterns
  getGoalSpecificPraise: (userName, metric, value, goal) => {
    const praiseMessages = {
      'dirty-bulk': [
        `${userName}, BULK BEAST! ${metric} at ${value} - you're building SERIOUS MASS!`,
        `CRUSHING the bulk, ${userName}! ${metric} shows commitment to size!`,
        `${userName}, MASS BUILDING MACHINE! This is how you get HUGE!`,
        `BULK DOMINATION, ${userName}! ${metric} = real mass building fuel!`
      ],
      'gain-muscle': [
        `${userName}, LEAN MUSCLE CHAMPION! ${metric} at ${value} - textbook muscle building!`,
        `ELITE execution, ${userName}! ${metric} puts you in pro territory!`,
        `${userName}, MASTERCLASS nutrition! Perfect for lean gains!`,
        `PRECISION muscle building, ${userName}! ${metric} is spot-on!`
      ],
      'lose': [
        `${userName}, FAT LOSS PRECISION! ${metric} at ${value} supports cutting goals!`,
        `SMART fat loss approach, ${userName}! ${metric} preserves muscle!`,
        `${userName}, this is how you cut properly! Efficient and effective!`,
        `FAT LOSS CHAMPION, ${userName}! ${metric} maximizes results!`
      ],
      'maintain': [
        `${userName}, MAINTENANCE MASTERY! ${metric} keeps you balanced!`,
        `CONSISTENT excellence, ${userName}! ${metric} shows sustainable habits!`,
        `${userName}, long-term success nutrition! Well executed!`,
        `STEADY excellence, ${userName}! ${metric} maintains your progress!`
      ]
    };
    
    const messages = praiseMessages[goal] || praiseMessages['maintain'];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  // Shared urgency patterns
  getUrgencyMessage: (userName, issue, goal) => {
    const urgencyMessages = [
      `${userName}, WAKE UP CALL! ${issue} won't support your ${goal} goals!`,
      `RED ALERT, ${userName}! ${issue} puts you behind on ${goal} success!`,
      `${userName}, URGENT ACTION NEEDED! ${issue} requires course correction!`,
      `WARNING, ${userName}! ${issue} is working against your ${goal} progress!`
    ];
    return urgencyMessages[Math.floor(Math.random() * urgencyMessages.length)];
  },

  // Weekly habit reinforcement messages
  getHabitReinforcementMessage: (mealType, userProfile) => {
    const { firstName, goal } = userProfile;
    
    const habitMessages = {
      breakfast: [
        `${firstName}, strong breakfast choices like this build weekly momentum for ${goal}!`,
        `Consistent breakfast quality = weekly success foundation, ${firstName}!`,
        `${firstName}, breakfast discipline like this repeated daily creates weekly wins!`
      ],
      lunch: [
        `${firstName}, midday nutrition this solid builds weekly ${goal} progress!`,
        `Lunch precision like this daily = weekly transformation, ${firstName}!`,
        `${firstName}, consistent lunch quality creates weekly momentum!`
      ],
      dinner: [
        `${firstName}, dinner quality like this builds weekly ${goal} habits!`,
        `Evening nutrition this solid = weekly success patterns, ${firstName}!`,
        `${firstName}, consistent dinners create weekly transformation momentum!`
      ]
    };
    
    const messages = habitMessages[mealType] || habitMessages['lunch'];
    return messages[Math.floor(Math.random() * messages.length)];
  }
};
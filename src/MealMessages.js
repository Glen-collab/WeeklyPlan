// MealMessages.js - All smart coaching and nutrition guidance messages

export const MealMessages = {

  // ========================
  // BREAKFAST MESSAGES - UPDATED WITH 3-PART SYSTEM
  // ========================
  getBreakfastMessage: (pieData, selectedTime, foodItems, totals, userProfile) => {
    if (totals.calories < 50) return null;
    
    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check - TOP PRIORITY
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food}. Let's focus here! Balance Daniel-son.`;
    }

    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;
    const fatPercent = pieData[2]?.percentage || 0;
    
    // Perfect balance check
    const isWellBalanced = 
      Math.abs(proteinPercent - 40) <= 5 &&
      Math.abs(carbPercent - 40) <= 5 &&
      Math.abs(fatPercent - 20) <= 5;
    
    if (isWellBalanced) {
      const timeHour = parseInt(selectedTime.split(':')[0]);
      let message = `Excellent! You've nailed the macro balance with ${proteinPercent}% protein, ${carbPercent}% carbs, and ${fatPercent}% fat. This is exactly the kind of balanced nutrition that will keep your energy steady and support your goals throughout the day. `;
      
      if (timeHour < 6) {
        message += "It also looks like you are getting an early start to the morning so make sure you grab your healthy on-the-go snack. You may need two before lunch.";
      } else if (timeHour === 6) {
        message += "This is right in the wheelhouse for a great time for breakfast, and another snack around 8 and 10 when your energy starts to dip before a healthy lunch.";
      } else if (timeHour >= 9) {
        message += `With breakfast being at ${selectedTime} you can most likely skip the snacks and focus on another healthy lunch.`;
      } else if (timeHour >= 7) {
        message += "You may be able to make it to lunch but hunger will set in around 10am, so make sure you have your snack ready so you don't over eat at lunch.";
      }
      
      return message;
    }

    // NEW 3-PART PERSONALIZED MESSAGE SYSTEM
    if (userProfile.firstName) {
      let message = "";
      const timeHour = parseInt(selectedTime.split(':')[0]);
      
      // PART 1: High-Protein Praise Messages (40%+ protein)
      if (proteinPercent >= 40) {
        const highProteinMessages = [
          `${userProfile.firstName}, now THAT'S how you start a day with ${proteinPercent}% protein!`,
          `Crushing it this morning, ${userProfile.firstName}! ${proteinPercent}% protein is exactly what your muscles needed.`,
          `${userProfile.firstName}, you're setting the tone perfectly with ${proteinPercent}% protein - your metabolism is thanking you!`,
          `Boom! ${userProfile.firstName}, ${proteinPercent}% protein at breakfast means you're already winning the day.`,
          `${userProfile.firstName}, I love seeing ${proteinPercent}% protein first thing - you're building lean muscle while others eat sugar.`,
          `Smart move, ${userProfile.firstName}! ${proteinPercent}% protein keeps you satisfied and focused all morning.`,
          `${userProfile.firstName}, ${proteinPercent}% protein at breakfast? That's champion-level nutrition right there!`,
          `Perfect protein start, ${userProfile.firstName}! ${proteinPercent}% protein means steady energy until lunch.`,
          `${userProfile.firstName}, you're ahead of 90% of people with ${proteinPercent}% protein at breakfast - keep it up!`,
          `Outstanding, ${userProfile.firstName}! ${proteinPercent}% protein fuels both body and brain for peak performance.`,
          `${userProfile.firstName}, ${proteinPercent}% protein shows you understand what real nutrition looks like!`,
          `Impressive start, ${userProfile.firstName}! ${proteinPercent}% protein sets you up for sustained energy all day.`,
          `${userProfile.firstName}, ${proteinPercent}% protein at breakfast is exactly how successful people eat!`,
          `Nailed it, ${userProfile.firstName}! ${proteinPercent}% protein keeps hunger away and metabolism high.`,
          `${userProfile.firstName}, starting with ${proteinPercent}% protein means you won't crash at 10 AM like everyone else!`,
          `Brilliant choice, ${userProfile.firstName}! ${proteinPercent}% protein builds the foundation for a productive day.`,
          `${userProfile.firstName}, ${proteinPercent}% protein at breakfast? You're playing in the major leagues now!`,
          `Love this, ${userProfile.firstName}! ${proteinPercent}% protein means you're serious about your goals.`
        ];
        
        message += highProteinMessages[Math.floor(Math.random() * highProteinMessages.length)];
      } else {
        // Standard protein messages for lower protein breakfasts
        const standardMessages = [
          `Good morning, ${userProfile.firstName}! Your breakfast is fueling up the day ahead.`,
          `${userProfile.firstName}, every healthy breakfast choice moves you closer to your goals.`,
          `Starting strong, ${userProfile.firstName}! This breakfast gives you a solid foundation.`,
          `Nice work, ${userProfile.firstName}! You're building healthy habits one meal at a time.`,
          `${userProfile.firstName}, this breakfast puts you on track for a successful day.`
        ];
        
        message += standardMessages[Math.floor(Math.random() * standardMessages.length)];
      }
      
      // PART 2: Time-Based Snack Recommendations
      message += " ";
      if (timeHour <= 6) {
        const earlyMessages = [
          "With that early start, plan a solid snack around 9 AM to maintain your energy.",
          "Early bird! You'll want a protein-rich snack in about 3 hours to stay strong.",
          "Starting this early means you'll need fuel around 9 AM - don't skip it!",
          "That early morning hustle deserves a quality snack by 9 AM."
        ];
        message += earlyMessages[Math.floor(Math.random() * earlyMessages.length)];
      } else if (timeHour === 7) {
        const sevenAMMessages = [
          "Perfect timing! Plan your first snack around 10 AM to cruise into lunch.",
          "Great breakfast timing - a mid-morning snack will keep you satisfied until lunch.",
          "With breakfast at 7 AM, you're set up perfectly for a 10 AM snack and strong lunch.",
          "Classic timing! Your next fuel stop should be around 10 AM."
        ];
        message += sevenAMMessages[Math.floor(Math.random() * sevenAMMessages.length)];
      } else if (timeHour === 8) {
        const eightAMMessages = [
          "Breakfast at 8 AM sets you up nicely - just one snack before lunch should do it.",
          "Good timing! A light snack around 11 AM will bridge you perfectly to lunch.",
          "Starting at 8 AM means you can probably make it to lunch with just one small snack.",
          "Eight o'clock breakfast? You're positioned well for just one strategic snack before lunch."
        ];
        message += eightAMMessages[Math.floor(Math.random() * eightAMMessages.length)];
      } else if (timeHour >= 9) {
        const lateMessages = [
          "With breakfast this late, you can probably skip snacks and go straight to a healthy lunch.",
          "Late breakfast works! You're all set to cruise directly into lunch without snacking.",
          "Perfect - with breakfast at this time, you won't need snacks before lunch.",
          "Late breakfast advantage: you can skip the snacks and head straight to lunch!"
        ];
        message += lateMessages[Math.floor(Math.random() * lateMessages.length)];
      }
      
      // PART 3: Balance and Adjustment Advice
      message += " ";
      if (proteinPercent < 25) {
        const lowProteinAdvice = [
          "Try adding some Greek yogurt or eggs to boost your protein for better satiety.",
          "Consider increasing protein next time - it'll keep you fuller longer and support your goals.",
          "A bit more protein would make this breakfast even more powerful for muscle building.",
          "Next time, try adding a protein source to optimize this meal's staying power."
        ];
        message += lowProteinAdvice[Math.floor(Math.random() * lowProteinAdvice.length)];
      } else if (carbPercent > 60) {
        const highCarbAdvice = [
          "Those carbs will give you energy, but adding more protein would provide better balance.",
          "Great energy from those carbs, but consider more protein to avoid an energy crash later.",
          "High-carb breakfast can work, but protein would help stabilize your blood sugar.",
          "Lots of quick energy here - adding protein would make it last longer."
        ];
        message += highCarbAdvice[Math.floor(Math.random() * highCarbAdvice.length)];
      } else if (fatPercent > 40) {
        const highFatAdvice = [
          "Those healthy fats will keep you satisfied - just watch the total calories for your goals.",
          "Good fat content for satiety! Make sure your other meals balance out the day.",
          "Smart fat choices for lasting energy - just keep an eye on overall daily intake.",
          "Those fats will sustain you well, but balance them with protein throughout the day."
        ];
        message += highFatAdvice[Math.floor(Math.random() * highFatAdvice.length)];
      } else {
        const balancedAdvice = [
          "Keep building on this foundation with consistent choices throughout the day.",
          "This puts you on track - maintain this quality with your remaining meals.",
          "Solid start! Carry this momentum into your snacks and lunch.",
          "You're building great habits - keep this consistency going all day."
        ];
        message += balancedAdvice[Math.floor(Math.random() * balancedAdvice.length)];
      }
      
      return message;
    }
    
    // Fallback for users without names
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      return `Every breakfast is a step in the right direction! Plan the rest of your day around your ${foodText} to optimize your energy levels and get towards your goal of 40% protein, 40% carbs and 20% fats.`;
    }
    
    return null;
  },

  // ========================
  // FIRST SNACK MESSAGES
  // ========================
  getFirstSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastPieData, userProfile) => {
    if (totals.calories < 25) return null;
    
    const breakfastHour = parseInt(breakfastTime.split(':')[0]);
    
    const fruitItems = ['banana', 'apple', 'berries', 'orange', 'strawberries', 'blueberries'];
    const hasFruit = foodItems.some(item => 
      item.food && fruitItems.some(fruit => item.food.toLowerCase().includes(fruit.toLowerCase()))
    );
    
    // Fruit + timing advice
    if (hasFruit && totals.calories >= 25 && breakfastHour <= 7) {
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(' and ');
      const proteinPercent = pieData[0]?.percentage || 0;
      const snackHour = parseInt(selectedTime.split(':')[0]);
      
      let message = `Great job on the ${foodText}! I usually eat this combination with a ready to drink protein shake, beef jerky, or another protein snack because your protein is only at ${proteinPercent}%.`;
      
      if (snackHour <= 9) {
        message += ` Since it is ${selectedTime}, and you have ${foodText}, you will be famished in another hour. Let's add in some healthy nuts or protein to hold you over.`;
      }
      
      return message;
    }
    
    // General first snack guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      return `Good choice on your first snack with ${foodText}! This should help bridge the gap to lunch while keeping your energy steady.`;
    }
    
    return null;
  },

  // ========================
  // SECOND SNACK MESSAGES
  // ========================
  getSecondSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastFoodItems, firstSnackTime, firstSnackTotals, firstSnackFoodItems, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const snackMinute = parseInt(selectedTime.split(':')[1]);
    
    const totalCaloriesSoFar = breakfastTotals.calories + 
                              (firstSnackTotals ? firstSnackTotals.calories : 0) + 
                              totals.calories;
    
    const totalProteinSoFar = Math.round(breakfastTotals.protein + 
                                        (firstSnackTotals ? firstSnackTotals.protein : 0) + 
                                        totals.protein);

    // Dirty bulk specific messaging
    if (userProfile.goal === 'dirty-bulk' && userProfile.firstName) {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      const dirtyBulkMessages = [
        `${userProfile.firstName}, you're at ${Math.round(totalCaloriesSoFar)} calories so far - keep that ${totalProteinSoFar}g of protein climbing and let's hit that goal of ${estimatedTDEE} or more!`,
        `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories down, but we're not even close to done. That ${totalProteinSoFar}g protein is solid - now let's add serious volume!`
      ];
      return dirtyBulkMessages[Math.floor(Math.random() * dirtyBulkMessages.length)];
    }

    // Late snack timing check
    if (snackHour >= 12 && snackMinute >= 30 && userProfile.firstName) {
      return `${userProfile.firstName}, at ${selectedTime} this is looking more like lunch than a snack. Perfect timing to fuel your afternoon properly.`;
    }

    // General second snack guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Good choice, ${userProfile.firstName}! Your second snack with ${foodText} at ${selectedTime} keeps your energy steady and supports your ${userProfile.goal} goals.`;
      } else {
        return `Perfect timing for your second snack with ${foodText}! This will help you cruise into lunch without any energy crashes.`;
      }
    }
    
    return null;
  },

  // ========================
  // LUNCH MESSAGES
  // ========================
  getLunchMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 50) return null;

    const lunchHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;
    const fatPercent = pieData[2]?.percentage || 0;

    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} at lunch! This is supposed to fuel your afternoon, not put you in a food coma!`;
    }

    // Dirty bulk progress tracking
    if (userProfile.goal === 'dirty-bulk' && userProfile.firstName) {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      const totalCaloriesSoFar = previousMeals.breakfast.totals.calories + 
                                previousMeals.firstSnack.totals.calories + 
                                previousMeals.secondSnack.totals.calories + 
                                totals.calories;
      const remainingCalories = estimatedTDEE - Math.round(totalCaloriesSoFar);
      
      return `${userProfile.firstName}, you're at ${Math.round(totalCaloriesSoFar)} calories so far! Keep pushing toward that ${estimatedTDEE} target - you need ${remainingCalories} more calories!`;
    }

    // Weight loss goal check
    if (['lose', 'lose-fat'].includes(userProfile.goal) && totals.calories > 400 && userProfile.firstName) {
      return `${userProfile.firstName}, that's a ${Math.round(totals.calories)} calorie lunch! Remember, your goal is ${userProfile.goal}. This might be working against you.`;
    }

    // Well-balanced lunch check
    const isWellBalanced = 
      Math.abs(proteinPercent - 35) <= 10 &&
      Math.abs(carbPercent - 45) <= 10 &&
      Math.abs(fatPercent - 20) <= 10;
    
    if (isWellBalanced && totals.calories >= 200 && userProfile.firstName) {
      return `${userProfile.firstName}, excellent macro balance at lunch! ${proteinPercent}% protein, ${carbPercent}% carbs, ${fatPercent}% fat - this will fuel your afternoon perfectly.`;
    }

    // General lunch guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Great lunch choice, ${userProfile.firstName}! Your ${foodText} at ${selectedTime} provides ${Math.round(totals.calories)} calories to fuel your afternoon and support your ${userProfile.goal} goals.`;
      } else {
        return `Solid lunch selection! Your ${foodText} provides balanced nutrition to power you through the rest of your day.`;
      }
    }
    
    return null;
  },

  // ========================
  // MID-AFTERNOON MESSAGES
  // ========================
  getMidAfternoonMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, seriously? Don't be ridiculous with the ${ridiculousItem.food} in your afternoon snack! You'll spoil dinner!`;
    }

    // Dirty bulk goal achievement check
    if (userProfile.goal === 'dirty-bulk' && userProfile.firstName) {
      const totalCaloriesSoFar = previousMeals.breakfast.totals.calories + 
                                previousMeals.firstSnack.totals.calories + 
                                previousMeals.secondSnack.totals.calories + 
                                previousMeals.lunch.totals.calories +
                                totals.calories;
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      if (totalCaloriesSoFar >= estimatedTDEE) {
        return `${userProfile.firstName}, MISSION ACCOMPLISHED! ${Math.round(totalCaloriesSoFar)} calories - you've crushed your ${estimatedTDEE} target! Keep going if you want!`;
      }
    }

    // Late afternoon timing warning
    if (snackHour >= 16 && userProfile.firstName) {
      return `${userProfile.firstName}, snacking at ${selectedTime}? That's getting close to dinner time! Make sure this doesn't spoil your evening meal.`;
    }

    // High protein praise
    if (proteinPercent >= 50 && userProfile.firstName) {
      return `${userProfile.firstName}, love the protein focus at ${selectedTime}! ${proteinPercent}% protein will keep you satisfied until dinner and support muscle recovery.`;
    }

    // General mid-afternoon guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Nice afternoon fuel, ${userProfile.firstName}! Your ${foodText} at ${selectedTime} provides ${Math.round(totals.calories)} calories to bridge you to dinner while supporting your ${userProfile.goal} goals.`;
      } else {
        return `Great afternoon snack choice! Your ${foodText} provides the right energy to carry you through to dinner without overdoing it.`;
      }
    }
    
    return null;
  },

  // ========================
  // DINNER MESSAGES
  // ========================
  getDinnerMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 50) return null;

    const dinnerHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;
    const fatPercent = pieData[2]?.percentage || 0;

    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} at dinner! You'll be too full to sleep properly!`;
    }

    // Calculate total daily calories including dinner
    const totalDailyCalories = (previousMeals.breakfast?.totals?.calories || 0) + 
                              (previousMeals.firstSnack?.totals?.calories || 0) + 
                              (previousMeals.secondSnack?.totals?.calories || 0) + 
                              (previousMeals.lunch?.totals?.calories || 0) + 
                              (previousMeals.midAfternoon?.totals?.calories || 0) + 
                              totals.calories;

    // Dirty bulk celebration
    if (userProfile.goal === 'dirty-bulk' && userProfile.firstName) {
      const estimatedTDEE = calorieData?.tdee || (userProfile.weight ? Math.round(userProfile.weight * 15 + 500) : 3000);
      
      if (totalDailyCalories >= estimatedTDEE) {
        return `${userProfile.firstName}, CRUSHING IT! ${Math.round(totalDailyCalories)} calories down - you've smashed your ${estimatedTDEE} target! This is how you build mass!`;
      } else {
        const remaining = estimatedTDEE - Math.round(totalDailyCalories);
        return `${userProfile.firstName}, you're at ${Math.round(totalDailyCalories)} calories for the day. Still need ${remaining} more to hit ${estimatedTDEE} - make this dinner count!`;
      }
    }

    // Late dinner warning for weight loss
    if (['lose', 'lose-fat'].includes(userProfile.goal) && dinnerHour >= 19 && totals.calories > 300 && userProfile.firstName) {
      return `${userProfile.firstName}, that's a ${Math.round(totals.calories)} calorie dinner at ${selectedTime}. Late, heavy dinners can work against your ${userProfile.goal} goals.`;
    }

    // High protein dinner praise
    if (proteinPercent >= 40 && totals.calories >= 200 && userProfile.firstName) {
      return `${userProfile.firstName}, excellent dinner choice! ${proteinPercent}% protein will support overnight recovery and keep you satisfied until morning.`;
    }

    // General dinner guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Great dinner choice, ${userProfile.firstName}! Your ${foodText} at ${selectedTime} provides ${Math.round(totals.calories)} calories to end your day well.`;
      } else {
        return `Perfect dinner selection! Your ${foodText} provides balanced nutrition to fuel recovery and prepare for tomorrow.`;
      }
    }
    
    return null;
  },

  // ========================
  // LATE SNACK MESSAGES
  // ========================
  getLateSnackMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, seriously? Don't be ridiculous with the ${ridiculousItem.food} this late! You'll regret it tomorrow morning!`;
    }

    // Weight loss goal warning
    if (['lose', 'lose-fat'].includes(userProfile.goal) && totals.calories > 200 && userProfile.firstName) {
      return `${userProfile.firstName}, that's a ${Math.round(totals.calories)} calorie late snack! Late eating can slow your ${userProfile.goal} progress. Keep it light and protein-focused.`;
    }

    // Late carb warning
    if (snackHour >= 21 && carbPercent >= 50 && userProfile.firstName) {
      return `${userProfile.firstName}, ${carbPercent}% carbs at ${selectedTime} might interfere with sleep quality. Consider protein and healthy fats instead.`;
    }

    // High protein late snack praise
    if (proteinPercent >= 50 && userProfile.firstName) {
      return `${userProfile.firstName}, smart late-night choice! ${proteinPercent}% protein supports overnight muscle recovery without disrupting sleep.`;
    }

    // General late snack guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Good late snack choice, ${userProfile.firstName}! Your ${foodText} at ${selectedTime} should satisfy late cravings without disrupting tomorrow's goals.`;
      } else {
        return `Smart late snack! Your ${foodText} provides the right fuel for overnight recovery.`;
      }
    }
    
    return null;
  },

  // ========================
  // POST-WORKOUT MESSAGES
  // ========================
  getPostWorkoutMessage: (pieData, selectedTime, foodItems, totals, previousMeals, userProfile, calorieData) => {
    if (totals.calories < 25) return null;

    const workoutHour = parseInt(selectedTime.split(':')[0]);
    const proteinPercent = pieData[0]?.percentage || 0;
    const carbPercent = pieData[1]?.percentage || 0;

    const eggItems = ['eggs (whole)', 'egg whites'];
    const ridiculousItem = foodItems.find(item => 
      item.food && 
      item.serving > 8 && 
      !eggItems.some(eggItem => item.food.toLowerCase().includes(eggItem.toLowerCase()))
    );
    
    // Ridiculous serving check
    if (ridiculousItem && userProfile.firstName) {
      return `${userProfile.firstName}, don't be ridiculous with the ${ridiculousItem.food} post-workout! You need recovery fuel, not a food coma!`;
    }

    // Perfect post-workout macro ratios
    if (proteinPercent >= 40 && carbPercent >= 30 && userProfile.firstName) {
      return `${userProfile.firstName}, PERFECT post-workout fuel! ${proteinPercent}% protein + ${carbPercent}% carbs is exactly what your muscles need for optimal recovery!`;
    }

    // High protein focus
    if (proteinPercent >= 60 && userProfile.firstName) {
      return `${userProfile.firstName}, excellent protein focus post-workout! ${proteinPercent}% protein maximizes muscle protein synthesis during the recovery window.`;
    }

    // High carb focus
    if (carbPercent >= 60 && userProfile.firstName) {
      return `${userProfile.firstName}, carb-heavy post-workout at ${carbPercent}% will replenish glycogen stores fast! Great for intense training days.`;
    }

    // Dirty bulk insufficient calories
    if (userProfile.goal === 'dirty-bulk' && totals.calories < 300 && userProfile.firstName) {
      return `${userProfile.firstName}, only ${Math.round(totals.calories)} calories post-workout? For a dirty bulk, this recovery meal should be MUCH bigger!`;
    }

    // Weight loss excessive calories
    if (['lose', 'lose-fat'].includes(userProfile.goal) && totals.calories > 250 && userProfile.firstName) {
      return `${userProfile.firstName}, ${Math.round(totals.calories)} calories post-workout is getting heavy for your ${userProfile.goal} goals. Focus on lean protein and minimize fats.`;
    }

    // General post-workout guidance
    const allFoods = foodItems.filter(item => item.food).map(item => item.food);
    if (allFoods.length > 0) {
      const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
      
      if (userProfile.firstName) {
        return `Great post-workout choice, ${userProfile.firstName}! Your ${foodText} at ${selectedTime} supports recovery and helps you get the most from your training.`;
      } else {
        return `Solid post-workout nutrition! Your ${foodText} provides the fuel your muscles need for optimal recovery.`;
      }
    }
    
    return null;
  }
};
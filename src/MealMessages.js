// MealMessages.js - All smart coaching and nutrition guidance messages

export const MealMessages = {

  // ========================
  // BREAKFAST MESSAGES - UPDATED WITH 3-PART SYSTEM + SUPPLEMENT CALCULATIONS
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

    // NEW 3-PART PERSONALIZED MESSAGE SYSTEM WITH SUPPLEMENT CALCULATIONS
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
      
      // PART 3: NEW - Smart Supplement Calculations for Low Protein (under 25%)
      message += " ";
      if (proteinPercent < 25) {
        // Calculate optimal supplement to reach 40%+ protein
        const currentProteinGrams = totals.protein;
        const currentCalories = totals.calories;
        
        // Try different supplements to find the best match
        const supplements = [
          { name: 'whey protein scoop', protein: 24, calories: 120, type: 'powder' },
          { name: 'beef jerky (1oz)', protein: 9, calories: 80, type: 'snack' },
          { name: 'Quest protein bar', protein: 20, calories: 190, type: 'bar' },
          { name: 'Greek yogurt cup', protein: 17, calories: 92, type: 'whole food' },
          { name: 'hard-boiled egg', protein: 6, calories: 70, type: 'whole food' }
        ];
        
        let bestSupplement = null;
        let bestMatch = 0;
        
        for (const supplement of supplements) {
          const newTotalProtein = currentProteinGrams + supplement.protein;
          const newTotalCalories = currentCalories + supplement.calories;
          const newProteinPercent = (newTotalProtein * 4 / newTotalCalories) * 100;
          
          // Find the supplement that gets closest to 40-45% protein range
          if (newProteinPercent >= 35 && newProteinPercent <= 50) {
            const targetScore = Math.abs(newProteinPercent - 42); // Aim for 42%
            if (!bestSupplement || targetScore < bestMatch) {
              bestSupplement = supplement;
              bestMatch = targetScore;
            }
          }
        }
        
        if (bestSupplement) {
          const newTotalProtein = Math.round(currentProteinGrams + bestSupplement.protein);
          const newTotalCalories = Math.round(currentCalories + bestSupplement.calories);
          const newProteinPercent = Math.round((newTotalProtein * 4 / newTotalCalories) * 100);
          
          const supplementMessages = [
            `This is where I add in ${bestSupplement.name} to bring you from ${proteinPercent}% to ${newProteinPercent}% protein (${newTotalProtein}g total, ${newTotalCalories} calories).`,
            `Perfect opportunity to add ${bestSupplement.name} - that would boost you to ${newProteinPercent}% protein for the meal (${newTotalProtein}g protein, ${newTotalCalories} total calories).`,
            `I'd throw in ${bestSupplement.name} here to hit ${newProteinPercent}% protein instead of ${proteinPercent}% - takes you to ${newTotalProtein}g protein in ${newTotalCalories} calories.`,
            `Time to add ${bestSupplement.name}! That jumps you from ${proteinPercent}% to ${newProteinPercent}% protein (${newTotalProtein}g in ${newTotalCalories} total calories).`
          ];
          
          message += supplementMessages[Math.floor(Math.random() * supplementMessages.length)];
        } else {
          // Fallback if no supplement calculation works
          const lowProteinAdvice = [
            "Try adding some Greek yogurt or eggs to boost your protein for better satiety.",
            "Consider increasing protein next time - it'll keep you fuller longer and support your goals.",
            "A bit more protein would make this breakfast even more powerful for muscle building.",
            "Next time, try adding a protein source to optimize this meal's staying power."
          ];
          message += lowProteinAdvice[Math.floor(Math.random() * lowProteinAdvice.length)];
        }
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
  // FIRST SNACK MESSAGES - COMPLETE 3-PART SYSTEM
  // ========================
  getFirstSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastPieData, userProfile, calorieData, postWorkoutTotals) => {
    if (totals.calories < 25) return null;
    
    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Good choice on your first snack with ${foodText}! This should help bridge the gap to lunch while keeping your energy steady.`;
      }
      return null;
    }

    // Calculate combined morning totals (breakfast + post-workout if applicable)
    const morningCombinedCalories = breakfastTotals.calories + (postWorkoutTotals?.calories || 0);
    const morningCombinedProtein = breakfastTotals.protein + (postWorkoutTotals?.protein || 0);
    
    // Calculate totals so far including this snack
    const totalCaloriesSoFar = morningCombinedCalories + totals.calories;
    const totalProteinSoFar = morningCombinedProtein + totals.protein;
    
    // Calculate time gaps
    const breakfastHour = parseInt(breakfastTime.split(':')[0]);
    const snackHour = parseInt(selectedTime.split(':')[0]);
    const hoursFromBreakfast = snackHour - breakfastHour;
    
    // Food quality assessment based on protein ratio
    const breakfastProteinRatio = breakfastTotals.protein / (breakfastTotals.protein + breakfastTotals.carbs + breakfastTotals.fat);
    const foodQuality = breakfastProteinRatio >= 0.4 ? 'high' : breakfastProteinRatio >= 0.25 ? 'medium' : 'low';
    
    // Goal-based protein targets
    const proteinTarget = ['gain-muscle', 'dirty-bulk'].includes(userProfile.goal) ? 50 : 30;
    const targetDailyCalories = calorieData?.targetCalories || 2500;
    const targetCaloriesByNow = Math.round(targetDailyCalories * 0.3); // 30% by first snack
    
    let message = "";
    
    // ============ PART 1: ASSESSMENT/PRAISE ============
    if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
      // Crushing it messages
      const crusherMessages = [
        `${userProfile.firstName}, CRUSHING IT! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - you're ahead of schedule!`,
        `Boom, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein and ${Math.round(totalCaloriesSoFar)} calories puts you right on track for ${userProfile.goal} success!`,
        `${userProfile.firstName}, this is textbook nutrition! ${Math.round(totalProteinSoFar)}g protein by snack 1 - most people don't get this much all day!`,
        `Perfect pacing, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein means you understand meal timing!`
      ];
      message += crusherMessages[Math.floor(Math.random() * crusherMessages.length)];
      
    } else if (totalProteinSoFar >= proteinTarget) {
      // Good protein, maybe low calories
      const goodProteinMessages = [
        `${userProfile.firstName}, solid protein at ${Math.round(totalProteinSoFar)}g, but only ${Math.round(totalCaloriesSoFar)} calories so far.`,
        `Nice protein work, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is on point, though calories are a bit light at ${Math.round(totalCaloriesSoFar)}.`,
        `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein shows you get it, but ${Math.round(totalCaloriesSoFar)} calories might not fuel your goals.`
      ];
      message += goodProteinMessages[Math.floor(Math.random() * goodProteinMessages.length)];
      
    } else {
      // Behind on protein
      const behindMessages = [
        `${userProfile.firstName}, only ${Math.round(totalProteinSoFar)}g protein by snack 1 for ${userProfile.goal}? We need to catch up!`,
        `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein isn't cutting it for your goals - bodybuilders need consistent protein every 3-4 hours!`,
        `Time to step it up, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by now puts you behind the curve.`
      ];
      message += behindMessages[Math.floor(Math.random() * behindMessages.length)];
    }

    message += " ";

    // ============ PART 2: SPECIFIC SUPPLEMENT RECOMMENDATIONS ============
    if (totalProteinSoFar < proteinTarget) {
      const proteinNeeded = proteinTarget - totalProteinSoFar;
      
      // Smart supplement selection based on goal and protein gap
      let recommendedSupplements = [];
      
      if (userProfile.goal === 'dirty-bulk') {
        recommendedSupplements = [
          { name: 'peanut butter sandwich', protein: 16, calories: 350, type: 'bulk' },
          { name: 'chocolate milk + protein bar', protein: 25, calories: 320, type: 'bulk' },
          { name: 'trail mix with jerky', protein: 12, calories: 280, type: 'bulk' }
        ];
      } else if (userProfile.goal === 'gain-muscle') {
        recommendedSupplements = [
          { name: 'lean beef jerky (2oz)', protein: 18, calories: 160, type: 'lean' },
          { name: 'Greek yogurt with berries', protein: 20, calories: 150, type: 'lean' },
          { name: 'whey protein with banana', protein: 25, calories: 200, type: 'lean' }
        ];
      } else { // maintain/lose-fat
        recommendedSupplements = [
          { name: 'protein shake', protein: 24, calories: 120, type: 'lean' },
          { name: 'turkey jerky (1oz)', protein: 11, calories: 70, type: 'lean' },
          { name: 'hard-boiled eggs (2)', protein: 12, calories: 140, type: 'lean' }
        ];
      }
      
      // Find best match for protein gap
      let bestSupplement = recommendedSupplements.find(supp => supp.protein >= proteinNeeded) || recommendedSupplements[0];
      
      const newTotalProtein = Math.round(totalProteinSoFar + bestSupplement.protein);
      const newTotalCalories = Math.round(totalCaloriesSoFar + bestSupplement.calories);
      
      const supplementMessages = [
        `Add ${bestSupplement.name} to hit ${newTotalProtein}g protein (${newTotalCalories} total calories) - that's ${userProfile.goal} territory!`,
        `I'd grab ${bestSupplement.name} right now to reach ${newTotalProtein}g protein and ${newTotalCalories} calories for optimal ${userProfile.goal} results.`,
        `Time for ${bestSupplement.name} - brings you to ${newTotalProtein}g protein in ${newTotalCalories} total calories, perfect for your goals.`
      ];
      
      message += supplementMessages[Math.floor(Math.random() * supplementMessages.length)];
      
    } else if (totalCaloriesSoFar < targetCaloriesByNow) {
      // Good protein, need more calories
      const calorieGap = targetCaloriesByNow - totalCaloriesSoFar;
      message += `Protein is solid, but add ${Math.round(calorieGap)} more calories to stay on pace for ${targetDailyCalories} daily.`;
    } else {
      // Everything looks good
      const goodMessages = [
        "Keep this momentum going into lunch - you're setting up for a perfect day!",
        "This pacing will have you hitting your targets perfectly by dinner time.",
        "Exactly the kind of consistent nutrition that separates pros from amateurs!"
      ];
      message += goodMessages[Math.floor(Math.random() * goodMessages.length)];
    }

    message += " ";

    // ============ PART 3: ENERGY/HUNGER STATE ASSESSMENT ============
    if (hoursFromBreakfast >= 4) {
      if (foodQuality === 'high') {
        const highQualityMessages = [
          `4+ hours on high-protein breakfast? That hunger is your body burning fat efficiently - you're doing this right!`,
          `Feeling hungry after quality protein? That's your metabolism working - embrace the fat burn or add lean fuel.`,
          `High-quality breakfast holding you 4+ hours? Perfect! Hunger now means fat oxidation is happening.`
        ];
        message += highQualityMessages[Math.floor(Math.random() * highQualityMessages.length)];
      } else if (foodQuality === 'medium') {
        const mediumQualityMessages = [
          `4 hours since breakfast - moderate protein kept you stable, but you're probably ready to eat now.`,
          `That medium-protein breakfast lasted 4 hours - not bad, but more protein next time for better staying power.`,
          `Feeling the hunger after 4 hours? Your breakfast was decent but could've used more protein for longevity.`
        ];
        message += mediumQualityMessages[Math.floor(Math.random() * mediumQualityMessages.length)];
      } else {
        const lowQualityMessages = [
          `Feeling tired and hungry after that carb-heavy breakfast? This is exactly why protein matters!`,
          `4 hours later feeling like garbage? That low-protein breakfast left you on a blood sugar rollercoaster.`,
          `Tired, hungry, and irritable? Classic signs of poor breakfast choices - learn from this for tomorrow!`
        ];
        message += lowQualityMessages[Math.floor(Math.random() * lowQualityMessages.length)];
      }
    } else {
      // Less than 4 hours
      const shortGapMessages = [
        `Only ${hoursFromBreakfast} hours since breakfast - this snack keeps your metabolism firing consistently.`,
        `Smart timing at ${hoursFromBreakfast} hours - preventing any energy dips before lunch.`,
        `${hoursFromBreakfast}-hour gap is perfect meal timing for sustained energy and muscle protein synthesis.`
      ];
      message += shortGapMessages[Math.floor(Math.random() * shortGapMessages.length)];
    }

    return message;
  },

  // ========================
  // SECOND SNACK MESSAGES - COMPLETE 3-PART SYSTEM
  // ========================
  getSecondSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastFoodItems, firstSnackTime, firstSnackTotals, firstSnackFoodItems, userProfile, calorieData, postWorkoutTotals) => {
    if (totals.calories < 25) return null;

    if (!userProfile.firstName) {
      // Fallback for users without names
      const allFoods = foodItems.filter(item => item.food).map(item => item.food);
      if (allFoods.length > 0) {
        const foodText = allFoods.length === 1 ? allFoods[0] : allFoods.join(', ');
        return `Perfect timing for your second snack with ${foodText}! This will help you cruise into lunch without any energy crashes.`;
      }
      return null;
    }

    const snackHour = parseInt(selectedTime.split(':')[0]);
    const snackMinute = parseInt(selectedTime.split(':')[1]);
    
    // Calculate all totals so far
    const morningCombinedCalories = breakfastTotals.calories + (postWorkoutTotals?.calories || 0);
    const morningCombinedProtein = breakfastTotals.protein + (postWorkoutTotals?.protein || 0);
    
    const totalCaloriesSoFar = morningCombinedCalories + 
                              (firstSnackTotals ? firstSnackTotals.calories : 0) + 
                              totals.calories;
    
    const totalProteinSoFar = morningCombinedProtein + 
                             (firstSnackTotals ? firstSnackTotals.protein : 0) + 
                             totals.protein;

    // Goal-based targets  
    const proteinTarget = ['gain-muscle', 'dirty-bulk'].includes(userProfile.goal) ? 75 : 50; // Higher by second snack
    const targetDailyCalories = calorieData?.targetCalories || 2500;
    const targetCaloriesByNow = Math.round(targetDailyCalories * 0.45); // 45% by second snack
    
    // Time analysis
    const lunchishTime = snackHour >= 12 || (snackHour === 11 && snackMinute >= 30);
    
    let message = "";

    // ============ PART 1: ASSESSMENT/PRAISE ============
    
    // Dirty bulk specific celebration
    if (userProfile.goal === 'dirty-bulk') {
      if (totalCaloriesSoFar >= targetCaloriesByNow) {
        const bulkCelebrationMessages = [
          `${userProfile.firstName}, BEAST MODE! ${Math.round(totalCaloriesSoFar)} calories down - you're building MASS!`,
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein by snack 2? That's how you BULK!`,
          `CRUSHING the bulk, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories - keep this pace and you'll be huge!`
        ];
        message += bulkCelebrationMessages[Math.floor(Math.random() * bulkCelebrationMessages.length)];
      } else {
        const bulkBehindMessages = [
          `${userProfile.firstName}, only ${Math.round(totalCaloriesSoFar)} calories for a dirty bulk? Time to get SERIOUS about eating!`,
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories isn't going to build the mass you want - EAT MORE!`
        ];
        message += bulkBehindMessages[Math.floor(Math.random() * bulkBehindMessages.length)];
      }
    } else {
      // Other goals
      if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
        const excellentMessages = [
          `${userProfile.firstName}, exceptional discipline! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - textbook ${userProfile.goal} nutrition!`,
          `Phenomenal pacing, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by snack 2 puts you in elite territory!`,
          `${userProfile.firstName}, this is how champions eat! ${Math.round(totalCaloriesSoFar)} calories perfectly distributed for ${userProfile.goal} results!`
        ];
        message += excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
      } else if (totalProteinSoFar >= proteinTarget) {
        const goodProteinMessages = [
          `${userProfile.firstName}, protein game is strong at ${Math.round(totalProteinSoFar)}g, but calories are light at ${Math.round(totalCaloriesSoFar)}.`,
          `Solid protein discipline, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is pro-level, just need more total fuel.`
        ];
        message += goodProteinMessages[Math.floor(Math.random() * goodProteinMessages.length)];
      } else {
        const catchUpMessages = [
          `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein by snack 2? For ${userProfile.goal}, we need to accelerate!`,
          `Wake up call, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by now won't cut it for serious results!`
        ];
        message += catchUpMessages[Math.floor(Math.random() * catchUpMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: SPECIFIC SUPPLEMENT RECOMMENDATIONS ============
    
    if (lunchishTime) {
      message += `At ${selectedTime}, this is basically lunch timing - perfect opportunity to make it substantial and hit your remaining macros for the day!`;
    } else if (totalProteinSoFar < proteinTarget) {
      const proteinNeeded = proteinTarget - totalProteinSoFar;
      
      // Goal-specific recommendations for second snack
      let recommendedSupplements = [];
      
      if (userProfile.goal === 'dirty-bulk') {
        recommendedSupplements = [
          { name: 'protein shake + bagel with peanut butter', protein: 35, calories: 520, type: 'bulk' },
          { name: 'double cheeseburger (no bun) + chocolate milk', protein: 30, calories: 450, type: 'bulk' },
          { name: 'protein bar + banana + nuts', protein: 28, calories: 420, type: 'bulk' }
        ];
      } else if (userProfile.goal === 'gain-muscle') {
        recommendedSupplements = [
          { name: 'chicken breast strips (3oz) + rice cakes', protein: 30, calories: 240, type: 'lean' },
          { name: 'tuna packet + crackers', protein: 25, calories: 180, type: 'lean' },
          { name: 'protein smoothie with berries', protein: 28, calories: 220, type: 'lean' }
        ];
      } else { // maintain/lose-fat
        recommendedSupplements = [
          { name: 'protein shake + apple', protein: 26, calories: 200, type: 'lean' },
          { name: 'Greek yogurt (large) + almonds', protein: 22, calories: 180, type: 'lean' },
          { name: 'turkey roll-ups + string cheese', protein: 20, calories: 160, type: 'lean' }
        ];
      }
      
      const bestSupplement = recommendedSupplements.find(supp => supp.protein >= proteinNeeded) || recommendedSupplements[0];
      const newTotalProtein = Math.round(totalProteinSoFar + bestSupplement.protein);
      const newTotalCalories = Math.round(totalCaloriesSoFar + bestSupplement.calories);
      
      const lateSupplementMessages = [
        `Second snack is crucial - grab ${bestSupplement.name} to reach ${newTotalProtein}g protein (${newTotalCalories} total calories)!`,
        `This is your last chance before lunch - ${bestSupplement.name} brings you to ${newTotalProtein}g protein for the morning!`,
        `Critical protein window - add ${bestSupplement.name} for ${newTotalProtein}g protein and ${newTotalCalories} calories before lunch!`
      ];
      
      message += lateSupplementMessages[Math.floor(Math.random() * lateSupplementMessages.length)];
    } else {
      // Protein is good
      const maintenanceMessages = [
        "Protein is dialed in - this snack just needs to bridge you perfectly into a strong lunch!",
        "You're tracking beautifully - maintain this consistency through lunch and you're golden!",
        "This is exactly the kind of precision that transforms physiques over time!"
      ];
      message += maintenanceMessages[Math.floor(Math.random() * maintenanceMessages.length)];
    }

    message += " ";

    // ============ PART 3: ENERGY/HUNGER STATE + PRE-LUNCH PREP ============
    
    const hoursSinceFirstSnack = firstSnackTime ? 
      snackHour - parseInt(firstSnackTime.split(':')[0]) : 
      snackHour - parseInt(breakfastTime.split(':')[0]);
    
    if (lunchishTime) {
      const preLunchMessages = [
        `With lunch approaching, make sure it's substantial - you've been fueling consistently and your body is primed for nutrients!`,
        `Pre-lunch timing is perfect - your metabolism is firing hot from consistent feeding, so lunch will be utilized efficiently!`,
        `This late-morning fuel sets up lunch perfectly - your body is in prime nutrient uptake mode!`
      ];
      message += preLunchMessages[Math.floor(Math.random() * preLunchMessages.length)];
    } else if (hoursSinceFirstSnack >= 2) {
      const consistentFeedingMessages = [
        `${hoursSinceFirstSnack} hours since your last fuel - this consistent feeding keeps your metabolism firing optimally!`,
        `Perfect feeding frequency! Every ${hoursSinceFirstSnack} hours prevents muscle breakdown and maintains energy levels.`,
        `${hoursSinceFirstSnack}-hour gaps are ideal for muscle protein synthesis - you're timing this like a pro!`
      ];
      message += consistentFeedingMessages[Math.floor(Math.random() * consistentFeedingMessages.length)];
    } else {
      const quickRefuelMessages = [
        `Quick refuel after just ${hoursSinceFirstSnack} hour(s) - staying ahead of hunger and energy dips!`,
        `Preemptive nutrition at its finest - never letting your body think it needs to conserve energy!`,
        `This is how you stay anabolic - consistent fuel prevents your body from breaking down muscle!`
      ];
      message += quickRefuelMessages[Math.floor(Math.random() * quickRefuelMessages.length)];
    }

    return message;
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
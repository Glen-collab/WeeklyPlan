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
  // FIRST SNACK MESSAGES - COMPLETE 3-PART SYSTEM WITH FOODATABASE ITEMS
  // ========================
  getFirstSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastPieData, userProfile, calorieData, postWorkoutTotals, postWorkoutTime) => {
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

    // Helper function to convert time to comparable number
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      return hour24 * 60 + minutes;
    };

    // Determine if post-workout should be included (only if it happened before this snack)
    const snackMinutes = timeToMinutes(selectedTime);
    const postWorkoutMinutes = timeToMinutes(postWorkoutTime);
    const shouldIncludePostWorkout = postWorkoutTotals && 
                                   postWorkoutTotals.calories > 0 && 
                                   postWorkoutMinutes < snackMinutes;

    // Calculate combined morning totals (breakfast + post-workout if applicable)
    const morningCombinedCalories = breakfastTotals.calories + (shouldIncludePostWorkout ? postWorkoutTotals.calories : 0);
    const morningCombinedProtein = breakfastTotals.protein + (shouldIncludePostWorkout ? postWorkoutTotals.protein : 0);
    
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
    
    // ============ PART 1: ASSESSMENT/PRAISE WITH MORE VARIETY ============
    if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
      // Crushing it messages - MORE VARIETY
      const crusherMessages = [
        `${userProfile.firstName}, CRUSHING IT! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - you're ahead of schedule!`,
        `Boom, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein and ${Math.round(totalCaloriesSoFar)} calories puts you right on track for ${userProfile.goal} success!`,
        `${userProfile.firstName}, this is textbook nutrition! ${Math.round(totalProteinSoFar)}g protein by snack 1 - most people don't get this much all day!`,
        `Perfect pacing, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein means you understand meal timing!`,
        `${userProfile.firstName}, you're DOMINATING! ${Math.round(totalProteinSoFar)}g protein by first snack - that's pro athlete level discipline!`,
        `Outstanding work, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories perfectly distributed - your metabolism is thanking you!`,
        `${userProfile.firstName}, this is how champions eat! ${Math.round(totalProteinSoFar)}g protein shows you're serious about results!`,
        `Phenomenal start, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories and consistent protein - you're building muscle while others skip meals!`
      ];
      message += crusherMessages[Math.floor(Math.random() * crusherMessages.length)];
      
    } else if (totalProteinSoFar >= proteinTarget) {
      // Good protein, maybe low calories - MORE VARIETY
      const goodProteinMessages = [
        `${userProfile.firstName}, solid protein game at ${Math.round(totalProteinSoFar)}g, but only ${Math.round(totalCaloriesSoFar)} calories so far.`,
        `Nice protein work, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is on point, though calories are a bit light at ${Math.round(totalCaloriesSoFar)}.`,
        `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein shows you get it, but ${Math.round(totalCaloriesSoFar)} calories might not fuel your goals.`,
        `Smart protein focus, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is excellent, just need more total energy at ${Math.round(totalCaloriesSoFar)} calories.`,
        `${userProfile.firstName}, loving the ${Math.round(totalProteinSoFar)}g protein, but ${Math.round(totalCaloriesSoFar)} calories won't support your ${userProfile.goal} goals.`,
        `Protein discipline is solid, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g shows you understand muscle building - just add more fuel.`
      ];
      message += goodProteinMessages[Math.floor(Math.random() * goodProteinMessages.length)];
      
    } else {
      // Behind on protein - MORE URGENT VARIETY
      const behindMessages = [
        `${userProfile.firstName}, only ${Math.round(totalProteinSoFar)}g protein by snack 1 for ${userProfile.goal}? We need to catch up FAST!`,
        `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein isn't cutting it for your goals - bodybuilders need consistent protein every 3-4 hours!`,
        `Time to step it up, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by now puts you behind the curve.`,
        `Wake up call, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by first snack won't build the physique you want!`,
        `${userProfile.firstName}, EMERGENCY! Only ${Math.round(totalProteinSoFar)}g protein so far - your muscles are starving for amino acids!`,
        `Red alert, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by snack 1 means you're losing muscle while others are building it!`
      ];
      message += behindMessages[Math.floor(Math.random() * behindMessages.length)];
    }

    message += " ";

    // ============ PART 2: SMART SUPPLEMENT RECOMMENDATIONS WITH FOODATABASE ITEMS ============
    if (totalProteinSoFar < proteinTarget) {
      const proteinNeeded = proteinTarget - totalProteinSoFar;
      const currentProteinGrams = totalProteinSoFar;
      const currentCalories = totalCaloriesSoFar;
      
      // FOODATABASE-ONLY supplement selection based on goal and protein gap
      let recommendedSupplements = [];
      
      if (userProfile.goal === 'dirty-bulk') {
        recommendedSupplements = [
          { name: 'Peanut Butter (2 tbsp) + Whey Protein', protein: 32, calories: 496, type: 'bulk' }, // PB 16g + Whey 24g
          { name: 'Fairlife Milk + Quest Bar', protein: 33, calories: 300, type: 'bulk' }, // Milk 13g + Quest 20g
          { name: 'Greek Yogurt + Almonds', protein: 23, calories: 256, type: 'bulk' }, // Yogurt 17g + Almonds 6g
          { name: 'Bagel + String Cheese (2)', protein: 21, calories: 385, type: 'bulk' }, // Bagel 9g + Cheese 12g
          { name: 'Whole Milk + Whey Protein', protein: 37, calories: 269, type: 'bulk' } // Assuming whole milk ~13g + Whey 24g
        ];
      } else if (userProfile.goal === 'gain-muscle') {
        recommendedSupplements = [
          { name: 'Chicken Breast (3oz)', protein: 26, calories: 140, type: 'lean' },
          { name: 'Greek Yogurt + Berries', protein: 17, calories: 124, type: 'lean' }, // Yogurt + Strawberries
          { name: 'Turkey Jerky (2oz)', protein: 22, calories: 140, type: 'lean' },
          { name: 'Whey Protein + Banana', protein: 25, calories: 209, type: 'lean' }, // Whey 24g + Banana 1g
          { name: 'Tuna + Rice Cakes (2)', protein: 23, calories: 178, type: 'lean' }, // Tuna 23g + Rice cakes
          { name: 'Hard-Boiled Eggs (2) + Apple', protein: 12, calories: 207, type: 'lean' } // Eggs 12g + Apple
        ];
      } else { // maintain/lose-fat
        recommendedSupplements = [
          { name: 'Whey Protein', protein: 24, calories: 120, type: 'lean' },
          { name: 'Turkey Jerky (1.5oz)', protein: 16, calories: 105, type: 'lean' },
          { name: 'Hard-Boiled Eggs (2)', protein: 12, calories: 140, type: 'lean' },
          { name: 'Greek Yogurt (non-fat)', protein: 17, calories: 92, type: 'lean' },
          { name: 'String Cheese + Turkey Jerky', protein: 17, calories: 140, type: 'lean' }, // Cheese 6g + Jerky 11g
          { name: 'Quest Protein Bar', protein: 20, calories: 190, type: 'lean' }
        ];
      }
      
      // Find best match for protein gap WITH PROTEIN PERCENTAGE CALCULATION
      let bestSupplement = null;
      let bestMatch = Infinity;
      
      for (const supplement of recommendedSupplements) {
        const newTotalProtein = currentProteinGrams + supplement.protein;
        const newTotalCalories = currentCalories + supplement.calories;
        const newProteinPercent = (newTotalProtein * 4 / newTotalCalories) * 100;
        
        // Prioritize getting protein gap filled AND getting to 40-50% protein range
        const proteinGapScore = Math.abs(supplement.protein - proteinNeeded);
        const proteinPercentScore = Math.abs(newProteinPercent - 45); // Target 45%
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
        
        // VARIETY OF SUPPLEMENT RECOMMENDATION MESSAGES WITH PROTEIN PERCENTAGE
        const supplementMessages = [
          `Add ${bestSupplement.name} to hit ${newTotalProtein}g protein and ${newProteinPercent}% protein ratio (${newTotalCalories} total calories) - that's ${userProfile.goal} territory!`,
          `I'd grab ${bestSupplement.name} right now to reach ${newTotalProtein}g protein at ${newProteinPercent}% - ${newTotalCalories} calories for optimal ${userProfile.goal} results.`,
          `Time for ${bestSupplement.name} - brings you to ${newTotalProtein}g protein (${newProteinPercent}% ratio) in ${newTotalCalories} total calories, perfect for your goals.`,
          `Smart move: ${bestSupplement.name} gets you to ${newTotalProtein}g protein at ${newProteinPercent}% - exactly where you need to be at ${newTotalCalories} calories!`,
          `Grab ${bestSupplement.name} and jump to ${newTotalProtein}g protein (${newProteinPercent}% protein) - that's ${newTotalCalories} total calories of pure muscle fuel!`,
          `Perfect supplement: ${bestSupplement.name} takes you to ${newTotalProtein}g protein at ${newProteinPercent}% ratio for ${userProfile.goal} success!`
        ];
        
        message += supplementMessages[Math.floor(Math.random() * supplementMessages.length)];
      }
      
    } else if (totalCaloriesSoFar < targetCaloriesByNow) {
      // Good protein, need more calories - MORE VARIETY
      const calorieGap = targetCaloriesByNow - totalCaloriesSoFar;
      const calorieMessages = [
        `Protein is solid, but add ${Math.round(calorieGap)} more calories to stay on pace for ${targetDailyCalories} daily.`,
        `Great protein work! Just need ${Math.round(calorieGap)} more calories to hit your target pacing.`,
        `Protein is dialed in - add ${Math.round(calorieGap)} calories with healthy carbs or fats for energy.`,
        `Perfect protein ratio! Boost calories by ${Math.round(calorieGap)} to maintain your target pace.`
      ];
      message += calorieMessages[Math.floor(Math.random() * calorieMessages.length)];
    } else {
      // Everything looks good - MORE CELEBRATORY VARIETY
      const goodMessages = [
        "Keep this momentum going into lunch - you're setting up for a perfect day!",
        "This pacing will have you hitting your targets perfectly by dinner time.",
        "Exactly the kind of consistent nutrition that separates pros from amateurs!",
        "This is how you build muscle and burn fat simultaneously - perfect balance!",
        "Your body is in prime anabolic mode - every meal from here is pure gains!",
        "Champion-level nutrition timing - you're maximizing every calorie!"
      ];
      message += goodMessages[Math.floor(Math.random() * goodMessages.length)];
    }

    message += " ";

    // ============ PART 3: ENERGY/HUNGER STATE ASSESSMENT WITH MORE VARIETY ============
    if (hoursFromBreakfast >= 4) {
      if (foodQuality === 'high') {
        const highQualityMessages = [
          `4+ hours on high-protein breakfast? That hunger is your body burning fat efficiently - you're doing this right!`,
          `Feeling hungry after quality protein? That's your metabolism working - embrace the fat burn or add lean fuel.`,
          `High-quality breakfast holding you 4+ hours? Perfect! Hunger now means fat oxidation is happening.`,
          `4+ hours since protein-rich breakfast? That hunger is pure fat burning - your body is a metabolic machine!`,
          `Quality protein breakfast lasting 4+ hours? You're in the fat-burning zone - hunger is your friend right now!`,
          `4+ hours on high-protein fuel? Your body is efficiently using stored fat - this is exactly how it should feel!`
        ];
        message += highQualityMessages[Math.floor(Math.random() * highQualityMessages.length)];
      } else if (foodQuality === 'medium') {
        const mediumQualityMessages = [
          `4 hours since breakfast - moderate protein kept you stable, but you're probably ready to eat now.`,
          `That medium-protein breakfast lasted 4 hours - not bad, but more protein next time for better staying power.`,
          `Feeling the hunger after 4 hours? Your breakfast was decent but could've used more protein for longevity.`,
          `4-hour gap on moderate protein? Decent staying power, but high-protein breakfasts prevent this hunger.`,
          `Medium protein breakfast holding 4 hours? Good, but imagine how much better you'd feel with more protein!`,
          `4 hours later feeling hungry? That moderate protein did okay, but you could do better tomorrow.`
        ];
        message += mediumQualityMessages[Math.floor(Math.random() * mediumQualityMessages.length)];
      } else {
        const lowQualityMessages = [
          `Feeling tired and hungry after that carb-heavy breakfast? This is exactly why protein matters!`,
          `4 hours later feeling like garbage? That low-protein breakfast left you on a blood sugar rollercoaster.`,
          `Tired, hungry, and irritable? Classic signs of poor breakfast choices - learn from this for tomorrow!`,
          `4 hours post-breakfast crash? Low protein + high carbs = energy disaster. Fix this pattern!`,
          `Feeling awful 4 hours later? That carb-loaded breakfast betrayed you - protein prevents this crash!`,
          `Blood sugar rollercoaster hitting hard? This is what happens without adequate breakfast protein!`
        ];
        message += lowQualityMessages[Math.floor(Math.random() * lowQualityMessages.length)];
      }
    } else if (hoursFromBreakfast >= 3) {
      // 3-4 hour gap messages - PERFECT TIMING
      const perfectTimingMessages = [
        `${hoursFromBreakfast} hours since breakfast - perfect meal timing for sustained energy and muscle protein synthesis.`,
        `Excellent ${hoursFromBreakfast}-hour gap - this consistent feeding keeps your metabolism firing optimally!`,
        `${hoursFromBreakfast} hours between meals is textbook nutrition - prevents muscle breakdown and maintains energy.`,
        `Perfect ${hoursFromBreakfast}-hour window - your body is primed for nutrients and ready to build muscle!`,
        `${hoursFromBreakfast} hours apart? Champion-level meal timing - this is how you stay anabolic all day!`,
        `Ideal ${hoursFromBreakfast}-hour gap - you're feeding your body exactly when it needs fuel most!`
      ];
      message += perfectTimingMessages[Math.floor(Math.random() * perfectTimingMessages.length)];
    } else {
      // Less than 3 hours - QUICK REFUEL
      const shortGapMessages = [
        `Only ${hoursFromBreakfast} hours since breakfast - this snack keeps your metabolism firing consistently.`,
        `Smart timing at ${hoursFromBreakfast} hours - preventing any energy dips before lunch.`,
        `${hoursFromBreakfast}-hour gap is perfect meal timing for sustained energy and muscle protein synthesis.`,
        `Quick refuel after ${hoursFromBreakfast} hours - staying ahead of hunger and energy crashes like a pro!`,
        `${hoursFromBreakfast} hours apart? You're preventing your body from ever thinking it needs to conserve energy!`,
        `Early fuel at ${hoursFromBreakfast} hours - this is how you maintain peak performance all morning!`
      ];
      message += shortGapMessages[Math.floor(Math.random() * shortGapMessages.length)];
    }

    return message;
  },

  // ========================
  // SECOND SNACK MESSAGES - COMPLETE 3-PART SYSTEM WITH FOODATABASE ITEMS
  // ========================
  getSecondSnackMessage: (pieData, selectedTime, foodItems, totals, breakfastTime, breakfastTotals, breakfastFoodItems, firstSnackTime, firstSnackTotals, firstSnackFoodItems, userProfile, calorieData, postWorkoutTotals, postWorkoutTime) => {
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
    
    // Helper function to convert time to comparable number
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      return hour24 * 60 + minutes;
    };

    // Determine if post-workout should be included (only if it happened before this snack)
    const snackMinutes = timeToMinutes(selectedTime);
    const postWorkoutMinutes = timeToMinutes(postWorkoutTime);
    const shouldIncludePostWorkout = postWorkoutTotals && 
                                   postWorkoutTotals.calories > 0 && 
                                   postWorkoutMinutes < snackMinutes;
    
    // Calculate all totals so far
    const morningCombinedCalories = breakfastTotals.calories + (shouldIncludePostWorkout ? postWorkoutTotals.calories : 0);
    const morningCombinedProtein = breakfastTotals.protein + (shouldIncludePostWorkout ? postWorkoutTotals.protein : 0);
    
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

    // ============ PART 1: ASSESSMENT/PRAISE WITH MORE VARIETY ============
    
    // Dirty bulk specific celebration - ENHANCED
    if (userProfile.goal === 'dirty-bulk') {
      if (totalCaloriesSoFar >= targetCaloriesByNow) {
        const bulkCelebrationMessages = [
          `${userProfile.firstName}, BEAST MODE ACTIVATED! ${Math.round(totalCaloriesSoFar)} calories down - you're building MASS!`,
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein by snack 2? That's how you BULK!`,
          `CRUSHING the bulk, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories - keep this pace and you'll be huge!`,
          `${userProfile.firstName}, BULK MONSTER! ${Math.round(totalCaloriesSoFar)} calories by second snack - your gains are going to be INSANE!`,
          `MASS BUILDING MACHINE, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories - other people are still eating like birds!`,
          `${userProfile.firstName}, you're a CALORIE CRUSHING BEAST! ${Math.round(totalCaloriesSoFar)} down - size is coming!`
        ];
        message += bulkCelebrationMessages[Math.floor(Math.random() * bulkCelebrationMessages.length)];
      } else {
        const bulkBehindMessages = [
          `${userProfile.firstName}, only ${Math.round(totalCaloriesSoFar)} calories for a dirty bulk? Time to get SERIOUS about eating!`,
          `${userProfile.firstName}, ${Math.round(totalCaloriesSoFar)} calories isn't going to build the mass you want - EAT MORE!`,
          `Wake up, ${userProfile.firstName}! ${Math.round(totalCaloriesSoFar)} calories for dirty bulk? You're bulking like you're cutting!`,
          `${userProfile.firstName}, BULK EMERGENCY! ${Math.round(totalCaloriesSoFar)} calories by snack 2? That's maintenance eating!`
        ];
        message += bulkBehindMessages[Math.floor(Math.random() * bulkBehindMessages.length)];
      }
    } else {
      // Other goals - ENHANCED VARIETY
      if (totalCaloriesSoFar >= targetCaloriesByNow && totalProteinSoFar >= proteinTarget) {
        const excellentMessages = [
          `${userProfile.firstName}, exceptional discipline! ${Math.round(totalCaloriesSoFar)} calories and ${Math.round(totalProteinSoFar)}g protein - textbook ${userProfile.goal} nutrition!`,
          `Phenomenal pacing, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by snack 2 puts you in elite territory!`,
          `${userProfile.firstName}, this is how champions eat! ${Math.round(totalCaloriesSoFar)} calories perfectly distributed for ${userProfile.goal} results!`,
          `MASTERCLASS nutrition, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein and ${Math.round(totalCaloriesSoFar)} calories - you're crushing your goals!`,
          `${userProfile.firstName}, ELITE LEVEL! ${Math.round(totalCaloriesSoFar)} calories with ${Math.round(totalProteinSoFar)}g protein - most people never eat this well!`,
          `Outstanding work, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by second snack - you're in the top 1% of nutrition!`
        ];
        message += excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
      } else if (totalProteinSoFar >= proteinTarget) {
        const goodProteinMessages = [
          `${userProfile.firstName}, protein game is strong at ${Math.round(totalProteinSoFar)}g, but calories are light at ${Math.round(totalCaloriesSoFar)}.`,
          `Solid protein discipline, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is pro-level, just need more total fuel.`,
          `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein shows you understand muscle building - just add energy.`,
          `Great protein consistency, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g is perfect, ${Math.round(totalCaloriesSoFar)} calories needs work.`
        ];
        message += goodProteinMessages[Math.floor(Math.random() * goodProteinMessages.length)];
      } else {
        const catchUpMessages = [
          `${userProfile.firstName}, ${Math.round(totalProteinSoFar)}g protein by snack 2? For ${userProfile.goal}, we need to accelerate!`,
          `Wake up call, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by now won't cut it for serious results!`,
          `${userProfile.firstName}, URGENT! Only ${Math.round(totalProteinSoFar)}g protein by second snack? Your muscles are begging for amino acids!`,
          `Red flag, ${userProfile.firstName}! ${Math.round(totalProteinSoFar)}g protein by snack 2 means you're behind on your ${userProfile.goal} goals!`
        ];
        message += catchUpMessages[Math.floor(Math.random() * catchUpMessages.length)];
      }
    }

    message += " ";

    // ============ PART 2: ENHANCED SUPPLEMENT RECOMMENDATIONS WITH FOODATABASE ITEMS ============
    
    if (lunchishTime) {
      const preLunchMessages = [
        `At ${selectedTime}, this is basically lunch timing - perfect opportunity to make it substantial and hit your remaining macros for the day!`,
        `${selectedTime}? This is lunch territory - go big and crush your macro targets with a solid meal!`,
        `Late-morning timing at ${selectedTime} - treat this like an early lunch and dominate your nutrition goals!`,
        `${selectedTime} is lunch timing - perfect chance to load up with quality nutrients before the afternoon!`
      ];
      message += preLunchMessages[Math.floor(Math.random() * preLunchMessages.length)];
    } else if (totalProteinSoFar < proteinTarget) {
      const proteinNeeded = proteinTarget - totalProteinSoFar;
      const currentProteinGrams = totalProteinSoFar;
      const currentCalories = totalCaloriesSoFar;
      
      // ENHANCED goal-specific recommendations for second snack WITH FOODATABASE ITEMS
      let recommendedSupplements = [];
      
      if (userProfile.goal === 'dirty-bulk') {
        recommendedSupplements = [
          { name: 'Whey Protein + Bagel + Peanut Butter', protein: 41, calories: 708, type: 'bulk' }, // Whey 24g + Bagel 9g + PB 8g
          { name: 'Fairlife Core Power 42g + Banana', protein: 43, calories: 319, type: 'bulk' },
          { name: 'Met-RX Big 100 + Whole Milk', protein: 43, calories: 560, type: 'bulk' }, // Bar 30g + Milk ~13g
          { name: 'Greek Yogurt + Almonds + Honey', protein: 23, calories: 340, type: 'bulk' },
          { name: 'Peanut Butter + White Bread (2 slices)', protein: 24, calories: 516, type: 'bulk' } // PB 16g + Bread 8g
        ];
      } else if (userProfile.goal === 'gain-muscle') {
        recommendedSupplements = [
          { name: 'Chicken Breast (4oz) + Rice Cakes (2)', protein: 35, calories: 235, type: 'lean' },
          { name: 'Tuna + Whole Wheat Bread', protein: 27, calories: 239, type: 'lean' },
          { name: 'Whey Protein + Blueberries', protein: 25, calories: 177, type: 'lean' },
          { name: 'Greek Yogurt + Whey Protein', protein: 41, calories: 212, type: 'lean' },
          { name: 'Turkey Jerky (3oz) + Apple', protein: 33, calories: 262, type: 'lean' }
        ];
      } else { // maintain/lose-fat
        recommendedSupplements = [
          { name: 'Whey Protein + Apple', protein: 24, calories: 172, type: 'lean' },
          { name: 'Greek Yogurt + Cottage Cheese', protein: 28, calories: 190, type: 'lean' },
          { name: 'Turkey Jerky (2oz) + String Cheese', protein: 28, calories: 210, type: 'lean' },
          { name: 'Hard-Boiled Eggs (3) + Cucumber', protein: 18, calories: 226, type: 'lean' },
          { name: 'Quest Bar + Almonds (small)', protein: 26, calories: 354, type: 'lean' }
        ];
      }
      
      // Find best match WITH PROTEIN PERCENTAGE CALCULATION
      let bestSupplement = null;
      let bestMatch = Infinity;
      
      for (const supplement of recommendedSupplements) {
        const newTotalProtein = currentProteinGrams + supplement.protein;
        const newTotalCalories = currentCalories + supplement.calories;
        const newProteinPercent = (newTotalProtein * 4 / newTotalCalories) * 100;
        
        // Prioritize getting protein gap filled AND getting to 40-50% protein range
        const proteinGapScore = Math.abs(supplement.protein - proteinNeeded);
        const proteinPercentScore = Math.abs(newProteinPercent - 45); // Target 45%
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
        
        const lateSupplementMessages = [
          `Second snack is crucial - grab ${bestSupplement.name} to reach ${newTotalProtein}g protein at ${newProteinPercent}% (${newTotalCalories} total calories)!`,
          `This is your last chance before lunch - ${bestSupplement.name} brings you to ${newTotalProtein}g protein and ${newProteinPercent}% for the morning!`,
          `Critical protein window - add ${bestSupplement.name} for ${newTotalProtein}g protein at ${newProteinPercent}% ratio and ${newTotalCalories} calories before lunch!`,
          `Don't waste this opportunity - ${bestSupplement.name} gets you to ${newTotalProtein}g protein (${newProteinPercent}% ratio) and ${newTotalCalories} calories!`,
          `Second snack strategy: ${bestSupplement.name} = ${newTotalProtein}g protein at ${newProteinPercent}% and ${newTotalCalories} calories of pure muscle fuel!`,
          `Last call for morning gains - ${bestSupplement.name} delivers ${newTotalProtein}g protein at ${newProteinPercent}% in ${newTotalCalories} total calories!`
        ];
        
        message += lateSupplementMessages[Math.floor(Math.random() * lateSupplementMessages.length)];
      }
    } else {
      // Protein is good - MORE VARIETY
      const maintenanceMessages = [
        "Protein is dialed in - this snack just needs to bridge you perfectly into a strong lunch!",
        "You're tracking beautifully - maintain this consistency through lunch and you're golden!",
        "This is exactly the kind of precision that transforms physiques over time!",
        "Perfect protein progression - your body is primed for an amazing lunch!",
        "Consistent protein like this is what separates champions from average people!",
        "Your protein timing is textbook - lunch is going to be utilized perfectly!"
      ];
      message += maintenanceMessages[Math.floor(Math.random() * maintenanceMessages.length)];
    }

    message += " ";

    // ============ PART 3: ENHANCED ENERGY/HUNGER STATE + PRE-LUNCH PREP ============
    
    const hoursSinceFirstSnack = firstSnackTime ? 
      snackHour - parseInt(firstSnackTime.split(':')[0]) : 
      snackHour - parseInt(breakfastTime.split(':')[0]);
    
    if (lunchishTime) {
      const preLunchMessages = [
        `With lunch approaching, make sure it's substantial - you've been fueling consistently and your body is primed for nutrients!`,
        `Pre-lunch timing is perfect - your metabolism is firing hot from consistent feeding, so lunch will be utilized efficiently!`,
        `This late-morning fuel sets up lunch perfectly - your body is in prime nutrient uptake mode!`,
        `Lunch window opening - your consistent feeding has your metabolism optimized for maximum nutrient utilization!`,
        `Perfect pre-lunch positioning - your body is metabolically primed to crush whatever you eat next!`,
        `Late-morning timing is ideal - you've trained your metabolism to expect and efficiently process nutrients!`
      ];
      message += preLunchMessages[Math.floor(Math.random() * preLunchMessages.length)];
    } else if (hoursSinceFirstSnack >= 2) {
      const consistentFeedingMessages = [
        `${hoursSinceFirstSnack} hours since your last fuel - this consistent feeding keeps your metabolism firing optimally!`,
        `Perfect feeding frequency! Every ${hoursSinceFirstSnack} hours prevents muscle breakdown and maintains energy levels.`,
        `${hoursSinceFirstSnack}-hour gaps are ideal for muscle protein synthesis - you're timing this like a pro!`,
        `Excellent ${hoursSinceFirstSnack}-hour spacing - your body never has time to think about storing fat or breaking down muscle!`,
        `${hoursSinceFirstSnack} hours between feeds = metabolic perfection - this is how you stay anabolic all day!`,
        `Champion-level timing! ${hoursSinceFirstSnack} hours keeps your body in constant growth and recovery mode!`
      ];
      message += consistentFeedingMessages[Math.floor(Math.random() * consistentFeedingMessages.length)];
    } else {
      const quickRefuelMessages = [
        `Quick refuel after just ${hoursSinceFirstSnack} hour(s) - staying ahead of hunger and energy dips!`,
        `Preemptive nutrition at its finest - never letting your body think it needs to conserve energy!`,
        `This is how you stay anabolic - consistent fuel prevents your body from breaking down muscle!`,
        `Lightning-fast refuel at ${hoursSinceFirstSnack} hours - your body will never experience energy stress!`,
        `Elite-level feeding frequency - ${hoursSinceFirstSnack} hours keeps your metabolism in peak performance mode!`,
        `${hoursSinceFirstSnack}-hour refuel shows you understand advanced nutrition - most people wait until they're starving!`
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
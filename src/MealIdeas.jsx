import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, Apple } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Function to create scaled meals based on target calories, meal type, goal, and BMR
const createScaledMeals = (targetCalories, mealType, fruitBudgetRemaining, goal = 'maintain', bmr = null) => {
  // Calculate meal-specific target calories based on goal
  let mealTarget;
  
  if (goal === 'lose') {
    // Weight loss: Use BMR + 300 for aggressive fat loss instead of TDEE-based target
    const loseTarget = bmr ? (bmr + 300) : Math.round(targetCalories * 0.7); // fallback if no BMR
    if (mealType === 'breakfast') mealTarget = Math.round(loseTarget / 6); // ~17%
    else if (mealType === 'lunch') mealTarget = Math.round(loseTarget / 5); // 20%
    else if (mealType === 'dinner') mealTarget = Math.round(loseTarget / 4); // 25%
  } else if (goal === 'gain-muscle') {
    // Muscle gain: same as maintain but protein-focused
    if (mealType === 'breakfast') mealTarget = Math.round(targetCalories / 5); // 20%
    else if (mealType === 'lunch') mealTarget = Math.round(targetCalories / 4); // 25%
    else if (mealType === 'dinner') mealTarget = Math.round(targetCalories / 3.3); // 30%
  } else if (goal === 'dirty-bulk') {
    // Dirty bulk: large portions
    mealTarget = Math.round(targetCalories / 3); // 33% each meal
  } else {
    // Maintain: balanced
    if (mealType === 'breakfast') mealTarget = Math.round(targetCalories / 5); // 20%
    else if (mealType === 'lunch') mealTarget = Math.round(targetCalories / 4); // 25%
    else if (mealType === 'dinner') mealTarget = Math.round(targetCalories / 3.3); // 30%
  }

  if (mealType === 'breakfast') {
    return createBreakfastMeals(mealTarget, fruitBudgetRemaining, goal);
  } else if (mealType === 'lunch') {
    return createLunchMeals(mealTarget, fruitBudgetRemaining, goal);
  } else if (mealType === 'dinner') {
    return createDinnerMeals(mealTarget, fruitBudgetRemaining, goal);
  }
};

// BREAKFAST MEALS (enhanced for all goals)
const createBreakfastMeals = (targetCalories, fruitBudgetRemaining, goal) => {
  const baseMeals = [];

  // MEAL 1: Eggs & Toast (Universal)
  baseMeals.push({
    id: 1,
    name: goal === 'lose' ? "Light Eggs & Toast" : goal === 'gain-muscle' ? "Protein Eggs & Toast" : goal === 'dirty-bulk' ? "Mega Eggs & Toast" : "Eggs & Toast",
    description: goal === 'lose' ? "Light protein + carbs combo" : goal === 'gain-muscle' ? "High-protein classic combo" : goal === 'dirty-bulk' ? "Maximum fuel eggs & toast" : "Classic protein + carbs combo",
    prepTime: "1 min", itemCount: 2, difficulty: "Super Easy", icon: "🍳",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 200) return 144; // 1 egg + 1 toast
        else if (targetCalories <= 250) return 214; // 2 eggs + 1 toast
        else return 288; // 2 eggs + 2 toast
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 350) return 358; // 3 eggs + 2 toast
        else if (targetCalories <= 450) return 498; // 5 eggs + 2 toast
        else return 642; // 6 eggs + 3 toast
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 642; // 6 eggs + 3 toast
        else if (targetCalories <= 800) return 856; // 8 eggs + 4 toast
        else return 1070; // 10 eggs + 5 toast
      } else {
        // maintain
        if (targetCalories <= 300) return 288;
        else if (targetCalories <= 400) return 358;
        else if (targetCalories <= 500) return 428;
        else if (targetCalories <= 600) return 498;
        else return 642;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let eggs, toast;
      
      if (goal === 'lose') {
        if (targetCalories <= 200) { eggs = 1; toast = 1; }
        else if (targetCalories <= 250) { eggs = 2; toast = 1; }
        else { eggs = 2; toast = 2; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 350) { eggs = 3; toast = 2; }
        else if (targetCalories <= 450) { eggs = 5; toast = 2; }
        else { eggs = 6; toast = 3; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) { eggs = 6; toast = 3; }
        else if (targetCalories <= 800) { eggs = 8; toast = 4; }
        else { eggs = 10; toast = 5; }
      } else {
        // maintain
        if (targetCalories <= 300) { eggs = 2; toast = 2; }
        else if (targetCalories <= 400) { eggs = 3; toast = 2; }
        else if (targetCalories <= 500) { eggs = 4; toast = 2; }
        else if (targetCalories <= 600) { eggs = 5; toast = 2; }
        else { eggs = 6; toast = 3; }
      }
      
      return [
        { id: generateId(), category: 'protein', food: 'Eggs (whole)', serving: eggs, displayServing: eggs.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: toast, displayServing: toast.toString(), displayUnit: 'servings' }
      ];
    })()
  });

  // MEAL 2: Protein Shake & Banana (Universal but adapted)
  baseMeals.push({
    id: 2,
    name: goal === 'lose' ? "Light Protein Shake" : goal === 'gain-muscle' ? "Muscle Protein Shake" : goal === 'dirty-bulk' ? "Mass Gainer Shake" : "Protein Shake & Banana",
    description: goal === 'lose' ? "Quick lean protein boost" : goal === 'gain-muscle' ? "High-protein liquid breakfast" : goal === 'dirty-bulk' ? "Maximum calorie shake" : "Grab and go liquid breakfast",
    prepTime: "30 sec", itemCount: fruitBudgetRemaining > 0 && goal !== 'gain-muscle' ? 2 : (goal === 'dirty-bulk' ? 3 : 2), difficulty: "Super Easy", icon: "🥤",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (fruitBudgetRemaining === 0) {
          if (targetCalories <= 200) return 120; // 1 scoop
          else return 240; // 2 scoops
        } else {
          if (targetCalories <= 200) return 209; // 1 scoop + 1 banana
          else return 329; // 2 scoops + 1 banana
        }
      } else if (goal === 'gain-muscle') {
        // Focus on protein - less fruit
        if (targetCalories <= 350) return 360; // 3 scoops
        else if (targetCalories <= 450) return 480; // 4 scoops
        else return 600; // 5 scoops
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 569; // 4 scoops + 1 banana + PB
        else if (targetCalories <= 800) return 689; // 5 scoops + 1 banana + 2 PB
        else return 809; // 6 scoops + 1 banana + 2 PB
      } else {
        // maintain
        if (fruitBudgetRemaining === 0) {
          if (targetCalories <= 300) return 240;
          else if (targetCalories <= 400) return 360;
          else return 480;
        } else {
          if (targetCalories <= 300) return 209; // 1 scoop + 1 banana
          else if (targetCalories <= 400) return 209; // 1 scoop + 1 banana  
          else if (targetCalories <= 500) return 329; // 2 scoops + 1 banana
          else if (targetCalories <= 600) return 329; // 2 scoops + 1 banana
          else return 449; // 3 scoops + 1 banana
        }
      }
    })(),
    fruitCount: fruitBudgetRemaining > 0 && goal !== 'gain-muscle' ? 1 : 0,
    items: (() => {
      let scoops, bananas, pbServings = 0;
      
      if (goal === 'lose') {
        if (fruitBudgetRemaining === 0) {
          if (targetCalories <= 200) { scoops = 1; bananas = 0; }
          else { scoops = 2; bananas = 0; }
        } else {
          if (targetCalories <= 200) { scoops = 1; bananas = 1; }
          else { scoops = 2; bananas = 1; }
        }
      } else if (goal === 'gain-muscle') {
        // All protein focus
        if (targetCalories <= 350) { scoops = 3; bananas = 0; }
        else if (targetCalories <= 450) { scoops = 4; bananas = 0; }
        else { scoops = 5; bananas = 0; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) { scoops = 4; bananas = 1; pbServings = 1; }
        else if (targetCalories <= 800) { scoops = 5; bananas = 1; pbServings = 2; }
        else { scoops = 6; bananas = 1; pbServings = 2; }
      } else {
        // maintain (existing logic)
        if (fruitBudgetRemaining === 0) {
          if (targetCalories <= 300) { scoops = 2; bananas = 0; }
          else if (targetCalories <= 400) { scoops = 3; bananas = 0; }
          else { scoops = 4; bananas = 0; }
        } else {
          if (targetCalories <= 300) { scoops = 1; bananas = 1; }
          else if (targetCalories <= 400) { scoops = 1; bananas = 1; }
          else if (targetCalories <= 500) { scoops = 2; bananas = 1; }
          else if (targetCalories <= 600) { scoops = 2; bananas = 1; }
          else { scoops = 3; bananas = 1; }
        }
      }
      
      const items = [
        { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: scoops, displayServing: scoops.toString(), displayUnit: 'servings' }
      ];
      
      if (bananas > 0) {
        items.push({ id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' });
      }
      
      if (pbServings > 0) {
        items.push({ id: generateId(), category: 'fat', food: 'Peanut Butter', serving: pbServings, displayServing: pbServings.toString(), displayUnit: 'servings' });
      }
      
      return items;
    })()
  });

  // MEAL 3: Greek Yogurt Bowl (adapted for goals)
  baseMeals.push({
    id: 3,
    name: goal === 'lose' ? "Light Yogurt Bowl" : goal === 'gain-muscle' ? "Protein Yogurt Bowl" : goal === 'dirty-bulk' ? "Massive Yogurt Bowl" : "Yogurt Banana Bowl",
    description: goal === 'lose' ? "Light protein with minimal carbs" : goal === 'gain-muscle' ? "High-protein creamy breakfast" : goal === 'dirty-bulk' ? "Calorie-dense yogurt feast" : "Creamy protein with natural sugars",
    prepTime: "2 min", itemCount: goal === 'dirty-bulk' ? 4 : 3, difficulty: "Easy", icon: "🥣",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 200) return 163; // 1 cup yogurt + 0.25 almonds
        else return 213; // 1 cup yogurt + 0.5 almonds
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 350) return 343; // 1.5 cups yogurt + 1 almonds
        else if (targetCalories <= 450) return 425; // 2 cups yogurt + 1 almonds
        else return 589; // 2 cups yogurt + 2 almonds
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 578; // 2 cups yogurt + 2 almonds + 1 PB
        else if (targetCalories <= 800) return 766; // 3 cups yogurt + 2 almonds + 1 PB
        else return 954; // 4 cups yogurt + 2 almonds + 1 PB
      } else {
        // maintain (existing logic)
        if (fruitBudgetRemaining === 0) {
          if (targetCalories <= 300) return 302;
          else if (targetCalories <= 400) return 384;
          else return 466;
        } else {
          if (targetCalories <= 300) return 308; // 1 cup yogurt + 1 banana + 0.5 almonds
          else if (targetCalories <= 400) return 383; // 1 cup yogurt + 1 banana + 1 almonds
          else if (targetCalories <= 500) return 448; // 1.5 cups yogurt + 1 banana + 1 almonds
          else if (targetCalories <= 600) return 513; // 1.5 cups yogurt + 1 banana + 1.5 almonds
          else return 508; // 2 cups yogurt + 1 banana + 1 almonds
        }
      }
    })(),
    fruitCount: fruitBudgetRemaining > 0 && goal !== 'gain-muscle' && goal !== 'lose' ? 1 : 0,
    items: (() => {
      if (goal === 'lose') {
        let cups, almonds;
        if (targetCalories <= 200) { cups = 1; almonds = 0.25; }
        else { cups = 1; almonds = 0.5; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' }
        ];
      } else if (goal === 'gain-muscle') {
        let cups, almonds;
        if (targetCalories <= 350) { cups = 1.5; almonds = 1; }
        else if (targetCalories <= 450) { cups = 2; almonds = 1; }
        else { cups = 2; almonds = 2; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' }
        ];
      } else if (goal === 'dirty-bulk') {
        let cups, almonds, pbServings;
        if (targetCalories <= 600) { cups = 2; almonds = 2; pbServings = 1; }
        else if (targetCalories <= 800) { cups = 3; almonds = 2; pbServings = 1; }
        else { cups = 4; almonds = 2; pbServings = 1; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: pbServings, displayServing: pbServings.toString(), displayUnit: 'servings' }
        ];
      } else {
        // maintain (existing logic)
        if (fruitBudgetRemaining === 0) {
          let cups, almonds, bread;
          if (targetCalories <= 300) { cups = 1; almonds = 0.5; bread = 1; }
          else if (targetCalories <= 400) { cups = 1; almonds = 1; bread = 1; }
          else { cups = 1.5; almonds = 1; bread = 1; }
          
          return [
            { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
            { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' },
            { id: generateId(), category: 'carbohydrate', food: 'Ezekiel Bread', serving: bread, displayServing: bread.toString(), displayUnit: 'servings' }
          ];
        } else {
          let cups, bananas, almondOz;
          if (targetCalories <= 300) { cups = 1; bananas = 1; almondOz = 0.5; }
          else if (targetCalories <= 400) { cups = 1; bananas = 1; almondOz = 1; }
          else if (targetCalories <= 500) { cups = 1.5; bananas = 1; almondOz = 1; }
          else if (targetCalories <= 600) { cups = 1.5; bananas = 1; almondOz = 1.5; }
          else { cups = 2; bananas = 1; almondOz = 1; }
          
          return [
            { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
            { id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' },
            { id: generateId(), category: 'fat', food: 'Almonds', serving: almondOz, displayServing: almondOz.toString(), displayUnit: 'servings' }
          ];
        }
      }
    })()
  });

  // MEAL 4: Egg Whites Special (Muscle Gain Focus)
  if (goal === 'gain-muscle') {
    baseMeals.push({
      id: 4,
      name: "Egg White Power Bowl",
      description: "Maximum protein, minimal fat",
      prepTime: "3 min", itemCount: 3, difficulty: "Easy", icon: "🥚",
      estimatedCalories: (() => {
        if (targetCalories <= 350) return 334; // 12 whites + 1 toast + 0.5 avocado
        else if (targetCalories <= 450) return 385; // 15 whites + 1 toast + 0.5 avocado
        else return 436; // 18 whites + 1 toast + 0.5 avocado
      })(),
      fruitCount: 0,
      items: (() => {
        let whites, toast, avocado;
        if (targetCalories <= 350) { whites = 12; toast = 1; avocado = 0.5; }
        else if (targetCalories <= 450) { whites = 15; toast = 1; avocado = 0.5; }
        else { whites = 18; toast = 1; avocado = 0.5; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Egg Whites', serving: whites, displayServing: whites.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'carbohydrate', food: 'Ezekiel Bread', serving: toast, displayServing: toast.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Avocado', serving: avocado, displayServing: avocado.toString(), displayUnit: 'servings' }
        ];
      })()
    });
  }

  // MEAL 5: Power Oat Bowl (existing, but adapted)
  baseMeals.push({
    id: goal === 'gain-muscle' ? 5 : 4,
    name: goal === 'lose' ? "Light Oat Bowl" : goal === 'gain-muscle' ? "Muscle Oat Bowl" : goal === 'dirty-bulk' ? "Mega Oat Bowl" : "Power Oat Bowl",
    description: goal === 'lose' ? "Balanced light breakfast" : goal === 'gain-muscle' ? "High-protein oat bowl" : goal === 'dirty-bulk' ? "Maximum calorie oat feast" : "Complete macro-balanced breakfast",
    prepTime: "4 min", itemCount: goal === 'dirty-bulk' ? 5 : 4, difficulty: "Moderate", icon: "💪",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 200) return 187; // small portions
        else return 245; // slightly bigger
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 350) return 345; // high protein
        else if (targetCalories <= 450) return 465; // more protein
        else return 585; // max protein
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 527; // reduced from 3 bananas to 1
        else if (targetCalories <= 800) return 715; // reduced from 3 bananas to 1, added PB
        else return 873; // reduced from 4 bananas to 1, added almonds
      } else {
        // maintain (existing)
        if (targetCalories <= 300) return 298;
        else if (targetCalories <= 400) return 433;
        else if (targetCalories <= 500) return 527;
        else if (targetCalories <= 600) return 602;
        else return 677;
      }
    })(),
    fruitCount: goal === 'gain-muscle' ? 0 : 1,
    items: (() => {
      let oatCups, scoops, bananas, pbTbsp, almonds = 0;
      
      if (goal === 'lose') {
        if (targetCalories <= 200) { oatCups = 0.25; scoops = 0.25; bananas = 1; pbTbsp = 0.5; }
        else { oatCups = 0.25; scoops = 0.5; bananas = 1; pbTbsp = 0.5; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 350) { oatCups = 0.25; scoops = 1.5; bananas = 0; pbTbsp = 1; }
        else if (targetCalories <= 450) { oatCups = 0.5; scoops = 2; bananas = 0; pbTbsp = 1; }
        else { oatCups = 0.75; scoops = 2.5; bananas = 0; pbTbsp = 1; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) { oatCups = 0.75; scoops = 1.5; bananas = 1; pbTbsp = 2; almonds = 1; }
        else if (targetCalories <= 800) { oatCups = 1; scoops = 2; bananas = 1; pbTbsp = 3; almonds = 1; }
        else { oatCups = 1.25; scoops = 2.5; bananas = 1; pbTbsp = 3; almonds = 1.5; }
      } else {
        // maintain (existing logic)
        if (targetCalories <= 300) { oatCups = 0.25; scoops = 0.5; bananas = 1; pbTbsp = 1; }
        else if (targetCalories <= 400) { oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 1; }
        else if (targetCalories <= 500) { oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 2; }
        else if (targetCalories <= 600) { oatCups = 0.75; scoops = 1; bananas = 1; pbTbsp = 2; }
        else { oatCups = 1; scoops = 1; bananas = 1; pbTbsp = 2; }
      }
      
      const items = [
        { id: generateId(), category: 'carbohydrate', food: 'Oats (dry)', serving: oatCups * 2, displayServing: oatCups.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: scoops, displayServing: scoops.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: pbTbsp / 2, displayServing: pbTbsp.toString(), displayUnit: 'tbsp' }
      ];
      
      if (bananas > 0) {
        items.push({ id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' });
      }
      
      if (almonds > 0) {
        items.push({ id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' });
      }
      
      return items;
    })()
  });

  return baseMeals;
};

// LUNCH MEALS (enhanced for all goals)
const createLunchMeals = (targetCalories, fruitBudgetRemaining, goal) => {
  const baseMeals = [];

  // MEAL 1: Chicken & Rice Bowl (Universal)
  baseMeals.push({
    id: 1,
    name: goal === 'lose' ? "Light Chicken & Rice" : goal === 'gain-muscle' ? "Protein Chicken & Rice" : goal === 'dirty-bulk' ? "Massive Chicken & Rice" : "Chicken & Rice Bowl",
    description: goal === 'lose' ? "Lean protein + controlled carbs" : goal === 'gain-muscle' ? "High-protein classic combo" : goal === 'dirty-bulk' ? "Maximum fuel chicken & rice" : "Classic lean protein + carbs",
    prepTime: "5 min", itemCount: 2, difficulty: "Super Easy", icon: "🍗",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 240) return 221; // 80g chicken + 0.5 cups rice
        else if (targetCalories <= 300) return 277; // 100g chicken + 0.5 cups rice
        else return 333; // 120g chicken + 1 cup rice
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 400) return 413; // 200g chicken + 1 cup rice
        else if (targetCalories <= 500) return 525; // 250g chicken + 1.5 cups rice
        else return 637; // 300g chicken + 2 cups rice
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 692; // 300g chicken + 2.5 cups rice
        else if (targetCalories <= 800) return 804; // 350g chicken + 3 cups rice
        else return 916; // 400g chicken + 3.5 cups rice
      } else {
        // maintain
        if (targetCalories <= 400) return 380;
        else if (targetCalories <= 500) return 465;
        else if (targetCalories <= 600) return 550;
        else return 650;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let chicken, rice;
      
      if (goal === 'lose') {
        if (targetCalories <= 240) { chicken = 80; rice = 0.5; }
        else if (targetCalories <= 300) { chicken = 100; rice = 0.5; }
        else { chicken = 120; rice = 1; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 400) { chicken = 200; rice = 1; }
        else if (targetCalories <= 500) { chicken = 250; rice = 1.5; }
        else { chicken = 300; rice = 2; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) { chicken = 300; rice = 2.5; }
        else if (targetCalories <= 800) { chicken = 350; rice = 3; }
        else { chicken = 400; rice = 3.5; }
      } else {
        // maintain (existing)
        if (targetCalories <= 400) { chicken = 120; rice = 1; }
        else if (targetCalories <= 500) { chicken = 150; rice = 1.5; }
        else if (targetCalories <= 600) { chicken = 180; rice = 2; }
        else { chicken = 220; rice = 2.5; }
      }
      
      return [
        { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: chicken/100, displayServing: chicken.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Brown Rice (cooked)', serving: rice, displayServing: rice.toString(), displayUnit: 'cups' }
      ];
    })()
  });

  // MEAL 2: Tuna Power (adapted for goals)
  baseMeals.push({
    id: 2,
    name: goal === 'lose' ? "Light Tuna Meal" : goal === 'gain-muscle' ? "High-Protein Tuna" : goal === 'dirty-bulk' ? "Mega Tuna Bowl" : "Tuna & Apple",
    description: goal === 'lose' ? "Light protein + minimal carbs" : goal === 'gain-muscle' ? "Maximum protein tuna meal" : goal === 'dirty-bulk' ? "High-calorie tuna feast" : "Quick protein + refreshing fruit",
    prepTime: "2 min", itemCount: goal === 'dirty-bulk' ? 3 : 2, difficulty: "Super Easy", icon: "🐟",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 240) return 108; // 1 tuna
        else if (targetCalories <= 300) return 216; // 2 tuna
        else return 324; // 3 tuna
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 400) return 432; // 4 tuna
        else if (targetCalories <= 500) return 540; // 5 tuna
        else return 648; // 6 tuna
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 620; // 4 tuna + 2 bread + PB
        else if (targetCalories <= 800) return 808; // 6 tuna + 3 bread + PB
        else return 996; // 8 tuna + 4 bread + PB
      } else {
        // maintain (existing logic)
        if (targetCalories <= 400) return 268;
        else if (targetCalories <= 500) return 376;
        else if (targetCalories <= 600) return 484;
        else return 592;
      }
    })(),
    fruitCount: fruitBudgetRemaining > 0 && goal !== 'gain-muscle' && goal !== 'lose' ? 1 : 0,
    items: (() => {
      if (goal === 'lose') {
        let tuna;
        if (targetCalories <= 240) { tuna = 1; }
        else if (targetCalories <= 300) { tuna = 2; }
        else { tuna = 3; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' }
        ];
      } else if (goal === 'gain-muscle') {
        let tuna;
        if (targetCalories <= 400) { tuna = 4; }
        else if (targetCalories <= 500) { tuna = 5; }
        else { tuna = 6; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' }
        ];
      } else if (goal === 'dirty-bulk') {
        let tuna, bread, pbServings;
        if (targetCalories <= 600) { tuna = 4; bread = 2; pbServings = 1; }
        else if (targetCalories <= 800) { tuna = 6; bread = 3; pbServings = 1; }
        else { tuna = 8; bread = 4; pbServings = 1; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: bread, displayServing: bread.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: pbServings, displayServing: pbServings.toString(), displayUnit: 'servings' }
        ];
      } else {
        // maintain (existing logic)
        if (fruitBudgetRemaining === 0) {
          let tuna, bread;
          if (targetCalories <= 400) { tuna = 2; bread = 2; }
          else if (targetCalories <= 500) { tuna = 3; bread = 2; }
          else { tuna = 4; bread = 2; }
          
          return [
            { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' },
            { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: bread, displayServing: bread.toString(), displayUnit: 'servings' }
          ];
        } else {
          let tuna, apples;
          if (targetCalories <= 400) { tuna = 2; apples = 1; }
          else if (targetCalories <= 500) { tuna = 3; apples = 1; }
          else if (targetCalories <= 600) { tuna = 4; apples = 1; }
          else { tuna = 5; apples = 1; }
          
          return [
            { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' },
            { id: generateId(), category: 'fruits', food: 'Apple', serving: apples, displayServing: apples.toString(), displayUnit: 'servings' }
          ];
        }
      }
    })()
  });

  // Add more lunch meals following the same pattern...
  // I'll add 2-3 more key lunch meals

  // MEAL 3: Salmon Power Bowl (adapted)
  baseMeals.push({
    id: 3,
    name: goal === 'lose' ? "Light Salmon Bowl" : goal === 'gain-muscle' ? "Protein Salmon Bowl" : goal === 'dirty-bulk' ? "Mega Salmon Feast" : "Salmon Quinoa Salad",
    description: goal === 'lose' ? "Omega-3 + light carbs" : goal === 'gain-muscle' ? "High-protein omega-3 rich" : goal === 'dirty-bulk' ? "Maximum calorie salmon feast" : "Omega-3 rich + complete protein grain",
    prepTime: "6 min", itemCount: 3, difficulty: "Easy", icon: "🐠",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 240) return 234; // 60g salmon + 0.5 quinoa + 1 spinach
        else if (targetCalories <= 300) return 294; // 80g salmon + 0.5 quinoa + 1 spinach
        else return 354; // 100g salmon + 1 quinoa + 1 spinach
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 400) return 437; // 160g salmon + 1 quinoa + 2 spinach
        else if (targetCalories <= 500) return 541; // 200g salmon + 1.5 quinoa + 2 spinach
        else return 645; // 240g salmon + 2 quinoa + 2 spinach
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) return 622; // 200g salmon + 2 quinoa + 2 spinach + oil
        else if (targetCalories <= 800) return 826; // 280g salmon + 3 quinoa + 2 spinach + oil
        else return 1030; // 360g salmon + 4 quinoa + 2 spinach + oil
      } else {
        // maintain (existing)
        if (targetCalories <= 400) return 388;
        else if (targetCalories <= 500) return 508;
        else if (targetCalories <= 600) return 628;
        else return 748;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let salmon, quinoa, spinach, oil = 0;
      
      if (goal === 'lose') {
        if (targetCalories <= 240) { salmon = 60; quinoa = 0.5; spinach = 1; }
        else if (targetCalories <= 300) { salmon = 80; quinoa = 0.5; spinach = 1; }
        else { salmon = 100; quinoa = 1; spinach = 1; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 400) { salmon = 160; quinoa = 1; spinach = 2; }
        else if (targetCalories <= 500) { salmon = 200; quinoa = 1.5; spinach = 2; }
        else { salmon = 240; quinoa = 2; spinach = 2; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 600) { salmon = 200; quinoa = 2; spinach = 2; oil = 1; }
        else if (targetCalories <= 800) { salmon = 280; quinoa = 3; spinach = 2; oil = 1; }
        else { salmon = 360; quinoa = 4; spinach = 2; oil = 1; }
      } else {
        // maintain (existing)
        if (targetCalories <= 400) { salmon = 80; quinoa = 1; spinach = 2; }
        else if (targetCalories <= 500) { salmon = 120; quinoa = 1.5; spinach = 2; }
        else if (targetCalories <= 600) { salmon = 160; quinoa = 2; spinach = 2; }
        else { salmon = 200; quinoa = 2.5; spinach = 2; }
      }
      
      const items = [
        { id: generateId(), category: 'protein', food: 'Salmon', serving: salmon/85, displayServing: salmon.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Quinoa (cooked)', serving: quinoa, displayServing: quinoa.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'vegetables', food: 'Spinach', serving: spinach, displayServing: spinach.toString(), displayUnit: 'cups' }
      ];
      
      if (oil > 0) {
        items.push({ id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' });
      }
      
      return items;
    })()
  });

  return baseMeals;
};

// DINNER MEALS (enhanced for all goals)
const createDinnerMeals = (targetCalories, fruitBudgetRemaining, goal) => {
  const baseMeals = [];

  // MEAL 1: Steak & Potato (Universal)
  baseMeals.push({
    id: 1,
    name: goal === 'lose' ? "Light Steak & Potato" : goal === 'gain-muscle' ? "Protein Steak & Potato" : goal === 'dirty-bulk' ? "Mega Steak & Potato" : "Steak & Potato",
    description: goal === 'lose' ? "Lean protein + controlled carbs" : goal === 'gain-muscle' ? "High-protein hearty dinner" : goal === 'dirty-bulk' ? "Maximum fuel steak dinner" : "Classic hearty dinner combo",
    prepTime: "10 min", itemCount: 2, difficulty: "Easy", icon: "🥩",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 300) return 298; // 80g beef + 0.5 potato
        else if (targetCalories <= 375) return 337; // 100g beef + 1 potato
        else return 420; // 120g beef + 1.5 potato
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) return 528; // 200g beef + 1.5 potato
        else if (targetCalories <= 600) return 650; // 250g beef + 2 potato
        else return 772; // 300g beef + 2.5 potato
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) return 894; // 350g beef + 3 potato
        else if (targetCalories <= 900) return 1055; // 450g beef + 3.5 potato
        else return 1216; // 550g beef + 4 potato
      } else {
        // maintain (existing)
        if (targetCalories <= 500) return 487;
        else if (targetCalories <= 600) return 609;
        else if (targetCalories <= 700) return 731;
        else return 853;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let beef, potato;
      
      if (goal === 'lose') {
        if (targetCalories <= 300) { beef = 80; potato = 0.5; }
        else if (targetCalories <= 375) { beef = 100; potato = 1; }
        else { beef = 120; potato = 1.5; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) { beef = 200; potato = 1.5; }
        else if (targetCalories <= 600) { beef = 250; potato = 2; }
        else { beef = 300; potato = 2.5; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) { beef = 350; potato = 3; }
        else if (targetCalories <= 900) { beef = 450; potato = 3.5; }
        else { beef = 550; potato = 4; }
      } else {
        // maintain (existing)
        if (targetCalories <= 500) { beef = 150; potato = 1; }
        else if (targetCalories <= 600) { beef = 200; potato = 1.5; }
        else if (targetCalories <= 700) { beef = 250; potato = 2; }
        else { beef = 300; potato = 2.5; }
      }
      
      return [
        { id: generateId(), category: 'protein', food: 'Lean Beef (90/10)', serving: beef/85, displayServing: beef.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Potato (baked)', serving: potato, displayServing: potato.toString(), displayUnit: 'servings' }
      ];
    })()
  });

  // MEAL 2: Salmon & Sweet Potato (adapted)
  baseMeals.push({
    id: 2,
    name: goal === 'lose' ? "Light Salmon Dinner" : goal === 'gain-muscle' ? "Protein Salmon Dinner" : goal === 'dirty-bulk' ? "Mega Salmon Dinner" : "Salmon & Sweet Potato",
    description: goal === 'lose' ? "Omega-3 + light complex carbs" : goal === 'gain-muscle' ? "High-protein omega-3 dinner" : goal === 'dirty-bulk' ? "Maximum calorie salmon feast" : "Omega-3 rich + complex carbs",
    prepTime: "12 min", itemCount: 2, difficulty: "Easy", icon: "🐟",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 300) return 294; // 80g salmon + 2.5 sweet potato
        else if (targetCalories <= 375) return 346; // 120g salmon + 2 sweet potato
        else return 398; // 160g salmon + 2.5 sweet potato
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) return 512; // 200g salmon + 3.5 sweet potato
        else if (targetCalories <= 600) return 616; // 240g salmon + 4.5 sweet potato
        else return 720; // 280g salmon + 5.5 sweet potato
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) return 778; // 280g salmon + 6 sweet potato
        else if (targetCalories <= 900) return 986; // 360g salmon + 8 sweet potato
        else return 1194; // 440g salmon + 10 sweet potato
      } else {
        // maintain (existing)
        if (targetCalories <= 500) return 466;
        else if (targetCalories <= 600) return 570;
        else if (targetCalories <= 700) return 674;
        else return 778;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let salmon, sweetPotato;
      
      if (goal === 'lose') {
        if (targetCalories <= 300) { salmon = 80; sweetPotato = 2.5; }
        else if (targetCalories <= 375) { salmon = 120; sweetPotato = 2; }
        else { salmon = 160; sweetPotato = 2.5; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) { salmon = 200; sweetPotato = 3.5; }
        else if (targetCalories <= 600) { salmon = 240; sweetPotato = 4.5; }
        else { salmon = 280; sweetPotato = 5.5; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) { salmon = 280; sweetPotato = 6; }
        else if (targetCalories <= 900) { salmon = 360; sweetPotato = 8; }
        else { salmon = 440; sweetPotato = 10; }
      } else {
        // maintain (existing)
        if (targetCalories <= 500) { salmon = 120; sweetPotato = 3; }
        else if (targetCalories <= 600) { salmon = 160; sweetPotato = 4; }
        else if (targetCalories <= 700) { salmon = 200; sweetPotato = 5; }
        else { salmon = 240; sweetPotato = 6; }
      }
      
      return [
        { id: generateId(), category: 'protein', food: 'Salmon', serving: salmon/85, displayServing: salmon.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: sweetPotato, displayServing: sweetPotato.toString(), displayUnit: 'servings' }
      ];
    })()
  });

  // MEAL 3: Chicken Stir-Fry (adapted)
  baseMeals.push({
    id: 3,
    name: goal === 'lose' ? "Light Chicken Stir-Fry" : goal === 'gain-muscle' ? "Protein Chicken Stir-Fry" : goal === 'dirty-bulk' ? "Mega Chicken Stir-Fry" : "Chicken Veggie Stir-Fry",
    description: goal === 'lose' ? "Lean protein + vegetables" : goal === 'gain-muscle' ? "High-protein + healthy fats" : goal === 'dirty-bulk' ? "Maximum calorie stir-fry" : "Lean protein + vegetables + healthy fats",
    prepTime: "8 min", itemCount: 3, difficulty: "Easy", icon: "🥘",
    estimatedCalories: (() => {
      if (goal === 'lose') {
        if (targetCalories <= 300) return 272; // 100g chicken + 2 peppers + 0.5 oil
        else if (targetCalories <= 375) return 327; // 150g chicken + 2 peppers + 0.5 oil
        else return 389; // 180g chicken + 2 peppers + 0.5 oil
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) return 506; // 250g chicken + 2 peppers + 1 oil
        else if (targetCalories <= 600) return 625; // 300g chicken + 2 peppers + 1.5 oil
        else return 744; // 350g chicken + 2 peppers + 2 oil
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) return 863; // 400g chicken + 3 peppers + 2.5 oil
        else if (targetCalories <= 900) return 1101; // 500g chicken + 3 peppers + 3.5 oil
        else return 1339; // 600g chicken + 3 peppers + 4.5 oil
      } else {
        // maintain (existing)
        if (targetCalories <= 500) return 505;
        else if (targetCalories <= 600) return 625;
        else if (targetCalories <= 700) return 745;
        else return 865;
      }
    })(),
    fruitCount: 0,
    items: (() => {
      let chicken, peppers, oil;
      
      if (goal === 'lose') {
        if (targetCalories <= 300) { chicken = 100; peppers = 2; oil = 0.5; }
        else if (targetCalories <= 375) { chicken = 150; peppers = 2; oil = 0.5; }
        else { chicken = 180; peppers = 2; oil = 0.5; }
      } else if (goal === 'gain-muscle') {
        if (targetCalories <= 500) { chicken = 250; peppers = 2; oil = 1; }
        else if (targetCalories <= 600) { chicken = 300; peppers = 2; oil = 1.5; }
        else { chicken = 350; peppers = 2; oil = 2; }
      } else if (goal === 'dirty-bulk') {
        if (targetCalories <= 700) { chicken = 400; peppers = 3; oil = 2.5; }
        else if (targetCalories <= 900) { chicken = 500; peppers = 3; oil = 3.5; }
        else { chicken = 600; peppers = 3; oil = 4.5; }
      } else {
        // maintain (existing)
        if (targetCalories <= 500) { chicken = 180; peppers = 2; oil = 1; }
        else if (targetCalories <= 600) { chicken = 220; peppers = 2; oil = 1.5; }
        else if (targetCalories <= 700) { chicken = 260; peppers = 2; oil = 2; }
        else { chicken = 300; peppers = 2; oil = 2.5; }
      }
      
      return [
        { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: chicken/100, displayServing: chicken.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'vegetables', food: 'Bell Peppers', serving: peppers, displayServing: peppers.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' }
      ];
    })()
  });

  return baseMeals;
};

const MealIdeasModal = ({
  isOpen,
  onClose,
  onAddMeal,
  userProfile,
  calorieData,
  isMobile,
  mealType = 'breakfast', // 'breakfast', 'lunch', 'dinner'
  fruitBudgetRemaining = 3 // Track remaining fruit servings
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate target calories for the specific meal
  const targetCalories = calorieData?.targetCalories ? calorieData.targetCalories : 2200;
  const bmr = calorieData?.bmr || null;
  const goal = userProfile?.goal || 'maintain';
  
  // Generate meals based on meal type, goal, BMR, and fruit budget
  const mealOptions = createScaledMeals(targetCalories, mealType, fruitBudgetRemaining, goal, bmr);

  useEffect(() => {
    if (currentIndex >= mealOptions.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, mealOptions.length]);

  if (!isOpen) return null;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < mealOptions.length - 1) {
      navigateToMeal(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      navigateToMeal(currentIndex - 1);
    }
  };

  const navigateToMeal = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddMeal = (meal) => {
    onAddMeal({ items: meal.items, fruitCount: meal.fruitCount });
    onClose();
  };

  const currentMeal = mealOptions[currentIndex];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Super Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Easy': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMealTypeInfo = (type) => {
    switch(type) {
      case 'breakfast': return { emoji: '🌅', name: 'Breakfast', target: Math.round(targetCalories / (goal === 'lose' ? 6 : goal === 'dirty-bulk' ? 3 : 5)) };
      case 'lunch': return { emoji: '☀️', name: 'Lunch', target: Math.round(targetCalories / (goal === 'lose' ? 5 : goal === 'dirty-bulk' ? 3 : 4)) };
      case 'dinner': return { emoji: '🌙', name: 'Dinner', target: Math.round(targetCalories / (goal === 'lose' ? 4 : goal === 'dirty-bulk' ? 3 : 3.3)) };
      default: return { emoji: '🍽️', name: 'Meal', target: 400 };
    }
  };

  const getGoalInfo = (goalType) => {
    switch(goalType) {
      case 'lose': return { emoji: '🔥', name: 'Weight Loss', color: 'from-red-500 to-pink-500' };
      case 'gain-muscle': return { emoji: '💪', name: 'Muscle Gain', color: 'from-blue-500 to-purple-500' };
      case 'dirty-bulk': return { emoji: '🚀', name: 'Dirty Bulk', color: 'from-orange-500 to-red-500' };
      default: return { emoji: '⚖️', name: 'Maintain', color: 'from-green-500 to-teal-500' };
    }
  };

  const mealInfo = getMealTypeInfo(mealType);
  const goalInfo = getGoalInfo(goal);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[700px]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b bg-gradient-to-r ${goalInfo.color} text-white`}>
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
              {mealInfo.emoji} {mealInfo.name} Ideas ({currentIndex + 1}/{mealOptions.length})
            </h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>{goalInfo.emoji} {goalInfo.name}</span>
              <span>Target: {mealInfo.target} calories</span>
              {fruitBudgetRemaining < 3 && goal === 'maintain' && (
                <div className="flex items-center gap-1">
                  <Apple size={14} />
                  <span>Fruit: {fruitBudgetRemaining}/3</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 p-1">
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-full flex flex-col">
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className={`w-full bg-gradient-to-br ${
                goal === 'lose' ? 'from-red-50 to-pink-50 border-red-200' :
                goal === 'gain-muscle' ? 'from-blue-50 to-purple-50 border-blue-200' :
                goal === 'dirty-bulk' ? 'from-orange-50 to-red-50 border-orange-200' :
                'from-green-50 to-teal-50 border-green-200'
              } border-2 rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}>
                
                {/* Meal Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{currentMeal.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentMeal.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{currentMeal.description}</div>
                  
                  {/* Speed indicators */}
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentMeal.difficulty)}`}>
                      {currentMeal.difficulty}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Clock size={12} />
                      {currentMeal.prepTime}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                      <Zap size={12} />
                      {currentMeal.itemCount} items
                    </div>
                    {currentMeal.fruitCount > 0 && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                        <Apple size={12} />
                        Uses {currentMeal.fruitCount} fruit
                      </div>
                    )}
                  </div>

                  {/* Calorie Display */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className={`text-2xl font-bold ${
                      goal === 'lose' ? 'text-red-600' :
                      goal === 'gain-muscle' ? 'text-blue-600' :
                      goal === 'dirty-bulk' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>{currentMeal.estimatedCalories}</div>
                    <div className="text-xs text-gray-600">Calories (Perfect for your {goalInfo.name.toLowerCase()} goal!)</div>
                  </div>
                </div>
                
                {/* Food Items List */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-bold text-gray-800 text-center mb-3">Simple Ingredients:</h5>
                  {currentMeal.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-sm font-medium text-gray-700">{item.food}</span>
                      <span className="text-sm text-gray-600 font-medium">{item.displayServing} {item.displayUnit}</span>
                    </div>
                  ))}
                </div>

                {/* Add to Meal Button */}
                <button
                  onClick={() => handleAddMeal(currentMeal)}
                  className={`w-full bg-gradient-to-r ${goalInfo.color} text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  ✅ Add to My {mealInfo.name}
                </button>

                {isMobile && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    👈 Swipe left/right for more {goalInfo.name.toLowerCase()} ideas 👉
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateToMeal(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === 0 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : `bg-gradient-to-r ${goalInfo.color} text-white hover:opacity-90`
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  {mealOptions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => !isTransitioning && navigateToMeal(index)}
                      disabled={isTransitioning}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? (
                          goal === 'lose' ? 'bg-red-500' :
                          goal === 'gain-muscle' ? 'bg-blue-500' :
                          goal === 'dirty-bulk' ? 'bg-orange-500' :
                          'bg-green-500'
                        ) : 'bg-gray-300'
                      } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => navigateToMeal(Math.min(mealOptions.length - 1, currentIndex + 1))}
                  disabled={currentIndex === mealOptions.length - 1 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === mealOptions.length - 1 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : `bg-gradient-to-r ${goalInfo.color} text-white hover:opacity-90`
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealIdeasModal;
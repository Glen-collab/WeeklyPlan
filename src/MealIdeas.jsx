import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, Apple } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Function to create scaled meals based on target calories and meal type
const createScaledMeals = (targetCalories, mealType, fruitBudgetRemaining) => {
  // Base calorie values from FoodDatabase.js
  const calories = {
    // Proteins
    egg: 70, chickenBreast: 165, tuna: 108, turkeyBreast: 135, leanBeef: 176,
    salmon: 208, greekYogurt: 130, cottageCheese: 90, cod: 89, shrimp: 85,
    
    // Carbs  
    toast: 74, brownRice: 112, oats: 150, sweetPotato: 86, whiteRice: 130,
    quinoa: 120, ezekielBread: 80, pasta: 131, potato: 161,
    
    // Fruits
    apple: 52, banana: 89, strawberries: 32, blueberries: 57, orange: 47,
    
    // Vegetables
    broccoli: 25, spinach: 23, bellPeppers: 31, carrots: 41, asparagus: 20,
    
    // Fats
    avocado: 160, almonds: 164, peanutButter: 188, oliveOil: 119, walnuts: 185,
    
    // Supplements
    proteinPowder: 120, stringCheese: 70
  };

  // Calculate meal-specific target calories
  let mealTarget;
  if (mealType === 'breakfast') mealTarget = Math.round(targetCalories / 5); // 20%
  else if (mealType === 'lunch') mealTarget = Math.round(targetCalories / 4); // 25%  
  else if (mealType === 'dinner') mealTarget = Math.round(targetCalories / 3.3); // 30%

  if (mealType === 'breakfast') {
    return createBreakfastMeals(mealTarget, fruitBudgetRemaining);
  } else if (mealType === 'lunch') {
    return createLunchMeals(mealTarget, fruitBudgetRemaining);
  } else if (mealType === 'dinner') {
    return createDinnerMeals(mealTarget, fruitBudgetRemaining);
  }
};

// BREAKFAST MEALS (complete)
const createBreakfastMeals = (targetCalories, fruitBudgetRemaining) => [
  {
    id: 1,
    name: "Eggs & Toast",
    description: "Classic protein + carbs combo",
    prepTime: "1 min", itemCount: 2, difficulty: "Super Easy", icon: "🍳",
    estimatedCalories: (() => {
      if (targetCalories <= 300) return 288;
      else if (targetCalories <= 400) return 358;
      else if (targetCalories <= 500) return 428;
      else if (targetCalories <= 600) return 498;
      else return 642;
    })(),
    fruitCount: 0,
    items: (() => {
      let eggs, toast;
      if (targetCalories <= 300) { eggs = 2; toast = 2; }
      else if (targetCalories <= 400) { eggs = 3; toast = 2; }
      else if (targetCalories <= 500) { eggs = 4; toast = 2; }
      else if (targetCalories <= 600) { eggs = 5; toast = 2; }
      else { eggs = 6; toast = 3; }
      
      return [
        { id: generateId(), category: 'protein', food: 'Eggs (whole)', serving: eggs, displayServing: eggs.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: toast, displayServing: toast.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 2,
    name: "Protein Shake & Banana",
    description: "Grab and go liquid breakfast",
    prepTime: "30 sec", itemCount: 2, difficulty: "Super Easy", icon: "🥤",
    estimatedCalories: (() => {
      if (fruitBudgetRemaining === 0) {
        if (targetCalories <= 300) return 240;
        else if (targetCalories <= 400) return 360;
        else return 480;
      } else {
        if (targetCalories <= 300) return 298;
        else if (targetCalories <= 400) return 387;
        else if (targetCalories <= 500) return 418;
        else if (targetCalories <= 600) return 507;
        else return 538;
      }
    })(),
    fruitCount: fruitBudgetRemaining > 0 ? 1 : 0,
    items: (() => {
      let scoops, bananas;
      if (fruitBudgetRemaining === 0) {
        // No fruit version - more protein
        if (targetCalories <= 300) { scoops = 2; bananas = 0; }
        else if (targetCalories <= 400) { scoops = 3; bananas = 0; }
        else { scoops = 4; bananas = 0; }
      } else {
        if (targetCalories <= 300) { scoops = 1; bananas = 2; }
        else if (targetCalories <= 400) { scoops = 1; bananas = 3; }
        else if (targetCalories <= 500) { scoops = 2; bananas = 2; }
        else if (targetCalories <= 600) { scoops = 2; bananas = 3; }
        else { scoops = 3; bananas = 2; }
      }
      
      const items = [
        { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: scoops, displayServing: scoops.toString(), displayUnit: 'servings' }
      ];
      
      if (bananas > 0) {
        items.push({ id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' });
      }
      
      return items;
    })()
  },
  {
    id: 3,
    name: "Buttered Eggs & Toast",
    description: "Comfort food with healthy fats",
    prepTime: "3 min", itemCount: 3, difficulty: "Easy", icon: "🧈",
    estimatedCalories: (() => {
      if (targetCalories <= 300) return 286;
      else if (targetCalories <= 400) return 377;
      else if (targetCalories <= 500) return 447;
      else if (targetCalories <= 600) return 517;
      else return 661;
    })(),
    fruitCount: 0,
    items: (() => {
      let eggs, toast, tbspOil;
      if (targetCalories <= 300) { eggs = 2; toast = 1; tbspOil = 1; }
      else if (targetCalories <= 400) { eggs = 3; toast = 2; tbspOil = 1; }
      else if (targetCalories <= 500) { eggs = 4; toast = 2; tbspOil = 1; }
      else if (targetCalories <= 600) { eggs = 5; toast = 2; tbspOil = 1; }
      else { eggs = 6; toast = 3; tbspOil = 1; }
      
      return [
        { id: generateId(), category: 'protein', food: 'Eggs (whole)', serving: eggs, displayServing: eggs.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: toast, displayServing: toast.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: tbspOil, displayServing: tbspOil.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 4,
    name: "Yogurt Banana Bowl",
    description: "Creamy protein with natural sugars",
    prepTime: "2 min", itemCount: 3, difficulty: "Easy", icon: "🥣",
    estimatedCalories: (() => {
      if (fruitBudgetRemaining === 0) {
        if (targetCalories <= 300) return 302;
        else if (targetCalories <= 400) return 384;
        else return 466;
      } else {
        if (targetCalories <= 300) return 308;
        else if (targetCalories <= 400) return 383;
        else if (targetCalories <= 500) return 472;
        else if (targetCalories <= 600) return 554;
        else return 537;
      }
    })(),
    fruitCount: fruitBudgetRemaining > 0 ? 1 : 0,
    items: (() => {
      if (fruitBudgetRemaining === 0) {
        // No fruit version - extra cottage cheese + nuts
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
        else if (targetCalories <= 500) { cups = 1; bananas = 2; almondOz = 1; }
        else if (targetCalories <= 600) { cups = 1; bananas = 2; almondOz = 1.5; }
        else { cups = 1.5; bananas = 2; almondOz = 1; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: cups, displayServing: cups.toString(), displayUnit: 'cups' },
          { id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almondOz, displayServing: almondOz.toString(), displayUnit: 'servings' }
        ];
      }
    })()
  },
  {
    id: 5,
    name: "Power Oat Bowl",
    description: "Complete macro-balanced breakfast",
    prepTime: "4 min", itemCount: 4, difficulty: "Moderate", icon: "💪",
    estimatedCalories: (() => {
      if (targetCalories <= 300) return 298;
      else if (targetCalories <= 400) return 433;
      else if (targetCalories <= 500) return 527;
      else if (targetCalories <= 600) return 602;
      else return 677;
    })(),
    fruitCount: 1,
    items: (() => {
      let oatCups, scoops, bananas, pbTbsp;
      if (targetCalories <= 300) { oatCups = 0.25; scoops = 0.5; bananas = 1; pbTbsp = 1; }
      else if (targetCalories <= 400) { oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 1; }
      else if (targetCalories <= 500) { oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 2; }
      else if (targetCalories <= 600) { oatCups = 0.75; scoops = 1; bananas = 1; pbTbsp = 2; }
      else { oatCups = 1; scoops = 1; bananas = 1; pbTbsp = 2; }
      
      return [
        { id: generateId(), category: 'carbohydrate', food: 'Oats (dry)', serving: oatCups * 2, displayServing: oatCups.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: scoops, displayServing: scoops.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'fruits', food: 'Banana', serving: bananas, displayServing: bananas.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: pbTbsp / 2, displayServing: pbTbsp.toString(), displayUnit: 'tbsp' }
      ];
    })()
  }
];

// LUNCH MEALS (new)
const createLunchMeals = (targetCalories, fruitBudgetRemaining) => [
  {
    id: 1,
    name: "Chicken & Rice Bowl",
    description: "Classic lean protein + carbs",
    prepTime: "5 min", itemCount: 2, difficulty: "Super Easy", icon: "🍗",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 380;
      else if (targetCalories <= 500) return 465;
      else if (targetCalories <= 600) return 550;
      else return 650;
    })(),
    fruitCount: 0,
    items: (() => {
      let chicken, rice;
      if (targetCalories <= 400) { chicken = 120; rice = 1; } // 318 cal
      else if (targetCalories <= 500) { chicken = 150; rice = 1.5; } // 415 cal  
      else if (targetCalories <= 600) { chicken = 180; rice = 2; } // 521 cal
      else { chicken = 220; rice = 2.5; } // 643 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: chicken/100, displayServing: chicken.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Brown Rice (cooked)', serving: rice, displayServing: rice.toString(), displayUnit: 'cups' }
      ];
    })()
  },
  {
    id: 2,
    name: "Tuna & Apple",
    description: "Quick protein + refreshing fruit",
    prepTime: "2 min", itemCount: 2, difficulty: "Super Easy", icon: "🐟",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 268;
      else if (targetCalories <= 500) return 376;
      else if (targetCalories <= 600) return 484;
      else return 592;
    })(),
    fruitCount: fruitBudgetRemaining > 0 ? 1 : 0,
    items: (() => {
      if (fruitBudgetRemaining === 0) {
        // No fruit version - double tuna + bread
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
        if (targetCalories <= 400) { tuna = 2; apples = 1; } // 268 cal
        else if (targetCalories <= 500) { tuna = 3; apples = 1; } // 376 cal
        else if (targetCalories <= 600) { tuna = 4; apples = 1; } // 484 cal
        else { tuna = 5; apples = 1; } // 592 cal
        
        return [
          { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: tuna, displayServing: tuna.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fruits', food: 'Apple', serving: apples, displayServing: apples.toString(), displayUnit: 'servings' }
        ];
      }
    })()
  },
  {
    id: 3,
    name: "Turkey Avocado Wrap",
    description: "Satisfying protein + healthy fats + carbs",
    prepTime: "4 min", itemCount: 3, difficulty: "Easy", icon: "🌯",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 395;
      else if (targetCalories <= 500) return 475;
      else if (targetCalories <= 600) return 555;
      else return 635;
    })(),
    fruitCount: 0,
    items: (() => {
      let turkey, bread, avocado;
      if (targetCalories <= 400) { turkey = 100; bread = 2; avocado = 0.5; } // 395 cal
      else if (targetCalories <= 500) { turkey = 120; bread = 2; avocado = 0.75; } // 475 cal
      else if (targetCalories <= 600) { turkey = 150; bread = 2; avocado = 1; } // 555 cal
      else { turkey = 180; bread = 2; avocado = 1; } // 635 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Turkey Breast', serving: turkey/85, displayServing: turkey.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Whole Wheat Bread', serving: bread, displayServing: bread.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'fat', food: 'Avocado', serving: avocado, displayServing: avocado.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 4,
    name: "Salmon Quinoa Salad",
    description: "Omega-3 rich + complete protein grain",
    prepTime: "6 min", itemCount: 3, difficulty: "Easy", icon: "🐠",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 388;
      else if (targetCalories <= 500) return 508;
      else if (targetCalories <= 600) return 628;
      else return 748;
    })(),
    fruitCount: 0,
    items: (() => {
      let salmon, quinoa, spinach;
      if (targetCalories <= 400) { salmon = 80; quinoa = 1; spinach = 2; } // 388 cal
      else if (targetCalories <= 500) { salmon = 120; quinoa = 1.5; spinach = 2; } // 508 cal
      else if (targetCalories <= 600) { salmon = 160; quinoa = 2; spinach = 2; } // 628 cal
      else { salmon = 200; quinoa = 2.5; spinach = 2; } // 748 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Salmon', serving: salmon/85, displayServing: salmon.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Quinoa (cooked)', serving: quinoa, displayServing: quinoa.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'vegetables', food: 'Spinach', serving: spinach, displayServing: spinach.toString(), displayUnit: 'cups' }
      ];
    })()
  },
  {
    id: 5,
    name: "Beef Power Bowl",
    description: "Complete macro-balanced meal + vegetables",
    prepTime: "8 min", itemCount: 4, difficulty: "Moderate", icon: "🥩",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 407;
      else if (targetCalories <= 500) return 527;
      else if (targetCalories <= 600) return 647;
      else return 767;
    })(),
    fruitCount: 0,
    items: (() => {
      let beef, rice, broccoli, oil;
      if (targetCalories <= 400) { beef = 80; rice = 1; broccoli = 1; oil = 0.5; } // 407 cal
      else if (targetCalories <= 500) { beef = 120; rice = 1.5; broccoli = 1; oil = 0.5; } // 527 cal
      else if (targetCalories <= 600) { beef = 160; rice = 2; broccoli = 1; oil = 0.5; } // 647 cal
      else { beef = 200; rice = 2.5; broccoli = 1; oil = 0.5; } // 767 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Lean Beef (90/10)', serving: beef/85, displayServing: beef.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Brown Rice (cooked)', serving: rice, displayServing: rice.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'vegetables', food: 'Broccoli', serving: broccoli, displayServing: broccoli.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 6,
    name: "Cottage Cheese Berry Bowl",
    description: "High protein + antioxidant-rich + satisfying",
    prepTime: "2 min", itemCount: 4, difficulty: "Easy", icon: "🫐",
    estimatedCalories: (() => {
      if (targetCalories <= 400) return 402;
      else if (targetCalories <= 500) return 522;
      else if (targetCalories <= 600) return 642;
      else return 762;
    })(),
    fruitCount: fruitBudgetRemaining > 0 ? 1 : 0,
    items: (() => {
      if (fruitBudgetRemaining === 0) {
        // No fruit version - extra cottage cheese + nuts
        let cottage, almonds, bread;
        if (targetCalories <= 400) { cottage = 2; almonds = 0.5; bread = 1; }
        else if (targetCalories <= 500) { cottage = 3; almonds = 0.5; bread = 1; }
        else { cottage = 4; almonds = 0.5; bread = 1; }
        
        return [
          { id: generateId(), category: 'protein', food: 'Cottage Cheese (low-fat)', serving: cottage, displayServing: cottage.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'carbohydrate', food: 'Ezekiel Bread', serving: bread, displayServing: bread.toString(), displayUnit: 'servings' }
        ];
      } else {
        let cottage, berries, almonds, oats;
        if (targetCalories <= 400) { cottage = 2; berries = 2; almonds = 0.5; oats = 0.25; } // 402 cal
        else if (targetCalories <= 500) { cottage = 3; berries = 2; almonds = 0.5; oats = 0.5; } // 522 cal
        else if (targetCalories <= 600) { cottage = 4; berries = 2; almonds = 0.5; oats = 0.75; } // 642 cal
        else { cottage = 5; berries = 2; almonds = 0.5; oats = 1; } // 762 cal
        
        return [
          { id: generateId(), category: 'protein', food: 'Cottage Cheese (low-fat)', serving: cottage, displayServing: cottage.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fruits', food: 'Strawberries', serving: berries, displayServing: berries.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: almonds, displayServing: almonds.toString(), displayUnit: 'servings' },
          { id: generateId(), category: 'carbohydrate', food: 'Oats (dry)', serving: oats, displayServing: (oats * 0.5).toString(), displayUnit: 'cups' }
        ];
      }
    })()
  }
];

// DINNER MEALS (new)
const createDinnerMeals = (targetCalories, fruitBudgetRemaining) => [
  {
    id: 1,
    name: "Steak & Potato",
    description: "Classic hearty dinner combo",
    prepTime: "10 min", itemCount: 2, difficulty: "Easy", icon: "🥩",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 487;
      else if (targetCalories <= 600) return 609;
      else if (targetCalories <= 700) return 731;
      else return 853;
    })(),
    fruitCount: 0,
    items: (() => {
      let beef, potato;
      if (targetCalories <= 500) { beef = 150; potato = 1; } // 487 cal
      else if (targetCalories <= 600) { beef = 200; potato = 1.5; } // 609 cal
      else if (targetCalories <= 700) { beef = 250; potato = 2; } // 731 cal
      else { beef = 300; potato = 2.5; } // 853 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Lean Beef (90/10)', serving: beef/85, displayServing: beef.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Potato (baked)', serving: potato, displayServing: potato.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 2,
    name: "Salmon & Sweet Potato",
    description: "Omega-3 rich + complex carbs",
    prepTime: "12 min", itemCount: 2, difficulty: "Easy", icon: "🐟",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 466;
      else if (targetCalories <= 600) return 570;
      else if (targetCalories <= 700) return 674;
      else return 778;
    })(),
    fruitCount: 0,
    items: (() => {
      let salmon, sweetPotato;
      if (targetCalories <= 500) { salmon = 120; sweetPotato = 3; } // 466 cal
      else if (targetCalories <= 600) { salmon = 160; sweetPotato = 4; } // 570 cal
      else if (targetCalories <= 700) { salmon = 200; sweetPotato = 5; } // 674 cal
      else { salmon = 240; sweetPotato = 6; } // 778 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Salmon', serving: salmon/85, displayServing: salmon.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: sweetPotato, displayServing: sweetPotato.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 3,
    name: "Chicken Veggie Stir-Fry",
    description: "Lean protein + vegetables + healthy fats",
    prepTime: "8 min", itemCount: 3, difficulty: "Easy", icon: "🥘",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 505;
      else if (targetCalories <= 600) return 625;
      else if (targetCalories <= 700) return 745;
      else return 865;
    })(),
    fruitCount: 0,
    items: (() => {
      let chicken, peppers, oil;
      if (targetCalories <= 500) { chicken = 180; peppers = 2; oil = 1; } // 505 cal
      else if (targetCalories <= 600) { chicken = 220; peppers = 2; oil = 1.5; } // 625 cal
      else if (targetCalories <= 700) { chicken = 260; peppers = 2; oil = 2; } // 745 cal
      else { chicken = 300; peppers = 2; oil = 2.5; } // 865 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: chicken/100, displayServing: chicken.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'vegetables', food: 'Bell Peppers', serving: peppers, displayServing: peppers.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 4,
    name: "Turkey Pasta Dinner",
    description: "Comfort food + lean protein + vegetables",
    prepTime: "12 min", itemCount: 3, difficulty: "Moderate", icon: "🍝",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 516;
      else if (targetCalories <= 600) return 636;
      else if (targetCalories <= 700) return 756;
      else return 876;
    })(),
    fruitCount: 0,
    items: (() => {
      let turkey, pasta, spinach;
      if (targetCalories <= 500) { turkey = 150; pasta = 1.5; spinach = 2; } // 516 cal
      else if (targetCalories <= 600) { turkey = 200; pasta = 2; spinach = 2; } // 636 cal
      else if (targetCalories <= 700) { turkey = 250; pasta = 2.5; spinach = 2; } // 756 cal
      else { turkey = 300; pasta = 3; spinach = 2; } // 876 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Turkey Breast', serving: turkey/85, displayServing: turkey.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Pasta (cooked)', serving: pasta, displayServing: pasta.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'vegetables', food: 'Spinach', serving: spinach, displayServing: spinach.toString(), displayUnit: 'cups' }
      ];
    })()
  },
  {
    id: 5,
    name: "Surf & Turf Feast",
    description: "Premium protein + vegetables + healthy fats + carbs",
    prepTime: "15 min", itemCount: 4, difficulty: "Moderate", icon: "🦐",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 509;
      else if (targetCalories <= 600) return 629;
      else if (targetCalories <= 700) return 749;
      else return 869;
    })(),
    fruitCount: 0,
    items: (() => {
      let beef, shrimp, asparagus, oil;
      if (targetCalories <= 500) { beef = 100; shrimp = 100; asparagus = 2; oil = 1; } // 509 cal
      else if (targetCalories <= 600) { beef = 120; shrimp = 120; asparagus = 2; oil = 1.5; } // 629 cal
      else if (targetCalories <= 700) { beef = 140; shrimp = 140; asparagus = 2; oil = 2; } // 749 cal
      else { beef = 160; shrimp = 160; asparagus = 2; oil = 2.5; } // 869 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Lean Beef (90/10)', serving: beef/85, displayServing: beef.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'protein', food: 'Shrimp', serving: shrimp/100, displayServing: shrimp.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'vegetables', food: 'Asparagus', serving: asparagus, displayServing: asparagus.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' }
      ];
    })()
  },
  {
    id: 6,
    name: "Fish & Chips Healthy",
    description: "Cod + sweet potato + vegetables + heart-healthy fats",
    prepTime: "10 min", itemCount: 4, difficulty: "Moderate", icon: "🐠",
    estimatedCalories: (() => {
      if (targetCalories <= 500) return 513;
      else if (targetCalories <= 600) return 633;
      else if (targetCalories <= 700) return 753;
      else return 873;
    })(),
    fruitCount: 0,
    items: (() => {
      let cod, sweetPotato, broccoli, oil;
      if (targetCalories <= 500) { cod = 200; sweetPotato = 2; broccoli = 2; oil = 1; } // 513 cal
      else if (targetCalories <= 600) { cod = 250; sweetPotato = 3; broccoli = 2; oil = 1; } // 633 cal
      else if (targetCalories <= 700) { cod = 300; sweetPotato = 4; broccoli = 2; oil = 1; } // 753 cal
      else { cod = 350; sweetPotato = 5; broccoli = 2; oil = 1; } // 873 cal
      
      return [
        { id: generateId(), category: 'protein', food: 'Cod', serving: cod/100, displayServing: cod.toString(), displayUnit: 'grams' },
        { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: sweetPotato, displayServing: sweetPotato.toString(), displayUnit: 'servings' },
        { id: generateId(), category: 'vegetables', food: 'Broccoli', serving: broccoli, displayServing: broccoli.toString(), displayUnit: 'cups' },
        { id: generateId(), category: 'fat', food: 'Olive Oil', serving: oil, displayServing: oil.toString(), displayUnit: 'servings' }
      ];
    })()
  }
];

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
  
  // Generate meals based on meal type and fruit budget
  const mealOptions = createScaledMeals(targetCalories, mealType, fruitBudgetRemaining);

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
      case 'breakfast': return { emoji: '🌅', name: 'Breakfast', target: Math.round(targetCalories / 5) };
      case 'lunch': return { emoji: '☀️', name: 'Lunch', target: Math.round(targetCalories / 4) };
      case 'dinner': return { emoji: '🌙', name: 'Dinner', target: Math.round(targetCalories / 3.3) };
      default: return { emoji: '🍽️', name: 'Meal', target: 400 };
    }
  };

  const mealInfo = getMealTypeInfo(mealType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[700px]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
              {mealInfo.emoji} {mealInfo.name} Ideas ({currentIndex + 1}/{mealOptions.length})
            </h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>Target: {mealInfo.target} calories</span>
              {fruitBudgetRemaining < 3 && (
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
              <div className={`w-full bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 shadow-lg transition-all duration-300 ${
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
                    <div className="text-2xl font-bold text-blue-600">{currentMeal.estimatedCalories}</div>
                    <div className="text-xs text-gray-600">Calories (Perfect for your goal!)</div>
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
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✅ Add to My {mealInfo.name}
                </button>

                {isMobile && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    👈 Swipe left/right for more quick ideas 👉
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
                      : 'bg-green-500 text-white hover:bg-green-600'
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
                        index === currentIndex ? 'bg-green-500' : 'bg-gray-300'
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
                      : 'bg-green-500 text-white hover:bg-green-600'
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
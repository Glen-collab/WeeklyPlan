import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, Apple, Calendar, Target, Utensils } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Create 6 different daily meal plan options
const createWeekPlanOptions = (targetCalories, goal, bmr) => {
  // Calculate daily calorie targets based on goal
  let dailyTarget;
  if (goal === 'lose') {
    dailyTarget = bmr ? (bmr + 50) : Math.round(targetCalories * 0.7);
  } else if (goal === 'dirty-bulk') {
    dailyTarget = Math.round(targetCalories * 1.3);
  } else {
    dailyTarget = targetCalories;
  }

  // Fruit limits based on goal
  let maxFruits;
  if (goal === 'lose') {
    maxFruits = 2;
  } else if (goal === 'dirty-bulk') {
    maxFruits = 4;
  } else {
    maxFruits = 3; // maintain and gain-muscle
  }

  const plans = [];

  // PLAN 1: Classic Bodybuilder Day
  plans.push({
    id: 1,
    name: goal === 'lose' ? "Lean Machine Day" : goal === 'dirty-bulk' ? "Mass Monster Day" : "Classic Bodybuilder Day",
    description: goal === 'lose' ? "High protein, lean portions for fat loss" : goal === 'dirty-bulk' ? "Maximum muscle fuel with big portions" : "Time-tested muscle building approach",
    icon: "💪",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 12 : goal === 'dirty-bulk' ? 35 : 24,
    fruitCount: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 2,
    allMeals: [
      // Breakfast: Protein Shake + Banana
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'scoops' },
          ...(goal !== 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      },
      // Snack 1: Greek Yogurt
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          ...(goal === 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Apple', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      },
      // Lunch: Chicken & Rice
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: goal === 'lose' ? 0.8 : goal === 'dirty-bulk' ? 3 : 1.5, displayServing: goal === 'lose' ? '80' : goal === 'dirty-bulk' ? '300' : '150', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Brown Rice (cooked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2.5 : 1.5, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2.5' : '1.5', displayUnit: 'cups' }
        ]
      },
      // Snack 2: Protein Bar
      {
        name: "Afternoon Snack",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'supplements', food: goal === 'lose' ? 'Bucked Up Protein' : 'Quest Bar', serving: 1, displayServing: '1', displayUnit: 'bar' }
        ]
      },
      // Dinner: Beef & Potato
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Lean Beef (90/10)', serving: goal === 'lose' ? 0.94 : goal === 'dirty-bulk' ? 3.5 : 2, displayServing: goal === 'lose' ? '80' : goal === 'dirty-bulk' ? '300' : '170', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Potato (baked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2.5 : 1.5, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2.5' : '1.5', displayUnit: 'servings' }
        ]
      },
      // Post-Workout/Evening
      {
        name: goal === 'lose' ? "Evening Snack" : "Post-Workout",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'supplements', food: 'Pure Protein RTD', serving: 1, displayServing: '1', displayUnit: 'bottle' },
          ...(goal === 'dirty-bulk' ? [{ id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      }
    ]
  });

  // PLAN 2: Seafood Lover Day
  plans.push({
    id: 2,
    name: goal === 'lose' ? "Ocean Lean Day" : goal === 'dirty-bulk' ? "Seafood Feast Day" : "Seafood Lover Day",
    description: goal === 'lose' ? "Omega-3 rich, lean proteins" : goal === 'dirty-bulk' ? "High-calorie seafood combinations" : "Heart-healthy fish and seafood focus",
    icon: "🐟",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 15 : goal === 'dirty-bulk' ? 32 : 22,
    fruitCount: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 2,
    allMeals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'protein', food: 'Eggs (whole)', serving: goal === 'lose' ? 2 : goal === 'dirty-bulk' ? 4 : 3, displayServing: goal === 'lose' ? '2' : goal === 'dirty-bulk' ? '4' : '3', displayUnit: 'eggs' },
          { id: generateId(), category: 'carbohydrate', food: 'Ezekiel Bread', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'slices' }
        ]
      },
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Apple', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Salmon', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '85' : goal === 'dirty-bulk' ? '255' : '170', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Quinoa (cooked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Spinach', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Afternoon Snack",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Cottage Cheese (low-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' }
        ]
      },
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Shrimp', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '100' : goal === 'dirty-bulk' ? '300' : '200', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' },
          { id: generateId(), category: 'vegetables', food: 'Asparagus', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'scoops' },
          ...(goal !== 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Strawberries', serving: 1, displayServing: '1', displayUnit: 'cups' }] : [])
        ]
      }
    ]
  });

  // PLAN 3: Plant Power Day
  plans.push({
    id: 3,
    name: goal === 'lose' ? "Lean Plant Day" : goal === 'dirty-bulk' ? "Plant Power Feast" : "Plant Power Day",
    description: goal === 'lose' ? "High fiber, lean plant proteins" : goal === 'dirty-bulk' ? "Calorie-dense plant combinations" : "Balanced plant-based proteins and nutrients",
    icon: "🌱",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 18 : goal === 'dirty-bulk' ? 38 : 26,
    fruitCount: goal === 'lose' ? 2 : goal === 'dirty-bulk' ? 3 : 3,
    allMeals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'carbohydrate', food: 'Oats (dry)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'cups' },
          { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'scoops' },
          { id: generateId(), category: 'fruits', food: 'Blueberries', serving: 1, displayServing: '1', displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Apple', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'tbsp' }
        ]
      },
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Turkey Breast', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '85' : goal === 'dirty-bulk' ? '255' : '170', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Quinoa (cooked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Bell Peppers', serving: 1, displayServing: '1', displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Avocado', serving: goal === 'lose' ? 0.25 : goal === 'dirty-bulk' ? 1 : 0.5, displayServing: goal === 'lose' ? '0.25' : goal === 'dirty-bulk' ? '1' : '0.5', displayUnit: 'servings' }
        ]
      },
      {
        name: "Afternoon Snack",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Walnuts', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Cod', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '100' : goal === 'dirty-bulk' ? '300' : '200', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2.5 : 1.5, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2.5' : '1.5', displayUnit: 'servings' },
          { id: generateId(), category: 'vegetables', food: 'Broccoli', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Orange', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Cashews', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'servings' }
        ]
      }
    ]
  });

  // PLAN 4: High Energy Day
  plans.push({
    id: 4,
    name: goal === 'lose' ? "Steady Energy Day" : goal === 'dirty-bulk' ? "Maximum Energy Day" : "High Energy Day",
    description: goal === 'lose' ? "Sustained energy with controlled carbs" : goal === 'dirty-bulk' ? "Peak performance fuel all day" : "Perfect for active training days",
    icon: "⚡",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 16 : goal === 'dirty-bulk' ? 42 : 28,
    fruitCount: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2,
    allMeals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'protein', food: 'Egg Whites', serving: goal === 'lose' ? 4 : goal === 'dirty-bulk' ? 12 : 8, displayServing: goal === 'lose' ? '4' : goal === 'dirty-bulk' ? '12' : '8', displayUnit: 'whites' },
          { id: generateId(), category: 'carbohydrate', food: 'Bagel (plain)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 1.5 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'bagels' },
          { id: generateId(), category: 'fat', food: 'Avocado', serving: goal === 'lose' ? 0.25 : goal === 'dirty-bulk' ? 0.75 : 0.5, displayServing: goal === 'lose' ? '0.25' : goal === 'dirty-bulk' ? '0.75' : '0.5', displayUnit: 'servings' }
        ]
      },
      {
        name: "Pre-Workout",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'scoops' }
        ]
      },
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Tuna (canned in water)', serving: goal === 'lose' ? 2 : goal === 'dirty-bulk' ? 5 : 3, displayServing: goal === 'lose' ? '2' : goal === 'dirty-bulk' ? '5' : '3', displayUnit: 'cans' },
          { id: generateId(), category: 'carbohydrate', food: 'Pasta (cooked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Tomatoes', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Post-Workout",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'supplements', food: 'Fairlife Core Power 26g', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'bottles' },
          ...(goal !== 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Grapes', serving: 1, displayServing: '1', displayUnit: 'cups' }] : [])
        ]
      },
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Chicken Breast', serving: goal === 'lose' ? 1.2 : goal === 'dirty-bulk' ? 3.5 : 2, displayServing: goal === 'lose' ? '120' : goal === 'dirty-bulk' ? '350' : '200', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Jasmine Rice (cooked)', serving: goal === 'lose' ? 0.75 : goal === 'dirty-bulk' ? 2.5 : 1.5, displayServing: goal === 'lose' ? '0.75' : goal === 'dirty-bulk' ? '2.5' : '1.5', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Green Beans', serving: 1, displayServing: '1', displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Olive Oil', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Cottage Cheese (low-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' },
          ...(goal === 'dirty-bulk' ? [{ id: generateId(), category: 'fruits', food: 'Strawberries', serving: 1, displayServing: '1', displayUnit: 'cups' }] : [])
        ]
      }
    ]
  });

  // PLAN 5: Simple & Clean Day
  plans.push({
    id: 5,
    name: goal === 'lose' ? "Clean Cut Day" : goal === 'dirty-bulk' ? "Simple Bulk Day" : "Simple & Clean Day",
    description: goal === 'lose' ? "Basic, clean foods for fat loss" : goal === 'dirty-bulk' ? "Simple high-calorie combinations" : "Whole foods, minimal processing",
    icon: "🥗",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 14 : goal === 'dirty-bulk' ? 36 : 24,
    fruitCount: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 2,
    allMeals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'protein', food: 'Eggs (whole)', serving: goal === 'lose' ? 2 : goal === 'dirty-bulk' ? 5 : 3, displayServing: goal === 'lose' ? '2' : goal === 'dirty-bulk' ? '5' : '3', displayUnit: 'eggs' },
          { id: generateId(), category: 'carbohydrate', food: 'Oats (dry)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '1.5' : '1', displayUnit: 'cups' },
          ...(goal !== 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      },
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Apple', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Almonds', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Turkey Breast', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '85' : goal === 'dirty-bulk' ? '255' : '170', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'White Rice (cooked)', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2.5 : 1.5, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2.5' : '1.5', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Carrots', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Afternoon Snack",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'supplements', food: 'String Cheese', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'sticks' },
          { id: generateId(), category: 'supplements', food: 'Hard-Boiled Egg', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'eggs' }
        ]
      },
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Tilapia', serving: goal === 'lose' ? 1.5 : goal === 'dirty-bulk' ? 4 : 2.5, displayServing: goal === 'lose' ? '150' : goal === 'dirty-bulk' ? '400' : '250', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Potato (baked)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' },
          { id: generateId(), category: 'vegetables', food: 'Zucchini', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Greek Yogurt (non-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'cups' },
          ...(goal === 'dirty-bulk' ? [{ id: generateId(), category: 'fruits', food: 'Kiwi', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      }
    ]
  });

  // PLAN 6: Power Lifter Day
  plans.push({
    id: 6,
    name: goal === 'lose' ? "Strength Lean Day" : goal === 'dirty-bulk' ? "Power Bulk Day" : "Power Lifter Day",
    description: goal === 'lose' ? "Strong on protein, controlled portions" : goal === 'dirty-bulk' ? "Maximum strength and size fuel" : "Built for strength and power training",
    icon: "🏋️",
    totalCalories: dailyTarget,
    totalSugar: goal === 'lose' ? 12 : goal === 'dirty-bulk' ? 40 : 26,
    fruitCount: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2,
    allMeals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          { id: generateId(), category: 'carbohydrate', food: 'Instant Oats (dry)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 4 : 2.5, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1.25', displayUnit: 'cups' },
          { id: generateId(), category: 'supplements', food: 'Whey Protein (generic)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'scoops' },
          { id: generateId(), category: 'fat', food: 'Peanut Butter', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '4' : '2', displayUnit: 'tbsp' },
          ...(goal !== 'lose' ? [{ id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      },
      {
        name: "Pre-Workout",
        time: "10:00 AM",
        items: [
          { id: generateId(), category: 'fruits', food: 'Apple', serving: 1, displayServing: '1', displayUnit: 'servings' },
          { id: generateId(), category: 'supplements', food: 'Pure Protein RTD', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'bottles' }
        ]
      },
      {
        name: "Lunch",
        time: "12:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Lean Ground Turkey', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3.5 : 2.5, displayServing: goal === 'lose' ? '100' : goal === 'dirty-bulk' ? '350' : '250', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Jasmine Rice (cooked)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'cups' },
          { id: generateId(), category: 'vegetables', food: 'Spinach', serving: 1, displayServing: '1', displayUnit: 'cups' }
        ]
      },
      {
        name: "Post-Workout",
        time: "3:00 PM",
        items: [
          { id: generateId(), category: 'supplements', food: 'Fairlife Core Power 42g', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'bottles' },
          ...(goal === 'dirty-bulk' ? [{ id: generateId(), category: 'fruits', food: 'Banana', serving: 1, displayServing: '1', displayUnit: 'servings' }] : [])
        ]
      },
      {
        name: "Dinner",
        time: "6:00 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Salmon', serving: goal === 'lose' ? 1.5 : goal === 'dirty-bulk' ? 4 : 2.5, displayServing: goal === 'lose' ? '128' : goal === 'dirty-bulk' ? '340' : '213', displayUnit: 'grams' },
          { id: generateId(), category: 'carbohydrate', food: 'Sweet Potato', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' },
          { id: generateId(), category: 'vegetables', food: 'Broccoli', serving: 1, displayServing: '1', displayUnit: 'cups' },
          { id: generateId(), category: 'fat', food: 'Olive Oil', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'servings' }
        ]
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          { id: generateId(), category: 'protein', food: 'Cottage Cheese (low-fat)', serving: goal === 'lose' ? 1 : goal === 'dirty-bulk' ? 3 : 2, displayServing: goal === 'lose' ? '1' : goal === 'dirty-bulk' ? '3' : '2', displayUnit: 'servings' },
          { id: generateId(), category: 'fat', food: 'Walnuts', serving: goal === 'lose' ? 0.5 : goal === 'dirty-bulk' ? 2 : 1, displayServing: goal === 'lose' ? '0.5' : goal === 'dirty-bulk' ? '2' : '1', displayUnit: 'servings' },
          ...(goal === 'dirty-bulk' ? [{ id: generateId(), category: 'fruits', food: 'Grapes', serving: 1, displayServing: '1', displayUnit: 'cups' }] : [])
        ]
      }
    ]
  });

  return plans;
};

const WeekPlanModal = ({
  isOpen,
  onClose,
  onAddWeekPlan,
  userProfile,
  calorieData,
  isMobile
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const targetCalories = calorieData?.targetCalories || 2200;
  const bmr = calorieData?.bmr || null;
  const goal = userProfile?.goal || 'maintain';
  
  const weekPlans = createWeekPlanOptions(targetCalories, goal, bmr);

  useEffect(() => {
    if (currentIndex >= weekPlans.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, weekPlans.length]);

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

    if (isLeftSwipe && currentIndex < weekPlans.length - 1) {
      navigateToPlan(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      navigateToPlan(currentIndex - 1);
    }
  };

  const navigateToPlan = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddPlan = (plan) => {
    onAddWeekPlan(plan);
    onClose();
  };

  const currentPlan = weekPlans[currentIndex];

  const getGoalInfo = (goalType) => {
    switch(goalType) {
      case 'lose': return { emoji: '🔥', name: 'Weight Loss', color: 'from-red-500 to-pink-500' };
      case 'gain-muscle': return { emoji: '💪', name: 'Muscle Gain', color: 'from-blue-500 to-purple-500' };
      case 'dirty-bulk': return { emoji: '🚀', name: 'Dirty Bulk', color: 'from-orange-500 to-red-500' };
      default: return { emoji: '⚖️', name: 'Maintain', color: 'from-green-500 to-teal-500' };
    }
  };

  const goalInfo = getGoalInfo(goal);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[700px]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b bg-gradient-to-r ${goalInfo.color} text-white`}>
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold flex items-center gap-2`}>
              <Calendar size={24} />
              Daily Plans ({currentIndex + 1}/{weekPlans.length})
            </h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>{goalInfo.emoji} {goalInfo.name}</span>
              <span>Target: {currentPlan.totalCalories} cal/day</span>
              <span className="flex items-center gap-1">
                <Apple size={14} />
                {currentPlan.fruitCount} fruits
              </span>
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
                
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{currentPlan.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentPlan.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{currentPlan.description}</div>
                  
                  {/* Daily Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className={`text-lg font-bold ${
                        goal === 'lose' ? 'text-red-600' :
                        goal === 'gain-muscle' ? 'text-blue-600' :
                        goal === 'dirty-bulk' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>{currentPlan.totalCalories}</div>
                      <div className="text-xs text-gray-600">Daily Calories</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-purple-600">{Math.round(currentPlan.totalSugar)}g</div>
                      <div className="text-xs text-gray-600">Total Sugar</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-pink-600">{currentPlan.fruitCount}</div>
                      <div className="text-xs text-gray-600">Fruit Servings</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Meal Preview */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-bold text-gray-800 text-center mb-3">Daily Meal Schedule:</h5>
                  {currentPlan.allMeals.map((meal, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Utensils size={14} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{meal.name}</span>
                        <span className="text-xs text-gray-500">{meal.time}</span>
                      </div>
                      <span className="text-xs text-gray-600">{meal.items.length} items</span>
                    </div>
                  ))}
                </div>

                {/* Add Plan Button */}
                <button
                  onClick={() => handleAddPlan(currentPlan)}
                  className={`w-full bg-gradient-to-r ${goalInfo.color} text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  ✅ Add This for My Week
                </button>

                {isMobile && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    👈 Swipe left/right for more {goalInfo.name.toLowerCase()} daily plans 👉
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateToPlan(Math.max(0, currentIndex - 1))}
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
                  {weekPlans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => !isTransitioning && navigateToPlan(index)}
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
                  onClick={() => navigateToPlan(Math.min(weekPlans.length - 1, currentIndex + 1))}
                  disabled={currentIndex === weekPlans.length - 1 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === weekPlans.length - 1 || isTransitioning
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

export default WeekPlanModal;
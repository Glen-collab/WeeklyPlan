import React, { useState } from 'react';
import { X, Calendar, Target, Users, Clock } from 'lucide-react';

const WeekPlanModal = ({ 
  isOpen, 
  onClose, 
  onAddWeekPlan, 
  userProfile = {}, 
  calorieData = null,
  isMobile = false 
}) => {
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [selectedEaterType, setSelectedEaterType] = useState('balanced');
  const [selectedMealFreq, setSelectedMealFreq] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (!isOpen) return null;

  const goals = [
    { id: 'maintain', label: 'Maintain Weight', color: 'bg-gray-100', icon: '⚖️' },
    { id: 'lose', label: 'Lose Weight', color: 'bg-red-100', icon: '📉' },
    { id: 'gain-muscle', label: 'Gain Muscle', color: 'bg-blue-100', icon: '💪' },
    { id: 'dirty-bulk', label: 'Dirty Bulk', color: 'bg-green-100', icon: '🚀' }
  ];

  const eaterTypes = [
    { 
      id: 'balanced', 
      label: 'Balanced Eater', 
      description: 'Variety of foods, moderate portions',
      icon: '⚖️'
    },
    { 
      id: 'performance', 
      label: 'Performance Eater', 
      description: 'High protein, optimized timing',
      icon: '🏃‍♂️'
    }
  ];

  const mealFrequencies = [
    { id: 3, label: '3 Meals/Day', description: 'Breakfast, Lunch, Dinner' },
    { id: 5, label: '5 Meals/Day', description: 'Main meals + 2 snacks' },
    { id: 6, label: '6 Meals/Day', description: 'Main meals + 2 snacks + post-workout' }
  ];

  // Generate meal plan based on selections
  const generateMealPlan = () => {
    const mealPlans = getMealPlans();
    const planKey = `${selectedGoal}-${selectedEaterType}-${selectedMealFreq}`;
    return mealPlans[planKey] || mealPlans['maintain-balanced-5']; // fallback
  };

  const handleSelectPlan = () => {
    const plan = generateMealPlan();
    setSelectedPlan(plan);
  };

  const handleConfirmPlan = () => {
    if (selectedPlan) {
      onAddWeekPlan(selectedPlan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg w-full ${isMobile ? 'max-w-sm max-h-full' : 'max-w-4xl max-h-[95vh]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 flex items-center gap-2`}>
            <Calendar size={24} />
            Plan My Week
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {!selectedPlan ? (
            /* Selection Interface */
            <div className="space-y-8">
              
              {/* Goal Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={20} />
                  1. Choose Your Goal
                </h3>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                  {goals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedGoal === goal.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : `border-gray-200 ${goal.color} text-gray-700 hover:border-gray-300`
                      }`}
                    >
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <div className="font-medium">{goal.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eater Type Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  2. Choose Your Eating Style
                </h3>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                  {eaterTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedEaterType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedEaterType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <div className="text-sm">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Frequency Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  3. Choose Meal Frequency
                </h3>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                  {mealFrequencies.map(freq => (
                    <button
                      key={freq.id}
                      onClick={() => setSelectedMealFreq(freq.id)}
                      className={`p-4 rounded-lg border-2 transition-colors text-center ${
                        selectedMealFreq === freq.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">{freq.label}</div>
                      <div className="text-sm">{freq.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Plan Button */}
              <div className="text-center pt-4">
                <button
                  onClick={handleSelectPlan}
                  className="px-8 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-medium text-lg"
                >
                  🎯 Generate My Meal Plan
                </button>
              </div>

            </div>
          ) : (
            /* Plan Preview */
            <div className="space-y-6">
              
              {/* Plan Header */}
              <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Custom Meal Plan</h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="bg-blue-100 px-3 py-1 rounded-full">
                    🎯 {goals.find(g => g.id === selectedGoal)?.label}
                  </span>
                  <span className="bg-purple-100 px-3 py-1 rounded-full">
                    👥 {eaterTypes.find(e => e.id === selectedEaterType)?.label}
                  </span>
                  <span className="bg-orange-100 px-3 py-1 rounded-full">
                    ⏰ {selectedMealFreq} Meals/Day
                  </span>
                </div>
              </div>

              {/* Meal Plan Display */}
              <div className="space-y-4">
                {selectedPlan.allMeals.map((meal, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-gray-800">{meal.mealName}</h4>
                      <span className="text-sm text-gray-600">{meal.time}</span>
                    </div>
                    <div className="space-y-1">
                      {meal.items.filter(item => item.food).map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-700 flex justify-between">
                          <span>{item.food}</span>
                          <span className="font-medium">{item.displayServing} {item.displayUnit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
                >
                  ← Back to Options
                </button>
                <button
                  onClick={handleConfirmPlan}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
                >
                  ✅ Use This Plan
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Comprehensive meal plan database with all 24 combinations
const getMealPlans = () => {
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  const createFoodItem = (food, category, serving, displayServing, displayUnit) => ({
    id: generateId(),
    category,
    food,
    serving,
    displayServing,
    displayUnit
  });

  const mealPlans = {
    // ===== MAINTAIN WEIGHT PLANS (TDEE calories) =====
    
    // MAINTAIN - BALANCED - 3 MEALS (~2200 calories)
    'maintain-balanced-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 1, '1/2', 'cup'), // 150 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 1, '1', 'tbsp'), // 188 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop') // 120 cal
            // Total: ~547 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.5, '3/4', 'cup'), // 168 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~667 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:30 PM',
          items: [
            createFoodItem('Salmon', 'protein', 2, '7', 'oz'), // 416 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2, '2', 'medium'), // 172 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1, '1', 'medium') // 320 cal
            // Total: ~954 calories
          ]
        }
        // Grand Total: ~2168 calories
      ]
    },

    // MAINTAIN - BALANCED - 5 MEALS
    'maintain-balanced-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 0.75, '1/3', 'cup'), // 113 cal
            createFoodItem('Blueberries', 'fruits', 1, '1', 'cup'), // 57 cal
            createFoodItem('Almonds', 'fat', 0.5, '0.5', 'oz') // 82 cal
            // Total: ~252 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1, '1', 'cup'), // 130 cal
            createFoodItem('Strawberries', 'fruits', 1, '1', 'cup') // 32 cal
            // Total: ~162 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 1.5, '5.25', 'oz'), // 248 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.5, '3/4', 'cup'), // 168 cal
            createFoodItem('Bell Peppers', 'vegetables', 1, '1', 'cup'), // 31 cal
            createFoodItem('Olive Oil', 'fat', 0.5, '1/2', 'tbsp') // 60 cal
            // Total: ~507 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('Peanut Butter', 'fat', 0.5, '1/2', 'tbsp'), // 94 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 0.75, '3/4', 'scoop') // 90 cal
            // Total: ~236 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Salmon', 'protein', 1.5, '5.25', 'oz'), // 312 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1.5, '1.5', 'medium'), // 129 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 0.75, '3/4', 'medium') // 240 cal
            // Total: ~721 calories
          ]
        }
        // Grand Total: ~1878 calories
      ]
    },

    // MAINTAIN - BALANCED - 6 MEALS
    'maintain-balanced-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 0.6, '1/4', 'cup'), // 90 cal
            createFoodItem('Banana', 'fruits', 0.75, '3/4', 'medium'), // 67 cal
            createFoodItem('Almonds', 'fat', 0.4, '0.4', 'oz') // 66 cal
            // Total: ~223 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.75, '3/4', 'cup'), // 98 cal
            createFoodItem('Blueberries', 'fruits', 0.75, '3/4', 'cup') // 43 cal
            // Total: ~141 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('String Cheese', 'supplements', 1, '1', 'stick') // 70 cal
            // Total: ~122 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 1.5, '5.25', 'oz'), // 248 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1, '1/2', 'cup'), // 112 cal
            createFoodItem('Broccoli', 'vegetables', 1.5, '1.5', 'cups'), // 38 cal
            createFoodItem('Olive Oil', 'fat', 0.5, '1/2', 'tbsp') // 60 cal
            // Total: ~458 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Banana', 'fruits', 0.5, '1/2', 'medium') // 45 cal
            // Total: ~165 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Salmon', 'protein', 1.5, '5.25', 'oz'), // 312 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1, '1', 'medium'), // 86 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 0.75, '3/4', 'medium') // 240 cal
            // Total: ~684 calories
          ]
        }
        // Grand Total: ~1793 calories
      ]
    },

    // MAINTAIN - PERFORMANCE - 3 MEALS (Higher protein)
    'maintain-performance-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 8, '8', 'egg whites'), // 136 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1, '1/2', 'cup'), // 150 cal
            createFoodItem('Blueberries', 'fruits', 1, '1', 'cup'), // 57 cal
            createFoodItem('Almonds', 'fat', 1, '1', 'oz') // 164 cal
            // Total: ~507 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.5, '3/4', 'cup'), // 168 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~750 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:00 PM',
          items: [
            createFoodItem('Salmon', 'protein', 2.5, '8.75', 'oz'), // 520 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2, '2', 'medium'), // 172 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1, '1', 'medium') // 320 cal
            // Total: ~1052 calories
          ]
        }
        // Grand Total: ~2309 calories
      ]
    },

    // MAINTAIN - PERFORMANCE - 5 MEALS
    'maintain-performance-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 6, '6', 'egg whites'), // 102 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.75, '1/3', 'cup'), // 113 cal
            createFoodItem('Banana', 'fruits', 0.75, '3/4', 'medium') // 67 cal
            // Total: ~282 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:30 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop'), // 180 cal
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('Almonds', 'fat', 0.75, '0.75', 'oz') // 123 cal
            // Total: ~355 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.5, '3/4', 'cup'), // 168 cal
            createFoodItem('Bell Peppers', 'vegetables', 1.5, '1.5', 'cups'), // 47 cal
            createFoodItem('Olive Oil', 'fat', 0.75, '3/4', 'tbsp') // 89 cal
            // Total: ~634 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1, '1', 'cup'), // 130 cal
            createFoodItem('Berries', 'fruits', 1, '1', 'cup') // 52 cal
            // Total: ~182 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2, '7', 'oz'), // 352 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1.5, '1.5', 'medium'), // 129 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1, '1', 'medium') // 320 cal
            // Total: ~847 calories
          ]
        }
        // Grand Total: ~2300 calories
      ]
    },

    // MAINTAIN - PERFORMANCE - 6 MEALS
    'maintain-performance-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 5, '5', 'egg whites'), // 85 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.6, '1/4', 'cup') // 90 cal
            // Total: ~175 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:00 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Banana', 'fruits', 0.75, '3/4', 'medium') // 67 cal
            // Total: ~187 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.75, '3/4', 'cup'), // 98 cal
            createFoodItem('Berries', 'fruits', 0.75, '3/4', 'cup') // 39 cal
            // Total: ~137 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.25, '5/8', 'cup'), // 140 cal
            createFoodItem('Broccoli', 'vegetables', 1.5, '1.5', 'cups'), // 38 cal
            createFoodItem('Olive Oil', 'fat', 0.75, '3/4', 'tbsp') // 89 cal
            // Total: ~597 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Apple', 'fruits', 1, '1', 'medium') // 52 cal
            // Total: ~172 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Salmon', 'protein', 2, '7', 'oz'), // 416 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1.5, '1.5', 'medium'), // 129 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1, '1', 'medium') // 320 cal
            // Total: ~905 calories
          ]
        }
        // Grand Total: ~2173 calories
      ]
    },

    // ===== LOSE WEIGHT PLANS (TDEE - 500 calories) =====
    
    // LOSE - BALANCED - 3 MEALS (~1700 calories)
    'lose-balanced-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 5, '5', 'egg whites'), // 85 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.5, '1/4', 'cup'), // 75 cal
            createFoodItem('Strawberries', 'fruits', 1.5, '1.5', 'cups'), // 48 cal
            createFoodItem('Almonds', 'fat', 0.5, '0.5', 'oz') // 82 cal
            // Total: ~290 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.75, '3/8', 'cup'), // 84 cal
            createFoodItem('Broccoli', 'vegetables', 3, '3', 'cups'), // 75 cal
            createFoodItem('Olive Oil', 'fat', 0.5, '1/2', 'tbsp') // 60 cal
            // Total: ~549 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:30 PM',
          items: [
            createFoodItem('Cod', 'protein', 2.5, '8.75', 'oz'), // 223 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1.5, '1.5', 'medium'), // 129 cal
            createFoodItem('Asparagus', 'vegetables', 3, '3', 'cups'), // 60 cal
            createFoodItem('Avocado', 'fat', 0.5, '1/2', 'medium') // 160 cal
            // Total: ~572 calories
          ]
        }
        // Grand Total: ~1411 calories
      ]
    },

    // LOSE - BALANCED - 5 MEALS
    'lose-balanced-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 4, '4', 'egg whites'), // 68 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.4, '1/5', 'cup'), // 60 cal
            createFoodItem('Blueberries', 'fruits', 0.75, '3/4', 'cup') // 43 cal
            // Total: ~171 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.75, '3/4', 'cup'), // 98 cal
            createFoodItem('Strawberries', 'fruits', 1, '1', 'cup') // 32 cal
            // Total: ~130 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 1.75, '6.1', 'oz'), // 289 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.75, '3/8', 'cup'), // 84 cal
            createFoodItem('Bell Peppers', 'vegetables', 2, '2', 'cups'), // 62 cal
            createFoodItem('Olive Oil', 'fat', 0.4, '0.4', 'tbsp') // 48 cal
            // Total: ~483 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 0.75, '3/4', 'scoop') // 90 cal
            // Total: ~142 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Cod', 'protein', 2, '7', 'oz'), // 178 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1, '1', 'medium'), // 86 cal
            createFoodItem('Spinach', 'vegetables', 3, '3', 'cups'), // 69 cal
            createFoodItem('Avocado', 'fat', 0.5, '1/2', 'medium') // 160 cal
            // Total: ~493 calories
          ]
        }
        // Grand Total: ~1419 calories
      ]
    },

    // LOSE - BALANCED - 6 MEALS
    'lose-balanced-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 4, '4', 'egg whites'), // 68 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.3, '1/6', 'cup') // 45 cal
            // Total: ~113 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.5, '1/2', 'cup'), // 65 cal
            createFoodItem('Berries', 'fruits', 0.75, '3/4', 'cup') // 39 cal
            // Total: ~104 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('Almonds', 'fat', 0.25, '0.25', 'oz') // 41 cal
            // Total: ~93 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 1.75, '6.1', 'oz'), // 289 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.5, '1/4', 'cup'), // 56 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 0.3, '0.3', 'tbsp') // 36 cal
            // Total: ~431 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 0.75, '3/4', 'scoop'), // 90 cal
            createFoodItem('Strawberries', 'fruits', 1, '1', 'cup') // 32 cal
            // Total: ~122 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Cod', 'protein', 2, '7', 'oz'), // 178 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1, '1', 'medium'), // 86 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 0.4, '0.4', 'medium') // 128 cal
            // Total: ~432 calories
          ]
        }
        // Grand Total: ~1295 calories
      ]
    },

    // LOSE - PERFORMANCE - 3 MEALS
    'lose-performance-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 8, '8', 'egg whites'), // 136 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.5, '1/4', 'cup'), // 75 cal
            createFoodItem('Blueberries', 'fruits', 1, '1', 'cup') // 57 cal
            // Total: ~268 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.75, '3/8', 'cup'), // 84 cal
            createFoodItem('Broccoli', 'vegetables', 3, '3', 'cups'), // 75 cal
            createFoodItem('Olive Oil', 'fat', 0.5, '1/2', 'tbsp') // 60 cal
            // Total: ~632 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:00 PM',
          items: [
            createFoodItem('Cod', 'protein', 3, '10.5', 'oz'), // 267 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1, '1', 'medium'), // 86 cal
            createFoodItem('Spinach', 'vegetables', 3, '3', 'cups'), // 69 cal
            createFoodItem('Avocado', 'fat', 0.5, '1/2', 'medium') // 160 cal
            // Total: ~582 calories
          ]
        }
        // Grand Total: ~1482 calories
      ]
    },

    // LOSE - PERFORMANCE - 5 MEALS
    'lose-performance-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 6, '6', 'egg whites'), // 102 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.4, '1/5', 'cup') // 60 cal
            // Total: ~162 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:30 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Berries', 'fruits', 0.75, '3/4', 'cup') // 39 cal
            // Total: ~159 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.75, '3/8', 'cup'), // 84 cal
            createFoodItem('Bell Peppers', 'vegetables', 2, '2', 'cups'), // 62 cal
            createFoodItem('Olive Oil', 'fat', 0.4, '0.4', 'tbsp') // 48 cal
            // Total: ~524 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.75, '3/4', 'cup'), // 98 cal
            createFoodItem('Apple', 'fruits', 0.75, '3/4', 'medium') // 39 cal
            // Total: ~137 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Cod', 'protein', 2.5, '8.75', 'oz'), // 223 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1, '1', 'medium'), // 86 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 0.5, '1/2', 'medium') // 160 cal
            // Total: ~509 calories
          ]
        }
        // Grand Total: ~1491 calories
      ]
    },

    // LOSE - PERFORMANCE - 6 MEALS
    'lose-performance-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 5, '5', 'egg whites'), // 85 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 0.3, '1/6', 'cup') // 45 cal
            // Total: ~130 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:00 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 0.75, '3/4', 'scoop'), // 90 cal
            createFoodItem('Berries', 'fruits', 0.5, '1/2', 'cup') // 26 cal
            // Total: ~116 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 0.5, '1/2', 'cup'), // 65 cal
            createFoodItem('Apple', 'fruits', 0.75, '3/4', 'medium') // 39 cal
            // Total: ~104 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 0.5, '1/4', 'cup'), // 56 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 0.3, '0.3', 'tbsp') // 36 cal
            // Total: ~472 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Banana', 'fruits', 0.5, '1/2', 'medium') // 45 cal
            // Total: ~165 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Cod', 'protein', 2, '7', 'oz'), // 178 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 0.75, '3/4', 'medium'), // 65 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 0.4, '0.4', 'medium') // 128 cal
            // Total: ~417 calories
          ]
        }
        // Grand Total: ~1404 calories
      ]
    },

    // ===== GAIN MUSCLE PLANS (TDEE + 300-500 calories) =====
    
    // GAIN-MUSCLE - BALANCED - 3 MEALS (~2700 calories)
    'gain-muscle-balanced-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 1.5, '3/4', 'cup'), // 225 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Peanut Butter', 'fat', 1.5, '1.5', 'tbsp'), // 282 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop') // 180 cal
            // Total: ~821 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.5, '1.25', 'cups'), // 280 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~922 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2.5, '8.75', 'oz'), // 440 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1.5, '1.5', 'medium') // 480 cal
            // Total: ~1181 calories
          ]
        }
        // Grand Total: ~2924 calories
      ]
    },

    // GAIN-MUSCLE - BALANCED - 5 MEALS
    'gain-muscle-balanced-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 1, '1/2', 'cup'), // 150 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 1, '1', 'tbsp'), // 188 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop') // 120 cal
            // Total: ~547 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1.5, '1.5', 'cups'), // 195 cal
            createFoodItem('Blueberries', 'fruits', 1.5, '1.5', 'cups'), // 86 cal
            createFoodItem('Almonds', 'fat', 1, '1', 'oz') // 164 cal
            // Total: ~445 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2, '1', 'cup'), // 224 cal
            createFoodItem('Bell Peppers', 'vegetables', 1.5, '1.5', 'cups'), // 47 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~720 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Apple', 'fruits', 1.5, '1.5', 'medium'), // 78 cal
            createFoodItem('Peanut Butter', 'fat', 1, '1', 'tbsp'), // 188 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop') // 120 cal
            // Total: ~386 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Salmon', 'protein', 2.5, '8.75', 'oz'), // 520 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2, '2', 'medium'), // 172 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1, '1', 'medium') // 320 cal
            // Total: ~1052 calories
          ]
        }
        // Grand Total: ~3150 calories
      ]
    },

    // GAIN-MUSCLE - BALANCED - 6 MEALS
    'gain-muscle-balanced-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 0.75, '3/8', 'cup'), // 113 cal
            createFoodItem('Banana', 'fruits', 0.75, '3/4', 'medium'), // 67 cal
            createFoodItem('Peanut Butter', 'fat', 0.75, '3/4', 'tbsp') // 141 cal
            // Total: ~321 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1, '1', 'cup'), // 130 cal
            createFoodItem('Blueberries', 'fruits', 1, '1', 'cup'), // 57 cal
            createFoodItem('Almonds', 'fat', 0.75, '0.75', 'oz') // 123 cal
            // Total: ~310 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('String Cheese', 'supplements', 2, '2', 'sticks'), // 140 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 0.75, '3/4', 'scoop') // 90 cal
            // Total: ~282 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 1.75, '7/8', 'cup'), // 196 cal
            createFoodItem('Broccoli', 'vegetables', 1.5, '1.5', 'cups'), // 38 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~683 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop'), // 180 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 0.75, '3/4', 'tbsp') // 141 cal
            // Total: ~410 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2, '7', 'oz'), // 352 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2, '2', 'medium'), // 172 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1.25, '1.25', 'medium') // 400 cal
            // Total: ~970 calories
          ]
        }
        // Grand Total: ~2976 calories
      ]
    },

    // GAIN-MUSCLE - PERFORMANCE - 3 MEALS
    'gain-muscle-performance-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 10, '10', 'egg whites'), // 170 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1.5, '3/4', 'cup'), // 225 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Almonds', 'fat', 1.5, '1.5', 'oz') // 246 cal
            // Total: ~775 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 3, '10.5', 'oz'), // 495 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.5, '1.25', 'cups'), // 280 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~1004 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:00 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 3, '10.5', 'oz'), // 528 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1.5, '1.5', 'medium') // 480 cal
            // Total: ~1263 calories
          ]
        }
        // Grand Total: ~3042 calories
      ]
    },

    // GAIN-MUSCLE - PERFORMANCE - 5 MEALS (Keeping original from your code)
    'gain-muscle-performance-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 6, '6', 'egg whites'), // 102 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1.5, '3/4', 'cup'), // 225 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 1, '1', 'tbsp') // 188 cal
            // Total: ~604 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:30 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Apple', 'fruits', 1, '1', 'medium'), // 52 cal
            createFoodItem('Almonds', 'fat', 1, '1', 'oz') // 164 cal
            // Total: ~336 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2, '7', 'oz'), // 330 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2, '1', 'cup'), // 224 cal
            createFoodItem('Broccoli', 'vegetables', 1, '1', 'cup'), // 25 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~698 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1, '1', 'cup'), // 130 cal
            createFoodItem('Berries', 'fruits', 1, '1', 'cup') // 52 cal
            // Total: ~182 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 1.5, '5.25', 'oz'), // 264 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 1.5, '1.5', 'medium'), // 129 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 0.5, '1/2', 'medium') // 160 cal
            // Total: ~599 calories
          ]
        }
        // Grand Total: ~2419 calories
      ]
    },

    // GAIN-MUSCLE - PERFORMANCE - 6 MEALS
    'gain-muscle-performance-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 6, '6', 'egg whites'), // 102 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1, '1/2', 'cup') // 150 cal
            // Total: ~252 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:00 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop'), // 180 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 0.75, '3/4', 'tbsp') // 141 cal
            // Total: ~410 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1, '1', 'cup'), // 130 cal
            createFoodItem('Berries', 'fruits', 1, '1', 'cup'), // 52 cal
            createFoodItem('Almonds', 'fat', 0.75, '0.75', 'oz') // 123 cal
            // Total: ~305 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2, '1', 'cup'), // 224 cal
            createFoodItem('Broccoli', 'vegetables', 1.5, '1.5', 'cups'), // 38 cal
            createFoodItem('Olive Oil', 'fat', 1, '1', 'tbsp') // 119 cal
            // Total: ~794 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop'), // 120 cal
            createFoodItem('Apple', 'fruits', 1, '1', 'medium') // 52 cal
            // Total: ~172 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2.5, '8.75', 'oz'), // 440 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2, '2', 'medium'), // 172 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1.25, '1.25', 'medium') // 400 cal
            // Total: ~1052 calories
          ]
        }
        // Grand Total: ~2985 calories
      ]
    },

    // ===== DIRTY BULK PLANS (TDEE + 700+ calories) =====
    
    // DIRTY-BULK - BALANCED - 3 MEALS (~3000 calories)
    'dirty-bulk-balanced-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 2, '1', 'cup'), // 300 cal
            createFoodItem('Banana', 'fruits', 2, '2', 'medium'), // 178 cal
            createFoodItem('Peanut Butter', 'fat', 2, '2', 'tbsp'), // 376 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 2, '2', 'scoop') // 240 cal
            // Total: ~1094 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 3, '10.5', 'oz'), // 495 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 3, '1.5', 'cups'), // 336 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 2, '2', 'tbsp') // 238 cal
            // Total: ~1119 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 3, '10.5', 'oz'), // 528 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 3, '3', 'medium'), // 258 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 2, '2', 'medium') // 640 cal
            // Total: ~1472 calories
          ]
        }
        // Grand Total: ~3685 calories
      ]
    },

    // DIRTY-BULK - BALANCED - 5 MEALS
    'dirty-bulk-balanced-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 1.25, '5/8', 'cup'), // 188 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Peanut Butter', 'fat', 1.5, '1.5', 'tbsp'), // 282 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop') // 180 cal
            // Total: ~784 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 2, '2', 'cups'), // 260 cal
            createFoodItem('Blueberries', 'fruits', 2, '2', 'cups'), // 114 cal
            createFoodItem('Almonds', 'fat', 1.5, '1.5', 'oz') // 246 cal
            // Total: ~620 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.5, '1.25', 'cups'), // 280 cal
            createFoodItem('Bell Peppers', 'vegetables', 2, '2', 'cups'), // 62 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~934 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Apple', 'fruits', 2, '2', 'medium'), // 104 cal
            createFoodItem('Peanut Butter', 'fat', 1.5, '1.5', 'tbsp'), // 282 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop') // 180 cal
            // Total: ~566 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Salmon', 'protein', 3, '10.5', 'oz'), // 624 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1.5, '1.5', 'medium') // 480 cal
            // Total: ~1359 calories
          ]
        }
        // Grand Total: ~4263 calories
      ]
    },

    // DIRTY-BULK - BALANCED - 6 MEALS
    'dirty-bulk-balanced-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '7:00 AM',
          items: [
            createFoodItem('Oats (dry)', 'carbohydrate', 1, '1/2', 'cup'), // 150 cal
            createFoodItem('Banana', 'fruits', 1, '1', 'medium'), // 89 cal
            createFoodItem('Peanut Butter', 'fat', 1, '1', 'tbsp') // 188 cal
            // Total: ~427 calories
          ]
        },
        {
          mealName: 'Morning Snack',
          time: '10:00 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1.5, '1.5', 'cups'), // 195 cal
            createFoodItem('Blueberries', 'fruits', 1.5, '1.5', 'cups'), // 86 cal
            createFoodItem('Almonds', 'fat', 1.25, '1.25', 'oz') // 205 cal
            // Total: ~486 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Apple', 'fruits', 1.5, '1.5', 'medium'), // 78 cal
            createFoodItem('String Cheese', 'supplements', 3, '3', 'sticks'), // 210 cal
            createFoodItem('Whey Protein (generic)', 'supplements', 1, '1', 'scoop') // 120 cal
            // Total: ~408 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 2.5, '8.75', 'oz'), // 413 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.25, '1.125', 'cups'), // 252 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~894 calories
          ]
        },
        {
          mealName: 'Afternoon Snack',
          time: '4:00 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 2, '2', 'scoop'), // 240 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Peanut Butter', 'fat', 1.25, '1.25', 'tbsp') // 235 cal
            // Total: ~609 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:00 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2.5, '8.75', 'oz'), // 440 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1.75, '1.75', 'medium') // 560 cal
            // Total: ~1261 calories
          ]
        }
        // Grand Total: ~4085 calories
      ]
    },

    // DIRTY-BULK - PERFORMANCE - 3 MEALS
    'dirty-bulk-performance-3': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 12, '12', 'egg whites'), // 204 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 2, '1', 'cup'), // 300 cal
            createFoodItem('Banana', 'fruits', 2, '2', 'medium'), // 178 cal
            createFoodItem('Almonds', 'fat', 2, '2', 'oz') // 328 cal
            // Total: ~1010 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 4, '14', 'oz'), // 660 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 3, '1.5', 'cups'), // 336 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 2, '2', 'tbsp') // 238 cal
            // Total: ~1284 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '6:00 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 4, '14', 'oz'), // 704 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 3, '3', 'medium'), // 258 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 2, '2', 'medium') // 640 cal
            // Total: ~1642 calories
          ]
        }
        // Grand Total: ~3936 calories
      ]
    },

    // DIRTY-BULK - PERFORMANCE - 5 MEALS
    'dirty-bulk-performance-5': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 8, '8', 'egg whites'), // 136 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1.75, '7/8', 'cup'), // 263 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Peanut Butter', 'fat', 1.5, '1.5', 'tbsp') // 282 cal
            // Total: ~815 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:30 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop'), // 180 cal
            createFoodItem('Apple', 'fruits', 1.5, '1.5', 'medium'), // 78 cal
            createFoodItem('Almonds', 'fat', 1.5, '1.5', 'oz') // 246 cal
            // Total: ~504 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '12:30 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 3, '10.5', 'oz'), // 495 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.5, '1.25', 'cups'), // 280 cal
            createFoodItem('Broccoli', 'vegetables', 1.5, '1.5', 'cups'), // 38 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~992 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1.5, '1.5', 'cups'), // 195 cal
            createFoodItem('Berries', 'fruits', 1.5, '1.5', 'cups') // 78 cal
            // Total: ~273 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 2.5, '8.75', 'oz'), // 440 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Spinach', 'vegetables', 2, '2', 'cups'), // 46 cal
            createFoodItem('Avocado', 'fat', 1.5, '1.5', 'medium') // 480 cal
            // Total: ~1181 calories
          ]
        }
        // Grand Total: ~3765 calories
      ]
    },

    // DIRTY-BULK - PERFORMANCE - 6 MEALS
    'dirty-bulk-performance-6': {
      allMeals: [
        {
          mealName: 'Breakfast',
          time: '6:30 AM',
          items: [
            createFoodItem('Egg Whites', 'protein', 8, '8', 'egg whites'), // 136 cal
            createFoodItem('Oats (dry)', 'carbohydrate', 1.5, '3/4', 'cup') // 225 cal
            // Total: ~361 calories
          ]
        },
        {
          mealName: 'Mid-Morning',
          time: '9:00 AM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 2, '2', 'scoop'), // 240 cal
            createFoodItem('Banana', 'fruits', 1.5, '1.5', 'medium'), // 134 cal
            createFoodItem('Peanut Butter', 'fat', 1.25, '1.25', 'tbsp') // 235 cal
            // Total: ~609 calories
          ]
        },
        {
          mealName: 'Pre-Lunch',
          time: '11:30 AM',
          items: [
            createFoodItem('Greek Yogurt (non-fat)', 'protein', 1.5, '1.5', 'cups'), // 195 cal
            createFoodItem('Berries', 'fruits', 1.5, '1.5', 'cups'), // 78 cal
            createFoodItem('Almonds', 'fat', 1.25, '1.25', 'oz') // 205 cal
            // Total: ~478 calories
          ]
        },
        {
          mealName: 'Lunch',
          time: '1:00 PM',
          items: [
            createFoodItem('Chicken Breast', 'protein', 3, '10.5', 'oz'), // 495 cal
            createFoodItem('Brown Rice (cooked)', 'carbohydrate', 2.5, '1.25', 'cups'), // 280 cal
            createFoodItem('Broccoli', 'vegetables', 2, '2', 'cups'), // 50 cal
            createFoodItem('Olive Oil', 'fat', 1.5, '1.5', 'tbsp') // 179 cal
            // Total: ~1004 calories
          ]
        },
        {
          mealName: 'Pre-Workout',
          time: '4:30 PM',
          items: [
            createFoodItem('Whey Protein (generic)', 'supplements', 1.5, '1.5', 'scoop'), // 180 cal
            createFoodItem('Apple', 'fruits', 1.5, '1.5', 'medium') // 78 cal
            // Total: ~258 calories
          ]
        },
        {
          mealName: 'Dinner',
          time: '7:30 PM',
          items: [
            createFoodItem('Lean Beef (90/10)', 'protein', 3, '10.5', 'oz'), // 528 cal
            createFoodItem('Sweet Potato', 'carbohydrate', 2.5, '2.5', 'medium'), // 215 cal
            createFoodItem('Asparagus', 'vegetables', 2, '2', 'cups'), // 40 cal
            createFoodItem('Avocado', 'fat', 1.75, '1.75', 'medium') // 560 cal
            // Total: ~1343 calories
          ]
        }
        // Grand Total: ~4053 calories
      ]
    }
  };

  return mealPlans;
};

export default WeekPlanModal;
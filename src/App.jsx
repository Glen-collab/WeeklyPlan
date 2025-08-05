import React, { useState } from 'react';
import { X, Scale, Coffee, Hand } from 'lucide-react';
import MealTracker from './MealTracker.jsx';
import { FoodDatabase, servingSizeConversions, getServingInfo } from './FoodDatabase.js';
import { calculateTotals, preparePieData, calculateTDEE } from './Utils.js';

// Sample user profile - you can customize this
const defaultUserProfile = {
  firstName: "Glen",
  weight: 180,
  targetCalories: 2200,
  activityLevel: "moderate"
};

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial food item structure
const createFoodItem = () => ({
  id: generateId(),
  category: '',
  food: '',
  serving: 1,
  displayServing: '1',
  displayUnit: 'servings'
});

const NutritionApp = () => {
  // User profile state
  const [userProfile] = useState(defaultUserProfile);
  
  // State for each meal type
  const [meals, setMeals] = useState({
    breakfast: {
      time: '7:00 AM',
      items: [createFoodItem()]
    },
    firstSnack: {
      time: '9:00 AM',
      items: [createFoodItem()]
    },
    secondSnack: {
      time: '11:00 AM',
      items: [createFoodItem()]
    },
    lunch: {
      time: '12:30 PM',
      items: [createFoodItem()]
    },
    midAfternoon: {
      time: '3:00 PM',
      items: [createFoodItem()]
    },
    dinner: {
      time: '6:30 PM',
      items: [createFoodItem()]
    },
    lateSnack: {
      time: '8:30 PM',
      items: [createFoodItem()]
    },
    postWorkout: {
      time: '5:00 PM',
      items: [createFoodItem()]
    }
  });

  // Serving modal state - FIXED VERSION
  const [servingModal, setServingModal] = useState({
    isOpen: false,
    mealType: '',
    item: null
  });

  // NEW: Custom serving state for the modal
  const [customServing, setCustomServing] = useState({ 
    amount: 1, 
    unit: 'servings' 
  });

  // Calculate TDEE data using external function
  const calorieData = calculateTDEE(userProfile);

  // Calculate totals for a meal using external function
  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const totals = calculateTotals(meal.items);
    const pieData = preparePieData(totals);
    return { totals, pieData };
  };

  // Handler functions
  const handleTimeChange = (mealType, newTime) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        time: newTime
      }
    }));
  };

  const handleAddFoodItem = (mealType) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: [...prev[mealType].items, createFoodItem()]
      }
    }));
  };

  const handleRemoveFoodItem = (mealType, itemId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const handleUpdateFoodItem = (mealType, itemId, field, value) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.map(item => 
          item.id === itemId 
            ? { ...item, [field]: value }
            : item
        )
      }
    }));
  };

  // FIXED: Open serving modal with proper initialization
  const handleOpenServingModal = (mealType, item) => {
    setServingModal({
      isOpen: true,
      mealType,
      item
    });
    // Initialize the custom serving with the current item's values
    setCustomServing({ 
      amount: parseFloat(item.displayServing) || 1, 
      unit: item.displayUnit || 'servings' 
    });
  };

  // FIXED: Close serving modal
  const handleCloseServingModal = () => {
    setServingModal({
      isOpen: false,
      mealType: '',
      item: null
    });
  };

  // NEW: Apply the custom serving size changes
  const handleApplyCustomServing = () => {
    if (servingModal.item && servingModal.mealType) {
      let finalServing = customServing.amount;
      
      // Convert different units to serving multiplier
      if (customServing.unit === 'grams' && servingModal.item.category && servingModal.item.food) {
        const baseGrams = servingSizeConversions[servingModal.item.category]?.[servingModal.item.food]?.grams || 100;
        finalServing = customServing.amount / baseGrams;
      } else if (customServing.unit === 'ounces' && servingModal.item.category && servingModal.item.food) {
        const baseOunces = servingSizeConversions[servingModal.item.category]?.[servingModal.item.food]?.ounces || 3.5;
        finalServing = customServing.amount / baseOunces;
      } else if (customServing.unit === 'cups' && servingModal.item.category && servingModal.item.food) {
        const baseCups = servingSizeConversions[servingModal.item.category]?.[servingModal.item.food]?.cups || 0.5;
        finalServing = customServing.amount / baseCups;
      }

      // Update the meal with the new serving size
      setMeals(prev => ({
        ...prev,
        [servingModal.mealType]: {
          ...prev[servingModal.mealType],
          items: prev[servingModal.mealType].items.map(item => 
            item.id === servingModal.item.id 
              ? { 
                  ...item, 
                  serving: finalServing,
                  displayServing: customServing.amount.toString(),
                  displayUnit: customServing.unit
                }
              : item
          )
        }
      }));
      
      handleCloseServingModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🥗 Nutrition Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {userProfile.firstName}! Track your daily nutrition goals.
          </p>
        </div>

        {/* Meal Trackers */}
        <div className="space-y-6">
          {Object.keys(meals).map(mealType => {
            const { totals, pieData } = getMealData(mealType);
            
            return (
              <MealTracker
                key={mealType}
                mealType={mealType}
                time={meals[mealType].time}
                setTime={(newTime) => handleTimeChange(mealType, newTime)}
                items={meals[mealType].items}
                totals={totals}
                pieData={pieData}
                warnings={[]} // You can add warning logic here
                userProfile={userProfile}
                calorieData={calorieData || {}} // You can add calorie goal logic here
                previousMeals={meals}
                onOpenServingModal={handleOpenServingModal}
                onUpdateFoodItem={handleUpdateFoodItem}
                onAddFoodItem={handleAddFoodItem}
                onRemoveFoodItem={handleRemoveFoodItem}
              />
            );
          })}
        </div>

        {/* Daily Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            📊 Daily Summary
          </h2>
          {(() => {
            const totalDailyCalories = Object.keys(meals).reduce((sum, mealType) => {
              const { totals } = getMealData(mealType);
              return sum + totals.calories;
            }, 0);
            
            return (
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(totalDailyCalories)} / {userProfile.targetCalories} calories
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ 
                      width: `${Math.min((totalDailyCalories / userProfile.targetCalories) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  {totalDailyCalories < userProfile.targetCalories 
                    ? `${userProfile.targetCalories - Math.round(totalDailyCalories)} calories remaining`
                    : totalDailyCalories > userProfile.targetCalories
                    ? `${Math.round(totalDailyCalories - userProfile.targetCalories)} calories over target`
                    : "Perfect! You've hit your calorie target!"
                  }
                </p>
              </div>
            );
          })()}
        </div>

        {/* FIXED: Fully Functional Serving Modal */}
        {servingModal.isOpen && servingModal.item && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Serving Size - {servingModal.item.food || 'Food Item'}
                </h3>
                <button
                  onClick={handleCloseServingModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customServing.amount}
                    onChange={(e) => setCustomServing({ 
                      ...customServing, 
                      amount: parseFloat(e.target.value) || 0 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={customServing.unit}
                    onChange={(e) => setCustomServing({ 
                      ...customServing, 
                      unit: e.target.value 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="servings">Servings</option>
                    <option value="grams">Grams</option>
                    <option value="ounces">Ounces</option>
                    <option value="cups">Cups</option>
                  </select>
                </div>

                {/* Reference serving size info */}
                {servingModal.item.category && servingModal.item.food && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Reference Serving Size:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Scale size={14} />
                        <span>{getServingInfo(servingModal.item.category, servingModal.item.food).grams}g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coffee size={14} />
                        <span>{getServingInfo(servingModal.item.category, servingModal.item.food).ounces} oz / {getServingInfo(servingModal.item.category, servingModal.item.food).cups} cups</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hand size={14} />
                        <span>{getServingInfo(servingModal.item.category, servingModal.item.food).palm}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleApplyCustomServing}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleCloseServingModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionApp;
import React, { useState } from 'react';
import MealTracker from './MealTracker.jsx';
import { FoodDatabase } from './FoodDatabase.js';
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

  // Serving modal state
  const [servingModal, setServingModal] = useState({
    isOpen: false,
    mealType: '',
    item: null
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

  const handleOpenServingModal = (mealType, item) => {
    setServingModal({
      isOpen: true,
      mealType,
      item
    });
  };

  const handleCloseServingModal = () => {
    setServingModal({
      isOpen: false,
      mealType: '',
      item: null
    });
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

        <p style={{backgroundColor: 'yellow', padding: '10px', textAlign: 'center', fontSize: '20px'}}>
          DEBUG: App is rendering with {Object.keys(meals).length} meals
        </p>

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

        {/* Simple Serving Modal */}
        {servingModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Adjust Serving Size</h3>
              <p className="mb-4">
                Current serving: {servingModal.item?.displayServing} {servingModal.item?.displayUnit}
              </p>
              {/* You can add serving adjustment controls here */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCloseServingModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionApp;
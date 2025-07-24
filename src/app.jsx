import React, { useState } from 'react';
import MealTracker from './MealTracker';

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
  displayUnit: ''
});

// Calculate totals for a meal
const calculateTotals = (items, foodDatabase) => {
  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  
  items.forEach(item => {
    if (item.category && item.food && foodDatabase[item.category] && foodDatabase[item.category][item.food]) {
      const food = foodDatabase[item.category][item.food];
      totalCalories += food.calories * item.serving;
      totalProtein += food.protein * item.serving;
      totalCarbs += food.carbs * item.serving;
      totalFat += food.fat * item.serving;
    }
  });
  
  return {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat
  };
};

// Generate pie chart data
const generatePieData = (totals) => {
  const total = totals.protein + totals.carbs + totals.fat;
  if (total === 0) return [];
  
  return [
    {
      name: 'Protein',
      value: totals.protein,
      percentage: Math.round((totals.protein / total) * 100),
      color: '#FF6B6B'
    },
    {
      name: 'Carbs',
      value: totals.carbs,
      percentage: Math.round((totals.carbs / total) * 100),
      color: '#4ECDC4'
    },
    {
      name: 'Fat',
      value: totals.fat,
      percentage: Math.round((totals.fat / total) * 100),
      color: '#45B7D1'
    }
  ];
};

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

  // Simple food database (you can expand this)
  const foodDatabase = {
    proteins: {
      'Chicken Breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'Salmon': { calories: 208, protein: 22, carbs: 0, fat: 12 },
      'Eggs': { calories: 155, protein: 13, carbs: 1, fat: 11 },
      'Greek Yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0 }
    },
    carbs: {
      'Brown Rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8 },
      'Sweet Potato': { calories: 112, protein: 2, carbs: 26, fat: 0.1 },
      'Oatmeal': { calories: 147, protein: 5, carbs: 28, fat: 2.5 },
      'Banana': { calories: 105, protein: 1, carbs: 27, fat: 0.3 }
    },
    vegetables: {
      'Broccoli': { calories: 25, protein: 3, carbs: 5, fat: 0.3 },
      'Spinach': { calories: 7, protein: 1, carbs: 1, fat: 0.1 },
      'Bell Peppers': { calories: 20, protein: 1, carbs: 5, fat: 0.2 },
      'Carrots': { calories: 25, protein: 1, carbs: 6, fat: 0.1 }
    },
    fats: {
      'Avocado': { calories: 160, protein: 2, carbs: 9, fat: 15 },
      'Almonds': { calories: 161, protein: 6, carbs: 6, fat: 14 },
      'Olive Oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
      'Peanut Butter': { calories: 588, protein: 25, carbs: 20, fat: 50 }
    }
  };

  // Calculate totals and pie data for each meal
  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const totals = calculateTotals(meal.items, foodDatabase);
    const pieData = generatePieData(totals);
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
                calorieData={{}} // You can add calorie goal logic here
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
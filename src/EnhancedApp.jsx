import React, { useState, useEffect } from 'react';
import { X, Scale, Coffee, Hand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MealTracker from './MealTracker.jsx';
import { FoodDatabase, servingSizeConversions, getServingInfo, getAllCategories, getFoodsInCategory } from './FoodDatabase.js';
import { calculateTotals, preparePieData, calculateTDEE, getServingWarnings } from './Utils.js';

const defaultUserProfile = {
  firstName: '',
  lastName: '',
  heightFeet: '',
  heightInches: '',
  weight: '',
  exerciseLevel: '',
  goal: '',
  gender: ''
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const createFoodItem = () => ({
  id: generateId(),
  category: '',
  food: '',
  serving: 1,
  displayServing: '1',
  displayUnit: 'servings'
});

// Simple Swipeable Meal Cards Modal
const SwipeableMealModal = ({ 
  isOpen,
  onClose,
  meals, 
  userProfile, 
  calorieData, 
  isMobile,
  removedFoods,
  removedMeals,
  onRemoveMeal,
  onRestoreMeal
}) => {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
  const mealLabels = {
    breakfast: 'Breakfast',
    firstSnack: 'Morning Snack', 
    secondSnack: 'Mid-Morning Snack',
    lunch: 'Lunch',
    midAfternoon: 'Afternoon Snack',
    dinner: 'Dinner',
    lateSnack: 'Evening Snack',
    postWorkout: 'Post-Workout'
  };

  // Filter out removed meals
  const activeMealTypes = allMealTypes.filter(mealType => !removedMeals.has(mealType));
  
  // Ensure current index is valid
  const validCurrentIndex = Math.min(currentMealIndex, activeMealTypes.length - 1);
  const currentMealType = activeMealTypes[validCurrentIndex] || activeMealTypes[0];

  // Get meal data
  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const activeItems = meal.items.filter(item => 
      !removedFoods.has(`${mealType}-${item.id}`)
    );
    const totals = calculateTotals(activeItems);
    return { totals, activeItems };
  };

  // Touch handlers for swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && validCurrentIndex < activeMealTypes.length - 1) {
      navigateToMeal(validCurrentIndex + 1);
    }
    if (isRightSwipe && validCurrentIndex > 0) {
      navigateToMeal(validCurrentIndex - 1);
    }
    
    setTouchStart(null);
  };

  const navigateToMeal = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentMealIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  if (!isOpen) return null;

  // If no active meals, show restore interface
  if (activeMealTypes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🍽️ No Active Meals</h2>
            <p className="text-gray-600 mb-6">You've removed all meals. Restore some to continue!</p>
            
            <div className="grid grid-cols-2 gap-3">
              {allMealTypes.map(mealType => (
                <button
                  key={mealType}
                  onClick={() => onRestoreMeal(mealType)}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <span className="font-medium">🔄 {mealLabels[mealType]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totals, activeItems } = getMealData(currentMealType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              {mealLabels[currentMealType]}
            </h2>
            <p className="text-blue-100">
              {validCurrentIndex + 1} of {activeMealTypes.length} meals • {meals[currentMealType].time}
            </p>
          </div>

          {/* Meal Card Content */}
          <div className={`p-6 transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            
            {/* Calorie Summary */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round(totals.calories)}
              </div>
              <div className="text-gray-600">calories in this meal</div>
            </div>

            {/* Macro Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(totals.protein)}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{Math.round(totals.carbs)}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(totals.fat)}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>

            {/* Sugar Warning */}
            {totals.sugar > 0 && (
              <div className={`text-center mb-6 p-3 rounded-lg ${
                totals.sugar > 20 ? 'bg-red-100 border border-red-300' :
                totals.sugar > 10 ? 'bg-yellow-100 border border-yellow-300' :
                'bg-green-100 border border-green-300'
              }`}>
                <div className="text-lg font-bold">
                  {Math.round(totals.sugar)}g sugar
                </div>
                <div className="text-sm text-gray-600">
                  {totals.sugar > 20 ? '⚠️ High sugar content' :
                   totals.sugar > 10 ? '💡 Moderate sugar' :
                   '✅ Low sugar'}
                </div>
              </div>
            )}

            {/* Food Count */}
            <div className="text-center mb-6">
              <div className="text-lg text-gray-600">
                📊 {activeItems.filter(item => item.food).length} food item(s) selected
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onRemoveMeal(currentMealType)}
                className="w-full py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                🗑️ Remove This Meal
              </button>
              
              {removedMeals.size > 0 && (
                <button
                  onClick={() => {
                    const mealToRestore = Array.from(removedMeals)[0];
                    onRestoreMeal(mealToRestore);
                  }}
                  className="w-full py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  🔄 Restore Latest Removed Meal
                </button>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToMeal(Math.max(0, validCurrentIndex - 1))}
                disabled={validCurrentIndex === 0 || isTransitioning}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  validCurrentIndex === 0 || isTransitioning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                ← Previous
              </button>
              
              <div className="flex space-x-2">
                {activeMealTypes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isTransitioning && navigateToMeal(index)}
                    disabled={isTransitioning}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === validCurrentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => navigateToMeal(Math.min(activeMealTypes.length - 1, validCurrentIndex + 1))}
                disabled={validCurrentIndex === activeMealTypes.length - 1 || isTransitioning}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  validCurrentIndex === activeMealTypes.length - 1 || isTransitioning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next →
              </button>
            </div>
            
            <div className="mt-3 text-center text-xs text-gray-500">
              👈 Swipe left/right to navigate meals 👉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Swipeable Meal Cards Modal
const SwipeableMealModal = ({ 
  isOpen,
  onClose,
  meals, 
  userProfile, 
  calorieData, 
  isMobile,
  removedFoods,
  removedMeals,
  onRemoveMeal,
  onRestoreMeal
}) => {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
  const mealLabels = {
    breakfast: 'Breakfast',
    firstSnack: 'Morning Snack', 
    secondSnack: 'Mid-Morning Snack',
    lunch: 'Lunch',
    midAfternoon: 'Afternoon Snack',
    dinner: 'Dinner',
    lateSnack: 'Evening Snack',
    postWorkout: 'Post-Workout'
  };

  // Filter out removed meals
  const activeMealTypes = allMealTypes.filter(mealType => !removedMeals.has(mealType));
  
  // Ensure current index is valid
  const validCurrentIndex = Math.min(currentMealIndex, activeMealTypes.length - 1);
  const currentMealType = activeMealTypes[validCurrentIndex] || activeMealTypes[0];

  // Get meal data
  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const activeItems = meal.items.filter(item => 
      !removedFoods.has(`${mealType}-${item.id}`)
    );
    const totals = calculateTotals(activeItems);
    return { totals, activeItems };
  };

  // Touch handlers for swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && validCurrentIndex < activeMealTypes.length - 1) {
      navigateToMeal(validCurrentIndex + 1);
    }
    if (isRightSwipe && validCurrentIndex > 0) {
      navigateToMeal(validCurrentIndex - 1);
    }
    
    setTouchStart(null);
  };

  const navigateToMeal = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentMealIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  if (!isOpen) return null;

  // If no active meals, show restore interface
  if (activeMealTypes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🍽️ No Active Meals</h2>
            <p className="text-gray-600 mb-6">You've removed all meals. Restore some to continue!</p>
            
            <div className="grid grid-cols-2 gap-3">
              {allMealTypes.map(mealType => (
                <button
                  key={mealType}
                  onClick={() => onRestoreMeal(mealType)}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <span className="font-medium">🔄 {mealLabels[mealType]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totals, activeItems } = getMealData(currentMealType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              {mealLabels[currentMealType]}
            <button
          onClick={onOpenSwipeModal}
          className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-2 text-sm'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-medium transition-all duration-300 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 transform hover:scale-105 shadow-lg`}
        >
          <span>📱</span>
          {isMobile ? 'Swipe View' : 'Open Swipe Interface'}
        </button>
            <p className="text-blue-100">
              {validCurrentIndex + 1} of {activeMealTypes.length} meals • {meals[currentMealType].time}
            </p>
          </div>

          {/* Meal Card Content */}
          <div className={`p-6 transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            
            {/* Calorie Summary */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round(totals.calories)}
              </div>
              <div className="text-gray-600">calories in this meal</div>
            </div>

            {/* Macro Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(totals.protein)}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{Math.round(totals.carbs)}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(totals.fat)}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>

            {/* Sugar Warning */}
            {totals.sugar > 0 && (
              <div className={`text-center mb-6 p-3 rounded-lg ${
                totals.sugar > 20 ? 'bg-red-100 border border-red-300' :
                totals.sugar > 10 ? 'bg-yellow-100 border border-yellow-300' :
                'bg-green-100 border border-green-300'
              }`}>
                <div className="text-lg font-bold">
                  {Math.round(totals.sugar)}g sugar
                </div>
                <div className="text-sm text-gray-600">
                  {totals.sugar > 20 ? '⚠️ High sugar content' :
                   totals.sugar > 10 ? '💡 Moderate sugar' :
                   '✅ Low sugar'}
                </div>
              </div>
            )}

            {/* Food Count */}
            <div className="text-center mb-6">
              <div className="text-lg text-gray-600">
                📊 {activeItems.filter(item => item.food).length} food item(s) selected
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onRemoveMeal(currentMealType)}
                className="w-full py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                🗑️ Remove This Meal
              </button>
              
              {removedMeals.size > 0 && (
                <button
                  onClick={() => {
                    const mealToRestore = Array.from(removedMeals)[0];
                    onRestoreMeal(mealToRestore);
                  }}
                  className="w-full py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  🔄 Restore Latest Removed Meal
                </button>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToMeal(Math.max(0, validCurrentIndex - 1))}
                disabled={validCurrentIndex === 0 || isTransitioning}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  validCurrentIndex === 0 || isTransitioning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                ← Previous
              </button>
              
              <div className="flex space-x-2">
                {activeMealTypes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isTransitioning && navigateToMeal(index)}
                    disabled={isTransitioning}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === validCurrentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => navigateToMeal(Math.min(activeMealTypes.length - 1, validCurrentIndex + 1))}
                disabled={validCurrentIndex === activeMealTypes.length - 1 || isTransitioning}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  validCurrentIndex === activeMealTypes.length - 1 || isTransitioning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next →
              </button>
            </div>
            
            <div className="mt-3 text-center text-xs text-gray-500">
              👈 Swipe left/right to navigate meals 👉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Static Meal Interface
const SimpleMealInterface = ({ 
  meals, 
  onTimeChange, 
  onAddFoodItem, 
  onRemoveFoodItem, 
  onUpdateFoodItem, 
  onOpenServingModal, 
  onOpenFoodModal, 
  userProfile, 
  calorieData, 
  isMobile,
  getAllMealsData,
  removedFoods,
  removedMeals,
  onRemoveMeal,
  onRestoreMeal,
  onOpenSwipeModal
}) => {
  const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
  const mealLabels = {
    breakfast: 'Breakfast',
    firstSnack: 'Morning Snack', 
    secondSnack: 'Mid-Morning Snack',
    lunch: 'Lunch',
    midAfternoon: 'Afternoon Snack',
    dinner: 'Dinner',
    lateSnack: 'Evening Snack',
    postWorkout: 'Post-Workout'
  };

  // Filter out removed meals
  const activeMealTypes = allMealTypes.filter(mealType => !removedMeals.has(mealType));

  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const activeItems = meal.items.filter(item => 
      !removedFoods.has(`${mealType}-${item.id}`)
    );
    const totals = calculateTotals(activeItems);
    return { totals, activeItems };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800`}>
          🍽️ Your Meals ({activeMealTypes.length} active)
        </h2>
      </div>

      {/* Meal Summary Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {activeMealTypes.map(mealType => {
          const { totals, activeItems } = getMealData(mealType);
          const isMainMeal = ['breakfast', 'lunch', 'dinner'].includes(mealType);
          
          return (
            <div key={mealType} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">
                  {mealLabels[mealType]}
                </h3>
                <span className="text-xs text-gray-500">{meals[mealType].time}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{Math.round(totals.calories)}</div>
                  <div className="text-gray-600">Cal</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{Math.round(totals.protein)}g</div>
                  <div className="text-gray-600">Pro</div>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                {activeItems.filter(item => item.food).length} food item(s)
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onRemoveMeal(mealType)}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Add Removed Meals Back */}
        {removedMeals.size > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-bold text-blue-800 text-sm mb-3">Restore Meals</h3>
            <div className="space-y-2">
              {Array.from(removedMeals).slice(0, 3).map(mealType => (
                <button
                  key={mealType}
                  onClick={() => onRestoreMeal(mealType)}
                  className="w-full text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors text-left"
                >
                  🔄 {mealLabels[mealType]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Static Meal Interface
const SimpleMealInterface = ({ 
  meals, 
  onTimeChange, 
  onAddFoodItem, 
  onRemoveFoodItem, 
  onUpdateFoodItem, 
  onOpenServingModal, 
  onOpenFoodModal, 
  userProfile, 
  calorieData, 
  isMobile,
  getAllMealsData,
  removedFoods,
  removedMeals,
  onRemoveMeal,
  onRestoreMeal,
  onOpenSwipeModal
}) => {
  const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
  const mealLabels = {
    breakfast: 'Breakfast',
    firstSnack: 'Morning Snack', 
    secondSnack: 'Mid-Morning Snack',
    lunch: 'Lunch',
    midAfternoon: 'Afternoon Snack',
    dinner: 'Dinner',
    lateSnack: 'Evening Snack',
    postWorkout: 'Post-Workout'
  };

  // Filter out removed meals
  const activeMealTypes = allMealTypes.filter(mealType => !removedMeals.has(mealType));

  const getMealData = (mealType) => {
    const meal = meals[mealType];
    const activeItems = meal.items.filter(item => 
      !removedFoods.has(`${mealType}-${item.id}`)
    );
    const totals = calculateTotals(activeItems);
    return { totals, activeItems };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800`}>
          🍽️ Your Meals ({activeMealTypes.length} active)
        </h2>
        
        <button
          onClick={onOpenSwipeModal}
          className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-2 text-sm'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-medium transition-all duration-300 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 transform hover:scale-105 shadow-lg`}
        >
          <span>📱</span>
          {isMobile ? 'Swipe View' : 'Open Swipe Interface'}
        </button>
      </div>

      {/* Meal Summary Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {activeMealTypes.map(mealType => {
          const { totals, activeItems } = getMealData(mealType);
          const isMainMeal = ['breakfast', 'lunch', 'dinner'].includes(mealType);
          
          return (
            <div key={mealType} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">
                  {mealLabels[mealType]}
                </h3>
                <span className="text-xs text-gray-500">{meals[mealType].time}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{Math.round(totals.calories)}</div>
                  <div className="text-gray-600">Cal</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{Math.round(totals.protein)}g</div>
                  <div className="text-gray-600">Pro</div>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                {activeItems.filter(item => item.food).length} food item(s)
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onRemoveMeal(mealType)}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Add Removed Meals Back */}
        {removedMeals.size > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-bold text-blue-800 text-sm mb-3">Restore Meals</h3>
            <div className="space-y-2">
              {Array.from(removedMeals).slice(0, 3).map(mealType => (
                <button
                  key={mealType}
                  onClick={() => onRestoreMeal(mealType)}
                  className="w-full text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors text-left"
                >
                  🔄 {mealLabels[mealType]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={onOpenSwipeModal}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          📱 Open Swipe Interface for detailed editing
        </button>
      </div>
    </div>
  );
};

// Daily Summary Component
const DailySummary = ({ allMeals, userProfile, calorieData, isMobile, removedMeals }) => {
  // Calculate total daily nutrition using only active (non-removed) meals
  const calculateDailyTotals = () => {
    return Object.values(allMeals).reduce((totals, meal) => {
      const mealTotals = meal.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 };
      return {
        calories: totals.calories + mealTotals.calories,
        protein: totals.protein + mealTotals.protein,
        carbs: totals.carbs + mealTotals.carbs,
        fat: totals.fat + mealTotals.fat,
        sugar: totals.sugar + mealTotals.sugar
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 });
  };

  const dailyTotals = calculateDailyTotals();
  const dailyPieData = preparePieData(dailyTotals);

  const targetCalories = calorieData?.targetCalories || 2200;
  const progressPercentage = Math.min((dailyTotals.calories / targetCalories) * 100, 100);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // Blue, Green, Orange

  const activeMealCount = Object.keys(allMeals).length;
  const totalMealSlots = 8;
  const removedMealCount = removedMeals.size;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-6 text-center`}>
        📊 Daily Nutrition Summary
      </h2>
      
      {/* Active Meals Indicator */}
      {activeMealCount < totalMealSlots && (
        <div className="mb-4 text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
          🍽️ Using {activeMealCount} of {totalMealSlots} meal slots
          {removedMealCount > 0 && ` • ${removedMealCount} meals removed`}
        </div>
      )}

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
        
        {/* Calorie Progress */}
        <div className="space-y-4">
          <div className="text-center">
            <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-600 mb-2`}>
              {Math.round(dailyTotals.calories)} / {targetCalories} calories
            </div>
            <div className={`w-full bg-gray-200 rounded-full ${isMobile ? 'h-6' : 'h-4'} mb-4`}>
              <div 
                className={`bg-blue-600 ${isMobile ? 'h-6' : 'h-4'} rounded-full transition-all duration-500`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
              {(() => {
                if (dailyTotals.calories < targetCalories) {
                  return `${targetCalories - Math.round(dailyTotals.calories)} calories remaining`;
                } else if (dailyTotals.calories > targetCalories) {
                  return `${Math.round(dailyTotals.calories - targetCalories)} calories over target`;
                } else {
                  return "Perfect! You've hit your calorie target!";
                }
              })()}
            </p>
          </div>

          {/* Macro Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3 text-center">Daily Macros</h3>
            <div className="space-y-2">
              {dailyPieData.map((entry, index) => (
                <div key={entry.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="text-sm font-medium">{entry.name}:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{entry.value}g</span>
                    <span className="text-sm text-gray-500 ml-1">({entry.percentage}%)</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Sugar:</span>
                <span className={`font-bold ${
                  dailyTotals.sugar > 50 ? 'text-red-600' : 
                  dailyTotals.sugar > 25 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {Math.round(dailyTotals.sugar)}g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Pie Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-gray-800 mb-4">Macro Distribution</h3>
          <div style={{ width: isMobile ? 250 : 300, height: isMobile ? 250 : 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dailyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 80 : 100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dailyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}g (${dailyPieData.find(d => d.name === name)?.percentage}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Goal-specific feedback */}
          {userProfile.goal && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                <strong>Goal:</strong> {userProfile.goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const NutritionApp = () => {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('chart');
  
  // Track removed foods (foods user swiped away)
  const [removedFoods, setRemovedFoods] = useState(new Set());
  
  // Track removed meals (entire meals user swiped away)
  const [removedMeals, setRemovedMeals] = useState(new Set());
  
  // Swipe modal state
  const [showSwipeModal, setShowSwipeModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
      time: '5:00 AM',
      items: [createFoodItem()]
    }
  });

  // All modals and state management
  const [servingModal, setServingModal] = useState({
    isOpen: false,
    mealType: '',
    item: null
  });

  const [foodModal, setFoodModal] = useState({
    isOpen: false,
    mealType: '',
    item: null,
    category: ''
  });

  const [profileModal, setProfileModal] = useState({
    isOpen: false
  });

  const [customServing, setCustomServing] = useState({ 
    amount: 1, 
    unit: 'servings' 
  });

  const calorieData = calculateTDEE(userProfile);

  const getMealData = (mealType) => {
    const meal = meals[mealType];
    // Filter out removed foods
    const activeItems = meal.items.filter(item => 
      !removedFoods.has(`${mealType}-${item.id}`)
    );
    const totals = calculateTotals(activeItems);
    const pieData = preparePieData(totals);
    return { totals, pieData, activeItems };
  };

  // Handle removing entire meals (swipe up/down)
  const handleRemoveMeal = (mealType) => {
    setRemovedMeals(prev => new Set([...prev, mealType]));
  };

  // Handle restoring removed meals
  const handleRestoreMeal = (mealType) => {
    setRemovedMeals(prev => {
      const newSet = new Set([...prev]);
      newSet.delete(mealType);
      return newSet;
    });
  };

  const getAllMealsData = () => {
    const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
    const result = {};
    
    // Only include non-removed meals in the data
    allMealTypes.forEach(mealType => {
      if (!removedMeals.has(mealType)) {
        const mealData = getMealData(mealType);
        result[mealType] = {
          time: meals[mealType].time,
          totals: mealData.totals,
          items: meals[mealType].items,
          activeItems: mealData.activeItems,
          pieData: mealData.pieData
        };
      }
    });
    
    return result;
  };

  // Swipe modal handlers
  const openSwipeModal = () => {
    setShowSwipeModal(true);
  };

  const closeSwipeModal = () => {
    setShowSwipeModal(false);
  };

  // All existing handler functions
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

  // Modal handlers
  const handleOpenServingModal = (mealType, item) => {
    setServingModal({
      isOpen: true,
      mealType,
      item
    });
    setCustomServing({ 
      amount: parseFloat(item.displayServing) || 1, 
      unit: item.displayUnit || 'servings' 
    });
  };

  const handleCloseServingModal = () => {
    setServingModal({
      isOpen: false,
      mealType: '',
      item: null
    });
  };

  const handleOpenFoodModal = (mealType, item, category) => {
    setFoodModal({
      isOpen: true,
      mealType,
      item,
      category
    });
  };

  const handleCloseFoodModal = () => {
    setFoodModal({
      isOpen: false,
      mealType: '',
      item: null,
      category: ''
    });
  };

  const handleOpenProfileModal = () => {
    setProfileModal({ isOpen: true });
  };

  const handleCloseProfileModal = () => {
    setProfileModal({ isOpen: false });
  };

  const updateUserProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const setDemoMaleProfile = () => {
    setUserProfile({
      firstName: 'John',
      lastName: 'Doe',
      heightFeet: '5',
      heightInches: '10',
      weight: '165',
      exerciseLevel: 'moderate',
      goal: 'maintain',
      gender: 'male'
    });
  };

  const setDemoFemaleProfile = () => {
    setUserProfile({
      firstName: 'Jane',
      lastName: 'Doe',
      heightFeet: '5',
      heightInches: '6',
      weight: '135',
      exerciseLevel: 'moderate',
      goal: 'maintain',
      gender: 'female'
    });
  };

  const handleSelectFood = (selectedFood) => {
    if (foodModal.item && foodModal.mealType) {
      handleUpdateFoodItem(foodModal.mealType, foodModal.item.id, 'food', selectedFood);
      handleCloseFoodModal();
      
      const updatedItem = { ...foodModal.item, food: selectedFood, category: foodModal.category };
      setTimeout(() => {
        handleOpenServingModal(foodModal.mealType, updatedItem);
      }, 100);
    }
  };

  const handleApplyCustomServing = () => {
    if (servingModal.item && servingModal.mealType) {
      let finalServing = customServing.amount;
      
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

  const getTimelineData = () => {
    const allMealTypes = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
    const mealLabels = {
      breakfast: 'Breakfast',
      firstSnack: 'Morning Snack', 
      secondSnack: 'Mid-Morning Snack',
      lunch: 'Lunch',
      midAfternoon: 'Afternoon Snack',
      dinner: 'Dinner',
      lateSnack: 'Evening Snack',
      postWorkout: 'Post-Workout'
    };

    const timeToHours = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      return hour24 + minutes / 60;
    };

    // Only include active (non-removed) meals in timeline
    const basicTimelineData = allMealTypes
      .filter(mealType => !removedMeals.has(mealType))
      .map((mealType, index) => {
        const mealData = getMealData(mealType); // This already filters out removed foods
        const { totals } = mealData;
        return {
          name: isMobile ? mealLabels[mealType] : `${mealLabels[mealType]}\n${meals[mealType].time}`,
          shortName: mealLabels[mealType],
          fullName: mealLabels[mealType],
          time: meals[mealType].time,
          timeHours: timeToHours(meals[mealType].time),
          calories: Math.round(totals.calories),
          sugar: Math.round(totals.sugar),
          sugarScaled: Math.round(totals.sugar) * 10,
          order: index,
          mealType: mealType
        };
      });

    return [...basicTimelineData].sort((a, b) => a.timeHours - b.timeHours);
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isMobile ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-4'} space-y-8`}>
        
        {/* SECTION 1: HEADER & PROFILE CARD */}
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-gray-800 mb-2`}>
            🥗 Nutrition Tracker
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600`}>
            Welcome back{userProfile.firstName ? `, ${userProfile.firstName}` : ''}! Track your daily nutrition goals.
          </p>
        </div>

        <div className={`${isMobile ? 'mb-4' : 'mb-6'} bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-6'}`}>
              <div className="text-center">
                <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-blue-800`}>
                  {userProfile.firstName ? `${userProfile.firstName}${userProfile.lastName ? ` ${userProfile.lastName}` : ''}` : 'Setup Your Profile'}
                </div>
                {userProfile.goal && (
                  <div className={`${isMobile ? 'text-sm' : 'text-base'} text-blue-600 capitalize`}>
                    Goal: {userProfile.goal.replace('-', ' ')}
                  </div>
                )}
              </div>
              
              {calorieData && (
                <div className={`flex ${isMobile ? 'justify-center space-x-4' : 'space-x-6'} text-center`}>
                  <div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>
                      {calorieData.bmr}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-700`}>BMR</div>
                  </div>
                  <div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-600`}>
                      {calorieData.tdee}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-purple-700`}>TDEE</div>
                  </div>
                  <div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-orange-600`}>
                      {calorieData.targetCalories}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-orange-700`}>Target</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-3'}`}>
              <button
                onClick={handleOpenProfileModal}
                className={`${isMobile ? 'w-full py-3' : 'py-2 px-6'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
              >
                {userProfile.firstName ? 'Edit Profile' : 'Setup Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: SIMPLE MEAL INTERFACE */}
        <SimpleMealInterface 
          meals={meals}
          onTimeChange={handleTimeChange}
          onAddFoodItem={handleAddFoodItem}
          onRemoveFoodItem={handleRemoveFoodItem}
          onUpdateFoodItem={handleUpdateFoodItem}
          onOpenServingModal={handleOpenServingModal}
          onOpenFoodModal={handleOpenFoodModal}
          userProfile={userProfile}
          calorieData={calorieData}
          isMobile={isMobile}
          getAllMealsData={getAllMealsData}
          removedFoods={removedFoods}
          removedMeals={removedMeals}
          onRemoveMeal={handleRemoveMeal}
          onRestoreMeal={handleRestoreMeal}
          onOpenSwipeModal={openSwipeModal}
        />

        {/* SECTION 3: DAILY SUMMARY */}
        <DailySummary 
          allMeals={getAllMealsData()}
          userProfile={userProfile}
          calorieData={calorieData}
          isMobile={isMobile}
          removedMeals={removedMeals}
        />

        {/* SECTION 4: CHARTS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col sm:flex-row'} justify-between items-center mb-4`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 ${isMobile ? 'mb-0' : 'mb-2 sm:mb-0'}`}>
              📊 Daily Timeline: Calories & Sugar
            </h3>
            
            <div className={`flex bg-gray-100 rounded-lg ${isMobile ? 'p-2' : 'p-1'}`}>
              <button
                onClick={() => setViewMode('line')}
                className={`${isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-1 text-sm'} rounded-md font-medium transition-colors ${
                  viewMode === 'line' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📈 Trends
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`${isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-1 text-sm'} rounded-md font-medium transition-colors ${
                  viewMode === 'chart' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Bars
              </button>
            </div>
          </div>

          {/* Chart content */}
          {(() => {
            const timelineData = getTimelineData();

            if (viewMode === 'line') {
              return (
                <div>
                  <div className={isMobile ? "h-96" : "h-80"}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={timelineData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="shortName" 
                          tick={{ fontSize: isMobile ? 9 : 11 }}
                          angle={isMobile ? -45 : -30}
                          textAnchor="end"
                          height={isMobile ? 80 : 70}
                        />
                        <YAxis 
                          label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#8B5CF6" }}
                          name="calories"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sugarScaled" 
                          stroke="#EF4444" 
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#EF4444" }}
                          name="sugarScaled"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            }

            return (
              <div>
                <div className={isMobile ? "h-96" : "h-80"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={timelineData.filter(meal => meal.calories > 0 || meal.sugar > 0)}
                      margin={isMobile 
                        ? { top: 20, right: 20, left: 20, bottom: 80 }
                        : { top: 20, right: 30, left: 20, bottom: 60 }
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={isMobile ? "shortName" : "name"}
                        tick={{ fontSize: isMobile ? 9 : 10 }}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        height={isMobile ? 70 : 50}
                        interval={0}
                      />
                      <YAxis 
                        label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="calories" 
                        fill="#8B5CF6" 
                        name="calories" 
                        radius={2}
                      />
                      <Bar 
                        dataKey="sugarScaled" 
                        fill="#EF4444" 
                        name="sugarScaled" 
                        radius={2}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* MODALS */}
      
      {/* Serving Size Modal */}
      {servingModal.isOpen && servingModal.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg ${isMobile ? 'p-4 max-w-sm w-full' : 'p-6 max-w-md w-full mx-4'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
                {isMobile ? 'Serving Size' : `Serving Size - ${servingModal.item.food || 'Food Item'}`}
              </h3>
              <button
                onClick={handleCloseServingModal}
                className={`text-gray-500 hover:text-gray-700 ${isMobile ? 'p-2' : ''}`}
              >
                <X size={isMobile ? 20 : 24} />
              </button>
            </div>
            
            {isMobile && servingModal.item.food && (
              <div className="text-sm text-gray-600 mb-4 text-center font-medium">
                {servingModal.item.food}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className={`block ${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-700 mb-2`}>
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
                  className={`w-full ${isMobile ? 'p-3 text-base' : 'p-2'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block ${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-700 mb-2`}>
                  Unit
                </label>
                <select
                  value={customServing.unit}
                  onChange={(e) => setCustomServing({ 
                    ...customServing, 
                    unit: e.target.value 
                  })}
                  className={`w-full ${isMobile ? 'p-3 text-base' : 'p-2'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="servings">Servings</option>
                  <option value="grams">Grams</option>
                  <option value="ounces">Ounces</option>
                  <option value="cups">Cups</option>
                </select>
              </div>

              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'gap-3'} mt-6`}>
                <button
                  onClick={handleApplyCustomServing}
                  className={`${isMobile ? 'w-full py-3' : 'flex-1 py-2 px-4'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
                >
                  Apply
                </button>
                <button
                  onClick={handleCloseServingModal}
                  className={`${isMobile ? 'w-full py-3' : 'flex-1 py-2 px-4'} bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Selection Modal */}
      {foodModal.isOpen && foodModal.category && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg ${isMobile ? 'p-4 max-w-sm w-full max-h-[80vh]' : 'p-6 max-w-md w-full mx-4 max-h-[70vh]'} overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
                Select {foodModal.category.charAt(0).toUpperCase() + foodModal.category.slice(1)}
              </h3>
              <button
                onClick={handleCloseFoodModal}
                className={`text-gray-500 hover:text-gray-700 ${isMobile ? 'p-2' : ''}`}
              >
                <X size={isMobile ? 20 : 24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {getFoodsInCategory(foodModal.category).map(food => (
                  <button
                    key={food}
                    onClick={() => handleSelectFood(food)}
                    className={`${isMobile ? 'p-4 text-base' : 'p-3 text-sm'} text-left rounded-md transition-colors bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300`}
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={handleCloseFoodModal}
                className={`${isMobile ? 'w-full py-3' : 'w-full py-2 px-4'} bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg ${isMobile ? 'p-4 w-full max-h-[90vh]' : 'p-6 max-w-2xl w-full mx-4 max-h-[80vh]'} overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>
                Your Profile & Goals
              </h3>
              <button
                onClick={handleCloseProfileModal}
                className={`text-gray-500 hover:text-gray-700 ${isMobile ? 'p-2' : ''}`}
              >
                <X size={isMobile ? 20 : 24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Quick Demo Setup Buttons */}
              <div className={`mb-6 p-4 bg-gray-50 rounded-lg border`}>
                <h4 className="font-semibold text-gray-700 mb-3 text-center">🚀 Quick Demo Setup</h4>
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-center'}`}>
                  <button
                    onClick={setDemoMaleProfile}
                    className={`${isMobile ? 'w-full py-3' : 'px-6 py-2'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
                  >
                    👨 Demo Male (John, 5'10", 165lbs)
                  </button>
                  <button
                    onClick={setDemoFemaleProfile}
                    className={`${isMobile ? 'w-full py-3' : 'px-6 py-2'} bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors font-medium`}
                  >
                    👩 Demo Female (Jane, 5'6", 135lbs)
                  </button>
                </div>
                <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 text-center mt-2`}>
                  Click for instant setup with realistic values • Both set to "Moderate" exercise & "Maintain" goal
                </p>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
                {/* Personal Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Personal Info</h4>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-3'}`}>
                    <input
                      type="text"
                      placeholder="First name"
                      value={userProfile.firstName}
                      onChange={(e) => updateUserProfile('firstName', e.target.value)}
                      className={`${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={userProfile.lastName}
                      onChange={(e) => updateUserProfile('lastName', e.target.value)}
                      className={`${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <select
                    value={userProfile.gender}
                    onChange={(e) => updateUserProfile('gender', e.target.value)}
                    className={`w-full ${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-2'}`}>
                    <select
                      value={userProfile.heightFeet}
                      onChange={(e) => updateUserProfile('heightFeet', e.target.value)}
                      className={`${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Feet</option>
                      {[4, 5, 6, 7].map(feet => (
                        <option key={feet} value={feet}>{feet} ft</option>
                      ))}
                    </select>
                    <select
                      value={userProfile.heightInches}
                      onChange={(e) => updateUserProfile('heightInches', e.target.value)}
                      className={`${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Inches</option>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inches => (
                        <option key={inches} value={inches}>{inches} in</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Weight (lbs)"
                      value={userProfile.weight}
                      onChange={(e) => updateUserProfile('weight', e.target.value)}
                      className={`${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <select
                    value={userProfile.exerciseLevel}
                    onChange={(e) => updateUserProfile('exerciseLevel', e.target.value)}
                    className={`w-full ${isMobile ? 'p-3 text-base' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Exercise Level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very-active">Very Active (2x/day, intense)</option>
                  </select>
                </div>
                
                {/* Goal Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Your Goal</h4>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-2'}`}>
                    {[
                      { value: 'maintain', label: 'Maintain', color: 'bg-gray-100 hover:bg-gray-200' },
                      { value: 'lose', label: 'Lose Weight/Fat', color: 'bg-red-100 hover:bg-red-200' },
                      { value: 'gain-muscle', label: 'Gain Muscle', color: 'bg-blue-100 hover:bg-blue-200' },
                      { value: 'dirty-bulk', label: 'Dirty Bulk', color: 'bg-green-100 hover:bg-green-200' }
                    ].map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => updateUserProfile('goal', goal.value)}
                        className={`${isMobile ? 'p-4 text-base' : 'p-3 text-sm'} font-medium rounded-md border-2 transition-colors ${
                          userProfile.goal === goal.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : `border-gray-200 ${goal.color} text-gray-700`
                        }`}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* TDEE Results */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Your Numbers</h4>
                  {calorieData ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">BMR:</span>
                        <span className="font-medium">{calorieData.bmr} cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TDEE:</span>
                        <span className="font-medium">{calorieData.tdee} cal</span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-gray-600 font-medium">Target:</span>
                        <span className="font-bold text-blue-600">{calorieData.targetCalories} cal</span>
                      </div>
                      {userProfile.firstName && (
                        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 mt-2`}>
                          Hey {userProfile.firstName}! These are your daily calorie targets.
                        </div>
                      )}
                      <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 mt-3 p-2 bg-blue-50 rounded`}>
                        <strong>BMR:</strong> Base metabolic rate - calories burned at rest<br/>
                        <strong>TDEE:</strong> Total daily energy expenditure - BMR + activity<br/>
                        <strong>Target:</strong> TDEE adjusted for your goal
                      </div>
                    </div>
                  ) : (
                    <div className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-500`}>
                      Fill out your info to see your personalized calorie targets
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handleCloseProfileModal}
                className={`${isMobile ? 'w-full py-3' : 'w-full py-2 px-4'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swipeable Meal Modal */}
      <SwipeableMealModal
        isOpen={showSwipeModal}
        onClose={closeSwipeModal}
        meals={meals}
        userProfile={userProfile}
        calorieData={calorieData}
        isMobile={isMobile}
        removedFoods={removedFoods}
        removedMeals={removedMeals}
        onRemoveMeal={handleRemoveMeal}
        onRestoreMeal={handleRestoreMeal}
      />

    </div>
  );
};

export default NutritionApp;
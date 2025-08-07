// Updated MealTracker.jsx - Universal reusable meal tracking component with food modal
import React from 'react';
import { Plus, Minus, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateMealTimes, generateHourlyTimes } from './Utils.js';
import { FoodDatabase, getAllCategories, getFoodsInCategory } from './FoodDatabase.js';
import { MealMessages } from './MealMessages.js';

// Define proper category order and display names
const categoryDisplayMap = {
  'protein': 'Proteins',
  'carbohydrate': 'Carbohydrates', 
  'fat': 'Fats',
  'fruits': 'Fruits',
  'vegetables': 'Vegetables',
  'condiments': 'Condiments',
  'supplements': 'Supplements'
};

const categoryOrder = ['protein', 'carbohydrate', 'fat', 'fruits', 'vegetables', 'condiments', 'supplements'];

// Meal configuration - defines behavior for each meal type
const MEAL_CONFIG = {
  breakfast: {
    title: '🥞 Breakfast',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    maxItems: 4,
    timeRange: { start: 4, end: 10 },
    useHalfHours: true
  },
  firstSnack: {
    title: '🍎 First Snack',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    maxItems: 2,
    timeRange: { start: 8, end: 10 },
    useHalfHours: true
  },
  secondSnack: {
    title: '🥨 Second Snack',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    maxItems: 2,
    timeRange: { start: 10, end: 12 },
    useHalfHours: true,
    extraTimes: ['11:30 AM', '12:00 PM']
  },
  lunch: {
    title: '🍽️ Lunch',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    maxItems: 4,
    timeRange: { start: 11, end: 14 },
    useHalfHours: true
  },
  midAfternoon: {
    title: '☕ Mid-Afternoon Snack',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    maxItems: 2,
    timeRange: { start: 14, end: 16 },
    useHalfHours: true
  },
  dinner: {
    title: '🍽️ Dinner',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    maxItems: 4,
    timeRange: { start: 16, end: 20 },
    useHalfHours: true
  },
  lateSnack: {
    title: '🌙 Late Snack',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-800',
    maxItems: 2,
    timeRange: { start: 19, end: 22 },
    useHalfHours: true
  },
  postWorkout: {
    title: '💪 Post Workout',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    maxItems: 2,
    timeRange: { start: 5, end: 22 },
    useHalfHours: false
  }
};

const MealTracker = ({
  mealType = 'breakfast',
  time = '',
  setTime = () => {},
  items = [],
  setItems = () => {},
  totals = { calories: 0, protein: 0, carbs: 0, fat: 0 },
  pieData = [],
  warnings = [],
  userProfile = {},
  calorieData = {},
  previousMeals = {},
  onOpenServingModal = () => {},
  onOpenFoodModal = () => {}, // NEW PROP
  onUpdateFoodItem = () => {},
  onAddFoodItem = () => {},
  onRemoveFoodItem = () => {}
}) => {
  // Additional validation and debugging
  if (!mealType || typeof mealType !== 'string') {
    console.warn(`MealTracker received invalid mealType: ${mealType}, defaulting to 'breakfast'`);
    mealType = 'breakfast';
  }

  const config = MEAL_CONFIG[mealType];
  
  if (!config) {
    console.error(`Invalid meal type: ${mealType}. Available types: ${Object.keys(MEAL_CONFIG).join(', ')}`);
    return (
      <div className="mb-8 p-6 bg-red-50 rounded-lg border-2 border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">
          ⚠️ Configuration Error
        </h2>
        <p className="text-red-700 text-center">
          Invalid meal type "{mealType}". Please check your component props.
          <br />
          Available meal types: {Object.keys(MEAL_CONFIG).join(', ')}
        </p>
      </div>
    );
  }

  // Generate time options based on meal type
  const getTimeOptions = () => {
    const { timeRange, useHalfHours, extraTimes } = config;
    let times = useHalfHours 
      ? generateMealTimes(timeRange.start, timeRange.end)
      : generateHourlyTimes(timeRange.start, timeRange.end);
    
    if (extraTimes) {
      times = times.concat(extraTimes);
    }
    
    return times;
  };

  // Get appropriate message for this meal type - FIXED WITH CORRECT PARAMETERS
  const getMessage = () => {
    if (!totals || !pieData || !items || !userProfile) {
      return null;
    }

    try {
      switch(mealType) {
        case 'breakfast':
          return MealMessages.getBreakfastMessage(pieData, time, items, totals, userProfile);
        case 'firstSnack':
          return MealMessages.getFirstSnackMessage(
            pieData, time, items, totals, 
            previousMeals.breakfast?.time, 
            previousMeals.breakfast?.totals, 
            previousMeals.breakfast?.pieData, 
            userProfile,
            calorieData,
            previousMeals.postWorkout?.totals,
            previousMeals.postWorkout?.time
          );
        case 'secondSnack':
          return MealMessages.getSecondSnackMessage(
            pieData, time, items, totals,
            previousMeals.breakfast?.time,
            previousMeals.breakfast?.totals,
            previousMeals.breakfast?.items,
            previousMeals.firstSnack?.time,
            previousMeals.firstSnack?.totals,
            previousMeals.firstSnack?.items,
            userProfile,
            calorieData,
            previousMeals.postWorkout?.totals,
            previousMeals.postWorkout?.time
          );
        case 'lunch':
          return MealMessages.getLunchMessage(pieData, time, items, totals, previousMeals, userProfile, calorieData);
        case 'midAfternoon':
          return MealMessages.getMidAfternoonMessage(pieData, time, items, totals, previousMeals, userProfile, calorieData);
        case 'dinner':
          return MealMessages.getDinnerMessage(pieData, time, items, totals, previousMeals, userProfile, calorieData);
        case 'lateSnack':
          return MealMessages.getLateSnackMessage(pieData, time, items, totals, previousMeals, userProfile, calorieData);
        case 'postWorkout':
          return MealMessages.getPostWorkoutMessage(pieData, time, items, totals, previousMeals, userProfile, calorieData);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting message for meal type ${mealType}:`, error);
      return null;
    }
  };

  // Toggle food item expanded/collapsed state
  const toggleFoodItemExpanded = (item) => {
    const newExpandedState = !item.isExpanded;
    onUpdateFoodItem(mealType, item.id, 'isExpanded', newExpandedState);
  };

  // Render individual food item - UPDATED VERSION WITH MODAL
  const renderFoodItem = (item) => {
    const warningData = warnings?.find(w => w.id === item.id);
    const isExpanded = item.isExpanded !== false; // Default to expanded if not set
    const hasSelectedFood = item.food && item.category;
    
    return (
      <div key={item.id} className="border rounded-lg bg-gray-50 p-4">
        
        {/* COLLAPSED VIEW - Clean selected food display */}
        {hasSelectedFood && !isExpanded && (
          <div 
            onClick={() => toggleFoodItemExpanded(item)}
            className="cursor-pointer hover:bg-blue-50 transition-colors rounded-md p-4 border border-blue-200"
          >
            {/* Food Name - Single Line */}
            <div className="font-medium text-blue-800 text-lg mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
              {item.food}
            </div>
            
            {/* Servings and Adjust Button - Middle Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-blue-600 font-medium">
                {item.displayServing} {item.displayUnit}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenServingModal(mealType, item);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <Scale size={14} />
                Adjust
              </button>
            </div>
            
            {/* Macros - Bottom Row, One Line */}
            <div className="text-sm text-blue-700 font-medium mb-2 text-center">
              {FoodDatabase[item.category] && FoodDatabase[item.category][item.food] ? (
                <span>
                  {Math.round(FoodDatabase[item.category][item.food].protein * item.serving)}p • 
                  {Math.round(FoodDatabase[item.category][item.food].carbs * item.serving)}c • 
                  {Math.round(FoodDatabase[item.category][item.food].fat * item.serving)}f • 
                  {Math.round(FoodDatabase[item.category][item.food].calories * item.serving)} cal
                </span>
              ) : (
                <span>Select food to see nutrition</span>
              )}
            </div>
            
            {/* Category - Bottom Center, Bold Red */}
            <div className="text-center">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                {categoryDisplayMap[item.category] || item.category}
              </span>
            </div>

            {/* Warning for ridiculous servings */}
            {warningData && warningData.showWarning && (
              <div className="mt-3 bg-red-100 border border-red-300 rounded-md p-2">
                <div className="text-red-700 text-sm font-medium">
                  {userProfile.firstName}, don't be ridiculous, that's {warningData.totalCalories} calories! 😱
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPANDED VIEW - Category selector only (no inline food grid) */}
        {(!hasSelectedFood || isExpanded) && (
          <>
            {/* Category Dropdown - UPDATED WITH PROPER ORDER AND PLURALIZATION */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
              <select
                value={item.category}
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  onUpdateFoodItem(mealType, item.id, 'category', selectedCategory);
                  if (selectedCategory) {
                    // Open food modal when category is selected
                    onOpenFoodModal(mealType, item, selectedCategory);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a food category...</option>
                {categoryOrder.map(category => (
                  <option key={category} value={category}>
                    {categoryDisplayMap[category]}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Selection Display (in expanded view) */}
            {item.food && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-800">{item.food}</div>
                    <div className="text-sm text-blue-600">
                      {item.displayServing} {item.displayUnit}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenServingModal(mealType, item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Scale size={14} />
                      Adjust
                    </button>
                    <button
                      onClick={() => toggleFoodItemExpanded(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
                
                {/* Macros Display */}
                <div className="mt-2 text-sm text-blue-700">
                  {FoodDatabase[item.category] && FoodDatabase[item.category][item.food] ? (
                    <span>
                      {Math.round(FoodDatabase[item.category][item.food].protein * item.serving)}p / 
                      {Math.round(FoodDatabase[item.category][item.food].carbs * item.serving)}c / 
                      {Math.round(FoodDatabase[item.category][item.food].fat * item.serving)}f / 
                      {Math.round(FoodDatabase[item.category][item.food].calories * item.serving)} cal
                    </span>
                  ) : (
                    <span>Select food to see nutrition</span>
                  )}
                </div>

                {/* Warning for ridiculous servings */}
                {warningData && warningData.showWarning && (
                  <div className="mt-2 bg-red-100 border border-red-300 rounded-md p-2">
                    <div className="text-red-700 text-sm font-medium">
                      {userProfile.firstName}, don't be ridiculous, that's {warningData.totalCalories} calories! 😱
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Add/Remove Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          {items.length < config.maxItems && (
            <button
              onClick={() => onAddFoodItem(mealType)}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
              title="Add food item"
            >
              <Plus size={16} />
              Add Food
            </button>
          )}
          <button
            onClick={() => onRemoveFoodItem(mealType, item.id)}
            disabled={items.length === 1}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
            title="Remove food item"
          >
            <Minus size={16} />
            Remove
          </button>
        </div>
      </div>
    );
  };

  const message = getMessage();

  return (
    <div className={`mb-8 p-6 ${config.bgColor} rounded-lg border-2 ${config.borderColor}`}>
      <h2 className={`text-2xl font-bold ${config.textColor} mb-4 text-center`}>
        {config.title}
      </h2>
      
      {/* Time Selector */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-4">
          <label className="text-lg font-medium text-gray-700">
            {config.title.split(' ')[1] || 'Meal'} Time:
          </label>
          <select
            value={time || ''}
            onChange={(e) => setTime && setTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          >
            {getTimeOptions().map(timeOption => (
              <option key={timeOption} value={timeOption}>{timeOption}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Summary */}
      <div className="text-center mb-6">
        <div className={`text-sm font-bold ${config.textColor}`}>
          {totals && (totals.protein > 0 || totals.carbs > 0 || totals.fat > 0) ? 
            `Protein ${pieData && pieData[0] ? pieData[0].percentage || 0 : 0}% • Carbs ${pieData && pieData[1] ? pieData[1].percentage || 0 : 0}% • Fat ${pieData && pieData[2] ? pieData[2].percentage || 0 : 0}%` 
            : `Start selecting foods to see macro breakdown`
          }
        </div>
      </div>

      {/* Food Items - STREAMLINED */}
      <div className="space-y-4 mb-6">
        {items && items.length > 0 ? items.map(item => renderFoodItem(item)) : (
          <div className="p-4 text-center text-gray-500">
            No food items added yet
          </div>
        )}
      </div>

      {/* Pie Chart (only show if there are calories) */}
      {totals && totals.calories > 0 && (
        <div className="mb-6 bg-white rounded-lg p-4 border">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
            {config.title} Breakdown
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData && pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}g (${props.payload.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <div className="text-sm text-gray-600">
              Total: {Math.round(totals.calories)} calories
            </div>
          </div>
        </div>
      )}

      {/* Smart Messages */}
      {message && (
        <div className={`p-4 bg-${config.color}-100 border-l-4 border-${config.color}-500 rounded-md`}>
          <p className={`text-${config.color}-800 font-medium`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default MealTracker;
// MealTracker.js - Universal reusable meal tracking component
import React from 'react';
import { Plus, Minus, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateMealTimes, generateHourlyTimes } from './Utils.js';
import { foodDatabase, getAllCategories, getFoodsInCategory } from './foodDatabase.js';
import { MealMessages } from './MealMessages.js';

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
  mealType,
  time,
  setTime,
  items,
  setItems,
  totals,
  pieData,
  warnings,
  userProfile,
  calorieData,
  previousMeals = {},
  onOpenServingModal,
  onUpdateFoodItem,
  onAddFoodItem,
  onRemoveFoodItem
}) => {
  const config = MEAL_CONFIG[mealType];
  
  if (!config) {
    console.error(`Invalid meal type: ${mealType}`);
    return null;
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

  // Get appropriate message for this meal type
  const getMessage = () => {
    switch(mealType) {
      case 'breakfast':
        return MealMessages.getBreakfastMessage(pieData, time, items, totals, userProfile);
      case 'firstSnack':
        return MealMessages.getFirstSnackMessage(
          pieData, time, items, totals, 
          previousMeals.breakfast?.time, 
          previousMeals.breakfast?.totals, 
          previousMeals.breakfast?.pieData, 
          userProfile
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
          calorieData
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
  };

  // Render individual food item
  const renderFoodItem = (item) => {
    const warningData = warnings?.find(w => w.id === item.id);
    
    return (
      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
        {/* Category Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={item.category}
            onChange={(e) => onUpdateFoodItem(mealType, item.id, 'category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            {getAllCategories().map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Food Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
          <select
            value={item.food}
            onChange={(e) => onUpdateFoodItem(mealType, item.id, 'food', e.target.value)}
            disabled={!item.category}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select food</option>
            {item.category && getFoodsInCategory(item.category).map(food => (
              <option key={food} value={food}>{food}</option>
            ))}
          </select>
        </div>

        {/* Serving Button */}
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
          <div className="relative">
            <button
              onClick={() => onOpenServingModal(mealType, item)}
              disabled={!item.category || !item.food}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-blue-50 hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span>{item.displayServing} {item.displayUnit}</span>
                <Scale size={16} className="text-blue-500" />
              </div>
            </button>
            
            {/* Ridiculous Serving Warning */}
            {warningData && warningData.showWarning && (
              <div className="absolute -top-12 -right-34 z-20">
                <div className="relative">
                  <div className="absolute top-8 left-12 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    {userProfile.firstName}, don't be ridiculous, that's {warningData.totalCalories} calories! 😱
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Macros Display */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Macros (P/C/F)</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-sm">
            {item.category && item.food && foodDatabase[item.category][item.food] ? (
              <span className="text-gray-800">
                {Math.round(foodDatabase[item.category][item.food].protein * item.serving)}p / 
                {Math.round(foodDatabase[item.category][item.food].carbs * item.serving)}c / 
                {Math.round(foodDatabase[item.category][item.food].fat * item.serving)}f
              </span>
            ) : (
              <span className="text-gray-400">-p / -c / -f</span>
            )}
          </div>
        </div>

        {/* Add/Remove Buttons */}
        <div className="flex flex-col gap-2">
          {items.length < config.maxItems && (
            <button
              onClick={() => onAddFoodItem(mealType)}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              title="Add food item"
            >
              <Plus size={16} />
            </button>
          )}
          <button
            onClick={() => onRemoveFoodItem(mealType, item.id)}
            disabled={items.length === 1}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            title="Remove food item"
          >
            <Minus size={16} />
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
          {totals.protein > 0 || totals.carbs > 0 || totals.fat > 0 ? 
            `Protein ${pieData[0]?.percentage || 0}% • Carbs ${pieData[1]?.percentage || 0}% • Fat ${pieData[2]?.percentage || 0}%` 
            : `Start adding ${mealType === 'postWorkout' ? 'post-workout' : 'food'} items to see macro breakdown`
          }
        </div>
      </div>

      {/* Food Items */}
      <div className="space-y-4 mb-6">
        {items.map(item => renderFoodItem(item))}
      </div>

      {/* Pie Chart (only show if there are calories) */}
      {totals.calories > 0 && (
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
                  {pieData.map((entry, index) => (
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
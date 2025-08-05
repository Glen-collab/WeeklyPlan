import React, { useState, useEffect } from 'react';
import { X, Scale, Coffee, Hand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
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
  
  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'chart', 'cards', or 'line'
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

        {/* Daily Timeline - Mobile Responsive */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
              📊 Daily Timeline: Calories & Sugar
            </h3>
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📋 Cards
              </button>
              <button
                onClick={() => setViewMode('line')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'line' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📈 Trends
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'chart' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Bars
              </button>
            </div>
          </div>

          {(() => {
            // Create timeline data
            const mealOrder = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
            const mealLabels = {
              breakfast: 'Breakfast',
              firstSnack: 'Snack 1', 
              secondSnack: 'Snack 2',
              lunch: 'Lunch',
              midAfternoon: 'Mid-Aft',
              dinner: 'Dinner',
              lateSnack: 'Late Snack',
              postWorkout: 'Post-WO'
            };

            const timelineData = mealOrder.map((mealType, index) => {
              const { totals } = getMealData(mealType);
              return {
                name: isMobile ? mealLabels[mealType] : `${mealLabels[mealType]}\n${meals[mealType].time}`,
                shortName: mealLabels[mealType],
                fullName: mealLabels[mealType],
                time: meals[mealType].time,
                calories: Math.round(totals.calories),
                sugar: Math.round(totals.sugar),
                sugarScaled: Math.round(totals.sugar) * 10, // For chart visibility
                order: index // For line chart ordering
              };
            });

            // LINE CHART VIEW - Great for seeing trends!
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
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 80 : 60}
                        />
                        <YAxis 
                          label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            if (name === 'sugarScaled') {
                              return [`${props.payload.sugar}g`, 'Sugar'];
                            }
                            return [value, name === 'calories' ? 'Calories' : name];
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `${payload[0].payload.fullName} at ${payload[0].payload.time}`;
                            }
                            return label;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          name="calories"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sugarScaled" 
                          stroke="#EF4444" 
                          strokeWidth={3}
                          dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                          name="sugarScaled"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span>Calories Trend</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>Sugar Trend {!isMobile && '(scaled x10)'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      📈 See how your calories and sugar intake changes throughout the day!
                    </div>
                  </div>
                </div>
              );
            }

            // CARD VIEW - Perfect for Mobile
            if (viewMode === 'cards') {
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {timelineData.map((meal, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="font-bold text-gray-800 text-sm mb-1">
                          {meal.fullName}
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          {meal.time}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Calories:</span>
                            <span className="font-bold text-purple-600 text-lg">
                              {meal.calories}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Sugar:</span>
                            <span className="font-bold text-red-500 text-lg">
                              {meal.sugar}g
                            </span>
                          </div>
                        </div>
                        
                        {/* Mini progress bars */}
                        <div className="mt-3 space-y-1">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((meal.calories / 800) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((meal.sugar / 25) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // CHART VIEW - Fixed Responsive Bar Chart
            return (
              <div>
                <div className={isMobile ? "h-96" : "h-80"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={timelineData}
                      layout={isMobile ? "horizontal" : undefined}
                      margin={isMobile 
                        ? { top: 20, right: 30, left: 80, bottom: 20 }
                        : { top: 20, right: 30, left: 20, bottom: 60 }
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      
                      {isMobile ? (
                        // Mobile: Horizontal bars (FIXED)
                        <>
                          <XAxis 
                            type="number" 
                            domain={[0, 'dataMax + 100']}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="shortName" 
                            tick={{ fontSize: 11 }}
                            width={70}
                          />
                        </>
                      ) : (
                        // Desktop: Vertical bars  
                        <>
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10 }}
                            interval={0}
                          />
                          <YAxis 
                            label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
                          />
                        </>
                      )}
                      
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === 'sugarScaled') {
                            return [`${props.payload.sugar}g`, 'Sugar'];
                          }
                          return [value, name === 'calories' ? 'Calories' : name];
                        }}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            return `${payload[0].payload.fullName} at ${payload[0].payload.time}`;
                          }
                          return label;
                        }}
                      />
                      
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
                
                {/* Legend */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span>Calories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Sugar {!isMobile && '(scaled x10 for visibility)'}</span>
                    </div>
                  </div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500 mt-2">
                      💡 Sugar bars are scaled 10x larger to make high sugar content more visible!
                    </div>
                  )}
                </div>
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
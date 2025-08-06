import React, { useState, useEffect } from 'react';
import { X, Scale, Coffee, Hand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import MealTracker from './MealTracker.jsx';
import { FoodDatabase, servingSizeConversions, getServingInfo, getAllCategories, getFoodsInCategory } from './FoodDatabase.js';
import { calculateTotals, preparePieData, calculateTDEE } from './Utils.js';

const defaultUserProfile = {
  firstName: '',
  lastName: '',
  heightFeet: '',
  heightInches: '',
  weight: '',
  exerciseLevel: '',
  goal: ''
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

const NutritionApp = () => {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  
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
      time: '5:00 PM',
      items: [createFoodItem()]
    }
  });

  const [servingModal, setServingModal] = useState({
    isOpen: false,
    mealType: '',
    item: null
  });

  // NEW: Food selection modal state
  const [foodModal, setFoodModal] = useState({
    isOpen: false,
    mealType: '',
    item: null,
    category: ''
  });

  // NEW: Profile modal state
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
    const totals = calculateTotals(meal.items);
    const pieData = preparePieData(totals);
    return { totals, pieData };
  };

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

  // NEW: Food modal handlers
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

  // NEW: Profile modal handlers
  const handleOpenProfileModal = () => {
    setProfileModal({ isOpen: true });
  };

  const handleCloseProfileModal = () => {
    setProfileModal({ isOpen: false });
  };

  const updateUserProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  // NEW: Quick demo profile setups
  const setDemoMaleProfile = () => {
    setUserProfile({
      firstName: 'John',
      lastName: 'Doe',
      heightFeet: '5',
      heightInches: '10',
      weight: '165',
      exerciseLevel: 'moderate',
      goal: 'maintain'
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
      goal: 'maintain'
    });
  };

  const handleSelectFood = (selectedFood) => {
    if (foodModal.item && foodModal.mealType) {
      // Update the food selection
      handleUpdateFoodItem(foodModal.mealType, foodModal.item.id, 'food', selectedFood);
      
      // Close food modal
      handleCloseFoodModal();
      
      // Automatically open serving modal
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

  return (
    <div className={`min-h-screen bg-gray-100 ${isMobile ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-gray-800 mb-2`}>
            🥗 Nutrition Tracker
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600`}>
            Welcome back{userProfile.firstName ? `, ${userProfile.firstName}` : ''}! Track your daily nutrition goals.
          </p>
        </div>

        {/* Profile Card */}
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
            
            <button
              onClick={handleOpenProfileModal}
              className={`${isMobile ? 'w-full py-3' : 'py-2 px-6'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
            >
              {userProfile.firstName ? 'Edit Profile' : 'Setup Profile'}
            </button>
          </div>
        </div>

        <div className={`space-y-${isMobile ? '3' : '6'}`}>
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
                warnings={[]}
                userProfile={userProfile}
                calorieData={calorieData || {}}
                previousMeals={meals}
                onOpenServingModal={handleOpenServingModal}
                onOpenFoodModal={handleOpenFoodModal} // NEW PROP
                onUpdateFoodItem={handleUpdateFoodItem}
                onAddFoodItem={handleAddFoodItem}
                onRemoveFoodItem={handleRemoveFoodItem}
                isMobile={isMobile}
              />
            );
          })}
        </div>

        <div className={`mt-8 bg-white rounded-lg ${isMobile ? 'p-4' : 'p-6'} shadow-md`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-4 text-center`}>
            📊 Daily Summary
          </h2>
          {(() => {
            const totalDailyCalories = Object.keys(meals).reduce((sum, mealType) => {
              const { totals } = getMealData(mealType);
              return sum + totals.calories;
            }, 0);
            
            return (
              <div className="text-center">
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-600 mb-2`}>
                  {Math.round(totalDailyCalories)} / {calorieData?.targetCalories || 2200} calories
                </div>
                <div className={`w-full bg-gray-200 rounded-full ${isMobile ? 'h-6' : 'h-4'} mb-4`}>
                  <div 
                    className={`bg-blue-600 ${isMobile ? 'h-6' : 'h-4'} rounded-full transition-all duration-500`} 
                    style={{ 
                      width: `${Math.min((totalDailyCalories / (calorieData?.targetCalories || 2200)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
                  {(() => {
                    const target = calorieData?.targetCalories || 2200;
                    if (totalDailyCalories < target) {
                      return `${target - Math.round(totalDailyCalories)} calories remaining`;
                    } else if (totalDailyCalories > target) {
                      return `${Math.round(totalDailyCalories - target)} calories over target`;
                    } else {
                      return "Perfect! You've hit your calorie target!";
                    }
                  })()}
                </p>
              </div>
            );
          })()}
        </div>

        <div className={`mt-8 bg-white rounded-lg ${isMobile ? 'p-4' : 'p-6'} shadow-md`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col sm:flex-row'} justify-between items-center mb-4`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 ${isMobile ? 'mb-0' : 'mb-2 sm:mb-0'}`}>
              📊 Daily Timeline: Calories & Sugar
            </h3>
            
            <div className={`flex bg-gray-100 rounded-lg ${isMobile ? 'p-2 w-full' : 'p-1'}`}>
              <button
                onClick={() => setViewMode('cards')}
                className={`${isMobile ? 'flex-1 px-4 py-3 text-sm' : 'px-3 py-1 text-sm'} rounded-md font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📋 {isMobile ? 'Cards' : 'Cards'}
              </button>
              <button
                onClick={() => setViewMode('line')}
                className={`${isMobile ? 'flex-1 px-4 py-3 text-sm' : 'px-3 py-1 text-sm'} rounded-md font-medium transition-colors ${
                  viewMode === 'line' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📈 {isMobile ? 'Trends' : 'Trends'}
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`${isMobile ? 'flex-1 px-4 py-3 text-sm' : 'px-3 py-1 text-sm'} rounded-md font-medium transition-colors ${
                  viewMode === 'chart' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 {isMobile ? 'Bars' : 'Bars'}
              </button>
            </div>
          </div>

          {(() => {
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

            // Helper function to convert time to hours (24-hour format)
            const timeToHours = (timeStr) => {
              const [time, period] = timeStr.split(' ');
              const [hours, minutes] = time.split(':').map(Number);
              let hour24 = hours;
              if (period === 'PM' && hours !== 12) hour24 += 12;
              if (period === 'AM' && hours === 12) hour24 = 0;
              return hour24 + minutes / 60;
            };

            // Create basic timeline data
            const basicTimelineData = mealOrder.map((mealType, index) => {
              const { totals } = getMealData(mealType);
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

            // Sort meals by actual time (chronological order)
            const chronologicalData = [...basicTimelineData].sort((a, b) => a.timeHours - b.timeHours);

            // For line chart: create smart timeline with gap detection
            const createSmartLineData = () => {
              // Start with chronologically sorted meals that have food
              const mealsWithFood = chronologicalData.filter(meal => meal.calories > 0);
              
              if (mealsWithFood.length <= 1) return mealsWithFood;
              
              const smartData = [];
              
              for (let i = 0; i < mealsWithFood.length; i++) {
                const currentMeal = mealsWithFood[i];
                smartData.push(currentMeal);
                
                // Check gap to next meal
                if (i < mealsWithFood.length - 1) {
                  const nextMeal = mealsWithFood[i + 1];
                  const hourGap = nextMeal.timeHours - currentMeal.timeHours;
                  
                  // If 5+ hour gap, add zero points to show they need to eat
                  if (hourGap >= 5) {
                    const gapMidTime = currentMeal.timeHours + (hourGap / 2);
                    const gapHour = Math.floor(gapMidTime);
                    const gapMinute = Math.round((gapMidTime % 1) * 60);
                    const gapTimeStr = `${gapHour > 12 ? gapHour - 12 : gapHour === 0 ? 12 : gapHour}:${gapMinute.toString().padStart(2, '0')} ${gapHour >= 12 ? 'PM' : 'AM'}`;
                    
                    smartData.push({
                      name: `Gap`,
                      shortName: `${Math.round(hourGap)}h gap`,
                      fullName: `${Math.round(hourGap)} hour gap`,
                      time: gapTimeStr,
                      timeHours: gapMidTime,
                      calories: 0,
                      sugar: 0,
                      sugarScaled: 0,
                      order: currentMeal.order + 0.5,
                      isGap: true
                    });
                  }
                }
              }
              
              return smartData;
            };

            const timelineData = chronologicalData; // Now chronologically sorted!
            const smartLineData = createSmartLineData();

            if (viewMode === 'line') {
              return (
                <div>
                  <div className={isMobile ? "h-96" : "h-80"}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={smartLineData}
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
                        <Tooltip 
                          formatter={(value, name, props) => {
                            if (props.payload.isGap) {
                              return ['Long gap - time to eat!', 'Warning'];
                            }
                            if (name === 'sugarScaled') {
                              return [`${props.payload.sugar}g`, 'Sugar'];
                            }
                            return [value, name === 'calories' ? 'Calories' : name];
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              if (payload[0].payload.isGap) {
                                return `${payload[0].payload.fullName} - Consider a healthy snack!`;
                              }
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
                          dot={(props) => {
                            if (props.payload.isGap) {
                              return <circle cx={props.cx} cy={props.cy} r={6} fill="#00BFFF" stroke="#00BFFF" strokeWidth={2} />;
                            }
                            return <circle cx={props.cx} cy={props.cy} r={4} fill="#8B5CF6" stroke="#8B5CF6" strokeWidth={2} />;
                          }}
                          name="calories"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sugarScaled" 
                          stroke="#EF4444" 
                          strokeWidth={3}
                          dot={(props) => {
                            if (props.payload.isGap) {
                              return <circle cx={props.cx} cy={props.cy} r={6} fill="#00BFFF" stroke="#00BFFF" strokeWidth={2} />;
                            }
                            return <circle cx={props.cx} cy={props.cy} r={4} fill="#EF4444" stroke="#EF4444" strokeWidth={2} />;
                          }}
                          name="sugarScaled"
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className={`mt-4 text-center ${isMobile ? 'px-2' : ''}`}>
                    <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'gap-6'} text-sm flex-wrap`}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span>Calories Trend</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>Sugar Trend{!isMobile && ' (scaled x10)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                        <span>{isMobile ? 'Long Gaps' : '5+ Hour Gaps'}</span>
                      </div>
                    </div>
                    <div className={`${isMobile ? 'text-xs mt-3' : 'text-xs mt-2'} text-gray-500`}>
                      📈 {isMobile ? 'Shows meals with food • Cyan = 5+ hour gaps' : 'Only shows meals with food • Cyan dots show 5+ hour gaps where you should eat!'}
                    </div>
                  </div>
                </div>
              );
            }

            if (viewMode === 'cards') {
              return (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
                  {timelineData.map((meal, index) => (
                    <div key={index} className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                      <div className="text-center">
                        <div className={`font-bold text-gray-800 ${isMobile ? 'text-base' : 'text-sm'} mb-1`}>
                          {meal.fullName}
                        </div>
                        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 mb-3`}>
                          {meal.time}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600`}>Calories:</span>
                            <span className={`font-bold text-purple-600 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                              {meal.calories}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600`}>Sugar:</span>
                            <span className={`font-bold text-red-500 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                              {meal.sugar}g
                            </span>
                          </div>
                        </div>
                        
                        <div className={`${isMobile ? 'mt-4' : 'mt-3'} space-y-2`}>
                          <div className={`bg-gray-200 rounded-full ${isMobile ? 'h-3' : 'h-2'}`}>
                            <div 
                              className={`bg-purple-500 ${isMobile ? 'h-3' : 'h-2'} rounded-full transition-all duration-300`}
                              style={{ width: `${Math.min((meal.calories / 800) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className={`bg-gray-200 rounded-full ${isMobile ? 'h-3' : 'h-2'}`}>
                            <div 
                              className={`bg-red-500 ${isMobile ? 'h-3' : 'h-2'} rounded-full transition-all duration-300`}
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
                
                <div className={`mt-4 text-center ${isMobile ? 'px-2' : ''}`}>
                  <div className={`flex items-center justify-center ${isMobile ? 'flex-col space-y-2' : 'gap-6'} text-sm`}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span>Calories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Sugar{!isMobile && ' (scaled x10 for visibility)'}</span>
                    </div>
                  </div>
                  <div className={`${isMobile ? 'text-xs mt-3' : 'text-xs mt-2'} text-gray-500`}>
                    📊 {isMobile ? 'Shows meals with food • Sugar scaled x10' : 'Only shows meals with food • Sugar bars are scaled 10x larger to make high sugar content more visible!'}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

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

                {servingModal.item.category && servingModal.item.food && (
                  <div className={`bg-gray-50 ${isMobile ? 'p-3' : 'p-3'} rounded-md`}>
                    <h4 className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-700 mb-2`}>Reference Serving Size:</h4>
                    <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 space-y-1`}>
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

        {/* NEW: Food Selection Modal */}
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

        {/* NEW: Profile Modal */}
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
      </div>
    </div>
  );
};

export default NutritionApp;
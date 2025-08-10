import React, { useState, useEffect } from 'react';
import { X, Scale, Coffee, Hand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import MealTracker from './MealTracker.jsx';
import { FoodDatabase, servingSizeConversions, getServingInfo, getAllCategories, getFoodsInCategory } from './FoodDatabase.js';
import { calculateTotals, preparePieData, calculateTDEE } from './Utils.js';
import { MealMessages } from './MealMessages/index.js';
import { generatePersonalTrainerSummary } from './PersonalTrainerSummary.js';
import MealIdeasModal from './MealIdeas.jsx';

// Import the streamlined meal swipe component
import MealSwipeGame from './MealSwipeGame.jsx';

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

const NutritionApp = () => {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('chart');
  
  // Enhanced Tinder swipe modal state
  const [showTinderSwipe, setShowTinderSwipe] = useState(false);
  const [showCardsModal, setShowCardsModal] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // Meal Ideas modal state
  const [showMealIdeas, setShowMealIdeas] = useState(false);

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

  const [personalTrainerModal, setPersonalTrainerModal] = useState({
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

  const getAllMealsData = () => {
    return {
      breakfast: {
        time: meals.breakfast.time,
        totals: getMealData('breakfast').totals,
        items: meals.breakfast.items,
        pieData: getMealData('breakfast').pieData
      },
      firstSnack: {
        time: meals.firstSnack.time,
        totals: getMealData('firstSnack').totals,
        items: meals.firstSnack.items,
        pieData: getMealData('firstSnack').pieData
      },
      secondSnack: {
        time: meals.secondSnack.time,
        totals: getMealData('secondSnack').totals,
        items: meals.secondSnack.items,
        pieData: getMealData('secondSnack').pieData
      },
      lunch: {
        time: meals.lunch.time,
        totals: getMealData('lunch').totals,
        items: meals.lunch.items,
        pieData: getMealData('lunch').pieData
      },
      midAfternoon: {
        time: meals.midAfternoon.time,
        totals: getMealData('midAfternoon').totals,
        items: meals.midAfternoon.items,
        pieData: getMealData('midAfternoon').pieData
      },
      dinner: {
        time: meals.dinner.time,
        totals: getMealData('dinner').totals,
        items: meals.dinner.items,
        pieData: getMealData('dinner').pieData
      },
      lateSnack: {
        time: meals.lateSnack.time,
        totals: getMealData('lateSnack').totals,
        items: meals.lateSnack.items,
        pieData: getMealData('lateSnack').pieData
      },
      postWorkout: {
        time: meals.postWorkout.time,
        totals: getMealData('postWorkout').totals,
        items: meals.postWorkout.items,
        pieData: getMealData('postWorkout').pieData
      }
    };
  };

  // All your existing handler functions remain the same...
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

  const handleOpenPersonalTrainerModal = () => {
    setPersonalTrainerModal({ isOpen: true });
  };

  const handleClosePersonalTrainerModal = () => {
    setPersonalTrainerModal({ isOpen: false });
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

  // Meal Ideas modal functions (FIXED: moved outside of handleApplyCustomServing)
  const openMealIdeas = () => {
    setShowMealIdeas(true);
  };

  const closeMealIdeas = () => {
    setShowMealIdeas(false);
  };

  const addMealToBreakfast = (mealData) => {
    // Clear existing breakfast items and replace with the meal idea
    setMeals(prev => ({
      ...prev,
      breakfast: {
        ...prev.breakfast,
        items: [...mealData.items]
      }
    }));
    closeMealIdeas();
  };

  // Enhanced Tinder swipe functions
  const openTinderSwipe = () => {
    setShowTinderSwipe(true);
  };

  const closeTinderSwipe = () => {
    setShowTinderSwipe(false);
  };

  // Regular cards modal functions
  const openCardsModal = () => {
    setCurrentCardIndex(0);
    setShowCardsModal(true);
  };

  const closeCardsModal = () => {
    setShowCardsModal(false);
  };

  const getTimelineData = () => {
    const mealOrder = ['breakfast', 'firstSnack', 'secondSnack', 'lunch', 'midAfternoon', 'dinner', 'lateSnack', 'postWorkout'];
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

    return [...basicTimelineData].sort((a, b) => a.timeHours - b.timeHours);
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
            
            {/* Profile and Personal Trainer Buttons */}
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-3'}`}>
              <button
                onClick={handleOpenProfileModal}
                className={`${isMobile ? 'w-full py-3' : 'py-2 px-6'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium`}
              >
                {userProfile.firstName ? 'Edit Profile' : 'Setup Profile'}
              </button>
              
              <button
                onClick={handleOpenPersonalTrainerModal}
                className={`${isMobile ? 'w-full py-3' : 'py-2 px-6'} bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2`}
              >
                <span>💪</span>
                Personal Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Show meal trackers with special breakfast header */}
        <div className={`space-y-${isMobile ? '3' : '6'}`}>
          {Object.keys(meals).map(mealType => {
            const { totals, pieData } = getMealData(mealType);
            
            return (
              <div key={mealType}>
                {/* Special header for breakfast with Meal Ideas button */}
                {mealType === 'breakfast' && (
                  <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'} bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌅</span>
                      <div>
                        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>
                          Breakfast
                        </h3>
                        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
                          Target: {calorieData?.targetCalories ? Math.round(calorieData.targetCalories / 5) : 440} calories
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={openMealIdeas}
                      className={`${isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-2 text-sm'} bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md font-medium transition-all duration-300 hover:from-green-600 hover:to-teal-600 flex items-center gap-2 transform hover:scale-105 shadow-lg`}
                    >
                      <span>💡</span>
                      {isMobile ? 'Ideas' : 'Meal Ideas'}
                    </button>
                  </div>
                )}
                
                <MealTracker
                  mealType={mealType}
                  time={meals[mealType].time}
                  setTime={(newTime) => handleTimeChange(mealType, newTime)}
                  items={meals[mealType].items}
                  totals={totals}
                  pieData={pieData}
                  warnings={[]}
                  userProfile={userProfile}
                  calorieData={calorieData || {}}
                  allMeals={getAllMealsData()}
                  onOpenServingModal={handleOpenServingModal}
                  onOpenFoodModal={handleOpenFoodModal}
                  onUpdateFoodItem={handleUpdateFoodItem}
                  onAddFoodItem={handleAddFoodItem}
                  onRemoveFoodItem={handleRemoveFoodItem}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
        </div>

        {/* Summary and charts */}
        <>
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

          {/* ENHANCED: Charts and Timeline with TINDER SWIPE */}
          <div className={`mt-8 bg-white rounded-lg ${isMobile ? 'p-4' : 'p-6'} shadow-md`}>
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col sm:flex-row'} justify-between items-center mb-4`}>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 ${isMobile ? 'mb-0' : 'mb-2 sm:mb-0'}`}>
                📊 Daily Timeline: Calories & Sugar
              </h3>
              
              <div className="flex gap-3">
                {/* TINDER HOT OR NOT BUTTON Burn or Learn */}
                <button
                  onClick={openTinderSwipe}
                  className={`${isMobile ? 'px-4 py-3 text-sm' : 'px-4 py-2 text-sm'} bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md font-medium transition-all duration-300 hover:from-pink-600 hover:to-red-600 flex items-center gap-2 transform hover:scale-105 shadow-lg`}
                >
                  🔥 Burn or Learn
                </button>
                                             
                {/* View Mode Toggle */}
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
        </>

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
                    
                    {/* Gender Selection */}
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

        {/* Personal Trainer Summary Modal */}
        {personalTrainerModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg ${isMobile ? 'p-4 w-full max-h-[90vh]' : 'p-6 max-w-4xl w-full mx-4 max-h-[80vh]'} overflow-hidden flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 flex items-center gap-2`}>
                  <span>💪</span>
                  Personal Trainer Analysis
                </h3>
                <button
                  onClick={handleClosePersonalTrainerModal}
                  className={`text-gray-500 hover:text-gray-700 ${isMobile ? 'p-2' : ''}`}
                >
                  <X size={isMobile ? 20 : 24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {(() => {
                  const summary = generatePersonalTrainerSummary(getAllMealsData(), userProfile, calorieData);
                  
                  if (!userProfile.firstName) {
                    return (
                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Your Profile First</h3>
                        <p className="text-gray-600 mb-6">Please fill out your profile information to get your personalized trainer analysis!</p>
                        <button
                          onClick={() => {
                            handleClosePersonalTrainerModal();
                            handleOpenProfileModal();
                          }}
                          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                        >
                          Setup Profile Now
                        </button>
                      </div>
                    );
                  }

                  // Handle jumpstart message for users with profile but no food data
                  if (summary.isJumpstart) {
                    return (
                      <div className="space-y-6">
                        {/* Motivational Header */}
                        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
                          <div className="text-4xl mb-3">🚀</div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Transform?</h3>
                          <p className="text-gray-700 font-medium">{summary.goalMotivation}</p>
                          <div className="mt-4 text-sm text-gray-600">
                            Target: {summary.targets.calories} calories • {summary.targets.protein}g protein daily
                          </div>
                        </div>

                        {/* Top 3 Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <span>🎯</span> Your Top 3 Fundamentals
                          </h4>
                          <ol className="space-y-3">
                            {summary.recommendations.map((rec, index) => (
                              <li key={index} className="text-blue-700 text-sm">
                                <span className="font-bold">{index + 1}.</span> {rec}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <span>🏆</span> Wisdom from the Pros
                          </h4>
                          <div className="space-y-3">
                            {summary.proTips.map((tip, index) => (
                              <div key={index} className="text-purple-700 text-sm italic border-l-2 border-purple-300 pl-3">
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <span>⚡</span> Your Next Steps
                          </h4>
                          <p className="text-yellow-700 text-sm">{summary.callToAction}</p>
                        </div>

                        {/* Bottom Line */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-4 text-center">
                          <h4 className="font-bold mb-2">🔥 Champion Mindset</h4>
                          <p className="text-sm">{summary.bottomLine}</p>
                        </div>
                      </div>
                    );
                  }

                  // Regular analysis for users with food data
                  return (
                    <div className="space-y-6">
                      {/* Grade Header */}
                      <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
                        <div className={`text-6xl font-bold mb-2 ${
                          summary.grade === 'A' ? 'text-green-600' :
                          summary.grade === 'B' ? 'text-blue-600' :
                          summary.grade === 'C' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {summary.grade}
                        </div>
                        <div className="text-lg text-gray-600">Daily Score: {summary.score}/100</div>
                        <div className="text-sm text-gray-500 mt-2">
                          Daily Totals: {summary.dailyTotals.calories} cal • {summary.dailyTotals.protein}g protein • {summary.dailyTotals.sugar}g sugar
                        </div>
                      </div>

                      {/* Strengths */}
                      {summary.strengths.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <span>🏆</span> Your Strengths
                          </h4>
                          <ul className="space-y-2">
                            {summary.strengths.map((strength, index) => (
                              <li key={index} className="text-green-700 text-sm">{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Critical Issues */}
                      {summary.issues.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                            <span>🚨</span> Critical Issues
                          </h4>
                          <ul className="space-y-2">
                            {summary.issues.map((issue, index) => (
                              <li key={index} className="text-red-700 text-sm">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Analysis Sections */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800 mb-2">💪 Protein Analysis</h4>
                          <p className="text-blue-700 text-sm">{summary.proteinAnalysis}</p>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-bold text-orange-800 mb-2">🍞 Carb Strategy</h4>
                          <p className="text-orange-700 text-sm">{summary.carbAnalysis}</p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-purple-800 mb-2">⏰ Meal Timing</h4>
                          <p className="text-purple-700 text-sm">{summary.timingAnalysis}</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold text-gray-800 mb-2">🎯 Goal Alignment</h4>
                          <p className="text-gray-700 text-sm">{summary.goalAlignment}</p>
                        </div>
                      </div>

                      {/* Top Recommendations */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                          <span>💡</span> Top 3 Recommendations
                        </h4>
                        <ol className="space-y-2">
                          {summary.recommendations.map((rec, index) => (
                            <li key={index} className="text-yellow-700 text-sm">
                              <span className="font-medium">{index + 1}.</span> {rec}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Weekly Advice */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                          <span>📅</span> Weekly Consistency Focus
                        </h4>
                        <p className="text-indigo-700 text-sm">{summary.weeklyAdvice}</p>
                      </div>

                      {/* Bottom Line */}
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-4 text-center">
                        <h4 className="font-bold mb-2">🎯 Bottom Line</h4>
                        <p className="text-sm">{summary.bottomLine}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={handleClosePersonalTrainerModal}
                  className={`${isMobile ? 'w-full py-3' : 'w-full py-2 px-4'} bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors font-medium`}
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meal Ideas Modal */}
        {showMealIdeas && (
          <MealIdeasModal
            isOpen={showMealIdeas}
            onClose={closeMealIdeas}
            onAddMeal={addMealToBreakfast}
            userProfile={userProfile}
            calorieData={calorieData}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* ENHANCED: Tinder Hot or Not Burn or Learn Modal */}
      {showTinderSwipe && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            {/* Close button */}
            <button
              onClick={closeTinderSwipe}
              className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Enhanced Tinder Swipe Component */}
            <MealSwipeGame
              allMeals={getAllMealsData()}
              userProfile={userProfile}
              calorieData={calorieData}
              onComplete={closeCardsModal}
              isIntegrated={true}
            />
          </div>
        </div>
      )}

      {/* Regular Cards Modal */}
      <SwipeableCardsModal 
        isOpen={showCardsModal}
        onClose={closeCardsModal}
        timelineData={getTimelineData()}
        currentIndex={currentCardIndex}
        setCurrentIndex={setCurrentCardIndex}
        isMobile={isMobile}
      />
    </div>
  );
};

// Regular Swipeable Cards Modal Component (unchanged)
const SwipeableCardsModal = ({ 
  isOpen, 
  onClose, 
  timelineData, 
  currentIndex, 
  setCurrentIndex, 
  isMobile 
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredData = timelineData.filter(meal => meal.calories > 0 || meal.sugar > 0);

  React.useEffect(() => {
    if (currentIndex >= filteredData.length && filteredData.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredData.length, currentIndex, setCurrentIndex]);

  if (!isOpen || filteredData.length === 0) {
    return null;
  }

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

    if (isLeftSwipe && currentIndex < filteredData.length - 1) {
      navigateToCard(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      navigateToCard(currentIndex - 1);
    }
  };

  const navigateToCard = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const currentMeal = filteredData[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full max-w-sm' : 'w-full max-w-lg h-[600px]'} overflow-hidden flex flex-col`}>
        
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
            🃏 Meal Cards ({currentIndex + 1} of {filteredData.length})
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        <div 
          className="flex-1 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-full flex flex-col">
            
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className={`w-full max-w-sm bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}>
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentMeal.fullName}
                  </div>
                  <div className="text-lg text-gray-600">{currentMeal.time}</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-bold text-lg">{currentMeal.calories}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Sugar:</span>
                    <span className={`font-bold ${
                      currentMeal.sugar > 15 ? 'text-red-600' : 
                      currentMeal.sugar > 8 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {currentMeal.sugar}g
                    </span>
                  </div>
                </div>
                
                {currentMeal.sugar > 8 && (
                  <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                    currentMeal.sugar > 15 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {currentMeal.sugar > 15 ? '⚠️ High Sugar Content!' : '⚡ Moderate Sugar Level'}
                  </div>
                )}

                {isMobile && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    👈 Swipe left/right to navigate 👉
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateToCard(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === 0 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  {filteredData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => !isTransitioning && navigateToCard(index)}
                      disabled={isTransitioning}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
                      } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => navigateToCard(Math.min(filteredData.length - 1, currentIndex + 1))}
                  disabled={currentIndex === filteredData.length - 1 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === filteredData.length - 1 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
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

export default NutritionApp;
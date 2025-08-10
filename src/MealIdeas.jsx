import React, { useState, useEffect } from 'react';
import { X, Clock, Zap } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Function to create scaled breakfast meals based on target calories
const createScaledBreakfastMeals = (targetCalories) => {
  // Base calorie values
  const calories = {
    egg: 70,
    toast: 74,
    banana: 89,
    proteinPowder: 120,
    avocado: 160,
    butter: 102,
    greekYogurt: 130,
    oats: 150,
    almonds: 164,
    peanutButter: 188,
    milkCup: 110
  };

  return [
    // 2-ITEM MEALS (Super Quick - 1 minute)
    {
      id: 1,
      name: "Eggs & Toast",
      description: "Classic protein + carbs combo",
      prepTime: "1 min",
      itemCount: 2,
      difficulty: "Super Easy",
      icon: "🍳",
      estimatedCalories: (() => {
        // Show realistic calories based on whole number portions
        if (targetCalories <= 300) return 288;
        else if (targetCalories <= 400) return 358;
        else if (targetCalories <= 500) return 428;
        else if (targetCalories <= 600) return 498;
        else return 642;
      })(),
      items: (() => {
        // Practical whole numbers with 100-cal wiggle room
        let eggs, toast;
        if (targetCalories <= 300) {
          eggs = 2; toast = 2; // ~288 cal
        } else if (targetCalories <= 400) {
          eggs = 3; toast = 2; // ~358 cal  
        } else if (targetCalories <= 500) {
          eggs = 4; toast = 2; // ~428 cal
        } else if (targetCalories <= 600) {
          eggs = 5; toast = 2; // ~498 cal
        } else {
          eggs = 6; toast = 3; // ~642 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'protein',
            food: 'Eggs (whole)',
            serving: eggs,
            displayServing: eggs.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'carbohydrate',
            food: 'Whole Wheat Bread',
            serving: toast,
            displayServing: toast.toString(),
            displayUnit: 'servings'
          }
        ];
      })()
    },
    {
      id: 2,
      name: "Protein Shake & Banana",
      description: "Grab and go liquid breakfast",
      prepTime: "30 sec",
      itemCount: 2,
      difficulty: "Super Easy",
      icon: "🥤",
      estimatedCalories: (() => {
        // Realistic shake + banana calories
        if (targetCalories <= 300) return 298;
        else if (targetCalories <= 400) return 387;
        else if (targetCalories <= 500) return 418;
        else if (targetCalories <= 600) return 507;
        else return 538;
      })(),
      items: (() => {
        // Practical whole numbers for busy mornings
        let scoops, bananas;
        if (targetCalories <= 300) {
          scoops = 1; bananas = 2; // ~298 cal
        } else if (targetCalories <= 400) {
          scoops = 1; bananas = 3; // ~387 cal
        } else if (targetCalories <= 500) {
          scoops = 2; bananas = 2; // ~418 cal
        } else if (targetCalories <= 600) {
          scoops = 2; bananas = 3; // ~507 cal
        } else {
          scoops = 3; bananas = 2; // ~538 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'supplements',
            food: 'Whey Protein (generic)',
            serving: scoops,
            displayServing: scoops.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fruits',
            food: 'Banana',
            serving: bananas,
            displayServing: bananas.toString(),
            displayUnit: 'servings'
          }
        ];
      })()
    },

    // 3-ITEM MEALS (Quick - 3 minutes)
    {
      id: 3,
      name: "Buttered Eggs & Toast",
      description: "Comfort food with healthy fats",
      prepTime: "3 min",
      itemCount: 3,
      difficulty: "Easy",
      icon: "🧈",
      estimatedCalories: (() => {
        // Buttered eggs realistic calories
        if (targetCalories <= 300) return 286;
        else if (targetCalories <= 400) return 377;
        else if (targetCalories <= 500) return 447;
        else if (targetCalories <= 600) return 517;
        else return 661;
      })(),
      items: (() => {
        // Practical portions for real cooking
        let eggs, toast, tbspOil;
        if (targetCalories <= 300) {
          eggs = 2; toast = 1; tbspOil = 1; // ~286 cal
        } else if (targetCalories <= 400) {
          eggs = 3; toast = 2; tbspOil = 1; // ~377 cal
        } else if (targetCalories <= 500) {
          eggs = 4; toast = 2; tbspOil = 1; // ~447 cal
        } else if (targetCalories <= 600) {
          eggs = 5; toast = 2; tbspOil = 1; // ~517 cal
        } else {
          eggs = 6; toast = 3; tbspOil = 1; // ~661 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'protein',
            food: 'Eggs (whole)',
            serving: eggs,
            displayServing: eggs.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'carbohydrate',
            food: 'Whole Wheat Bread',
            serving: toast,
            displayServing: toast.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fat',
            food: 'Olive Oil',
            serving: tbspOil,
            displayServing: tbspOil.toString(),
            displayUnit: 'servings'
          }
        ];
      })()
    },
    {
      id: 4,
      name: "Yogurt Banana Bowl",
      description: "Creamy protein with natural sugars",
      prepTime: "2 min",
      itemCount: 3,
      difficulty: "Easy", 
      icon: "🥣",
      estimatedCalories: (() => {
        // Yogurt bowl realistic calories
        if (targetCalories <= 300) return 308;
        else if (targetCalories <= 400) return 383;
        else if (targetCalories <= 500) return 472;
        else if (targetCalories <= 600) return 554;
        else return 537;
      })(),
      items: (() => {
        // Simple whole portions 
        let cups, bananas, almondOz;
        if (targetCalories <= 300) {
          cups = 1; bananas = 1; almondOz = 0.5; // ~308 cal
        } else if (targetCalories <= 400) {
          cups = 1; bananas = 1; almondOz = 1; // ~383 cal
        } else if (targetCalories <= 500) {
          cups = 1; bananas = 2; almondOz = 1; // ~472 cal
        } else if (targetCalories <= 600) {
          cups = 1; bananas = 2; almondOz = 1.5; // ~554 cal
        } else {
          cups = 1.5; bananas = 2; almondOz = 1; // ~537 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'protein',
            food: 'Greek Yogurt (non-fat)',
            serving: cups,
            displayServing: cups.toString(),
            displayUnit: 'cups'
          },
          {
            id: generateId(),
            category: 'fruits',
            food: 'Banana',
            serving: bananas,
            displayServing: bananas.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fat',
            food: 'Almonds',
            serving: almondOz,
            displayServing: almondOz.toString(),
            displayUnit: 'servings'
          }
        ];
      })()
    },

    // 4-ITEM MEALS (Balanced - 5 minutes)
    {
      id: 5,
      name: "Avocado Egg Toast",
      description: "Instagram-worthy balanced meal",
      prepTime: "5 min",
      itemCount: 4,
      difficulty: "Moderate",
      icon: "🥑",
      estimatedCalories: (() => {
        // Avocado toast realistic calories
        if (targetCalories <= 300) return 285;
        else if (targetCalories <= 400) return 355;
        else if (targetCalories <= 500) return 429;
        else if (targetCalories <= 600) return 519;
        else return 719;
      })(),
      items: (() => {
        // Instagram-worthy but practical portions
        let eggs, toast, avocadoHalf, milkCups;
        if (targetCalories <= 300) {
          eggs = 1; toast = 1; avocadoHalf = 0.5; milkCups = 0.5; // ~285 cal
        } else if (targetCalories <= 400) {
          eggs = 2; toast = 1; avocadoHalf = 0.5; milkCups = 0.5; // ~355 cal
        } else if (targetCalories <= 500) {
          eggs = 2; toast = 2; avocadoHalf = 0.5; milkCups = 0.5; // ~429 cal
        } else if (targetCalories <= 600) {
          eggs = 3; toast = 2; avocadoHalf = 0.5; milkCups = 1; // ~519 cal
        } else {
          eggs = 4; toast = 2; avocadoHalf = 1; milkCups = 1; // ~719 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'protein',
            food: 'Eggs (whole)',
            serving: eggs,
            displayServing: eggs.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'carbohydrate',
            food: 'Ezekiel Bread',
            serving: toast,
            displayServing: toast.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fat',
            food: 'Avocado',
            serving: avocadoHalf,
            displayServing: avocadoHalf.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'supplements',
            food: 'Fairlife Milk (8oz)',
            serving: milkCups,
            displayServing: milkCups.toString(),
            displayUnit: 'cups'
          }
        ];
      })()
    },
    {
      id: 6,
      name: "Power Oat Bowl",
      description: "Complete macro-balanced breakfast",
      prepTime: "4 min",
      itemCount: 4,
      difficulty: "Moderate",
      icon: "💪",
      estimatedCalories: (() => {
        // Power oat bowl realistic calories
        if (targetCalories <= 300) return 298;
        else if (targetCalories <= 400) return 433;
        else if (targetCalories <= 500) return 527;
        else if (targetCalories <= 600) return 602;
        else return 677;
      })(),
      items: (() => {
        // Complete macro bowl with practical measurements
        let oatCups, scoops, bananas, pbTbsp;
        if (targetCalories <= 300) {
          oatCups = 0.25; scoops = 0.5; bananas = 1; pbTbsp = 1; // ~298 cal
        } else if (targetCalories <= 400) {
          oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 1; // ~433 cal
        } else if (targetCalories <= 500) {
          oatCups = 0.5; scoops = 1; bananas = 1; pbTbsp = 2; // ~527 cal
        } else if (targetCalories <= 600) {
          oatCups = 0.75; scoops = 1; bananas = 1; pbTbsp = 2; // ~602 cal
        } else {
          oatCups = 1; scoops = 1; bananas = 1; pbTbsp = 2; // ~677 cal
        }
        
        return [
          {
            id: generateId(),
            category: 'carbohydrate',
            food: 'Oats (dry)',
            serving: oatCups * 2, // Convert to our serving size
            displayServing: oatCups.toString(),
            displayUnit: 'cups'
          },
          {
            id: generateId(),
            category: 'supplements',
            food: 'Whey Protein (generic)',
            serving: scoops,
            displayServing: scoops.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fruits',
            food: 'Banana',
            serving: bananas,
            displayServing: bananas.toString(),
            displayUnit: 'servings'
          },
          {
            id: generateId(),
            category: 'fat',
            food: 'Peanut Butter',
            serving: pbTbsp / 2, // Convert to our serving size
            displayServing: pbTbsp.toString(),
            displayUnit: 'tbsp'
          }
        ];
      })()
    }
  ];
};

const MealIdeasModal = ({
  isOpen,
  onClose,
  onAddMeal,
  userProfile,
  calorieData,
  isMobile
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate target calories (total daily calories / 5)
  const targetCalories = calorieData?.targetCalories ? Math.round(calorieData.targetCalories / 5) : 440;
  
  // Generate meals based on user's target calories
  const breakfastMeals = createScaledBreakfastMeals(targetCalories);

  useEffect(() => {
    if (currentIndex >= breakfastMeals.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, breakfastMeals.length]);

  if (!isOpen) return null;

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

    if (isLeftSwipe && currentIndex < breakfastMeals.length - 1) {
      navigateToMeal(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      navigateToMeal(currentIndex - 1);
    }
  };

  const navigateToMeal = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddMeal = (meal) => {
    onAddMeal({ items: meal.items });
    onClose();
  };

  const currentMeal = breakfastMeals[currentIndex];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Super Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Easy': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[700px]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
              🚀 Quick Breakfast Ideas ({currentIndex + 1}/{breakfastMeals.length})
            </h3>
            <p className="text-sm opacity-90">Target: {targetCalories} calories • Busy lifestyle friendly</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 p-1">
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-full flex flex-col">
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className={`w-full bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 shadow-lg transition-all duration-300 ${
                isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}>
                
                {/* Meal Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{currentMeal.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentMeal.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{currentMeal.description}</div>
                  
                  {/* Speed indicators */}
                  <div className="flex justify-center gap-3 mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentMeal.difficulty)}`}>
                      {currentMeal.difficulty}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Clock size={12} />
                      {currentMeal.prepTime}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                      <Zap size={12} />
                      {currentMeal.itemCount} items
                    </div>
                  </div>

                  {/* Calorie Display */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-blue-600">{currentMeal.estimatedCalories}</div>
                    <div className="text-xs text-gray-600">Calories (Perfect for your goal!)</div>
                  </div>
                </div>
                
                {/* Food Items List */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-bold text-gray-800 text-center mb-3">Simple Ingredients:</h5>
                  {currentMeal.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-sm font-medium text-gray-700">{item.food}</span>
                      <span className="text-sm text-gray-600 font-medium">{item.displayServing} {item.displayUnit}</span>
                    </div>
                  ))}
                </div>

                {/* Add to Breakfast Button */}
                <button
                  onClick={() => handleAddMeal(currentMeal)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✅ Add to My Breakfast
                </button>

                {isMobile && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    👈 Swipe left/right for more quick ideas 👉
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateToMeal(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === 0 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  {breakfastMeals.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => !isTransitioning && navigateToMeal(index)}
                      disabled={isTransitioning}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-green-500' : 'bg-gray-300'
                      } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => navigateToMeal(Math.min(breakfastMeals.length - 1, currentIndex + 1))}
                  disabled={currentIndex === breakfastMeals.length - 1 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === breakfastMeals.length - 1 || isTransitioning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-green-600'
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

export default MealIdeasModal;
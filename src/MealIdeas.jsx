import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// 5 Complete Breakfast Meals for Maintain Goal (~target/5 calories each)
const maintainBreakfastMeals = [
  {
    id: 1,
    name: "Power Bowl",
    description: "Greek Yogurt + Oats + Blueberries + Almonds + Protein",
    estimatedCalories: 470,
    estimatedProtein: 54,
    estimatedCarbs: 43,
    estimatedFat: 12,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Greek Yogurt (non-fat)',
        serving: 1,
        displayServing: '1',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Oats (dry)',
        serving: 0.75,
        displayServing: '0.75',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fruits',
        food: 'Blueberries',
        serving: 0.67,
        displayServing: '0.5',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fat',
        food: 'Almonds',
        serving: 0.5,
        displayServing: '15',
        displayUnit: 'grams'
      },
      {
        id: generateId(),
        category: 'supplements',
        food: 'Whey Protein (generic)',
        serving: 1,
        displayServing: '1',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'fruits',
        food: 'Banana',
        serving: 0.5,
        displayServing: '0.5',
        displayUnit: 'servings'
      }
    ]
  },
  {
    id: 2,
    name: "Veggie Scramble",
    description: "Egg Whites + Sweet Potato + Spinach + Whole Grain Toast",
    estimatedCalories: 450,
    estimatedProtein: 35,
    estimatedCarbs: 48,
    estimatedFat: 12,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Egg Whites',
        serving: 6,
        displayServing: '6',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Sweet Potato',
        serving: 1,
        displayServing: '100',
        displayUnit: 'grams'
      },
      {
        id: generateId(),
        category: 'vegetables',
        food: 'Spinach',
        serving: 1,
        displayServing: '1',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fat',
        food: 'Olive Oil',
        serving: 1,
        displayServing: '1',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Whole Wheat Bread',
        serving: 2,
        displayServing: '2',
        displayUnit: 'servings'
      }
    ]
  },
  {
    id: 3,
    name: "Lean & Green",
    description: "Chicken + Brown Rice + Broccoli + Apple + Cottage Cheese",
    estimatedCalories: 480,
    estimatedProtein: 50,
    estimatedCarbs: 45,
    estimatedFat: 14,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Chicken Breast',
        serving: 1,
        displayServing: '100',
        displayUnit: 'grams'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Brown Rice (cooked)',
        serving: 0.8,
        displayServing: '0.8',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'vegetables',
        food: 'Broccoli',
        serving: 1,
        displayServing: '1',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fat',
        food: 'Olive Oil',
        serving: 0.5,
        displayServing: '0.5',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'fruits',
        food: 'Apple',
        serving: 1,
        displayServing: '1',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'protein',
        food: 'Cottage Cheese (low-fat)',
        serving: 0.5,
        displayServing: '0.5',
        displayUnit: 'cups'
      }
    ]
  },
  {
    id: 4,
    name: "Mediterranean Style",
    description: "Tuna + Quinoa + Bell Peppers + Avocado + Ezekiel Bread",
    estimatedCalories: 465,
    estimatedProtein: 40,
    estimatedCarbs: 52,
    estimatedFat: 11,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Tuna (canned in water)',
        serving: 1,
        displayServing: '100',
        displayUnit: 'grams'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Quinoa (cooked)',
        serving: 1.2,
        displayServing: '1.2',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'vegetables',
        food: 'Bell Peppers',
        serving: 1,
        displayServing: '1',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fat',
        food: 'Avocado',
        serving: 0.25,
        displayServing: '0.25',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Ezekiel Bread',
        serving: 1,
        displayServing: '1',
        displayUnit: 'servings'
      }
    ]
  },
  {
    id: 5,
    name: "Classic Hearty",
    description: "Whole Eggs + Oats + Strawberries + Peanut Butter",
    estimatedCalories: 455,
    estimatedProtein: 25,
    estimatedCarbs: 35,
    estimatedFat: 24,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Eggs (whole)',
        serving: 3,
        displayServing: '3',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Oats (dry)',
        serving: 0.6,
        displayServing: '0.6',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fruits',
        food: 'Strawberries',
        serving: 0.75,
        displayServing: '0.75',
        displayUnit: 'cups'
      },
      {
        id: generateId(),
        category: 'fat',
        food: 'Peanut Butter',
        serving: 0.5,
        displayServing: '1',
        displayUnit: 'servings'
      }
    ]
  }
];

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

  useEffect(() => {
    if (currentIndex >= maintainBreakfastMeals.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

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

    if (isLeftSwipe && currentIndex < maintainBreakfastMeals.length - 1) {
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

  const currentMeal = maintainBreakfastMeals[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[700px]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
              💡 Breakfast Ideas ({currentIndex + 1} of {maintainBreakfastMeals.length})
            </h3>
            <p className="text-sm opacity-90">Target: ~{targetCalories} calories</p>
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
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentMeal.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{currentMeal.description}</div>
                  
                  {/* Estimated Macros */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">{currentMeal.estimatedCalories}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">{currentMeal.estimatedProtein}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                  </div>
                  
                  {/* Quick macro breakdown */}
                  <div className="text-xs text-gray-500 mb-4">
                    {currentMeal.estimatedCarbs}g carbs • {currentMeal.estimatedFat}g fat
                  </div>
                </div>
                
                {/* Food Items List */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-bold text-gray-800 text-center mb-3">What's Included:</h5>
                  {currentMeal.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-700">{item.food}</span>
                      <span className="text-sm text-gray-600">{item.displayServing} {item.displayUnit}</span>
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
                    👈 Swipe left/right to see more ideas 👉
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
                  {maintainBreakfastMeals.map((_, index) => (
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
                  onClick={() => navigateToMeal(Math.min(maintainBreakfastMeals.length - 1, currentIndex + 1))}
                  disabled={currentIndex === maintainBreakfastMeals.length - 1 || isTransitioning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentIndex === maintainBreakfastMeals.length - 1 || isTransitioning
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
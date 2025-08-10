import React, { useState, useEffect } from 'react';
import { X, Plus, Target, TrendingUp } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Base breakfast meals (300-450 calories)
const baseMeals = [
  {
    id: 'base1',
    name: "Greek Yogurt Bowl",
    description: "High-protein foundation",
    calories: 350,
    protein: 28,
    carbs: 15,
    fat: 1,
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
        serving: 0.5,
        displayServing: '0.5',
        displayUnit: 'cups'
      }
    ]
  },
  {
    id: 'base2',
    name: "Egg White Scramble",
    description: "Clean protein base",
    calories: 320,
    protein: 26,
    carbs: 25,
    fat: 5,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Egg Whites',
        serving: 5,
        displayServing: '5',
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
      }
    ]
  },
  {
    id: 'base3',
    name: "Chicken & Rice",
    description: "Lean muscle fuel",
    calories: 380,
    protein: 35,
    carbs: 23,
    fat: 8,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Chicken Breast',
        serving: 0.8,
        displayServing: '80',
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
      }
    ]
  },
  {
    id: 'base4',
    name: "Whole Egg Classic",
    description: "Traditional hearty start",
    calories: 360,
    protein: 21,
    carbs: 27,
    fat: 18,
    items: [
      {
        id: generateId(),
        category: 'protein',
        food: 'Eggs (whole)',
        serving: 2,
        displayServing: '2',
        displayUnit: 'servings'
      },
      {
        id: generateId(),
        category: 'carbohydrate',
        food: 'Oats (dry)',
        serving: 0.5,
        displayServing: '0.5',
        displayUnit: 'cups'
      }
    ]
  }
];

// Add-on options to reach target calories
const addOnOptions = [
  // Fruits (50-90 calories)
  {
    category: 'Fruits',
    items: [
      { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 medium', food: 'Apple', foodCategory: 'fruits', servingAmount: 1, unit: 'servings' },
      { name: 'Banana', calories: 89, protein: 1.3, carbs: 23, fat: 0.3, serving: '1 medium', food: 'Banana', foodCategory: 'fruits', servingAmount: 1, unit: 'servings' },
      { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, serving: '1/2 cup', food: 'Blueberries', foodCategory: 'fruits', servingAmount: 0.67, unit: 'cups' },
      { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7, fat: 0.3, serving: '1/2 cup', food: 'Strawberries', foodCategory: 'fruits', servingAmount: 0.5, unit: 'cups' },
      { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, serving: '1 medium', food: 'Orange', foodCategory: 'fruits', servingAmount: 1, unit: 'servings' }
    ]
  },
  // Healthy Fats (80-180 calories)
  {
    category: 'Healthy Fats',
    items: [
      { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz', food: 'Almonds', foodCategory: 'fat', servingAmount: 1, unit: 'servings' },
      { name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, serving: '2 tbsp', food: 'Peanut Butter', foodCategory: 'fat', servingAmount: 1, unit: 'servings' },
      { name: 'Avocado', calories: 80, protein: 1, carbs: 4.5, fat: 7.5, serving: '1/4 avocado', food: 'Avocado', foodCategory: 'fat', servingAmount: 0.25, unit: 'servings' },
      { name: 'Walnuts', calories: 185, protein: 4, carbs: 4, fat: 18, serving: '1 oz', food: 'Walnuts', foodCategory: 'fat', servingAmount: 1, unit: 'servings' },
      { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp', food: 'Olive Oil', foodCategory: 'fat', servingAmount: 1, unit: 'servings' }
    ]
  },
  // Protein Boosts (80-130 calories)
  {
    category: 'Protein Boost',
    items: [
      { name: 'Whey Protein', calories: 120, protein: 24, carbs: 2, fat: 1.5, serving: '1 scoop', food: 'Whey Protein (generic)', foodCategory: 'supplements', servingAmount: 1, unit: 'servings' },
      { name: 'Cottage Cheese', calories: 90, protein: 14, carbs: 5, fat: 2, serving: '1/2 cup', food: 'Cottage Cheese (low-fat)', foodCategory: 'protein', servingAmount: 1, unit: 'servings' },
      { name: 'String Cheese', calories: 70, protein: 6, carbs: 1, fat: 5, serving: '1 stick', food: 'String Cheese', foodCategory: 'supplements', servingAmount: 1, unit: 'servings' }
    ]
  },
  // Extra Carbs (70-130 calories)
  {
    category: 'Extra Carbs',
    items: [
      { name: 'Whole Wheat Bread', calories: 74, protein: 4, carbs: 12, fat: 1, serving: '1 slice', food: 'Whole Wheat Bread', foodCategory: 'carbohydrate', servingAmount: 1, unit: 'servings' },
      { name: 'Ezekiel Bread', calories: 80, protein: 4, carbs: 15, fat: 0.5, serving: '1 slice', food: 'Ezekiel Bread', foodCategory: 'carbohydrate', servingAmount: 1, unit: 'servings' },
      { name: 'Rice Cakes', calories: 70, protein: 1.4, carbs: 14, fat: 0.8, serving: '2 cakes', food: 'Rice Cakes', foodCategory: 'carbohydrate', servingAmount: 2, unit: 'servings' },
      { name: 'More Oats', calories: 75, protein: 2.5, carbs: 13.5, fat: 1.5, serving: '+1/4 cup dry', food: 'Oats (dry)', foodCategory: 'carbohydrate', servingAmount: 0.25, unit: 'cups' }
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
  const [currentStep, setCurrentStep] = useState('base'); // 'base' or 'building'
  const [selectedBase, setSelectedBase] = useState(null);
  const [currentMeal, setCurrentMeal] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMacros, setTotalMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  // Calculate target calories (total daily calories / 4)
  const targetCalories = calorieData?.targetCalories ? Math.round(calorieData.targetCalories / 4) : 550;
  const caloriesRemaining = Math.max(0, targetCalories - totalCalories);
  const progressPercentage = Math.min((totalCalories / targetCalories) * 100, 100);

  useEffect(() => {
    if (selectedBase) {
      const calories = selectedBase.calories;
      const macros = {
        protein: selectedBase.protein,
        carbs: selectedBase.carbs,
        fat: selectedBase.fat
      };
      
      setTotalCalories(calories);
      setTotalMacros(macros);
      setCurrentMeal([...selectedBase.items]);
    }
  }, [selectedBase]);

  const handleSelectBase = (base) => {
    setSelectedBase(base);
    setCurrentStep('building');
  };

  const handleAddOn = (addOn) => {
    // Add to current meal items
    const newItem = {
      id: generateId(),
      category: addOn.foodCategory,
      food: addOn.food,
      serving: addOn.servingAmount,
      displayServing: addOn.servingAmount.toString(),
      displayUnit: addOn.unit
    };

    setCurrentMeal(prev => [...prev, newItem]);
    setTotalCalories(prev => prev + addOn.calories);
    setTotalMacros(prev => ({
      protein: prev.protein + addOn.protein,
      carbs: prev.carbs + addOn.carbs,
      fat: prev.fat + addOn.fat
    }));
  };

  const handleFinishMeal = () => {
    onAddMeal({ items: currentMeal });
    handleReset();
  };

  const handleReset = () => {
    setCurrentStep('base');
    setSelectedBase(null);
    setCurrentMeal([]);
    setTotalCalories(0);
    setTotalMacros({ protein: 0, carbs: 0, fat: 0 });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full h-full' : 'w-full max-w-4xl h-[90vh]'} overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
              💡 Build Your Breakfast
            </h3>
            <p className="text-sm opacity-90">Target: {targetCalories} calories</p>
          </div>
          <button onClick={handleClose} className="text-white hover:text-gray-200 p-1">
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep === 'building' && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {totalCalories} / {targetCalories} calories
              </span>
              <span className="text-sm text-gray-600">
                {caloriesRemaining} remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Current Macros */}
            <div className="flex justify-between mt-3 text-sm">
              <span>Protein: {Math.round(totalMacros.protein)}g</span>
              <span>Carbs: {Math.round(totalMacros.carbs)}g</span>
              <span>Fat: {Math.round(totalMacros.fat)}g</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Step 1: Choose Base Meal */}
          {currentStep === 'base' && (
            <div>
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">Step 1: Choose Your Base</h4>
                <p className="text-gray-600">Start with a foundation meal (300-400 calories)</p>
              </div>

              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
                {baseMeals.map((base) => (
                  <div
                    key={base.id}
                    onClick={() => handleSelectBase(base)}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <h5 className="text-xl font-bold text-gray-800 mb-2">{base.name}</h5>
                    <p className="text-gray-600 mb-4">{base.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{base.calories}</div>
                        <div className="text-xs text-gray-600">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{base.protein}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {base.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          • {item.food}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Build to Target */}
          {currentStep === 'building' && (
            <div>
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">Step 2: Add Components</h4>
                <p className="text-gray-600">Add items to reach your {targetCalories} calorie target</p>
              </div>

              {/* Current Meal Summary */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <h5 className="font-bold text-gray-800 mb-3">Your Current Meal:</h5>
                <div className="space-y-2">
                  {currentMeal.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.food}</span>
                      <span className="text-gray-600">{item.displayServing} {item.displayUnit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-On Categories */}
              <div className="space-y-6">
                {addOnOptions.map((category) => (
                  <div key={category.category}>
                    <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Plus size={20} className="text-green-500" />
                      {category.category}
                    </h5>
                    
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                      {category.items.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleAddOn(item)}
                          className={`bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:border-green-300 ${
                            item.calories > caloriesRemaining + 20 ? 'opacity-50' : 'hover:scale-105'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-sm font-bold text-blue-600">+{item.calories}</span>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{item.serving}</div>
                          <div className="text-xs text-gray-500">
                            {item.protein}p | {item.carbs}c | {item.fat}f
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4'} mt-8 pt-6 border-t`}>
                <button
                  onClick={handleReset}
                  className={`${isMobile ? 'py-3' : 'py-2 px-6'} bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium`}
                >
                  Start Over
                </button>
                
                <button
                  onClick={handleFinishMeal}
                  disabled={totalCalories < targetCalories * 0.8}
                  className={`${isMobile ? 'py-3' : 'py-2 px-6'} bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md font-medium transition-all duration-300 hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex-1`}
                >
                  ✅ Add to My Breakfast ({totalCalories} cal)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealIdeasModal;
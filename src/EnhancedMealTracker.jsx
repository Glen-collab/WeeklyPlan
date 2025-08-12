import React, { useState } from 'react';
import { Plus, X, Clock, Utensils, Trash2, RotateCcw } from 'lucide-react';
import { FoodDatabase, getAllCategories } from './FoodDatabase.js';

const EnhancedMealTracker = ({
  mealType,
  time,
  setTime,
  items,
  allItems,
  totals,
  onOpenServingModal,
  onOpenFoodModal,
  onUpdateFoodItem,
  onAddFoodItem,
  onRemoveFoodItem,
  onRemoveFood,
  onRestoreFood,
  removedFoods,
  isMobile,
  hideTitle = false
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const timeOptions = [
    '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
    '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM',
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];

  // Enhanced touch handlers for food items
  const handleFoodTouchStart = (e, item) => {
    e.stopPropagation();
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDraggedItem(item.id);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleFoodTouchMove = (e, item) => {
    if (!touchStart || draggedItem !== item.id) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = e.touches[0].clientY - touchStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleFoodTouchEnd = (e, item) => {
    if (!touchStart || draggedItem !== item.id) return;
    
    const deltaY = dragOffset.y;
    const deltaX = dragOffset.x;
    
    // Vertical swipe to remove/restore
    if (Math.abs(deltaY) > 80) {
      const isRemoved = removedFoods.has(`${mealType}-${item.id}`);
      if (isRemoved) {
        onRestoreFood(mealType, item.id);
      } else {
        onRemoveFood(mealType, item.id);
      }
    }
    
    // Reset state
    setTouchStart(null);
    setDraggedItem(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const getTransformStyle = (item) => {
    if (draggedItem === item.id) {
      const scale = Math.max(0.8, 1 - Math.abs(dragOffset.y) / 200);
      const opacity = Math.max(0.3, 1 - Math.abs(dragOffset.y) / 150);
      return {
        transform: `translateY(${dragOffset.y}px) scale(${scale})`,
        opacity: opacity,
        transition: 'none'
      };
    }
    return {
      transform: 'none',
      opacity: 1,
      transition: 'all 0.3s ease'
    };
  };

  const getFoodDisplayText = (item) => {
    if (!item.category || !item.food) {
      return "Select food...";
    }
    
    const servingText = item.displayServing ? 
      `${item.displayServing} ${item.displayUnit}` : 
      `${item.serving} serving${item.serving !== 1 ? 's' : ''}`;
    
    return `${item.food} (${servingText})`;
  };

  const getFoodCalories = (item) => {
    if (!item.category || !item.food || !FoodDatabase[item.category][item.food]) {
      return 0;
    }
    return Math.round(FoodDatabase[item.category][item.food].calories * item.serving);
  };

  const isItemRemoved = (item) => removedFoods.has(`${mealType}-${item.id}`);

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 flex items-center gap-2`}>
            <Utensils size={isMobile ? 20 : 24} />
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </h3>
        </div>
      )}

      {/* Time Selection */}
      <div className="flex items-center gap-3">
        <Clock size={16} className="text-gray-600" />
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`${isMobile ? 'p-2 text-sm' : 'p-2 text-sm'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
        >
          {timeOptions.map(timeOption => (
            <option key={timeOption} value={timeOption}>{timeOption}</option>
          ))}
        </select>
      </div>

      {/* Food Items with Swipe Support */}
      <div className="space-y-3">
        {allItems.map((item, index) => {
          const isRemoved = isItemRemoved(item);
          const calories = getFoodCalories(item);
          
          return (
            <div
              key={item.id}
              className={`relative ${isMobile ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all duration-300 ${
                isRemoved 
                  ? 'bg-red-50 border-red-200 opacity-50' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
              style={getTransformStyle(item)}
              onTouchStart={(e) => handleFoodTouchStart(e, item)}
              onTouchMove={(e) => handleFoodTouchMove(e, item)}
              onTouchEnd={(e) => handleFoodTouchEnd(e, item)}
            >
              {/* Swipe Indicators */}
              {draggedItem === item.id && Math.abs(dragOffset.y) > 30 && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                  dragOffset.y < 0 
                    ? (isRemoved ? 'bg-green-500' : 'bg-red-500')
                    : (isRemoved ? 'bg-green-500' : 'bg-red-500')
                } bg-opacity-20 pointer-events-none`}>
                  <div className={`text-2xl ${
                    dragOffset.y < 0 
                      ? (isRemoved ? 'text-green-600' : 'text-red-600')
                      : (isRemoved ? 'text-green-600' : 'text-red-600')
                  }`}>
                    {isRemoved ? <RotateCcw size={32} /> : <Trash2 size={32} />}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {/* Category Selection */}
                    <select
                      value={item.category}
                      onChange={(e) => onUpdateFoodItem(mealType, item.id, 'category', e.target.value)}
                      className={`${isMobile ? 'text-xs p-2' : 'text-sm p-2'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-0 flex-1`}
                      disabled={isRemoved}
                    >
                      <option value="">Category</option>
                      {getAllCategories().map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>

                    {/* Food Selection Button */}
                    <button
                      onClick={() => item.category && onOpenFoodModal(mealType, item, item.category)}
                      disabled={!item.category || isRemoved}
                      className={`${isMobile ? 'text-xs p-2' : 'text-sm p-2'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors min-w-0 flex-2 text-left ${
                        !item.category || isRemoved ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      {item.food || "Select food..."}
                    </button>

                    {/* Serving Button */}
                    <button
                      onClick={() => item.food && onOpenServingModal(mealType, item)}
                      disabled={!item.food || isRemoved}
                      className={`${isMobile ? 'text-xs p-2' : 'text-sm p-2'} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap ${
                        !item.food || isRemoved ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      {item.displayServing ? 
                        `${item.displayServing} ${item.displayUnit}` : 
                        `${item.serving} serving${item.serving !== 1 ? 's' : ''}`}
                    </button>
                  </div>

                  {/* Calories Display */}
                  {calories > 0 && !isRemoved && (
                    <div className="mt-2 text-sm text-gray-600">
                      📊 {calories} calories
                    </div>
                  )}

                  {/* Removed Status */}
                  {isRemoved && (
                    <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Trash2 size={14} />
                      Removed from calculations
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFoodItem(mealType, item.id)}
                  className={`${isMobile ? 'p-2' : 'p-2'} text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ml-2`}
                >
                  <X size={isMobile ? 16 : 18} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Food Button */}
        <button
          onClick={() => onAddFoodItem(mealType)}
          className={`w-full ${isMobile ? 'p-3' : 'p-4'} border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2`}
        >
          <Plus size={isMobile ? 18 : 20} />
          Add Food Item
        </button>
      </div>

      {/* Totals Display */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3 text-center">Meal Totals</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg text-blue-600">{Math.round(totals.calories)}</div>
            <div className="text-blue-700">Calories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">{Math.round(totals.protein)}g</div>
            <div className="text-green-700">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-600">{Math.round(totals.carbs)}g</div>
            <div className="text-yellow-700">Carbs</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-600">{Math.round(totals.fat)}g</div>
            <div className="text-purple-700">Fat</div>
          </div>
        </div>
        
        {totals.sugar > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-300">
            <div className="text-center">
              <div className={`font-bold text-lg ${
                totals.sugar > 30 ? 'text-red-600' : 
                totals.sugar > 15 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {Math.round(totals.sugar)}g
              </div>
              <div className="text-gray-700">Sugar</div>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Instructions */}
      {isMobile && (
        <div className="mt-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          👆 Swipe foods up/down to remove/restore • 
          {removedFoods.size > 0 && ` ${removedFoods.size} food(s) hidden from totals`}
        </div>
      )}
    </div>
  );
};

export default EnhancedMealTracker;
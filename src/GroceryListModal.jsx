import React, { useState, useEffect } from 'react';
import { Printer, X, ShoppingCart } from 'lucide-react';
import { servingSizeConversions, FoodDatabase } from './FoodDatabase.js';

const GroceryListModal = ({ 
  isOpen, 
  onClose, 
  allMeals = {}, 
  isMobile = false 
}) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // No print styles needed since we're using new window approach
  useEffect(() => {
    // Component mounted - no special print styles needed
  }, [isOpen]);

  // Extract and categorize foods from meal plan
  const extractGroceryList = () => {
    const groceryList = {
      protein: new Map(),
      carbohydrate: new Map(),
      fruits: new Map(),
      vegetables: new Map(),
      fat: new Map()
    };

    // Process all meals and extract unique foods with quantities
    Object.values(allMeals).forEach(meal => {
      if (!meal.items) return;
      
      meal.items.forEach(item => {
        if (!item.food || !item.serving) return;
        
        // If item doesn't have category, try to infer it from FoodDatabase
        let category = item.category;
        if (!category && item.food) {
          // Search through FoodDatabase to find the category
          Object.keys(FoodDatabase).forEach(cat => {
            if (FoodDatabase[cat][item.food]) {
              category = cat;
            }
          });
        }
        
        const categoryMap = groceryList[category];
        if (!categoryMap) return;

        // Calculate weekly quantity (7 days)
        const weeklyServing = item.serving * 7;
        
        if (categoryMap.has(item.food)) {
          categoryMap.set(item.food, categoryMap.get(item.food) + weeklyServing);
        } else {
          categoryMap.set(item.food, weeklyServing);
        }
      });
    });

    return groceryList;
  };

  // Convert serving to smart grocery quantity
  const getGroceryQuantity = (food, category, totalServings) => {
    const conversions = servingSizeConversions[category]?.[food];
    if (!conversions) return `${totalServings.toFixed(1)} servings`;

    const foodName = food.toLowerCase();

    // Proteins
    if (category === 'protein') {
      if (foodName.includes('egg whites')) {
        return `${Math.ceil(totalServings)} egg whites`;
      }
      if (foodName.includes('eggs') && foodName.includes('whole')) {
        return `${Math.ceil(totalServings)} eggs`;
      }
      if (foodName.includes('greek yogurt') || foodName.includes('cottage cheese')) {
        const totalContainers = Math.ceil((conversions.cups * totalServings) / 2); // 2 cups per container
        return `${totalContainers} container${totalContainers > 1 ? 's' : ''}`;
      }
      if (foodName.includes('chicken') || foodName.includes('salmon') || foodName.includes('turkey') || 
          foodName.includes('beef') || foodName.includes('fish')) {
        const totalPounds = ((conversions.ounces * totalServings) / 16).toFixed(1);
        return `${totalPounds} lb`;
      }
      if (foodName.includes('protein') && foodName.includes('powder')) {
        return `1 container (${Math.ceil(totalServings)} scoops)`;
      }
    }

    // Carbohydrates
    if (category === 'carbohydrate') {
      if (foodName.includes('bread')) {
        const totalLoaves = Math.ceil(totalServings / 10); // ~10 slices per loaf
        return `${totalLoaves} loaf${totalLoaves > 1 ? 'loaves' : ''}`;
      }
      if (foodName.includes('rice') || foodName.includes('oats') || foodName.includes('quinoa')) {
        const totalCups = (conversions.cups * totalServings).toFixed(1);
        return `${totalCups} cups (dry)`;
      }
    }

    // Fruits
    if (category === 'fruits') {
      if (foodName.includes('apple') || foodName.includes('banana') || foodName.includes('orange')) {
        return `${Math.ceil(totalServings)} ${food.toLowerCase()}${totalServings > 1 ? 's' : ''}`;
      } else {
        const totalCups = (conversions.cups * totalServings).toFixed(1);
        return `${totalCups} cups`;
      }
    }

    // Default to pounds for most items
    if (conversions.ounces) {
      const totalPounds = ((conversions.ounces * totalServings) / 16).toFixed(1);
      return totalPounds >= 1 ? `${totalPounds} lb` : `${(conversions.ounces * totalServings).toFixed(1)} oz`;
    }

    return `${totalServings.toFixed(1)} servings`;
  };

  // All condiments and supplements removed for cleaner one-page grocery list

  const groceryList = extractGroceryList();

  const handlePrint = () => {
    // Generate simple HTML for printing
    const groceryList = extractGroceryList();
    
    const formatDate = () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return `${today.toLocaleDateString()} - ${nextWeek.toLocaleDateString()}`;
    };

    const categoryLabels = {
      protein: '🥩 Proteins',
      carbohydrate: '🍞 Carbohydrates', 
      fruits: '🍎 Fruits',
      vegetables: '🥬 Vegetables',
      fat: '🥑 Healthy Fats'
    };

    let htmlContent = `
      <html>
        <head>
          <title>Weekly Grocery List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px; }
            h3 { background-color: #f0f0f0; padding: 8px; border: 1px solid black; margin: 15px 0 8px 0; }
            .item { margin: 5px 0; padding-left: 20px; }
            .footer { margin-top: 30px; text-align: center; border-top: 1px solid black; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>🛒 Weekly Grocery Shopping List</h1>
          <p style="text-align: center; margin-bottom: 25px;">Shopping Period: ${formatDate()}</p>
    `;

    // Add food categories
    Object.entries(categoryLabels).forEach(([category, label]) => {
      const items = groceryList[category];
      if (items && items.size > 0) {
        htmlContent += `<h3>${label}</h3>`;
        Array.from(items.entries()).forEach(([food, quantity]) => {
          htmlContent += `<div class="item">☐ ${getGroceryQuantity(food, category, quantity)} • ${food}</div>`;
        });
      }
    });

    htmlContent += `
          <div class="footer">
            <p>✓ Check off items as you shop • Generated from your nutrition plan</p>
          </div>
        </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handlePreview = () => {
    setShowPrintPreview(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 grocery-hide">
      <div className={`bg-white rounded-lg w-full ${isMobile ? 'max-w-sm max-h-full' : 'max-w-6xl max-h-[95vh]'} overflow-hidden flex flex-col`}>
        
        {/* Modal Header */}
        <div className="grocery-hide flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 flex items-center gap-2`}>
            <ShoppingCart size={24} />
            Weekly Grocery List
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2`}
            >
              👁️ Preview
            </button>
            <button
              onClick={handlePrint}
              className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2`}
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showPrintPreview ? (
            /* Print Preview */
            <div className="bg-white border border-gray-300 p-6 max-w-[8.5in] mx-auto min-h-[11in]">
              <div className="grocery-printable">
                <GroceryListContent 
                  groceryList={groceryList}
                  getGroceryQuantity={getGroceryQuantity}
                  isScreenView={true}
                />
              </div>
            </div>
          ) : (
            /* Screen View */
            <div className="grocery-hide">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">📋 7-Day Grocery Shopping List</h3>
                <p className="text-gray-600">Based on your current meal plan • Quantities calculated for one week</p>
              </div>
              
              <GroceryListContent 
                groceryList={groceryList}
                getGroceryQuantity={getGroceryQuantity}
                isScreenView={true}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>

        {/* Print Preview Controls */}
        {showPrintPreview && (
          <div className="grocery-hide border-t p-4 flex justify-between items-center">
            <button
              onClick={() => setShowPrintPreview(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              ← Back to List
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              Print List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const GroceryListContent = ({ 
  groceryList, 
  getGroceryQuantity, 
  isScreenView = false,
  isMobile = false
}) => {
  const categoryLabels = {
    protein: '🥩 Proteins',
    carbohydrate: '🍞 Carbohydrates', 
    fruits: '🍎 Fruits',
    vegetables: '🥬 Vegetables',
    fat: '🥑 Healthy Fats'
  };

  const formatDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return `${today.toLocaleDateString()} - ${nextWeek.toLocaleDateString()}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="grocery-header">
        <h1 style={{ fontSize: isScreenView ? '24px' : '20px', margin: '0 0 8px 0' }}>
          🛒 Weekly Grocery Shopping List
        </h1>
        <p style={{ fontSize: isScreenView ? '16px' : '12px', margin: '0', color: '#666' }}>
          Shopping Period: {formatDate()}
        </p>
      </div>

      {/* Food Categories Only */}
      <div className={isScreenView ? 'space-y-6' : 'space-y-4'}>
        {Object.entries(categoryLabels).map(([category, label]) => {
          const items = groceryList[category];
          if (!items || items.size === 0) return null;

          return (
            <div key={category} className="grocery-section">
              <h3 className={isScreenView ? 'text-lg font-bold bg-gray-100 p-2 rounded border' : ''}>
                {label}
              </h3>
              <div className={isScreenView ? 'space-y-1 ml-2' : ''}>
                {Array.from(items.entries()).map(([food, quantity]) => (
                  <div key={food} className={isScreenView ? 'flex items-center gap-3 py-1' : 'grocery-item'}>
                    <div className={isScreenView ? 'w-4 h-4 border border-gray-400 rounded' : 'grocery-checkbox'}></div>
                    <span className={isScreenView ? 'flex-1' : ''}>
                      {getGroceryQuantity(food, category, quantity)} • {food}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: isScreenView ? '20px' : '15px', textAlign: 'center', fontSize: isScreenView ? '14px' : '10px', color: '#666' }}>
        <p style={{ margin: '0' }}>
          ✓ Check off items as you shop • Generated from your nutrition plan
        </p>
      </div>
    </div>
  );
};

export default GroceryListModal;
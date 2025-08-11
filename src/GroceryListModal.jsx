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

  // Add print styles for grocery list
  useEffect(() => {
    if (!isOpen) return;

    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        
        .grocery-printable,
        .grocery-printable * {
          visibility: visible !important;
          display: block !important;
        }
        
        .grocery-printable {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
          font-family: Arial, sans-serif !important;
          color: black !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          overflow: hidden !important;
        }
        
        .grocery-hide {
          display: none !important;
          visibility: hidden !important;
        }
        
        .grocery-header {
          text-align: center !important;
          margin-bottom: 15px !important;
          border-bottom: 2px solid #333 !important;
          padding-bottom: 8px !important;
        }
        
        .grocery-section {
          margin-bottom: 12px !important;
          page-break-inside: avoid !important;
        }
        
        .grocery-section h3 {
          font-size: 12px !important;
          font-weight: bold !important;
          background-color: #f0f0f0 !important;
          padding: 4px 8px !important;
          margin: 0 0 6px 0 !important;
          border: 1px solid #333 !important;
        }
        
        .grocery-item {
          display: flex !important;
          align-items: center !important;
          padding: 2px 0 !important;
          font-size: 10px !important;
        }
        
        .grocery-checkbox {
          width: 12px !important;
          height: 12px !important;
          border: 1px solid #333 !important;
          margin-right: 6px !important;
          display: inline-block !important;
        }
        
        .grocery-dual-check {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 2px 0 !important;
          font-size: 10px !important;
        }
        
        .grocery-dual-label {
          font-size: 9px !important;
          margin-left: 2px !important;
        }
        
        @page {
          margin: 0.5in !important;
          size: letter !important;
        }
        
        .grocery-columns {
          display: flex !important;
          gap: 15px !important;
        }
        
        .grocery-column {
          flex: 1 !important;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    styleElement.setAttribute('data-grocery-styles', 'true');
    document.head.appendChild(styleElement);

    return () => {
      const existingStyle = document.querySelector('[data-grocery-styles="true"]');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isOpen]);

  // Extract and categorize foods from meal plan
  const extractGroceryList = () => {
    const groceryList = {
      protein: new Map(),
      carbohydrate: new Map(),
      fruits: new Map(),
      vegetables: new Map(),
      fat: new Map(),
      supplements: new Map()
    };

    // Debug: Log what we're getting
    console.log('All meals data:', allMeals);

    // Process all meals and extract unique foods with quantities
    Object.values(allMeals).forEach(meal => {
      if (!meal.items) return;
      
      meal.items.forEach(item => {
        console.log('Processing item:', item);
        
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
        
        console.log(`Item: ${item.food}, Category: ${category}`);
        
        const categoryMap = groceryList[category];
        if (!categoryMap) {
          console.log(`No category map found for: ${category}`);
          return;
        }

        // Calculate weekly quantity (7 days)
        const weeklyServing = item.serving * 7;
        
        if (categoryMap.has(item.food)) {
          categoryMap.set(item.food, categoryMap.get(item.food) + weeklyServing);
        } else {
          categoryMap.set(item.food, weeklyServing);
        }
      });
    });

    // Debug: Log final grocery list
    console.log('Final grocery list:', groceryList);
    Object.entries(groceryList).forEach(([cat, map]) => {
      console.log(`${cat}:`, Array.from(map.entries()));
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

  // All condiments list
  const allCondiments = [
    'Mustard', 'Hot Sauce', 'Lemon Juice', 'Soy Sauce (low sodium)', 
    'Salsa', 'Ketchup', 'Sriracha', 'Balsamic Vinegar', 'Apple Cider Vinegar',
    'Garlic Powder', 'Onion Powder', 'Black Pepper', 'Paprika', 
    'Italian Seasoning', 'Everything Bagel Seasoning', 'Hummus',
    'Salt', 'Olive Oil', 'Coconut Oil', 'MCT Oil'
  ];

  // All supplements list
  const allSupplements = [
    'Whey Protein (generic)', 'ON Gold Standard Whey', 'Ryse Protein',
    'Bucked Up Protein', 'Raw Nutrition Protein', 'Whey Protein Isolate',
    'Collagen Protein', 'Quest Bar', 'Pure Protein Bar', 'Protein Bar (generic)',
    'Pure Protein RTD', 'Fairlife Core Power 42g', 'Fairlife Core Power 26g'
  ];

  const groceryList = extractGroceryList();

  const handlePrint = () => {
    window.print();
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
            <div className="bg-white border border-gray-300 p-6 max-w-[8.5in] mx-auto">
              <GroceryListContent 
                groceryList={groceryList}
                getGroceryQuantity={getGroceryQuantity}
                allCondiments={allCondiments}
                allSupplements={allSupplements}
              />
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
                allCondiments={allCondiments}
                allSupplements={allSupplements}
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

      {/* Hidden Printable Content */}
      <div className="grocery-printable" style={{ display: 'none' }}>
        <GroceryListContent 
          groceryList={groceryList}
          getGroceryQuantity={getGroceryQuantity}
          allCondiments={allCondiments}
          allSupplements={allSupplements}
        />
      </div>
    </div>
  );
};

const GroceryListContent = ({ 
  groceryList, 
  getGroceryQuantity, 
  allCondiments, 
  allSupplements, 
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

      <div className={isScreenView && !isMobile ? 'grid grid-cols-2 gap-6' : 'space-y-4'}>
        
        {/* Left Column */}
        <div className="grocery-column">
          
          {/* Food Categories */}
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

        {/* Right Column */}
        <div className="grocery-column">
          
          {/* Condiments & Seasonings */}
          <div className="grocery-section">
            <h3 className={isScreenView ? 'text-lg font-bold bg-gray-100 p-2 rounded border' : ''}>
              🧂 Condiments & Seasonings
            </h3>
            <div className={isScreenView ? 'space-y-1 ml-2' : ''}>
              {allCondiments.map(condiment => (
                <div key={condiment} className={isScreenView ? 'flex items-center gap-2 py-1' : 'grocery-dual-check'}>
                  <div className={isScreenView ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
                    <div className={isScreenView ? 'w-3 h-3 border border-gray-400 rounded' : 'grocery-checkbox'}></div>
                    <span className={isScreenView ? 'text-xs text-gray-600' : 'grocery-dual-label'}>Need</span>
                  </div>
                  <div className={isScreenView ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
                    <div className={isScreenView ? 'w-3 h-3 border border-gray-400 rounded' : 'grocery-checkbox'}></div>
                    <span className={isScreenView ? 'text-xs text-gray-600' : 'grocery-dual-label'}>Have</span>
                  </div>
                  <span className={isScreenView ? 'flex-1 text-sm' : ''}>{condiment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supplements */}
          <div className="grocery-section">
            <h3 className={isScreenView ? 'text-lg font-bold bg-gray-100 p-2 rounded border' : ''}>
              💊 Supplements
            </h3>
            <div className={isScreenView ? 'space-y-1 ml-2' : ''}>
              {allSupplements.map(supplement => (
                <div key={supplement} className={isScreenView ? 'flex items-center gap-2 py-1' : 'grocery-dual-check'}>
                  <div className={isScreenView ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
                    <div className={isScreenView ? 'w-3 h-3 border border-gray-400 rounded' : 'grocery-checkbox'}></div>
                    <span className={isScreenView ? 'text-xs text-gray-600' : 'grocery-dual-label'}>Need</span>
                  </div>
                  <div className={isScreenView ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
                    <div className={isScreenView ? 'w-3 h-3 border border-gray-400 rounded' : 'grocery-checkbox'}></div>
                    <span className={isScreenView ? 'text-xs text-gray-600' : 'grocery-dual-label'}>Have</span>
                  </div>
                  <span className={isScreenView ? 'flex-1 text-sm' : ''}>{supplement}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
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
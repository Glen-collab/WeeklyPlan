import React, { useState, useEffect } from 'react';
import { Printer, X } from 'lucide-react';

const PrintableNutritionPlan = ({ 
  allMeals = {}, 
  userProfile = {}, 
  calorieData = null,
  isMobile = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);

  // Handle null calorieData by providing safe defaults
  const safeCalorieData = calorieData || {
    targetCalories: 'Not set',
    bmr: 'Not set',
    tdee: 'Not set'
  };

  // Add print styles to document head
  useEffect(() => {
    const printStyles = `
      @media print {
        /* Hide everything first */
        body * {
          visibility: hidden;
        }
        
        /* Show only printable content */
        .printable-content,
        .printable-content * {
          visibility: visible !important;
          display: block !important;
        }
        
        /* Main printable container */
        .printable-content {
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
          page-break-inside: avoid !important;
        }
        
        /* Hide non-printable elements */
        .print-hide {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Header styling */
        .print-header {
          text-align: center !important;
          margin-bottom: 15px !important;
          border-bottom: 2px solid #333 !important;
          padding-bottom: 8px !important;
          page-break-inside: avoid !important;
        }
        
        /* Table styling */
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-bottom: 10px !important;
          page-break-inside: avoid !important;
          font-size: 10px !important;
          display: table !important;
          visibility: visible !important;
        }
        
        .print-table th,
        .print-table td {
          border: 1px solid #333 !important;
          padding: 4px 6px !important;
          text-align: left !important;
          vertical-align: top !important;
          display: table-cell !important;
          visibility: visible !important;
        }
        
        .print-table thead {
          display: table-header-group !important;
          visibility: visible !important;
        }
        
        .print-table tbody {
          display: table-row-group !important;
          visibility: visible !important;
        }
        
        .print-table tr {
          display: table-row !important;
          visibility: visible !important;
          page-break-inside: avoid !important;
        }
        
        .print-table th {
          background-color: #f0f0f0 !important;
          font-weight: bold !important;
          font-size: 10px !important;
        }
        
        .meal-header {
          background-color: #e8e8e8 !important;
          font-weight: bold !important;
          page-break-inside: avoid !important;
        }
        
        /* Summary section */
        .print-summary {
          margin-top: 10px !important;
          border-top: 2px solid #333 !important;
          padding-top: 8px !important;
          page-break-inside: avoid !important;
        }
        
        /* Footer */
        .print-footer {
          margin-top: 15px !important;
          text-align: center !important;
          font-size: 9px !important;
          color: #666 !important;
          page-break-inside: avoid !important;
        }
        
        /* Notes section - smaller */
        .print-notes {
          margin-top: 10px !important;
          page-break-inside: avoid !important;
        }
        
        .print-notes-box {
          height: 40px !important;
          border: 1px solid #ccc !important;
          padding: 5px !important;
        }
        
        /* Force single page */
        @page {
          margin: 0.4in !important;
          size: letter !important;
        }
        
        /* Scale content to fit if needed */
        html, body {
          height: 100% !important;
          overflow: hidden !important;
        }
        
        /* Ensure no page breaks */
        * {
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `;

    // Create style element and add to head
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    styleElement.setAttribute('data-print-styles', 'true');
    document.head.appendChild(styleElement);

    // Cleanup function to remove styles when component unmounts
    return () => {
      const existingStyle = document.querySelector('[data-print-styles="true"]');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="w-full">
      {/* Screen View - Print Buttons */}
      <div className="print-hide space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 text-center">
          📄 Print Your Nutrition Plan
        </h3>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 justify-center`}>
          <button
            onClick={handlePreview}
            className={`${isMobile ? 'w-full py-3' : 'px-6 py-3'} bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2`}
          >
            <span>👁️</span>
            Preview Plan
          </button>
          
          <button
            onClick={handlePrint}
            className={`${isMobile ? 'w-full py-3' : 'px-6 py-3'} bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2`}
          >
            <Printer size={20} />
            Print Plan
          </button>
        </div>
        
        <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 text-center`}>
          Works with network printers, wireless printers, and mobile printing services
        </p>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="print-hide fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg w-full ${isMobile ? 'max-w-sm max-h-full' : 'max-w-4xl max-h-[90vh]'} overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}>Print Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2`}
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={isMobile ? 20 : 24} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white border border-gray-300 p-8 max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
                <PrintableContent 
                  allMeals={allMeals}
                  userProfile={userProfile}
                  calorieData={safeCalorieData}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Content */}
      <div className="printable-content" style={{ display: 'none' }}>
        <PrintableContent 
          allMeals={allMeals}
          userProfile={userProfile}
          calorieData={safeCalorieData}
        />
      </div>
    </div>
  );
};

const PrintableContent = ({ 
  allMeals = {},
  userProfile = {}, 
  calorieData = {} 
}) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch', 
      dinner: 'Dinner',
      firstSnack: 'Morning Snack',
      secondSnack: 'Mid-Morning Snack',
      midAfternoon: 'Afternoon Snack',
      lateSnack: 'Evening Snack',
      postWorkout: 'Post-Workout'
    };
    return labels[mealType] || mealType;
  };

  return (
    <div>
      {/* Header */}
      <div className="print-header">
        <h1 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>
          🥗 Daily Nutrition Plan
        </h1>
        <h2 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>
          {userProfile.firstName || 'User'} {userProfile.lastName || ''}
        </h2>
        <p style={{ fontSize: '14px', margin: '0', color: '#666' }}>
          {formatDate()}
        </p>
      </div>

      {/* Meal Plan Table */}
      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Time</th>
            <th style={{ width: '50%' }}>Food</th>
            <th style={{ width: '35%' }}>Serving Size</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(allMeals).map(([mealType, meal]) => {
            // Only show meals that have food items
            const validItems = meal.items ? meal.items.filter(item => item.food && item.food.trim() !== '') : [];
            
            if (validItems.length === 0) return null;
            
            return (
              <React.Fragment key={mealType}>
                <tr className="meal-header">
                  <td colSpan="3" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {getMealTypeLabel(mealType)} - {meal.time}
                  </td>
                </tr>
                {validItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index === 0 ? meal.time : ''}</td>
                    <td>{item.food}</td>
                    <td>{item.displayServing} {item.displayUnit}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Daily Summary */}
      <div className="print-summary">
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          📊 Daily Summary
        </h3>
        
        <table className="print-table" style={{ width: '50%' }}>
          <tbody>
            <tr>
              <td><strong>Target Calories:</strong></td>
              <td>{calorieData.targetCalories || 'Not set'}</td>
            </tr>
            <tr>
              <td><strong>BMR:</strong></td>
              <td>{calorieData.bmr || 'Not set'}</td>
            </tr>
            <tr>
              <td><strong>TDEE:</strong></td>
              <td>{calorieData.tdee || 'Not set'}</td>
            </tr>
            <tr>
              <td><strong>Goal:</strong></td>
              <td style={{ textTransform: 'capitalize' }}>{userProfile.goal || 'Not set'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes Section */}
      <div className="print-notes" style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '3px' }}>
          📝 Notes
        </h3>
        <div className="print-notes-box" style={{ height: '40px', border: '1px solid #ccc', padding: '5px' }}>
          <p style={{ margin: '0', color: '#666', fontSize: '9px' }}>
            Space for personal notes, meal prep reminders, or adjustments...
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="print-footer">
        <p style={{ margin: '0', fontSize: '9px' }}>
          Generated by Nutrition Tracker • {formatDate()}
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '9px' }}>
          Stay consistent, stay healthy! 💪
        </p>
      </div>
    </div>
  );
};

export default PrintableNutritionPlan;
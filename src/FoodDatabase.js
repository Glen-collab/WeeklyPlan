// foodDatabase.js - All food nutrition data and serving size conversions

// Main nutrition database - all values per serving
export const foodDatabase = {
  protein: {
    'Chicken Breast': { protein: 31, carbs: 0, fat: 3.6, sugar: 0, calories: 165 },
    'Egg Whites': { protein: 11, carbs: 1, fat: 0.2, sugar: 1, calories: 52 },
    'Tuna (canned in water)': { protein: 23, carbs: 0, fat: 1, sugar: 0, calories: 108 },
    'Turkey Breast': { protein: 29, carbs: 0, fat: 1, sugar: 0, calories: 135 },
    'Lean Beef (90/10)': { protein: 26, carbs: 0, fat: 10, sugar: 0, calories: 176 },
    'Salmon': { protein: 20, carbs: 0, fat: 13, sugar: 0, calories: 208 },
    'Greek Yogurt (non-fat)': { protein: 17, carbs: 6, fat: 0, sugar: 4, calories: 92 },
    'Cottage Cheese (low-fat)': { protein: 11, carbs: 3.4, fat: 4.3, sugar: 2, calories: 98 },
    'Protein Powder (whey)': { protein: 24, carbs: 2, fat: 1.5, sugar: 1, calories: 120 },
    'Eggs (whole)': { protein: 13, carbs: 1.1, fat: 11, sugar: 1, calories: 155 }
  },
  carbohydrate: {
    'Brown Rice (cooked)': { protein: 2.6, carbs: 23, fat: 0.9, sugar: 0.4, calories: 112 },
    'Oats (dry)': { protein: 13, carbs: 67, fat: 7, sugar: 1, calories: 379 },
    'Sweet Potato': { protein: 1.6, carbs: 20, fat: 0.1, sugar: 4.2, calories: 86 },
    'White Rice (cooked)': { protein: 2.7, carbs: 28, fat: 0.3, sugar: 0.1, calories: 130 },
    'Quinoa (cooked)': { protein: 4.1, carbs: 21, fat: 1.9, sugar: 0.9, calories: 120 },
    'Whole Wheat Bread': { protein: 4, carbs: 12, fat: 1, sugar: 2, calories: 74 },
    'Banana': { protein: 1.3, carbs: 23, fat: 0.3, sugar: 12, calories: 89 },
    'Apple': { protein: 0.3, carbs: 14, fat: 0.2, sugar: 10, calories: 52 },
    'Bagel (plain)': { protein: 9, carbs: 48, fat: 1.5, sugar: 6, calories: 245 }
  },
  fat: {
    'Avocado': { protein: 2, carbs: 9, fat: 15, sugar: 0.7, calories: 160 },
    'Almonds': { protein: 6, carbs: 6, fat: 14, sugar: 1.2, calories: 164 },
    'Peanut Butter': { protein: 8, carbs: 6, fat: 16, sugar: 3, calories: 188 },
    'Olive Oil': { protein: 0, carbs: 0, fat: 14, sugar: 0, calories: 119 },
    'Chia Seeds': { protein: 5, carbs: 12, fat: 9, sugar: 0, calories: 138 },
    'Walnuts': { protein: 4, carbs: 4, fat: 18, sugar: 1, calories: 185 },
    'Cashews': { protein: 5, carbs: 9, fat: 12, sugar: 1.7, calories: 157 }
  },
  vegetables: {
    'Broccoli': { protein: 2.8, carbs: 6, fat: 0.4, sugar: 1.5, calories: 25 },
    'Spinach': { protein: 2.9, carbs: 3.6, fat: 0.4, sugar: 0.4, calories: 23 },
    'Bell Peppers': { protein: 1, carbs: 7, fat: 0.3, sugar: 5, calories: 31 },
    'Carrots': { protein: 0.9, carbs: 10, fat: 0.2, sugar: 4.7, calories: 41 },
    'Cucumber': { protein: 0.7, carbs: 4, fat: 0.1, sugar: 2, calories: 16 },
    'Tomatoes': { protein: 0.9, carbs: 3.9, fat: 0.2, sugar: 2.6, calories: 18 },
    'Lettuce (Romaine)': { protein: 1.2, carbs: 2, fat: 0.3, sugar: 1.2, calories: 17 },
    'Asparagus': { protein: 2.2, carbs: 3.9, fat: 0.1, sugar: 1.9, calories: 20 },
    'Green Beans': { protein: 1.8, carbs: 7, fat: 0.2, sugar: 3.3, calories: 31 },
    'Zucchini': { protein: 1.2, carbs: 3.1, fat: 0.3, sugar: 2.5, calories: 17 }
  },
  condiments: {
    'Mustard': { protein: 0.2, carbs: 0.3, fat: 0.2, sugar: 0.1, calories: 3 },
    'Hot Sauce': { protein: 0.1, carbs: 0.1, fat: 0, sugar: 0, calories: 1 },
    'Lemon Juice': { protein: 0.1, carbs: 1.3, fat: 0, sugar: 0.4, calories: 7 },
    'Soy Sauce (low sodium)': { protein: 1.3, carbs: 0.8, fat: 0, sugar: 0.1, calories: 10 },
    'Salsa': { protein: 0.2, carbs: 1, fat: 0, sugar: 0.5, calories: 4 }
  }
};

// Serving size conversions - what constitutes "1 serving" in different units
export const servingSizeConversions = {
  protein: {
    'Chicken Breast': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 palm' },
    'Egg Whites': { grams: 46, ounces: 1.6, cups: 0.25, palm: '3 eggs' },
    'Tuna (canned in water)': { grams: 85, ounces: 3, cups: 0.5, palm: '1 palm' },
    'Turkey Breast': { grams: 85, ounces: 3, cups: 0.5, palm: '1 palm' },
    'Lean Beef (90/10)': { grams: 85, ounces: 3, cups: 0.5, palm: '1 palm' },
    'Salmon': { grams: 85, ounces: 3, cups: 0.5, palm: '1 palm' },
    'Greek Yogurt (non-fat)': { grams: 150, ounces: 5.3, cups: 0.67, palm: '1 cupped palm' },
    'Cottage Cheese (low-fat)': { grams: 113, ounces: 4, cups: 0.5, palm: '1 cupped palm' },
    'Protein Powder (whey)': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'Eggs (whole)': { grams: 50, ounces: 1.8, cups: 0.25, palm: '1 egg' }
  },
  carbohydrate: {
    'Brown Rice (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Oats (dry)': { grams: 40, ounces: 1.4, cups: 0.5, palm: '1 cupped palm' },
    'Sweet Potato': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 fist' },
    'White Rice (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Quinoa (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Whole Wheat Bread': { grams: 28, ounces: 1, cups: 0.125, palm: '1 slice' },
    'Banana': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 medium' },
    'Apple': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 medium' },
    'Bagel (plain)': { grams: 85, ounces: 3, cups: 0.5, palm: '1 bagel' }
  },
  fat: {
    'Avocado': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1/2 avocado' },
    'Almonds': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' },
    'Peanut Butter': { grams: 32, ounces: 1.1, cups: 0.125, palm: '1 thumb' },
    'Olive Oil': { grams: 14, ounces: 0.5, cups: 0.06, palm: '1 thumb' },
    'Chia Seeds': { grams: 28, ounces: 1, cups: 0.125, palm: '1 thumb' },
    'Walnuts': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' },
    'Cashews': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' }
  },
  vegetables: {
    'Broccoli': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Spinach': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Bell Peppers': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Carrots': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 fist' },
    'Cucumber': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Tomatoes': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 fist' },
    'Lettuce (Romaine)': { grams: 100, ounces: 3.5, cups: 2, palm: '2 cupped palms' },
    'Asparagus': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Green Beans': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' },
    'Zucchini': { grams: 100, ounces: 3.5, cups: 1, palm: '1 fist' }
  },
  condiments: {
    'Mustard': { grams: 5, ounces: 0.2, cups: 0.02, palm: '1 tsp' },
    'Hot Sauce': { grams: 5, ounces: 0.2, cups: 0.02, palm: '1 tsp' },
    'Lemon Juice': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Soy Sauce (low sodium)': { grams: 18, ounces: 0.6, cups: 0.07, palm: '1 tbsp' },
    'Salsa': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' }
  }
};

// Helper function to get serving info for a specific food
export const getServingInfo = (category, food) => {
  return servingSizeConversions[category]?.[food] || { 
    grams: 100, 
    ounces: 3.5, 
    cups: 0.5, 
    palm: '1 serving' 
  };
};

// Helper function to get all foods in a category
export const getFoodsInCategory = (category) => {
  return Object.keys(foodDatabase[category] || {});
};

// Helper function to get all categories
export const getAllCategories = () => {
  return Object.keys(foodDatabase);
};
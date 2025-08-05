// FoodDatabase.js - All food nutrition data and serving size conversions

// Main nutrition database - all values per serving
export const FoodDatabase = {
  protein: {
    'Chicken Breast': { protein: 31, carbs: 0, fat: 3.6, sugar: 0, calories: 165 },
    'Egg Whites': { protein: 11, carbs: 1, fat: 0.2, sugar: 1, calories: 52 },
    'Tuna (canned in water)': { protein: 23, carbs: 0, fat: 1, sugar: 0, calories: 108 },
    'Turkey Breast': { protein: 29, carbs: 0, fat: 1, sugar: 0, calories: 135 },
    'Lean Beef (90/10)': { protein: 26, carbs: 0, fat: 10, sugar: 0, calories: 176 },
    'Salmon': { protein: 20, carbs: 0, fat: 13, sugar: 0, calories: 208 },
    'Greek Yogurt (non-fat)': { protein: 17, carbs: 6, fat: 0, sugar: 4, calories: 92 },
    'Cottage Cheese (low-fat)': { protein: 11, carbs: 3.4, fat: 4.3, sugar: 2, calories: 98 },
    'Eggs (whole)': { protein: 13, carbs: 1.1, fat: 11, sugar: 1, calories: 155 },
    'Cod': { protein: 20, carbs: 0, fat: 0.7, sugar: 0, calories: 89 },
    'Tilapia': { protein: 20, carbs: 0, fat: 1.7, sugar: 0, calories: 96 },
    'Shrimp': { protein: 18, carbs: 1, fat: 0.3, sugar: 0, calories: 85 },
    'Lean Ground Turkey': { protein: 27, carbs: 0, fat: 8, sugar: 0, calories: 176 }
  },
  carbohydrate: {
    'Brown Rice (cooked)': { protein: 2.6, carbs: 23, fat: 0.9, sugar: 0.4, calories: 112 },
    'Oats (dry)': { protein: 13, carbs: 67, fat: 7, sugar: 1, calories: 379 },
    'Sweet Potato': { protein: 1.6, carbs: 20, fat: 0.1, sugar: 4.2, calories: 86 },
    'White Rice (cooked)': { protein: 2.7, carbs: 28, fat: 0.3, sugar: 0.1, calories: 130 },
    'Quinoa (cooked)': { protein: 4.1, carbs: 21, fat: 1.9, sugar: 0.9, calories: 120 },
    'Whole Wheat Bread': { protein: 4, carbs: 12, fat: 1, sugar: 2, calories: 74 },
    'Bagel (plain)': { protein: 9, carbs: 48, fat: 1.5, sugar: 6, calories: 245 },
    'Pasta (cooked)': { protein: 5, carbs: 25, fat: 1.1, sugar: 0.6, calories: 131 },
    'White Bread': { protein: 2.7, carbs: 13, fat: 0.8, sugar: 1.5, calories: 70 },
    'Potato (baked)': { protein: 2.9, carbs: 37, fat: 0.2, sugar: 1.6, calories: 161 },
    'Cereal (oats)': { protein: 3, carbs: 27, fat: 2, sugar: 1, calories: 130 },
    'Jasmine Rice (cooked)': { protein: 2.7, carbs: 28, fat: 0.3, sugar: 0.1, calories: 130 },
    'Ezekiel Bread': { protein: 4, carbs: 15, fat: 0.5, sugar: 0, calories: 80 },
    'Rice Cakes': { protein: 0.7, carbs: 7, fat: 0.4, sugar: 0.1, calories: 35 },
    'Cream of Rice (dry)': { protein: 1.5, carbs: 22, fat: 0.5, sugar: 0, calories: 95 },
    'Instant Oats (dry)': { protein: 3, carbs: 27, fat: 2, sugar: 1, calories: 130 }
  },
  fruits: {
    'Apple': { protein: 0.3, carbs: 14, fat: 0.2, sugar: 10, calories: 52 },
    'Banana': { protein: 1.3, carbs: 23, fat: 0.3, sugar: 12, calories: 89 },
    'Strawberries': { protein: 0.7, carbs: 7, fat: 0.3, sugar: 5, calories: 32 },
    'Blueberries': { protein: 0.7, carbs: 14, fat: 0.3, sugar: 10, calories: 57 },
    'Kiwi': { protein: 1.1, carbs: 15, fat: 0.5, sugar: 9, calories: 61 },
    'Grapes': { protein: 0.6, carbs: 16, fat: 0.2, sugar: 16, calories: 62 },
    'Raspberries': { protein: 1.2, carbs: 12, fat: 0.7, sugar: 4, calories: 52 },
    'Watermelon': { protein: 0.6, carbs: 8, fat: 0.2, sugar: 6, calories: 30 },
    'Blackberries': { protein: 1.4, carbs: 10, fat: 0.5, sugar: 5, calories: 43 },
    'Gooseberries': { protein: 0.9, carbs: 10, fat: 0.6, sugar: 8, calories: 44 },
    'Orange': { protein: 0.9, carbs: 12, fat: 0.1, sugar: 9, calories: 47 },
    'Lemon': { protein: 1.1, carbs: 9, fat: 0.3, sugar: 2.5, calories: 29 },
    'Lime': { protein: 0.7, carbs: 11, fat: 0.2, sugar: 1.7, calories: 30 },
    'Clementine': { protein: 0.9, carbs: 12, fat: 0.2, sugar: 9, calories: 47 },
    'Cantaloupe': { protein: 0.8, carbs: 8, fat: 0.2, sugar: 8, calories: 34 },
    'Honeydew Melon': { protein: 0.5, carbs: 9, fat: 0.1, sugar: 8, calories: 36 },
    'Cuties (Mandarin)': { protein: 0.8, carbs: 13, fat: 0.3, sugar: 11, calories: 53 }
  },
  supplements: {
    // Protein Powders (per scoop ~30g)
    'Whey Protein (generic)': { protein: 24, carbs: 2, fat: 1.5, sugar: 1, calories: 120 },
    'Ryse Protein': { protein: 25, carbs: 2, fat: 1, sugar: 1, calories: 120 },
    'Bucked Up Protein': { protein: 24, carbs: 1, fat: 1, sugar: 0, calories: 110 },
    'Raw Nutrition Protein': { protein: 25, carbs: 2, fat: 1.5, sugar: 1, calories: 125 },
    'EAS Protein': { protein: 23, carbs: 3, fat: 2, sugar: 2, calories: 130 },
    'ON Gold Standard': { protein: 24, carbs: 1, fat: 1, sugar: 1, calories: 110 },
    'Collagen Protein': { protein: 20, carbs: 0, fat: 0, sugar: 0, calories: 80 },
    
    // Protein Bars
    'Protein Bar (generic)': { protein: 20, carbs: 15, fat: 6, sugar: 8, calories: 190 },
    'Quest Bar': { protein: 20, carbs: 15, fat: 8, sugar: 1, calories: 190 },
    'Pure Protein Bar': { protein: 20, carbs: 17, fat: 2, sugar: 3, calories: 180 },
    'Met-RX Big 100': { protein: 30, carbs: 22, fat: 9, sugar: 16, calories: 410 },
    'Fit Crunch Bar': { protein: 16, carbs: 25, fat: 6, sugar: 5, calories: 190 },
    'Atkins Meal Bar': { protein: 15, carbs: 19, fat: 11, sugar: 1, calories: 250 },
    'Atkins Snack Bar': { protein: 10, carbs: 15, fat: 9, sugar: 1, calories: 170 },
    
    // Ready-to-Drink (RTD)
    'Pure Protein RTD': { protein: 35, carbs: 5, fat: 1.5, sugar: 2, calories: 160 },
    'Atkins RTD': { protein: 15, carbs: 5, fat: 10, sugar: 1, calories: 160 },
    'Fairlife Core Power 42g': { protein: 42, carbs: 6, fat: 6, sugar: 6, calories: 230 },
    'Fairlife Core Power 26g': { protein: 26, carbs: 5, fat: 4.5, sugar: 5, calories: 150 },
    'Fairlife Milk (8oz)': { protein: 13, carbs: 6, fat: 4.5, sugar: 6, calories: 110 }
  },
  supplements: {
    // Protein Powders (per scoop)
    'Whey Protein (generic)': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'Ryse Protein': { grams: 31, ounces: 1.1, cups: 0.125, palm: '1 scoop' },
    'Bucked Up Protein': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'Raw Nutrition Protein': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'EAS Protein': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'ON Gold Standard': { grams: 30, ounces: 1, cups: 0.125, palm: '1 scoop' },
    'Collagen Protein': { grams: 20, ounces: 0.7, cups: 0.1, palm: '1 scoop' },
    
    // Protein Bars
    'Protein Bar (generic)': { grams: 60, ounces: 2, cups: 0.25, palm: '1 bar' },
    'Quest Bar': { grams: 60, ounces: 2, cups: 0.25, palm: '1 bar' },  
    'Pure Protein Bar': { grams: 50, ounces: 1.8, cups: 0.2, palm: '1 bar' },
    'Met-RX Big 100': { grams: 100, ounces: 3.5, cups: 0.4, palm: '1 large bar' },
    'Fit Crunch Bar': { grams: 88, ounces: 3.1, cups: 0.35, palm: '1 bar' },
    'Atkins Meal Bar': { grams: 60, ounces: 2.1, cups: 0.25, palm: '1 bar' },
    'Atkins Snack Bar': { grams: 35, ounces: 1.2, cups: 0.15, palm: '1 small bar' },
    
    // Ready-to-Drink (RTD) 
    'Pure Protein RTD': { grams: 325, ounces: 11, cups: 1.4, palm: '1 bottle' },
    'Atkins RTD': { grams: 325, ounces: 11, cups: 1.4, palm: '1 bottle' },
    'Fairlife Core Power 42g': { grams: 414, ounces: 14, cups: 1.75, palm: '1 bottle' },
    'Fairlife Core Power 26g': { grams: 325, ounces: 11, cups: 1.4, palm: '1 bottle' },
    'Fairlife Milk (8oz)': { grams: 240, ounces: 8, cups: 1, palm: '1 cup' }
  },
  fat: {
    'Avocado': { protein: 2, carbs: 9, fat: 15, sugar: 0.7, calories: 160 },
    'Almonds': { protein: 6, carbs: 6, fat: 14, sugar: 1.2, calories: 164 },
    'Peanut Butter': { protein: 8, carbs: 6, fat: 16, sugar: 3, calories: 188 },
    'Olive Oil': { protein: 0, carbs: 0, fat: 14, sugar: 0, calories: 119 },
    'Chia Seeds': { protein: 5, carbs: 12, fat: 9, sugar: 0, calories: 138 },
    'Walnuts': { protein: 4, carbs: 4, fat: 18, sugar: 1, calories: 185 },
    'Cashews': { protein: 5, carbs: 9, fat: 12, sugar: 1.7, calories: 157 },
    'Coconut Oil': { protein: 0, carbs: 0, fat: 14, sugar: 0, calories: 121 },
    'MCT Oil': { protein: 0, carbs: 0, fat: 14, sugar: 0, calories: 130 },
    'Flaxseeds': { protein: 1.9, carbs: 2.9, fat: 4.3, sugar: 0.2, calories: 55 },
    'Hemp Seeds': { protein: 3.3, carbs: 1.2, fat: 4.9, sugar: 0.2, calories: 57 },
    'Sunflower Seeds': { protein: 2.4, carbs: 2.1, fat: 5.2, sugar: 0.3, calories: 64 },
    'Pumpkin Seeds': { protein: 2.5, carbs: 1.5, fat: 4, sugar: 0.1, calories: 47 },
    'Pecans': { protein: 1, carbs: 1.4, fat: 7, sugar: 0.4, calories: 69 },
    'Brazil Nuts': { protein: 2, carbs: 1.2, fat: 8.5, sugar: 0.2, calories: 93 },
    'Macadamia Nuts': { protein: 1.1, carbs: 1.6, fat: 10.6, sugar: 0.6, calories: 102 },
    'Sesame Seeds': { protein: 1.6, carbs: 2.1, fat: 4.5, sugar: 0.1, calories: 52 }
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
    'Salsa': { protein: 0.2, carbs: 1, fat: 0, sugar: 0.5, calories: 4 },
    'Ketchup': { protein: 0.2, carbs: 4.1, fat: 0.1, sugar: 3.7, calories: 17 },
    'Sriracha': { protein: 0.2, carbs: 1, fat: 0.1, sugar: 1, calories: 5 },
    'Balsamic Vinegar': { protein: 0, carbs: 2.7, fat: 0, sugar: 2.4, calories: 10 },
    'Apple Cider Vinegar': { protein: 0, carbs: 0.1, fat: 0, sugar: 0.1, calories: 3 },
    'Garlic Powder': { protein: 0.5, carbs: 2, fat: 0, sugar: 0.1, calories: 10 },
    'Onion Powder': { protein: 0.3, carbs: 1.9, fat: 0, sugar: 0.4, calories: 8 },
    'Black Pepper': { protein: 0.1, carbs: 0.4, fat: 0, sugar: 0, calories: 2 },
    'Paprika': { protein: 0.3, carbs: 1.2, fat: 0.3, sugar: 0.9, calories: 6 },
    'Italian Seasoning': { protein: 0.1, carbs: 0.6, fat: 0.1, sugar: 0.1, calories: 3 },
    'Everything Bagel Seasoning': { protein: 0.2, carbs: 0.5, fat: 0.2, sugar: 0, calories: 5 }
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
    'Eggs (whole)': { grams: 50, ounces: 1.8, cups: 0.25, palm: '1 egg' },
    'Cod': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 palm' },
    'Tilapia': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 palm' },
    'Shrimp': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 palm' },
    'Lean Ground Turkey': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 palm' }
  },
  carbohydrate: {
    'Brown Rice (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Oats (dry)': { grams: 40, ounces: 1.4, cups: 0.5, palm: '1 cupped palm' },
    'Sweet Potato': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 fist' },
    'White Rice (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Quinoa (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Whole Wheat Bread': { grams: 28, ounces: 1, cups: 0.125, palm: '1 slice' },
    'Bagel (plain)': { grams: 85, ounces: 3, cups: 0.5, palm: '1 bagel' },
    'Pasta (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'White Bread': { grams: 28, ounces: 1, cups: 0.125, palm: '1 slice' },
    'Potato (baked)': { grams: 150, ounces: 5.3, cups: 0.5, palm: '1 fist' },
    'Cereal (oats)': { grams: 40, ounces: 1.4, cups: 0.5, palm: '1 cupped palm' },
    'Jasmine Rice (cooked)': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 cupped palm' },
    'Ezekiel Bread': { grams: 34, ounces: 1.2, cups: 0.125, palm: '1 slice' },
    'Rice Cakes': { grams: 9, ounces: 0.3, cups: 0.06, palm: '1 cake' },
    'Cream of Rice (dry)': { grams: 30, ounces: 1, cups: 0.25, palm: '1/4 cup' },
    'Instant Oats (dry)': { grams: 40, ounces: 1.4, cups: 0.5, palm: '1/2 cup' }
  },
  fruits: {
    'Apple': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 medium' },
    'Banana': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 medium' },
    'Strawberries': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Blueberries': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Kiwi': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 large' },
    'Grapes': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Raspberries': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Watermelon': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Blackberries': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Gooseberries': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Orange': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1 medium' },
    'Lemon': { grams: 60, ounces: 2, cups: 0.25, palm: '1 medium' },
    'Lime': { grams: 60, ounces: 2, cups: 0.25, palm: '1 medium' },
    'Clementine': { grams: 75, ounces: 2.5, cups: 0.33, palm: '1 small' },
    'Cantaloupe': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Honeydew Melon': { grams: 100, ounces: 3.5, cups: 0.75, palm: '1 cupped palm' },
    'Cuties (Mandarin)': { grams: 75, ounces: 2.5, cups: 0.33, palm: '1 small' }
  },
  fat: {
    'Avocado': { grams: 100, ounces: 3.5, cups: 0.5, palm: '1/2 avocado' },
    'Almonds': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' },
    'Peanut Butter': { grams: 32, ounces: 1.1, cups: 0.125, palm: '1 thumb' },
    'Olive Oil': { grams: 14, ounces: 0.5, cups: 0.06, palm: '1 thumb' },
    'Chia Seeds': { grams: 28, ounces: 1, cups: 0.125, palm: '1 thumb' },
    'Walnuts': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' },
    'Cashews': { grams: 28, ounces: 1, cups: 0.25, palm: '1 handful' },
    'Coconut Oil': { grams: 14, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'MCT Oil': { grams: 14, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Flaxseeds': { grams: 12, ounces: 0.4, cups: 0.06, palm: '1 tbsp' },
    'Hemp Seeds': { grams: 10, ounces: 0.35, cups: 0.06, palm: '1 tbsp' },
    'Sunflower Seeds': { grams: 16, ounces: 0.56, cups: 0.06, palm: '1 tbsp' },
    'Pumpkin Seeds': { grams: 8, ounces: 0.28, cups: 0.06, palm: '1 tbsp' },
    'Pecans': { grams: 10, ounces: 0.35, cups: 0.06, palm: '1 tbsp' },
    'Brazil Nuts': { grams: 10, ounces: 0.35, cups: 0.06, palm: '1 tbsp' },
    'Macadamia Nuts': { grams: 11, ounces: 0.39, cups: 0.06, palm: '1 tbsp' },
    'Sesame Seeds': { grams: 9, ounces: 0.32, cups: 0.06, palm: '1 tbsp' }
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
    'Salsa': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Ketchup': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Sriracha': { grams: 5, ounces: 0.2, cups: 0.02, palm: '1 tsp' },
    'Balsamic Vinegar': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Apple Cider Vinegar': { grams: 15, ounces: 0.5, cups: 0.06, palm: '1 tbsp' },
    'Garlic Powder': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' },
    'Onion Powder': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' },
    'Black Pepper': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' },
    'Paprika': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' },
    'Italian Seasoning': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' },
    'Everything Bagel Seasoning': { grams: 2.5, ounces: 0.09, cups: 0.02, palm: '1 tsp' }
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
  return Object.keys(FoodDatabase[category] || {});
};

// Helper function to get all categories
export const getAllCategories = () => {
  return Object.keys(FoodDatabase);
};
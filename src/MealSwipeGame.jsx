import React, { useState, useEffect } from 'react';
import { Heart, X, RotateCcw, Trophy, Star } from 'lucide-react';

const MealSwipeGame = ({ 
  allMeals = {}, 
  userProfile = {}, 
  calorieData = {},
  onClose = () => {} 
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameCards, setGameCards] = useState([]);
  const [swipeResults, setSwipeResults] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [userGrade, setUserGrade] = useState('');
  const [aiPersonality, setAiPersonality] = useState('');

  // Initialize game cards from meal data
  useEffect(() => {
    if (!allMeals || Object.keys(allMeals).length === 0) return;
    
    const cards = [];
    Object.entries(allMeals).forEach(([mealType, mealData]) => {
      if (mealData.totals && mealData.totals.calories > 0) {
        cards.push({
          id: `${mealType}-${Date.now()}`,
          mealType,
          time: mealData.time,
          totals: mealData.totals,
          pieData: mealData.pieData || [],
          items: mealData.items || []
        });
      }
    });

    // Add some sample "bad" cards for variety
    const badCards = [
      {
        id: 'bad-1',
        mealType: 'temptation',
        title: 'Large Pizza + Soda',
        totals: { calories: 1200, protein: 28, carbs: 140, fat: 48, sugar: 35 },
        isGoodChoice: false,
        description: '🍕 Pepperoni pizza (4 slices) + 20oz Coke'
      },
      {
        id: 'bad-2', 
        mealType: 'temptation',
        title: 'Donut Breakfast',
        totals: { calories: 680, protein: 8, carbs: 86, fat: 34, sugar: 42 },
        isGoodChoice: false,
        description: '🍩 2 glazed donuts + large coffee with cream & sugar'
      },
      {
        id: 'bad-3',
        mealType: 'temptation', 
        title: 'Fast Food Combo',
        totals: { calories: 1100, protein: 25, carbs: 108, fat: 52, sugar: 28 },
        isGoodChoice: false,
        description: '🍔 Big Mac + large fries + milkshake'
      }
    ];

    const allCards = [...cards, ...badCards].sort(() => Math.random() - 0.5);
    setGameCards(allCards);
    
    // Calculate user's nutrition grade
    const grade = calculateNutritionGrade(allMeals, userProfile, calorieData);
    setUserGrade(grade);
    setAiPersonality(getAIPersonality(grade));
  }, [allMeals, userProfile, calorieData]);

  // Calculate user's nutrition grade based on their actual meals
  const calculateNutritionGrade = (meals, profile, calData) => {
    if (!meals || Object.keys(meals).length === 0) return 'D';
    
    let score = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalSugar = 0;
    let mealCount = 0;

    Object.values(meals).forEach(meal => {
      if (meal.totals && meal.totals.calories > 50) {
        totalCalories += meal.totals.calories;
        totalProtein += meal.totals.protein;
        totalSugar += meal.totals.sugar;
        mealCount++;
      }
    });

    // Protein score (40 points)
    const proteinTarget = getProteinTarget(profile.goal);
    if (totalProtein >= proteinTarget) score += 40;
    else if (totalProtein >= proteinTarget * 0.8) score += 30;
    else if (totalProtein >= proteinTarget * 0.6) score += 20;
    else score += 10;

    // Calorie accuracy (30 points)
    const targetCals = calData?.targetCalories || 2500;
    const calorieAccuracy = 1 - Math.abs(totalCalories - targetCals) / targetCals;
    score += Math.max(calorieAccuracy * 30, 0);

    // Meal frequency (20 points)
    if (mealCount >= 6) score += 20;
    else if (mealCount >= 4) score += 15;
    else if (mealCount >= 3) score += 10;
    else score += 5;

    // Sugar control (10 points)
    const sugarLimit = getSugarLimit(profile.goal);
    if (totalSugar <= sugarLimit) score += 10;
    else if (totalSugar <= sugarLimit * 1.5) score += 5;

    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    return 'D';
  };

  const getProteinTarget = (goal) => {
    switch(goal) {
      case 'dirty-bulk': return 150;
      case 'gain-muscle': return 130;
      case 'lose': return 120;
      default: return 100;
    }
  };

  const getSugarLimit = (goal) => {
    switch(goal) {
      case 'dirty-bulk': return 50;
      case 'lose': return 25;
      case 'gain-muscle': return 25;
      default: return 35;
    }
  };

  const getAIPersonality = (grade) => {
    switch(grade) {
      case 'A': return 'THE NUTRITION PROFESSOR 🎓';
      case 'B': return 'THE SUPPORTIVE WINGMAN 💪';
      case 'C': return 'LATE NIGHT LEFTOVERS 🌙';
      case 'D': return 'YOUR TIME WILL COME ⭐';
      default: return 'NUTRITION NEWBIE 🔰';
    }
  };

  // Get AI response based on grade and swipe
  const getSarcasticResponse = (card, swipeDirection, grade, userProfile) => {
    const firstName = userProfile.firstName || 'Friend';
    const gender = userProfile.gender || 'neutral';
    
    // Determine if this was a good or bad choice
    const isRealMeal = card.mealType !== 'temptation';
    const isGoodMeal = isRealMeal ? isNutritiousChoice(card) : false;
    const swipedRight = swipeDirection === 'right';
    
    // Create scenario key
    let scenario = '';
    if (swipedRight && isGoodMeal) scenario = 'rightSwipeGood';
    else if (swipedRight && !isGoodMeal) scenario = 'rightSwipeBad';
    else if (!swipedRight && isGoodMeal) scenario = 'leftSwipeGood';
    else scenario = 'leftSwipeBad';

    return getResponseByGradeAndScenario(grade, scenario, firstName, gender, card);
  };

  const isNutritiousChoice = (card) => {
    const { totals } = card;
    if (!totals) return false;
    
    const totalMacros = totals.protein + totals.carbs + totals.fat;
    if (totalMacros === 0) return false;
    
    const proteinPercent = (totals.protein / totalMacros) * 100;
    const sugarRatio = totals.sugar / totals.calories * 100;
    
    return proteinPercent >= 25 && sugarRatio <= 15 && totals.calories < 800;
  };

  const getResponseByGradeAndScenario = (grade, scenario, firstName, gender, card) => {
    const responses = {
      'A': {
        rightSwipeGood: [
          `Obviously you spotted that perfection! ${firstName}, you could teach a masterclass on nutrition!`,
          `A+ choice recognition! That ${Math.round(card.totals.protein)}g protein was calling your name, wasn't it?`,
          `Textbook excellence! Your expert eye caught those perfect macros immediately!`
        ],
        rightSwipeBad: [
          `${firstName}, did someone hack your brain?! Even nutrition experts have off days...`,
          `Wait, WHAT?! The professor chose the 🍕? I'm shook! Everyone makes mistakes though.`,
          `Error 404: Expert judgment not found! But hey, we all have weak moments!`
        ],
        leftSwipeGood: [
          `Hmm, ${firstName}, that was actually solid nutrition. Even experts can be too picky sometimes!`,
          `You rejected quality fuel? That's... surprising from a nutrition pro like you!`,
          `Expert-level standards, but maybe TOO expert? That was actually decent!`
        ],
        leftSwipeBad: [
          `PERFECT rejection! You spotted that nutritional disaster from a mile away!`,
          `Expert instincts activated! That sugar bomb had no chance against your knowledge!`,
          `Flawless defense against junk food! This is why you're the professor!`
        ]
      },
      'B': {
        rightSwipeGood: [
          `Your nutrition wingman approves! ${firstName}, you're learning to spot the good ones!`,
          `Solid choice recognition! That ${Math.round(card.totals.protein)}g protein caught your trained eye!`,
          `You're getting really good at this! Your nutrition instincts are developing nicely!`
        ],
        rightSwipeBad: [
          `Ooof, ${firstName}! I've got your back, but we need to work on spotting the red flags together!`,
          `Your wingman is covering for you here... that was NOT the move! But we'll learn!`,
          `Even good wingmen make bad calls sometimes! Let's stick to the game plan next time!`
        ],
        leftSwipeGood: [
          `Hey ${firstName}, your wingman thinks you might've been too harsh there!`,
          `That was actually decent nutrition! Your standards are getting high - good problem to have!`,
          `Wingman wisdom: sometimes good enough IS good enough! That wasn't bad!`
        ],
        leftSwipeBad: [
          `Your wingman is PROUD! You dodged that nutritional bullet like a pro!`,
          `Perfect teamwork! We spotted that junk food together and shut it down!`,
          `That's what I'm talking about! You're learning to protect yourself from bad choices!`
        ]
      },
      'C': {
        rightSwipeGood: [
          `You actually found quality at 2 AM?! ${firstName}, miracles DO happen!`,
          `Wait, you chose something GOOD for once?! The bar is closing and you found nutrition!`,
          `Miracle alert! ${firstName} found actual food instead of nutritional scraps!`
        ],
        rightSwipeBad: [
          `Of course you did... ${firstName}, it's 2 AM and you're accepting whatever's left!`,
          `Desperation is showing! That's exactly what I'd expect from someone grabbing leftovers!`,
          `Peak 2 AM energy - just taking whatever's available, aren't we?`
        ],
        leftSwipeGood: [
          `${firstName}, you rejected GOOD nutrition?! At this hour, you can't afford to be picky!`,
          `You're turning down quality food at 2 AM? That's... actually worse than settling!`,
          `Even at the bottom of the barrel, you're being too selective! That was decent!`
        ],
        leftSwipeBad: [
          `Finally showing some standards! Even at 2 AM, you know trash when you see it!`,
          `Look who's suddenly got taste! Rejecting the worst of the worst - progress!`,
          `At least you can spot complete garbage! Baby steps, ${firstName}!`
        ]
      },
      'D': {
        rightSwipeGood: [
          `THIS is your moment! ${firstName}, patience pays off and you found the good stuff!`,
          `YES! Your time finally came and you DELIVERED! That's quality nutrition right there!`,
          `The stars aligned! ${firstName}, you waited for the right choice and NAILED IT!`
        ],
        rightSwipeBad: [
          `Oh ${firstName}... your heart is in the right place, but that wasn't it!`,
          `Sweet ${firstName}, I believe in you! This just wasn't your nutritional soulmate!`,
          `Your time will come! This wasn't the one, but don't give up on finding good nutrition!`
        ],
        leftSwipeGood: [
          `${firstName}, you let perfection slip away! Your perfect match just walked by!`,
          `Nooo! That was actually your moment and you missed it! But don't worry, more chances coming!`,
          `Your time will come... but that WAS good nutrition! Trust your instincts more!`
        ],
        leftSwipeBad: [
          `Good instincts, ${firstName}! You're learning to recognize what you DON'T want!`,
          `Smart rejection! Your perfect nutrition match is still out there - keep waiting!`,
          `That's the spirit! You know you deserve better than that junk!`
        ]
      }
    };

    const gradeResponses = responses[grade] || responses['D'];
    const scenarioResponses = gradeResponses[scenario] || gradeResponses.rightSwipeGood;
    return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
  };

  const handleSwipe = (direction) => {
    const currentCard = gameCards[currentCardIndex];
    if (!currentCard) return;

    const response = getSarcasticResponse(currentCard, direction, userGrade, userProfile);
    
    setSwipeResults(prev => [...prev, {
      card: currentCard,
      direction,
      response,
      isCorrect: direction === 'right' ? isNutritiousChoice(currentCard) : !isNutritiousChoice(currentCard)
    }]);

    if (currentCardIndex >= gameCards.length - 1) {
      setGameComplete(true);
    } else {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setSwipeResults([]);
    setGameComplete(false);
  };

  const calculateFinalScore = () => {
    const correctChoices = swipeResults.filter(result => result.isCorrect).length;
    return Math.round((correctChoices / swipeResults.length) * 100);
  };

  const currentCard = gameCards[currentCardIndex];

  if (gameComplete) {
    const finalScore = calculateFinalScore();
    const finalGrade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : 'D';
    
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🎯 Game Complete!</h1>
          <div className="text-sm text-gray-600">Playing as: {aiPersonality}</div>
        </div>

        {/* Final Score */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white mb-4">
            <div className="text-4xl font-bold mb-2">{finalScore}%</div>
            <div className="text-lg">Grade: {finalGrade}</div>
            <div className="text-sm opacity-90">
              {swipeResults.filter(r => r.isCorrect).length} out of {swipeResults.length} correct
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
          {swipeResults.map((result, index) => (
            <div key={index} className={`p-3 rounded-lg border ${result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {result.card.title || result.card.mealType}
                </span>
                <span className={`text-lg ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isCorrect ? '✅' : '❌'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetGame}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Play Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">No meals to review!</h2>
        <p className="text-gray-600 mb-4">Add some meals to your daily plan first.</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">🍽️ Meal Swipe</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-sm opacity-90">
          Your Grade: {userGrade} • {aiPersonality}
        </div>
        <div className="text-xs opacity-75 mt-1">
          Card {currentCardIndex + 1} of {gameCards.length}
        </div>
      </div>

      {/* Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-[300px] flex flex-col justify-center">
          {/* Meal Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentCard.title || `${currentCard.mealType.charAt(0).toUpperCase() + currentCard.mealType.slice(1)}`}
            </h2>
            {currentCard.time && (
              <div className="text-sm text-gray-600">⏰ {currentCard.time}</div>
            )}
            {currentCard.description && (
              <div className="text-sm text-gray-700 mt-2">{currentCard.description}</div>
            )}
          </div>

          {/* Nutrition Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Calories:</span>
              <span className="font-bold text-lg">{Math.round(currentCard.totals.calories)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Protein:</span>
              <span className="font-bold text-blue-600">{Math.round(currentCard.totals.protein)}g</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Carbs:</span>
              <span className="font-bold text-green-600">{Math.round(currentCard.totals.carbs)}g</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Fat:</span>
              <span className="font-bold text-yellow-600">{Math.round(currentCard.totals.fat)}g</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Sugar:</span>
              <span className="font-bold text-red-600">{Math.round(currentCard.totals.sugar)}g</span>
            </div>
          </div>

          {/* Macro Percentage */}
          {currentCard.pieData && currentCard.pieData.length > 0 && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                P: {currentCard.pieData[0]?.percentage || 0}% • 
                C: {currentCard.pieData[1]?.percentage || 0}% • 
                F: {currentCard.pieData[2]?.percentage || 0}%
              </div>
            </div>
          )}
        </div>

        {/* Swipe Actions */}
        <div className="flex justify-center gap-8">
          <button
            onClick={() => handleSwipe('left')}
            className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <X size={32} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Heart size={32} />
          </button>
        </div>

        <div className="text-center mt-4">
          <div className="text-sm text-gray-600">
            ❌ Pass • ❤️ Accept
          </div>
        </div>
      </div>

      {/* Last Response */}
      {swipeResults.length > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="text-sm font-medium text-blue-800">
            {aiPersonality} says:
          </div>
          <div className="text-sm text-blue-700 mt-1">
            "{swipeResults[swipeResults.length - 1].response}"
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSwipeGame;
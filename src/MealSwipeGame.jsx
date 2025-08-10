import React, { useState, useEffect } from 'react';
import { Heart, X, RotateCcw, Trophy, Star } from 'lucide-react';
import { generatePersonalTrainerSummary } from './PersonalTrainerSummary.js';

const MealSwipeGame = ({ 
  allMeals = {}, 
  userProfile = {}, 
  calorieData = {},
  onComplete = () => {},
  isIntegrated = false
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameCards, setGameCards] = useState([]);
  const [swipeResults, setSwipeResults] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [overallGrade, setOverallGrade] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');

  // Initialize game cards from actual meal data
  useEffect(() => {
    if (!allMeals || Object.keys(allMeals).length === 0) return;
    
    const cards = [];
    
    // Only include meals that have actual food (calories > 50)
    Object.entries(allMeals).forEach(([mealType, mealData]) => {
      if (mealData.totals && mealData.totals.calories > 50) {
        cards.push({
          id: `${mealType}-${Date.now()}`,
          mealType,
          time: mealData.time,
          totals: mealData.totals,
          pieData: mealData.pieData || [],
          items: mealData.items || [],
          isRealMeal: true
        });
      }
    });

    // Sort by meal time chronologically
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      return hour24 * 60 + minutes;
    };

    cards.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    
    setGameCards(cards);
    
    // Get overall grade from personal trainer summary
    const summary = generatePersonalTrainerSummary(allMeals, userProfile, calorieData);
    setOverallGrade(summary.grade || 'C');
  }, [allMeals, userProfile, calorieData]);

  // Evaluate meal quality (returns score 0-100)
  const evaluateMealQuality = (card) => {
    const { totals } = card;
    let score = 0;
    const issues = [];
    const strengths = [];

    // Calculate macro percentages
    const totalMacroCalories = (totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9);
    const proteinPercent = totalMacroCalories > 0 ? (totals.protein * 4) / totalMacroCalories * 100 : 0;
    const carbPercent = totalMacroCalories > 0 ? (totals.carbs * 4) / totalMacroCalories * 100 : 0;
    const fatPercent = totalMacroCalories > 0 ? (totals.fat * 9) / totalMacroCalories * 100 : 0;

    // Macro ratio evaluation (40-40-20 ±5%)
    const proteinIdeal = Math.abs(proteinPercent - 40) <= 5;
    const carbIdeal = Math.abs(carbPercent - 40) <= 5;
    const fatIdeal = Math.abs(fatPercent - 20) <= 5;

    // NEW: Sweetheart criteria (40-40-20 ±10%)
    const proteinSweetheart = Math.abs(proteinPercent - 40) <= 10;
    const carbSweetheart = Math.abs(carbPercent - 40) <= 10;
    const fatSweetheart = Math.abs(fatPercent - 20) <= 10;

    if (proteinSweetheart && carbSweetheart && fatSweetheart) {
      score += 50;
      strengths.push('sweetheart_macros');
    } else if (proteinPercent >= 45) {
      score += 35;
      strengths.push('metabolism_booster');
    } else if (proteinPercent < 25) {
      score -= 20;
      issues.push('metabolism_killer');
    }

    // NEW: High carb = digestive destroyer
    if (totals.carbs > 55) {
      score -= 30;
      issues.push('carb_bloater');
    } else if (totals.carbs <= 30) {
      score += 15;
      strengths.push('lean_machine');
    }

    // NEW: Sugar evaluation with stricter single-item limits
    if (totals.sugar <= 15) {
      score += 25;
      strengths.push('sugar_angel');
    } else if (totals.sugar <= 25) {
      score += 10;
      strengths.push('manageable_sugar');
    } else if (totals.sugar > 25) {
      // Single item sugar warning system
      const sugarOverage = totals.sugar - 25;
      const warningLevel = Math.floor(sugarOverage / 10) + 1; // +1 for base warning
      score -= (15 + (warningLevel * 10));
      issues.push(`sugar_bomb_level_${warningLevel}`);
    }

    // Calorie burn potential
    if (totals.calories >= 100 && totals.calories <= 600) {
      score += 15;
      strengths.push('calorie_burn_friendly');
    } else if (totals.calories > 800) {
      score -= 20;
      issues.push('calorie_bomb');
    }

    // Protein metabolism boost bonus
    if (proteinPercent >= 50) {
      score += 20;
      strengths.push('fat_burning_machine');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      strengths,
      macros: { proteinPercent, carbPercent, fatPercent },
      carbGrams: totals.carbs,
      sugarGrams: totals.sugar
    };
  };

  // Get contextual response based on swipe and meal quality
  const getSwipeResponse = (card, swipeDirection, evaluation) => {
    const { firstName, gender } = userProfile;
    const { score, issues, strengths, macros } = evaluation;
    const swipedRight = swipeDirection === 'right';
    const isGoodMeal = score >= 70;
    
    // Gender-specific pronouns
    const genderPronouns = {
      male: { they: 'she', possessive: 'her', title: 'queen' },
      female: { they: 'he', possessive: 'his', title: 'king' },
      'non-binary': { they: 'they', possessive: 'their', title: 'royalty' }
    };
    
    const pronouns = genderPronouns[gender] || genderPronouns['non-binary'];
    
    // Create responses based on grade and scenario
    if (swipedRight && isGoodMeal) {
      // Swiped right on good meal - Success!
      const successMessages = {
        'A': [
          `🔥 PERFECT MATCH! That meal is nutrition royalty and you spotted it immediately!`,
          `💍 It's a match made in macro heaven! You've got elite nutrition instincts!`,
          `🏆 Expert-level swipe! Your nutrition game is championship tier!`
        ],
        'B': [
          `✨ GREAT MATCH! You've got solid taste in quality nutrition!`,
          `🎯 Nice choice! You're developing excellent nutrition radar!`,
          `💪 Good eye! You spotted that quality meal composition!`
        ],
        'C': [
          `😊 Not bad! You recognized decent nutrition when you saw it!`,
          `👍 Learning! You're starting to spot the good ones!`,
          `📈 Progress! Your nutrition instincts are improving!`
        ],
        'D': [
          `🙌 Finally! You found a good one! That meal is way above your usual choices!`,
          `🎉 Miracle match! Somehow you spotted quality nutrition!`,
          `✨ Dreams do come true! You actually chose well for once!`
        ]
      };
      
      return successMessages[overallGrade][Math.floor(Math.random() * successMessages[overallGrade].length)];
    }
    
    if (swipedRight && !isGoodMeal) {
      // Swiped right on bad meal - Rejection!
      const rejectionMessages = {
        'A': [
          `💔 REJECTED! ${firstName}, that meal is way below your standards! ${Math.round(card.totals.sugar)}g sugar is a red flag!`,
          `🚫 Standards, ${firstName}! You're A-grade - why chase ${Math.round(macros.carbPercent)}% carb disasters?`,
          `❌ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} said "no thanks" - wrong macros = instant left swipe!`
        ],
        'B': [
          `😬 Ouch! That meal ghosted you - ${Math.round(macros.proteinPercent)}% protein isn't cutting it!`,
          `🤦‍♀️ ${firstName}, you aimed too high! That ${Math.round(card.totals.calories)}-calorie mess rejected you!`,
          `💸 Friend-zoned! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} wants better nutrition standards!`
        ],
        'C': [
          `😅 Swing and a miss! That meal wants someone with better nutrition knowledge!`,
          `🎭 Plot twist: those macros weren't feeling your energy!`,
          `📱 Read receipt: OFF! That meal doesn't want nutrition confusion!`
        ],
        'D': [
          `🤡 Even terrible meals have standards! That ${Math.round(card.totals.sugar)}g sugar bomb rejected YOU!`,
          `🙈 Embarrassing! You got turned down by nutritional disaster!`,
          `🚨 BRUTAL! Even junk food doesn't want to be associated with your choices!`
        ]
      };
      
      return rejectionMessages[overallGrade][Math.floor(Math.random() * rejectionMessages[overallGrade].length)];
    }
    
    if (!swipedRight && isGoodMeal) {
      // Swiped left on good meal - Missed opportunity!
      const missedMessages = {
        'A': [
          `😱 WHAT?! ${firstName}, you just rejected perfection! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} had ideal macros!`,
          `🤯 Expert mistake! That was macro perfection and you let it walk away!`,
          `💔 Heartbreak! You're so used to A-grade meals you didn't appreciate that masterpiece!`
        ],
        'B': [
          `😕 You missed out! That meal was actually really good for your goals!`,
          `🚪 One that got away! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} was quality nutrition!`,
          `📞 ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s telling friends you have commitment issues!`
        ],
        'C': [
          `🤷‍♀️ Your loss! That was decent and you pushed it away!`,
          `📋 Add it to the list of good meals you've rejected!`,
          `🎪 Self-sabotage! You can't recognize good nutrition!`
        ],
        'D': [
          `😭 WHY?! That was the best meal you've seen and you said no!`,
          `🏃‍♀️ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} dodged a bullet! You're not ready for greatness!`,
          `🎯 Self-destruction! You chose chaos over quality!`
        ]
      };
      
      return missedMessages[overallGrade][Math.floor(Math.random() * missedMessages[overallGrade].length)];
    }
    
    // Swiped left on bad meal - Good choice!
    const goodRejectMessages = {
      'A': [
        `👑 ROYALTY ENERGY! You spotted that ${Math.round(card.totals.sugar)}g sugar disaster immediately!`,
        `🛡️ Perfect defense! That ${Math.round(macros.carbPercent)}% carb chaos couldn't fool you!`,
        `🎯 Flawless execution! You saw through that nutritional catfish!`
      ],
      'B': [
        `💪 Good instincts! You're learning to spot the red flags!`,
        `🚫 Smart swipe! That meal was definitely trouble!`,
        `📊 Progress! You're developing better standards!`
      ],
      'C': [
        `👍 Decent call! Even you spotted that disaster!`,
        `🎲 Lucky guess! That was clearly wrong!`,
        `📚 Learning! You're recognizing the bad ones!`
      ],
      'D': [
        `🎉 MIRACLE! You actually made a good choice for once!`,
        `😲 Character development! You're learning to say no to disasters!`,
        `🔥 There's hope! You rejected something terrible!`
      ]
    };
    
    return goodRejectMessages[overallGrade][Math.floor(Math.random() * goodRejectMessages[overallGrade].length)];
  };

  // Enhanced drag handlers for smooth Tinder-style swiping
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragPosition({ x: clientX, y: clientY });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragPosition.x;
    const deltaY = clientY - dragPosition.y;
    
    // Update card position
    const card = document.getElementById('swipe-card');
    if (card) {
      const rotation = deltaX * 0.1;
      card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
      
      // Show swipe direction indicators
      if (Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection('');
      }
    }
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - dragPosition.x;
    
    const card = document.getElementById('swipe-card');
    if (card) {
      card.style.transform = '';
    }
    
    setSwipeDirection('');
    
    // Determine swipe action based on distance
    if (Math.abs(deltaX) > 100) {
      handleSwipe(deltaX > 0 ? 'right' : 'left');
    }
  };

  const handleSwipe = (direction) => {
    const currentCard = gameCards[currentCardIndex];
    if (!currentCard) return;

    const evaluation = evaluateMealQuality(currentCard);
    const response = getSwipeResponse(currentCard, direction, evaluation);
    
    setLastResponse(response);
    
    setSwipeResults(prev => [...prev, {
      card: currentCard,
      direction,
      response,
      evaluation,
      isCorrect: direction === 'right' ? evaluation.score >= 70 : evaluation.score < 70
    }]);

    if (currentCardIndex >= gameCards.length - 1) {
      setGameComplete(true);
      setTimeout(() => {
        if (isIntegrated) {
          onComplete();
        }
      }, 3000);
    } else {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setSwipeResults([]);
    setGameComplete(false);
    setLastResponse('');
  };

  const getMealTypeDisplayName = (mealType) => {
    const names = {
      breakfast: 'Breakfast',
      firstSnack: 'Morning Snack',
      secondSnack: 'Mid-Morning Snack', 
      lunch: 'Lunch',
      midAfternoon: 'Afternoon Snack',
      dinner: 'Dinner',
      lateSnack: 'Evening Snack',
      postWorkout: 'Post-Workout'
    };
    return names[mealType] || mealType;
  };

  if (gameCards.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl shadow-lg p-6 text-center border-2 border-pink-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🍽️ No Meals to Rate!</h2>
        <p className="text-gray-600 mb-4">Add meals first, then you can rate them and see your calorie burn in action!</p>
      </div>
    );
  }

  const currentCard = gameCards[currentCardIndex];

  if (gameComplete) {
    const finalScore = Math.round((swipeResults.filter(r => r.isCorrect).length / swipeResults.length) * 100);
    
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl shadow-lg p-6 border-2 border-pink-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🎯 Swipe Complete!</h1>
          <div className="text-lg text-gray-600">Your Nutrition Dating Score: {finalScore}%</div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Final Verdict:</h3>
          <p className="text-gray-700 text-sm italic">
            {finalScore >= 80 ? `${userProfile.firstName}, you've got excellent nutrition instincts! You know quality when you see it!` :
             finalScore >= 60 ? `Not bad, ${userProfile.firstName}! You're learning to spot good nutrition.` :
             `${userProfile.firstName}, your nutrition game needs work! Time to learn what quality meals look like!`}
          </p>
        </div>

        {!isIntegrated && (
          <button
            onClick={resetGame}
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Swipe Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-xl p-4 text-center">
        <h1 className="text-xl font-bold mb-1">🔥 Swipe Your Meals</h1>
        <div className="text-sm opacity-90">
          {currentCardIndex + 1} of {gameCards.length} • Grade: {overallGrade}
        </div>
        <div className="text-xs opacity-75 mt-1">
          Swipe like your goals depend on it!
        </div>
      </div>

      {/* Card Container with Tinder-style stacking */}
      <div className="relative bg-white rounded-b-xl shadow-lg min-h-[500px] overflow-hidden">
        
        {/* Background Cards (stacked effect) */}
        {gameCards.slice(currentCardIndex + 1, currentCardIndex + 3).map((card, index) => (
          <div 
            key={card.id}
            className="absolute inset-4 bg-gray-100 rounded-lg border"
            style={{ 
              transform: `scale(${0.95 - index * 0.05}) translateY(${index * 8}px)`,
              zIndex: 10 - index,
              opacity: 0.6 - index * 0.2
            }}
          />
        ))}

        {/* Current Card with Drag Support */}
        {currentCard && (
          <div 
            id="swipe-card"
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 p-6 shadow-lg cursor-grab active:cursor-grabbing"
            style={{ zIndex: 20 }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            
            {/* Swipe Direction Indicators */}
            {swipeDirection && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                swipeDirection === 'right' ? 'bg-green-500' : 'bg-red-500'
              } bg-opacity-20 rounded-lg`}>
                <div className={`text-6xl font-bold ${
                  swipeDirection === 'right' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {swipeDirection === 'right' ? '❤️' : '❌'}
                </div>
              </div>
            )}
            
            {/* Card Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {getMealTypeDisplayName(currentCard.mealType)}
              </h2>
              <div className="text-sm text-gray-600">⏰ {currentCard.time}</div>
            </div>

            {/* Nutrition Display */}
            <div className="space-y-3 mb-6">
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
                <span className={`font-bold ${currentCard.totals.sugar > 30 ? 'text-red-600' : 'text-gray-600'}`}>
                  {Math.round(currentCard.totals.sugar)}g
                </span>
              </div>
            </div>

            {/* Macro Percentages */}
            {currentCard.pieData && currentCard.pieData.length > 0 && (
              <div className="text-center mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Macro Split:</div>
                <div className="text-sm text-gray-600">
                  💪 {currentCard.pieData[0]?.percentage || 0}% • 
                  🌾 {currentCard.pieData[1]?.percentage || 0}% • 
                  🥑 {currentCard.pieData[2]?.percentage || 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Target: 40% • 40% • 20%)
                </div>
              </div>
            )}

            {/* Swipe Actions */}
            <div className="flex justify-center gap-8 mb-4">
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

            <div className="text-center text-xs text-gray-500">
              ❌ Pass • ❤️ Accept • 👆 Drag to swipe
            </div>
          </div>
        )}

        {/* Last Response */}
        {lastResponse && (
          <div className="absolute bottom-4 left-4 right-4 bg-pink-50 border border-pink-200 rounded-lg p-3 z-30">
            <div className="text-sm font-medium text-pink-800 mb-1">
              💭 Dating Coach Says:
            </div>
            <div className="text-sm text-pink-700">
              "{lastResponse}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSwipeGame;
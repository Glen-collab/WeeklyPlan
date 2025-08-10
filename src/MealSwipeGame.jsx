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
  const { score, issues, strengths, macros, carbGrams, sugarGrams } = evaluation;
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
    // Swiped right on good meal - Success with metabolism focus!
    if (strengths.includes('sweetheart_macros')) {
      const sweetheartMessages = [
        `🔥 SWEETHEART MATCH! That 40-40-20 balance will have your metabolism PURRING like a Ferrari engine!`,
        `💍 WIFEY/HUBBY MATERIAL! Perfect macros = fat-burning machine activated, ${firstName}!`,
        `🏆 KEEPER ALERT! That balanced beauty will torch calories for HOURS after eating!`,
        `✨ MARRIAGE MATERIAL! Your metabolism just found its soulmate - prepare for the calorie burn!`
      ];
      return sweetheartMessages[Math.floor(Math.random() * sweetheartMessages.length)];
    } else if (strengths.includes('metabolism_booster')) {
      const metabolismMessages = [
        `💪 METABOLISM ROCKET! That protein will have you burning calories while you sleep!`,
        `🚀 FAT BURNING ACTIVATED! High protein = thermogenic BEAST MODE engaged!`,
        `🔥 CALORIE INCINERATOR! Your body is about to work OVERTIME digesting that protein!`,
        `⚡ METABOLIC LIGHTNING! That protein percentage just turned you into a calorie-burning machine!`
      ];
      return metabolismMessages[Math.floor(Math.random() * metabolismMessages.length)];
    } else {
      const generalSuccessMessages = [
        `✅ SOLID CHOICE! Your metabolism approves of this calorie-burning combination!`,
        `👍 NICE PICK! That meal won't slow down your fat-burning potential!`,
        `🎯 SMART SWIPE! Your body will actually THANK YOU for this one!`
      ];
      return generalSuccessMessages[Math.floor(Math.random() * generalSuccessMessages.length)];
    }
  }
  
  if (swipedRight && !isGoodMeal) {
    // Swiped right on bad meal - Rejection with savage sarcasm!
    if (issues.includes('carb_bloater')) {
      const carbBloaterMessages = [
        `💔 REJECTED! ${firstName}, ${Math.round(carbGrams)}g carbs?! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} said "I don't date people who make me look pregnant!"`,
        `🚫 GHOSTED! That ${Math.round(carbGrams)}g carb bomb just called you "bloat buddy" and ran away!`,
        `❌ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} swiped LEFT on your stomach! Too many carbs = looking 6 months pregnant tomorrow!`,
        `💸 FRIEND-ZONED! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} wants someone whose face won't match their bloated belly!`
      ];
      return carbBloaterMessages[Math.floor(Math.random() * carbBloaterMessages.length)];
    } else if (issues.some(issue => issue.startsWith('sugar_bomb'))) {
      const sugarLevel = issues.find(issue => issue.startsWith('sugar_bomb_level_'))?.split('_')[3] || '1';
      const sugarSavageMessages = [
        `🍭 DIABETES ALERT! ${Math.round(sugarGrams)}g sugar just gave you the "I don't date pre-diabetics" speech!`,
        `💔 SUGAR CRASH REJECTION! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} said "Call me when your blood sugar stabilizes!"`,
        `🚨 INSULIN SPIKE! That ${Math.round(sugarGrams)}g sugar bomb just blocked you on all social media!`,
        `🤡 EVEN CANDY doesn't want to be associated with that sugar disaster! Level ${sugarLevel} warning!`
      ];
      return sugarSavageMessages[Math.floor(Math.random() * sugarSavageMessages.length)];
    } else if (issues.includes('metabolism_killer')) {
      const metabolismKillerMessages = [
        `💀 METABOLISM MURDER! ${Math.round(macros.proteinPercent)}% protein just KILLED your calorie burn!`,
        `😴 HIBERNATION MODE! That low protein put your metabolism to sleep permanently!`,
        `🐌 SLUG SPEED! Your fat-burning potential just crawled into a cave and died!`,
        `❄️ FROZEN METABOLISM! ${Math.round(macros.proteinPercent)}% protein = ice age calorie burn!`
      ];
      return metabolismKillerMessages[Math.floor(Math.random() * metabolismKillerMessages.length)];
    } else {
      const generalRejectionMessages = [
        `😬 STANDARDS CHECK! That nutritional disaster wants someone with WORSE taste!`,
        `🤦‍♀️ ${firstName}, even junk food has standards! You got rejected by GARBAGE!`,
        `💸 That meal said "It's not you, it's your metabolism... and your face... and everything!"`,
        `📱 Read receipt: OFF! That meal doesn't want your digestive chaos!`
      ];
      return generalRejectionMessages[Math.floor(Math.random() * generalRejectionMessages.length)];
    }
  }
  
  if (!swipedRight && isGoodMeal) {
    // Swiped left on good meal - Missed metabolic opportunity!
    if (strengths.includes('sweetheart_macros')) {
      const missedSweetheartMessages = [
        `😱 WHAT?! ${firstName}, you just rejected METABOLIC PERFECTION! That 40-40-20 was your calorie-burning soulmate!`,
        `🤯 SELF-SABOTAGE! You let a fat-burning GODDESS walk away! Your metabolism is CRYING!`,
        `💔 HEARTBREAK! That sweetheart would have torched calories for HOURS and you said no!`,
        `🏃‍♀️ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} dodged a bullet! You're not ready for that level of metabolic excellence!`
      ];
      return missedSweetheartMessages[Math.floor(Math.random() * missedSweetheartMessages.length)];
    } else if (strengths.includes('metabolism_booster')) {
      const missedMetabolismMessages = [
        `😭 MISSED OPPORTUNITY! That protein powerhouse would have turned you into a calorie-burning MACHINE!`,
        `🚪 One that got away! Your metabolism just lost its best friend forever!`,
        `💸 You rejected PREMIUM fat-burning fuel! That's like turning down a Ferrari for a bicycle!`,
        `🤦‍♀️ ${firstName}, you just said no to 6+ hours of elevated calorie burn!`
      ];
      return missedMetabolismMessages[Math.floor(Math.random() * missedMetabolismMessages.length)];
    } else {
      const generalMissedMessages = [
        `🤷‍♀️ Your loss! That was decent metabolism fuel and you pushed it away!`,
        `📋 Add it to the list of good nutrition you've rejected for no reason!`,
        `🎪 Self-sabotage! You can't recognize calorie-burning gold when you see it!`
      ];
      return generalMissedMessages[Math.floor(Math.random() * generalMissedMessages.length)];
    }
  }
  
  // Swiped left on bad meal - Smart metabolic choice!
  if (issues.includes('carb_bloater')) {
    const smartCarbAvoidanceMessages = [
      `👑 DIGESTIVE ROYALTY! You spotted that ${Math.round(carbGrams)}g bloat-bomb immediately!`,
      `🛡️ BELLY PROTECTION! You saved yourself from looking 6 months pregnant tomorrow!`,
      `🎯 SAVAGE INTUITION! You saw through that carb catastrophe like a PRO!`,
      `💪 METABOLISM DEFENDER! That carb disaster couldn't fool your fat-burning instincts!`
    ];
    return smartCarbAvoidanceMessages[Math.floor(Math.random() * smartCarbAvoidanceMessages.length)];
  } else if (issues.some(issue => issue.startsWith('sugar_bomb'))) {
    const smartSugarAvoidanceMessages = [
      `🍭 SUGAR DETECTIVE! You spotted that ${Math.round(sugarGrams)}g diabetes trap from a mile away!`,
      `🚨 BLOOD SUGAR BODYGUARD! You protected your insulin like a CHAMPION!`,
      `🎯 METABOLIC GENIUS! That sugar bomb couldn't trick your calorie-burning brain!`,
      `⚡ ENERGY STABILITY! You chose sustained metabolism over sugar crash chaos!`
    ];
    return smartSugarAvoidanceMessages[Math.floor(Math.random() * smartSugarAvoidanceMessages.length)];
  } else if (issues.includes('metabolism_killer')) {
    const smartProteinChoiceMessages = [
      `🔥 METABOLISM PROTECTOR! You refused to let that low-protein disaster kill your calorie burn!`,
      `💪 FAT-BURNING GUARDIAN! You saved your metabolism from hibernation mode!`,
      `🚀 SMART SWIPE! You kept your calorie-burning machine running at full speed!`,
      `⚡ THERMOGENIC WISDOM! You know protein = metabolic FIRE!`
    ];
    return smartProteinChoiceMessages[Math.floor(Math.random() * smartProteinChoiceMessages.length)];
  } else {
    const generalGoodRejectMessages = [
      `👍 SOLID INSTINCTS! You're learning to protect your metabolism!`,
      `🚫 SMART DEFENSE! That nutritional chaos couldn't fool you!`,
      `📊 PROGRESS! You're developing fat-burning meal standards!`,
      `🔥 There's hope! You rejected something that would kill your calorie burn!`
    ];
    return generalGoodRejectMessages[Math.floor(Math.random() * generalGoodRejectMessages.length)];
  }
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
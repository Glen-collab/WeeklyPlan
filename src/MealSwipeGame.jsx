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
  const [showResults, setShowResults] = useState(false);
  const [lastResponse, setLastResponse] = useState('');

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

    if (proteinIdeal && carbIdeal && fatIdeal) {
      score += 40;
      strengths.push('perfect_macros');
    } else if (proteinPercent >= 35) {
      score += 25;
      strengths.push('good_protein');
    } else if (proteinPercent < 20) {
      issues.push('low_protein');
    }

    // Sugar evaluation
    if (totals.sugar <= 10) {
      score += 25;
      strengths.push('low_sugar');
    } else if (totals.sugar <= 25) {
      score += 15;
    } else if (totals.sugar > 30) {
      score -= 20;
      issues.push('high_sugar');
    }

    // Calorie appropriateness
    if (totals.calories >= 100 && totals.calories <= 800) {
      score += 20;
    } else if (totals.calories > 1000) {
      score -= 15;
      issues.push('too_many_calories');
    }

    // Protein adequacy for body weight
    const targetWeight = parseInt(userProfile.weight) || 150;
    const mealProteinTarget = card.mealType === 'breakfast' || card.mealType === 'lunch' || card.mealType === 'dinner' 
      ? targetWeight * 0.15 // 15% of bodyweight in grams for main meals
      : targetWeight * 0.05; // 5% for snacks

    if (totals.protein >= mealProteinTarget) {
      score += 15;
      strengths.push('adequate_protein');
    } else {
      issues.push('insufficient_protein');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      strengths,
      macros: { proteinPercent, carbPercent, fatPercent }
    };
  };

  // Get contextual response based on swipe and meal quality
  const getSwipeResponse = (card, swipeDirection, evaluation) => {
    const { firstName, gender } = userProfile;
    const { score, issues, strengths, macros } = evaluation;
    const swipedRight = swipeDirection === 'right';
    const isGoodMeal = score >= 70;
    
    // Gender-specific pronouns and metaphors
    const genderPronouns = {
      male: { they: 'she', possessive: 'her', article: 'a', title: 'queen' },
      female: { they: 'he', possessive: 'his', article: 'a', title: 'king' },
      'non-binary': { they: 'they', possessive: 'their', article: 'a', title: 'royalty' }
    };
    
    const pronouns = genderPronouns[gender] || genderPronouns['non-binary'];
    
    // Create responses based on grade and scenario
    if (swipedRight && isGoodMeal) {
      // Swiped right on good meal - Success!
      const successMessages = {
        'A': [
          `🔥 MATCH! That meal is ${pronouns.article} perfect 10, and ${pronouns.they} swiped back! Elite nutrition game, ${firstName}!`,
          `💍 It's a match made in macro heaven! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s got that 40-40-20 glow and you knew it!`,
          `🏆 Expert-level swipe! That meal is ${pronouns.article} ${pronouns.title} and you've got the nutrition IQ to match!`
        ],
        'B': [
          `✨ NICE MATCH! You've got good taste - that meal is definitely date-worthy nutrition!`,
          `🎯 Solid choice! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s got those balanced macros you can bring home to your goals!`,
          `💪 Great eye! You spotted quality nutrition when you saw it!`
        ],
        'C': [
          `😊 Not bad! You recognized a decent meal when you saw one - progress!`,
          `👍 Good call! That meal might not be perfect, but ${pronouns.they}'s got potential!`,
          `📈 Learning! You're starting to spot the good ones!`
        ],
        'D': [
          `🙌 Finally! You found a good one! That meal is way out of your usual league!`,
          `🎉 Miracle match! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s perfect and somehow interested in your nutrition chaos!`,
          `✨ Dreams do come true! Quality nutrition said yes to you!`
        ]
      };
      
      return successMessages[overallGrade][Math.floor(Math.random() * successMessages[overallGrade].length)];
    }
    
    if (swipedRight && !isGoodMeal) {
      // Swiped right on bad meal - Rejection!
      const rejectionMessages = {
        'A': [
          `💔 REJECTED! ${firstName}, that meal is way below your standards! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s got ${Math.round(card.totals.sugar)}g sugar - total red flag!`,
          `🚫 Standards, ${firstName}! You're an A-grade nutrition expert - why are you chasing ${Math.round(macros.carbPercent)}% carb disasters?`,
          `❌ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s not interested! ${issues.includes('high_sugar') ? 'Too much sugar' : 'Wrong macros'} = immediate left swipe from quality meals!`
        ],
        'B': [
          `😬 Ouch! That meal saw your swipe coming and ${pronouns.they} said "no thanks" - ${Math.round(macros.proteinPercent)}% protein isn't cutting it!`,
          `🤦‍♀️ ${firstName}, you aimed too high! That ${Math.round(card.totals.calories)}-calorie mess is out of your league!`,
          `💸 Friend-zoned! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} wants someone who understands balanced nutrition!`
        ],
        'C': [
          `😅 Swing and a miss! That meal is looking for someone with better nutrition game than you've got!`,
          `🎭 Plot twist: ${pronouns.they} ghosted you! Those macros weren't feeling your energy!`,
          `📱 Read receipt: OFF! That meal doesn't want to deal with your nutrition confusion!`
        ],
        'D': [
          `🤡 Come on, ${firstName}! Even terrible meals have standards! That ${Math.round(card.totals.sugar)}g sugar bomb rejected YOU!`,
          `🙈 Embarrassing! You got turned down by a nutritional disaster - time to level up your game!`,
          `🚨 BRUTAL! Even junk food doesn't want to be associated with your nutrition choices!`
        ]
      };
      
      return rejectionMessages[overallGrade][Math.floor(Math.random() * rejectionMessages[overallGrade].length)];
    }
    
    if (!swipedRight && isGoodMeal) {
      // Swiped left on good meal - Missed opportunity!
      const missedMessages = {
        'A': [
          `😱 WHAT?! ${firstName}, you just rejected ${pronouns.article} perfect 10! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} had ideal macros and you said no?!`,
          `🤯 Expert mistake! That meal was macro perfection and you let ${pronouns.possessive} walk away!`,
          `💔 Heartbreak! You're so used to A-grade meals you didn't appreciate that ${Math.round(macros.proteinPercent)}% protein masterpiece!`
        ],
        'B': [
          `😕 You missed out! That meal was actually really good - ${pronouns.they} would've been great for your goals!`,
          `🚪 One that got away! ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} was quality nutrition and you weren't ready!`,
          `📞 ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)}'s telling ${pronouns.possessive} friends you have commitment issues with good meals!`
        ],
        'C': [
          `🤷‍♀️ Your loss! That was actually a decent meal and you pushed ${pronouns.possessive} away!`,
          `📋 Add it to the list of good meals you've rejected! Maybe you're not ready for quality nutrition?`,
          `🎪 Self-sabotage! You're so used to mediocre meals you can't recognize a good one!`
        ],
        'D': [
          `😭 WHY?! That was literally the best meal you've seen all day and you said no! You need therapy!`,
          `🏃‍♀️ ${pronouns.they.charAt(0).toUpperCase() + pronouns.they.slice(1)} dodged a bullet! You're not ready for that level of nutrition excellence!`,
          `🎯 Self-destruction! You had a chance at greatness and chose chaos instead!`
        ]
      };
      
      return missedMessages[overallGrade][Math.floor(Math.random() * missedMessages[overallGrade].length)];
    }
    
    // Swiped left on bad meal - Good choice!
    const goodRejectMessages = {
      'A': [
        `👑 QUEEN/KING ENERGY! You spotted that ${Math.round(card.totals.sugar)}g sugar disaster immediately! Elite standards, ${firstName}!`,
        `🛡️ Perfect defense! That ${Math.round(macros.carbPercent)}% carb chaos couldn't fool an expert like you!`,
        `🎯 Flawless execution! You saw through that nutritional catfish instantly!`
      ],
      'B': [
        `💪 Good instincts! You're learning to spot the red flags - ${Math.round(card.totals.calories)} calories of trouble!`,
        `🚫 Smart swipe! That meal was definitely not worth your time or your goals!`,
        `📊 Progress! You're developing better nutrition standards!`
      ],
      'C': [
        `👍 Decent call! Even you can spot when something's obviously wrong with those macros!`,
        `🎲 Lucky guess! That meal was clearly a disaster and you figured it out!`,
        `📚 Learning moment! You're starting to recognize the bad ones!`
      ],
      'D': [
        `🎉 MIRACLE! You actually made a good choice! Even a broken clock is right twice a day!`,
        `😲 Shock! You rejected something terrible for once! There's hope for you yet, ${firstName}!`,
        `🔥 Character development! You're finally learning to say no to nutritional disasters!`
      ]
    };
    
    return goodRejectMessages[overallGrade][Math.floor(Math.random() * goodRejectMessages[overallGrade].length)];
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
      }, 3000); // Show final message for 3 seconds
    } else {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setSwipeResults([]);
    setGameComplete(false);
    setShowResults(false);
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
        <p className="text-gray-600 mb-4">Add some meals to your daily plan first, then come back to rate them!</p>
      </div>
    );
  }

  const currentCard = gameCards[currentCardIndex];

  if (gameComplete) {
    const finalScore = Math.round((swipeResults.filter(r => r.isCorrect).length / swipeResults.length) * 100);
    
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl shadow-lg p-6 border-2 border-pink-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🎯 Dating Game Complete!</h1>
          <div className="text-lg text-gray-600">Your Nutrition Dating Score: {finalScore}%</div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Final Verdict:</h3>
          <p className="text-gray-700 text-sm italic">
            {finalScore >= 80 ? `${userProfile.firstName}, you've got excellent taste in nutrition! You know quality when you see it!` :
             finalScore >= 60 ? `Not bad, ${userProfile.firstName}! You're learning to spot good nutrition vs. the disasters.` :
             `${userProfile.firstName}, your nutrition dating game needs work! Time to learn what quality meals look like!`}
          </p>
        </div>

        {!isIntegrated && (
          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Date Again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-xl p-4 text-center">
        <h1 className="text-xl font-bold mb-1">🍽️ Nutrition Dating</h1>
        <div className="text-sm opacity-90">
          Rate Your Meals • {currentCardIndex + 1} of {gameCards.length}
        </div>
        <div className="text-xs opacity-75 mt-1">
          Your Grade: {overallGrade} • Swipe like your goals depend on it!
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative bg-white rounded-b-xl shadow-lg p-6 min-h-[500px]">
        
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

        {/* Current Card */}
        {currentCard && (
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 p-6 shadow-lg" style={{ zIndex: 20 }}>
            
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
              ❌ Pass • ❤️ Accept
            </div>
          </div>
        )}

        {/* Last Response */}
        {lastResponse && (
          <div className="mt-4 bg-pink-50 border border-pink-200 rounded-lg p-3">
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
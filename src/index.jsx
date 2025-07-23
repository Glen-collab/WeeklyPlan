import React from 'react';
import ReactDOM from 'react-dom/client';
import MealTracker from './MealTracker'; // relative path now that it's in the same folder

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MealTracker />);

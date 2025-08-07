// src/MealMessages/index.js - Clean re-export of all meal messages

import { MorningMessages } from './MorningMessages.js';
import { EveningMessages } from './EveningMessages.js';

// Combine both message collections into a single export
export const MealMessages = {
  ...MorningMessages,
  ...EveningMessages
};

// Individual exports available if needed
export { MorningMessages, EveningMessages };
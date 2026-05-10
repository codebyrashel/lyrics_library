const adjectives = [
  'Happy', 'Sleepy', 'Clever', 'Brave', 'Swift', 'Calm', 'Bold', 'Wise',
  'Crazy', 'Quiet', 'Loud', 'Funny', 'Kind', 'Wild', 'Gentle', 'Mighty',
  'Speedy', 'Lucky', 'Jolly', 'Zesty', 'Cozy', 'Snappy', 'Dandy', 'Perky',
  'Breezy', 'Chipper', 'Dizzy', 'Froggy', 'Grumpy', 'Hoppy', 'Jumpy', 'Loopy'
];

const nouns = [
  'Panda', 'Koala', 'Fox', 'Wolf', 'Owl', 'Hawk', 'Bear', 'Deer',
  'Frog', 'Duck', 'Goose', 'Horse', 'Mouse', 'Rabbit', 'Squirrel', 'Raccoon',
  'Penguin', 'Dolphin', 'Octopus', 'Crab', 'Lobster', 'Starfish', 'Jellyfish', 'Seahorse',
  'Eagle', 'Falcon', 'Raven', 'Crow', 'Sparrow', 'Finch', 'Robin', 'Bluebird'
];

const colors = [
  'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown',
  'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Teal', 'Lime', 'Olive',
  'Maroon', 'Navy', 'Coral', 'Salmon', 'Plum', 'Lavender', 'Mint', 'Peach'
];

const getRandomItem = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Generate a random number between 1 and 999
const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 999) + 1;
};

// Generate a unique guest name
export const generateGuestName = (): string => {
  const adjective = getRandomItem(adjectives);
  const noun = getRandomItem(nouns);
  const number = getRandomNumber();
  return `${adjective}${noun}${number}`;
};

// Generate a consistent guest name based on guest ID (for returning guests)
export const getGuestName = (guestId: string): string => {
  const stored = localStorage.getItem('guest_name');
  if (stored) return stored;
  
  const newName = generateGuestName();
  localStorage.setItem('guest_name', newName);
  return newName;
};

// Generate random avatar color based on name
export const getGuestAvatarColor = (name: string): string => {
  // Generate consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Get initial letter for avatar
export const getGuestInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};
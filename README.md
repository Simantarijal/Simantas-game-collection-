# Simantas Game Collection

## Snake Game

A mobile-optimized Snake game with intuitive swipe controls for touch devices.

### Features

- **Mobile-First Design**: Optimized for mobile devices with touch controls
- **Swipe Controls**: Control the snake with simple swipe gestures
  - Swipe up/down/left/right to change direction
  - Minimum swipe distance prevents accidental direction changes
- **Responsive Design**: Automatically adapts to different screen sizes
- **Score System**: Track your current score and high score (saved locally)
- **Game Controls**: Start, pause, and reset functionality
- **Visual Feedback**: Modern UI with smooth animations and gradients
- **Cross-Platform**: Works on both mobile and desktop (keyboard controls on desktop)

### How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. On mobile: Swipe in the direction you want the snake to move
4. On desktop: Use arrow keys to control the snake
5. Eat the red food to grow and increase your score
6. Avoid hitting the walls or the snake's own body

### Controls

- **Mobile**: Swipe gestures (up, down, left, right)
- **Desktop**: Arrow keys
- **Game Controls**: Start, Pause, Reset buttons

### Technical Features

- Responsive canvas that scales with screen size
- Touch event handling with swipe detection
- Local storage for high score persistence
- Smooth game loop with configurable speed
- Collision detection for walls, food, and self
- Modern CSS with gradients and animations
- Prevents zoom and unwanted touch behaviors on mobile

### Files

- `index.html` - Main HTML structure
- `style.css` - Mobile-optimized styling and responsive design
- `script.js` - Game logic, touch controls, and swipe detection
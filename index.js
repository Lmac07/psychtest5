// Import the word list from dictionary.js
import { dictionary } from './dictionary.js';

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)], // Randomly selects a word from the dictionary
  grid: Array(6)
    .fill()
    .map(() => Array(state.secret.length).fill('')), // 6 rows, dynamic columns based on word length
  currentRow: 0,
  currentCol: 0,
};

// Set the CSS variable for dynamic column width based on word length
document.documentElement.style.setProperty('--word-length', state.secret.length);

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.style.gridTemplateColumns = `repeat(${state.secret.length}, 1fr)`; // Adjusts only the column count

  // Loop to create boxes, 6 rows with dynamic columns based on word length
  for (let i = 0; i < 6; i++) {  // fixed 6 rows
    for (let j = 0; j < state.secret.length; j++) {  // variable columns
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === state.secret.length) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
        }
      }
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < state.secret.length; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;

    setTimeout(() => {
      if (letter === state.secret[i]) {
        box.classList.add('right');
      } else if (state.secret.includes(letter)) {
        box.classList.add('wrong');
      } else {
        box.classList.add('empty');
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert('Congratulations!');
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === state.secret.length) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

// Initialization code to set up the game
function startup() {
  const game = document.getElementById('game');
  drawGrid(game); // Draws the game grid inside the game container
  registerKeyboardEvents(); // Sets up keyboard functionality
}

startup(); // Initializes the game



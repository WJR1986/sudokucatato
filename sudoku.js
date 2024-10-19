let solutionGrid = [];
let completedPuzzles = 0; // To count completed puzzles

// Load completed puzzles count from local storage
function loadCompletedCount() {
  const count = localStorage.getItem("completedCount");
  completedPuzzles = count ? parseInt(count) : 0;
  document.getElementById("completedCount").innerText = completedPuzzles;
}

// Create an empty 9x9 grid
function createEmptyGrid() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

// Check if it's safe to place a number in the grid
function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const startRow = row - (row % 3),
    startCol = col - (col % 3);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (grid[i + startRow][j + startCol] === num) return false;
  return true;
}

// Solve the Sudoku puzzle
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Remove numbers to create the puzzle based on difficulty
function removeNumbers(grid, difficulty) {
  let attempts = { easy: 40, medium: 50, hard: 60 }[difficulty];
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      attempts--;
    }
  }
}

// Display the grid on the webpage
function displayGrid(grid, editable = false) {
  const gridContainer = document.getElementById("sudokuGrid");
  gridContainer.innerHTML = ""; // Clear existing puzzle

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = "1";
      input.value = grid[row][col] === 0 ? "" : grid[row][col];
      input.readOnly = grid[row][col] !== 0;
      input.classList.add("form-control");
      input.dataset.row = row;
      input.dataset.col = col;
      gridContainer.appendChild(input);
    }
  }

  addRealTimeValidation(); // Add real-time validation after grid is created
}
// Highlight the 3x3 subgrid of a given cell
function highlightSubgrid(row, col) {
  console.log(`Highlighting subgrid for cell at row ${row}, col ${col}`);
  removeSubgridHighlight(); // Remove any existing highlight
  const subgridCells = getSubgridCells(row, col); // Get the cells of the subgrid
  console.log(`Subgrid cells:`, subgridCells); // Log the cells to check
  subgridCells.forEach((cell) => {
    console.log("Applying highlight to cell:", cell); // Log each cell being highlighted
    cell.classList.add("subgrid-highlight"); // Add the highlight class
  });
}

// Function to remove subgrid highlight from all cells
function removeSubgridHighlight() {
  console.log("Removing subgrid highlight");
  document.querySelectorAll("input").forEach((cell) => {
    cell.classList.remove("subgrid-highlight"); // Remove highlight from all cells
  });
}

function getSubgridCells(row, col) {
  const startRow = Math.floor(row / 3) * 3; // Find the starting row of the subgrid
  const startCol = Math.floor(col / 3) * 3; // Find the starting column of the subgrid
  const subgridCells = [];

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      const cell = document.querySelector(
        `input[data-row="${i}"][data-col="${j}"]`
      );
      if (cell) {
        subgridCells.push(cell);
      }
    }
  }

  console.log(subgridCells); // Check if subgrid cells are selected correctly
  return subgridCells;
}

// Generate the Sudoku puzzle
function generateSudoku(difficulty) {
  const grid = createEmptyGrid();
  solveSudoku(grid);
  solutionGrid = JSON.parse(JSON.stringify(grid)); // Keep a copy of the solved grid
  removeNumbers(grid, difficulty);
  displayGrid(grid, true);
  document.getElementById("message").innerHTML = ""; // Clear any previous message
  saveProgress(grid); // Save the generated puzzle to local storage
}

// Check if the solution is correct
function checkSudoku() {
  const inputs = document.querySelectorAll("input");
  let isCorrect = true;

  inputs.forEach((input) => {
    const row = input.dataset.row;
    const col = input.dataset.col;
    const userValue = input.value ? parseInt(input.value) : 0;

    if (userValue !== solutionGrid[row][col]) {
      input.style.backgroundColor = "#f8d7da"; // Mark incorrect cells in red
      isCorrect = false;
    } else {
      input.style.backgroundColor = "#d4edda"; // Mark correct cells in green
    }
  });

  const messageElement = document.getElementById("message");
  messageElement.innerHTML = isCorrect
    ? "Congratulations! You have solved the Sudoku correctly!"
    : "Some numbers are incorrect. Please try again!";
  messageElement.style.color = isCorrect ? "green" : "red";

  if (isCorrect) {
    completedPuzzles++;
    localStorage.setItem("completedCount", completedPuzzles); // Save updated count
    document.getElementById("completedCount").innerText = completedPuzzles;
  }
}

// Function to print the Sudoku puzzle
function printSudoku() {
  window.print();
}

// Function to reset the grid (clear user inputs)
function resetSudoku() {
  const inputs = document.querySelectorAll("input:not([readonly])");
  inputs.forEach((input) => {
    input.value = "";
    input.style.backgroundColor = "white";
  });
  document.getElementById("message").innerHTML = "";
}

function addRealTimeValidation() {
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      const row = input.dataset.row;
      const col = input.dataset.col;
      console.log(`Focused on row: ${row}, col: ${col}`); // Log the focus event
      highlightSubgrid(row, col); // Highlight the subgrid when the input is focused
    });
    input.addEventListener("blur", () => {
      console.log("Removing subgrid highlight"); // Log the blur event
      removeSubgridHighlight(); // Remove highlight when focus is lost
    });
  });
}

// Save the current puzzle to local storage
function saveProgress(grid) {
  localStorage.setItem("currentPuzzle", JSON.stringify(grid));
}

// Load saved puzzle from local storage
function loadProgress() {
  const savedPuzzle = localStorage.getItem("currentPuzzle");
  if (savedPuzzle) {
    const grid = JSON.parse(savedPuzzle);
    displayGrid(grid, true); // Display the saved grid
  } else {
    alert("No saved progress found!");
  }
}

// Add event listeners for buttons
document.addEventListener("DOMContentLoaded", function () {
  // Event listeners for difficulty buttons
  document.getElementById("generateEasy").addEventListener("click", () => {
    generateSudoku("easy");
  });

  document.getElementById("generateMedium").addEventListener("click", () => {
    generateSudoku("medium");
  });

  document.getElementById("generateHard").addEventListener("click", () => {
    generateSudoku("hard");
  });

  // Event listener for checking solution
  document
    .getElementById("checkSolution")
    .addEventListener("click", checkSudoku);

  // Event listener for resetting the grid
  document.getElementById("resetGrid").addEventListener("click", resetSudoku);

  // Event listener for printing the puzzle
  document.getElementById("printPuzzle").addEventListener("click", printSudoku);

  // Load completed puzzles count on page load
  loadCompletedCount();
});

// Load completed puzzles count on page load
loadCompletedCount();

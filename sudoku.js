let solutionGrid = [];

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
  let attempts = difficulty === "easy" ? 40 : difficulty === "medium" ? 50 : 60;
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (grid[row][col] === 0) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    grid[row][col] = 0;
    attempts--;
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

  addRealTimeValidation(); // Add real-time validation
}

// Generate the Sudoku puzzle
function generateSudoku(difficulty) {
  const grid = createEmptyGrid();
  solveSudoku(grid);
  solutionGrid = JSON.parse(JSON.stringify(grid)); // Keep a copy of the solved grid
  removeNumbers(grid, difficulty);
  displayGrid(grid, true);
  document.getElementById("message").innerHTML = ""; // Clear any previous message
}

// Check if the solution is correct
function checkSudoku() {
  const inputs = document.getElementsByTagName("input");
  let isCorrect = true;

  for (let i = 0; i < inputs.length; i++) {
    const row = inputs[i].dataset.row;
    const col = inputs[i].dataset.col;
    const userValue = inputs[i].value ? parseInt(inputs[i].value) : 0;

    if (userValue !== solutionGrid[row][col]) {
      inputs[i].style.backgroundColor = "#f8d7da"; // Mark incorrect cells in red
      isCorrect = false;
    } else {
      inputs[i].style.backgroundColor = "#d4edda"; // Mark correct cells in green
    }
  }

  const messageElement = document.getElementById("message");
  if (isCorrect) {
    messageElement.innerHTML =
      "Congratulations! You have solved the Sudoku correctly!";
    messageElement.style.color = "green";
  } else {
    messageElement.innerHTML = "Some numbers are incorrect. Please try again!";
    messageElement.style.color = "red";
  }
}

// Function to print the Sudoku puzzle
function printSudoku() {
  window.print();
}

// Function to reset the grid (clear user inputs)
function resetSudoku() {
  const inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].readOnly) {
      inputs[i].value = ""; // Clear only the user inputs
      inputs[i].style.backgroundColor = "white"; // Reset background color
    }
  }
  document.getElementById("message").innerHTML = ""; // Clear any message
}

// Function to check real-time mistakes
function addRealTimeValidation() {
  const inputs = document.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function () {
      const row = inputs[i].dataset.row;
      const col = inputs[i].dataset.col;
      const userValue = inputs[i].value ? parseInt(inputs[i].value) : 0;

      // Compare user input with the correct solution
      if (userValue !== 0 && userValue !== solutionGrid[row][col]) {
        inputs[i].style.backgroundColor = "#f8d7da"; // Mark incorrect cells in red
      } else {
        inputs[i].style.backgroundColor = "white"; // Reset background if correct
      }
    });
  }
}

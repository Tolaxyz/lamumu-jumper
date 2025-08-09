const character = document.getElementById("character");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
const startBtn = document.getElementById("startBtn");
const gameOverText = document.getElementById("gameOverText");
const restartBtn = document.getElementById("restartBtn");

let isJumping = false;
let isPaused = false;
let isGameStarted = false;
let score = 0;
let obstacleLeft = 1000;
let animationFrameId = null;

// Jump logic
function jump() {
  if (isJumping || isPaused || !isGameStarted) return;
  isJumping = true;
  let position = 0;

  const upInterval = setInterval(() => {
    if (isPaused) return;
    if (position >= 150) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (isPaused) return;
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 5;
          character.style.bottom = position + "px";
        }
      }, 20);
    } else {
      position += 5;
      character.style.bottom = position + "px";
    }
  }, 20);
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

// Start game button
startBtn.addEventListener("click", () => {
  if (!isGameStarted) {
    isGameStarted = true;
    isPaused = false;
    score = 0;
    obstacleLeft = 1000;
    scoreDisplay.textContent = "Score: 0";
    gameOverText.classList.add("hidden");
    restartBtn.classList.add("hidden");
    pauseBtn.disabled = false;
    startBtn.style.display = "none";
    moveObstacle();
  }
});

// Pause/Resume button
pauseBtn.addEventListener("click", () => {
  if (!isGameStarted) return;

  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";

  if (!isPaused) {
    moveObstacle(); // Resume loop
  } else {
    cancelAnimationFrame(animationFrameId);
  }
});

// End game function
function endGame() {
  isPaused = true;
  isGameStarted = false;
  cancelAnimationFrame(animationFrameId);
  pauseBtn.disabled = true;
  gameOverText.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
}

// Obstacle movement
function moveObstacle() {
  if (isPaused || !isGameStarted) return;

  if (obstacleLeft < -60) {
    obstacleLeft = 1000;
    score++;
    scoreDisplay.textContent = "Score: " + score;
  } else {
    obstacleLeft -= 10;
  }

  obstacle.style.left = obstacleLeft + "px";

  // Collision detection
  const characterBottom = parseInt(window.getComputedStyle(character).bottom);
  if (obstacleLeft < 110 && obstacleLeft > 40 && characterBottom < 60) {
    endGame();
  } else {
    animationFrameId = requestAnimationFrame(moveObstacle);
  }
}

//  Restart game button — PLACED OUTSIDE ANY FUNCTION
restartBtn.addEventListener("click", () => {
  // Reset game state
  isGameStarted = true;
  isPaused = false;
  score = 0;
  obstacleLeft = 1000;
  character.style.bottom = "0px";
  obstacle.style.left = "1000px";
  scoreDisplay.textContent = "Score: 0";

  // Hide UI elements
  gameOverText.classList.add("hidden");
  restartBtn.classList.add("hidden");
  pauseBtn.disabled = false;
  pauseBtn.textContent = "Pause";

  moveObstacle();
});

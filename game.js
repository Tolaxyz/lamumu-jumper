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

// Jump function
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

// Desktop: Space or ArrowUp
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

// Mobile: Tap character
character.addEventListener("click", jump);
character.addEventListener("touchstart", (e) => {
  e.preventDefault();
  jump();
});

// Start game
startBtn.addEventListener("click", () => {
  if (!isGameStarted) {
    isGameStarted = true;
    isPaused = false;
    score = 0;
    obstacleLeft = window.innerWidth;
    scoreDisplay.textContent = "Score: 0";
    gameOverText.classList.add("hidden");
    restartBtn.classList.add("hidden");
    pauseBtn.disabled = false;
    startBtn.style.display = "none";
    moveObstacle();
  }
});

// Pause / Resume
pauseBtn.addEventListener("click", () => {
  if (!isGameStarted) return;
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";

  if (!isPaused) {
    moveObstacle();
  } else {
    cancelAnimationFrame(animationFrameId);
  }
});

// End game
function endGame() {
  isPaused = true;
  isGameStarted = false;
  cancelAnimationFrame(animationFrameId);
  pauseBtn.disabled = true;
  gameOverText.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
}

// Move obstacle
function moveObstacle() {
  if (isPaused || !isGameStarted) return;

  if (obstacleLeft < -obstacle.offsetWidth) {
    obstacleLeft = window.innerWidth;
    score++;
    scoreDisplay.textContent = "Score: " + score;
  } else {
    obstacleLeft -= Math.max(5, window.innerWidth / 200);
  }

  obstacle.style.left = obstacleLeft + "px";

  const characterBottom = parseInt(window.getComputedStyle(character).bottom);
  if (
    obstacleLeft < character.offsetLeft + character.offsetWidth - 20 &&
    obstacleLeft > character.offsetLeft &&
    characterBottom < 60
  ) {
    endGame();
  } else {
    animationFrameId = requestAnimationFrame(moveObstacle);
  }
}

// Restart game
restartBtn.addEventListener("click", () => {
  isGameStarted = true;
  isPaused = false;
  score = 0;
  obstacleLeft = window.innerWidth;
  character.style.bottom = "0px";
  obstacle.style.left = window.innerWidth + "px";
  scoreDisplay.textContent = "Score: 0";
  gameOverText.classList.add("hidden");
  restartBtn.classList.add("hidden");
  pauseBtn.disabled = false;
  pauseBtn.textContent = "Pause";
  moveObstacle();
});

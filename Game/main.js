let playerName = "";
let startTime = 0;
let gameInterval;
let monsters = [];
let traps = [];
let lives = 5;
let gameTime = 0;
let canvas;
let ctx;
let playerX = 150;
let playerY = 150;
let playerSpeed = 3;
let monsterSpeed = 1;
let monsterCount = 10;

let timerInterval;
let timerSeconds = 30;

const keysPressed = {};
document.addEventListener("keydown", function(event) {
  keysPressed[event.key] = true;
});
document.addEventListener("keyup", function(event) {
  delete keysPressed[event.key];
});

const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const resultsScreen = document.getElementById("results-screen");

function startGame() {
  playerName = document.getElementById("username").value;
  document.getElementById("player-name").textContent = playerName; // Обновляем имя игрока на экране
  loginScreen.style.display = "none";
  gameScreen.style.display = "block";
  startTime = Date.now();
  gameTime = 0;
  lives = 5;
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");
  gameInterval = setInterval(updateGame, 20);
  generateMonsters();
  generateTraps();
  startTimer();
}


function startTimer() { 
  document.getElementById("timer").textContent = timerSeconds;

  timerInterval = setInterval(function() {
    timerSeconds--; 
    document.getElementById("timer").textContent = timerSeconds;


    if (timerSeconds === 0) {
      generateMonsters();
      timerSeconds = 30;
    }
  }, 1000); 
}


function stopTimer() {
  clearInterval(timerInterval);
}

function updateGame() {
  clearCanvas();
  updateTime();
  updatePlayer(); 
  updateMonsters();
  updateTraps();
  drawPlayer(); 
  checkCollisions();
if (lives <= 0) {
  endGame();
}
}


function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function updateTime() {
  let currentTime = new Date();
  document.getElementById("current-time").textContent = currentTime.toLocaleTimeString();
  gameTime = Math.floor((currentTime.getTime() - startTime) / 1000);
  document.getElementById("game-time").textContent = formatTime(gameTime);
}


function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


function updatePlayer() {
if (keysPressed["ArrowUp"]) playerY -= playerSpeed;
if (keysPressed["ArrowDown"]) playerY += playerSpeed;
if (keysPressed["ArrowLeft"]) playerX -= playerSpeed;
if (keysPressed["ArrowRight"]) playerX += playerSpeed;

if (playerX < 0) playerX = 0;
if (playerY < 0) playerY = 0;
if (playerX > canvas.width - 20) playerX = canvas.width - 20;
if (playerY > canvas.height - 20) playerY = canvas.height - 20;
}


function updateMonsters() {
for (let i = 0; i < monsters.length; i++) {
  let monster = monsters[i];
  let dx = playerX - monster.x;
  let dy = playerY - monster.y;
  let angle = Math.atan2(dy, dx);
  monster.x += monsterSpeed * Math.cos(angle);
  monster.y += monsterSpeed * Math.sin(angle);


  if (monster.x < 0) monster.x = 0;
  if (monster.y < 0) monster.y = 0;
  if (monster.x > canvas.width - 20) monster.x = canvas.width - 20;
  if (monster.y > canvas.height - 20) monster.y = canvas.height - 20;

  ctx.fillStyle = "green"; 
  ctx.beginPath(); 
  ctx.arc(monster.x + 10, monster.y + 10, 20, 0, Math.PI * 2);
  ctx.fill(); 
}
}


function updateTraps() {
for (let i = 0; i < traps.length; i++) {
  let trap = traps[i];
  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.moveTo(trap.x + 20, trap.y);
  ctx.lineTo(trap.x + 28, trap.y + 36);
  ctx.lineTo(trap.x, trap.y + 14);
  ctx.lineTo(trap.x + 40, trap.y + 14);
  ctx.lineTo(trap.x + 12, trap.y + 36);
  ctx.closePath();
  ctx.fill();
}
}


function drawPlayer() {
ctx.fillStyle = "red";
ctx.fillRect(playerX, playerY, 40, 40); 
}


function checkCollisions() {

for (let i = 0; i < monsters.length; i++) {
  let monster = monsters[i];
  if (playerCollision(monster)) {
    lives--;
    document.getElementById("lives").textContent = lives;
    monsters.splice(i, 1);
  }
}

for (let i = 0; i < traps.length; i++) {
  let trap = traps[i];
  if (playerCollision(trap)) {
    lives--;
    document.getElementById("lives").textContent = lives;
    traps.splice(i, 1);
  }
}
}


function togglePause() {
if (gameInterval) {
  clearInterval(gameInterval);
  gameInterval = null; 
} else {
  gameInterval = setInterval(updateGame, 20); 
}
}


function endGame() {
  clearInterval(gameInterval);
  stopTimer();
  gameScreen.style.display = "none";
  resultsScreen.style.display = "block";
  document.getElementById("result-time").textContent = formatTime(gameTime);
  let monsterCount = monsters.length;
  let trapCount = traps.length;
  document.getElementById("result-monsters").textContent = monsterCount;
  document.getElementById("result-traps").textContent = trapCount;
  document.getElementById("result-lives").textContent = lives;
}


function restartGame() {
  clearInterval(gameInterval);
  gameScreen.style.display = "none";
  resultsScreen.style.display = "none";
  loginScreen.style.display = "block";
  document.getElementById("username").value = "";
  monsters = [];
  traps = [];
  lives = 5;
  gameTime = 0;
  clearCanvas();
}


function generateMonsters() {
for (let i = 0; i < monsterCount; i++) {
  let monsterX = Math.floor(Math.random() * canvas.width);
  let monsterY = Math.floor(Math.random() * canvas.height);
  monsters.push({ x: monsterX, y: monsterY });
}
}


function generateTraps() {
for (let i = 0; i < 15; i++) {
  let trapX = Math.floor(Math.random() * canvas.width);
  let trapY = Math.floor(Math.random() * canvas.height);
  traps.push({ x: trapX, y: trapY });
}
}


function playerCollision(object) {
return (playerX < object.x + 40 &&
        playerX + 40 > object.x &&
        playerY < object.y + 40 &&
        playerY + 40 > object.y);
}
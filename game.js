const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const playerStartX = 50;
const playerStartY = 100;
const playerWidth = 50;
const playerHeight = 50;
const maxVelocityY = 10;
const gravity = 0.5;

let leftArrowPressed = false;
let rightArrowPressed = false;

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 7;
    this.jumpStrength = 20;
  }

  moveLeft() {
    this.velocityX = -this.speed;
  }

  moveRight() {
    this.velocityX = this.speed;
  }

  stop() {
    this.velocityX = 0;
  }

  jump() {
    if (this.canJump()) {
      this.velocityY = -this.jumpStrength;
    }
  }

  canJump() {
    for (let platform of platforms) {
      if (
        this.x + this.width >= platform.x &&
        this.x <= platform.x + platform.width &&
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + 5
      ) {
        return true;
      }
    }
    return false;
  }

  update() {
    // Apply gravity
    this.velocityY += gravity;

    // Clamp the velocity
    this.velocityX = clamp(this.velocityX, -this.speed, +this.speed);
    this.velocityY = clamp(this.velocityY, -maxVelocityY, +maxVelocityY);

    // Move the player
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check for collisions
    testCollisions(this, platforms);
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collidesWith(obj) {
    let left = this.x;
    let right = this.x + this.width;
    let top = this.y;
    let bottom = this.y + this.height;

    let objLeft = obj.x;
    let objRight = obj.x + obj.width;
    let objTop = obj.y;
    let objBottom = obj.y + obj.height;

    return (
      objLeft < right &&
      objRight > left &&
      objTop < bottom &&
      objBottom > top
    );
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let player = new Player(playerStartX, playerStartY, playerWidth, playerHeight);

let platformHeight = 20;
let platforms = [
  new Platform(0, canvas.height - platformHeight, canvas.width, platformHeight),
  new Platform(50, 200, 100, platformHeight),
  new Platform(300, 300, 150, platformHeight),
  new Platform(200, 150, 50, platformHeight),
];

function testCollisions(player, platforms) {
  for (let platform of platforms) {
    if (platform.collidesWith(player)) {
      let playerBottom = player.y + player.height;
      let platformTop = platform.y;
      let depth = playerBottom - platformTop;
      player.y -= depth;

      if (player.velocityY > 0) {
        player.velocityY = 0;
      }
    }
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function gameLoop() {
  // Update the game state
  player.update();

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the platforms
  for (let platform of platforms) {
    platform.draw();
  }

  // Draw the player
  player.draw();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
  if (event.code === 'ArrowLeft') {
    leftArrowPressed = true;
    player.moveLeft();
  }
  if (event.code === 'ArrowRight') {
    rightArrowPressed = true;
    player.moveRight();
  }
  if (event.code === 'Space') {
    player.jump();
  }
});

document.addEventListener('keyup', function(event) {
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
    leftArrowPressed = false;
    rightArrowPressed = false;
    player.stop();
  }
});

gameLoop();

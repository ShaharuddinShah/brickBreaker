//based on this codes make the ball round

let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 300;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
};

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

//ball start position
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
};

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as the game goes
let blockMaxRows = 10; //limit how many rows of blocks
let blockCount = 0;

//starting block corners
let blockX = 15;
let blockY = 45;

//score
let score = 0;

let gameOver = false;

window.onload = function () {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d'); //used for drawing on the board

  //draw initial player, The Paddle
  context.fillStyle = 'lightgreen';
  context.fillRect(player.x, player.y, player.width, player.height);
  // event listener listening to keypress or a keydown
  requestAnimationFrame(update);
  document.addEventListener('keydown', movePlayer);

  //crete blocks
  createBlocks();
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //player
  context.fillStyle = 'lightgreen';
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = 'white';
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  //bounce of the walls
  if (ball.y <= 0) {
    //if ball touches top canvas
    ball.velocityY *= -1;
  } else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    //if ball touches left or right of canvas
    ball.velocityX *= -1; //reverse direction
  } else if (ball.y + ball.height >= boardHeight) {
    //if ball touches bottom of the canvas
    //game over
    context.font = '20px sans-serif';
    context.fillText("Game Over: Press 'Space bar' to Restart", 80, 400);
    gameOver = true;
  }

  //bounce the ball off player paddle
  if (topCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityY *= -1; // flip y direction up or down
  } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1; // flip x direction up or down
  }

  //blocks
  context.fillStyle = 'skyblue';
  for (let i = 0; i < blockArray.length; i++) {
    let block = blockArray[i];
    if (!block.break) {
      if (topCollision(ball, block) || bottomCollision(ball, block)) {
        block.break = true;
        ball.velocityY *= -1; // flip y direction up or down
        blockCount -= 1;
        score += 100;
      } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
        block.break = true;
        ball.velocityX *= -1; // flip x direction left o right
        blockCount = 1;
        score += 100;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  }

  //next level
  if (blockCount == 0) {
    score += 100 * blockRows * blockColumns; //bonus points
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    createBlocks();
  }

  //draw the score onto the canvas
  context.font = '20px sans-serif';
  context.fillText('Score: ' + score, 10, 25);
}

function outOfBound(xPosition) {
  return xPosition < 0 || xPosition + playerWidth > boardWidth;
}

///////////////////////////////////////////////
//code to make the ball round
// function update() {
//   requestAnimationFrame(update);
//   context.clearRect(0, 0, board.width, board.height);

//   //player
//   context.fillStyle = 'lightgreen';
//   context.fillRect(player.x, player.y, player.width, player.height);

//   //ball
//   context.fillStyle = 'white';
//   context.beginPath();
//   context.arc(
//     ball.x + ball.width / 2,
//     ball.y + ball.height / 2,
//     ball.width / 2,
//     0,
//     Math.PI * 2
//   );
//   context.fill();

//   ball.x += ball.velocityX;
//   ball.y += ball.velocityY;

// Check for collisions and update ball velocity if necessary
//   if (ball.x + ball.width > boardWidth || ball.x < 0) {
//     ball.velocityX = -ball.velocityX;
//   }
//   if (ball.y + ball.height > boardHeight || ball.y < 0) {
//     ball.velocityY = -ball.velocityY;
//   }
// }

// function to control player paddle left and right
function movePlayer(e) {
  if (gameOver) {
    if (e.code == 'Space') {
      resetGame();
    }
  }

  if (e.code == 'ArrowLeft') {
    //player.x -= player.velocityX;
    //comment above is the initial code to draw the paddle
    //code below is to calculate the paddle and the board so the paddle will not cross the border
    let nextPlayerX = player.x - player.velocityX;
    if (!outOfBound(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  } else if (e.code == 'ArrowRight') {
    //player.x += player.velocityX;
    //comment above is the initial code to draw the paddle
    //code below is to calculate the paddle and the board so the paddle will not cross the border
    let nextPlayerX = player.x + player.velocityX;
    if (!outOfBound(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) {
  //a is above b (ball is above block)
  return detectCollision(ball, block) && ball.y + ball.height >= block.y;
}

function bottomCollision(ball, block) {
  //a is above b (ball is below block)
  return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
  //a is left of b (ball is left of block)
  return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
  //a is right of b (ball is right of block)
  return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

function createBlocks() {
  blockArray = [];
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 10,
        y: blockY + r * blockHeight + r * 10,
        width: blockWidth,
        height: blockHeight,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

function resetGame() {
  gameOver = false;
  player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
  };
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
  };
  blockArray = [];
  blockRows = 3;
  score = 0;
  createBlocks();
}

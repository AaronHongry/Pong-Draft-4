//Associates Canvas with JavaScript
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

//-------------------------------------Variables-----------------------------------------//
//Ball Object
var ball = {
  x : canvas.width / 2,
  y : canvas.height / 2,
  radius : 10,
  speedX : -5,
  speedY : 2
};

//User Paddle Object
var userPaddle = {
  x : 80,
  y : canvas.height / 3,
  width : 10,
  height : 80
};

//Computer Paddle Object
var compPaddle = {
  x : 720,
  y : canvas.height / 3,
  width : 10,
  height : 80
};

//Key Press Functions
var downKeyPress = false;
var upKeyPress = false;

//Distance Variables
var distanceBetween = Math.abs(userPaddle.x - compPaddle.x);
var distance = 0;
//---------------------------------------Functions---------------------------------------//
//Ball Functions
//Creates the ball
function drawBall() {
  c.beginPath();
  c.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  c.fillStyle = "#FFFFFF";
  c.fill();
  c.closePath();
}
//Movement of the Ball
function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

//User Paddle Functions
//Creates the user Paddle
function drawUserPaddle() {
  c.beginPath();
  c.rect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height);
  c.fillStyle = "#FFFFFF";
  c.fill();
  c.closePath();
}

//Collision Functions
//Ball with the Wall
function ballWallCollision() {
  if(ball.x + ball.speedX >= canvas.width - ball.radius || ball.x + ball.speedX <= 0 + ball.radius) {
    ball.speedX = -ball.speedX;
  }
  if(ball.y + ball.speedY >= canvas.height - ball.radius || ball.y + ball.speedY <= 0 + ball.radius) {
    ball.speedY = -ball.speedY;
  }
}
//Ball with the User
function userPaddleWithBall() {
  if(Math.abs(ball.x - userPaddle.x - ball.radius) < Math.abs(ball.speedX)) {
    if(ball.y > userPaddle.y && ball.y < userPaddle.y + userPaddle.height) {
      ball.speedX = -ball.speedX;
    }
  }
}
// Ball with the comp
function compPaddleWithBall() {
  if(Math.abs(ball.x - compPaddle.x + ball.radius) < Math.abs(ball.speedX)) {
    if(ball.y > compPaddle.y && ball.y < compPaddle.y + compPaddle.height) {
      ball.speedX = -ball.speedX;
    }
  }
}

//Key Press Functions
//Up and Down Key Presses
function keyDownHandler(position) {
  if(position.key == "Down" || position.key == "ArrowDown") {
    downKeyPress = true;
  }
  else if(position.key == "Up" || position.key == "ArrowUp") {
    upKeyPress = true;
  }
}
function keyUpHandler(position) {
  if(position.key == "Down" || position.key == "ArrowDown") {
    downKeyPress = false;
  }
  else if(position.key == "Up" || position.key == "ArrowUp") {
    upKeyPress = false;
  }
}
//Movement of Paddle + Wall Collision
function paddleOnWall() {
  if(downKeyPress && userPaddle.y < canvas.height - userPaddle.height) {
    userPaddle.y += 4;
  }
  else if(upKeyPress && userPaddle.y > 0) {
    userPaddle.y -= 4;
  }
}

//Draw Computer Paddle
function drawCompPaddle() {
  c.beginPath();
  c.rect(compPaddle.x, compPaddle.y, compPaddle.width, compPaddle.height);
  c.fillStyle = "#FFFFFF";
  c.fill();
  c.closePath();
}

//Distance Calculator
function calcDistance() {
  //Declare variables
  var time = 0;
  var totalTravel = 0;
  var final = 0;
  //First two if checks for collision
  if(Math.abs(ball.x - userPaddle.x - ball.radius) < Math.abs(ball.speedX)) {
    if(ball.y > userPaddle.y && ball.y < userPaddle.y + userPaddle.height) {
      //Solves for the time, the total distance it travels vertically, and to find the position it ends up
      time = distanceBetween / ball.speedX;
      totalTravel = time * ball.speedY;
      final = totalTravel + ball.y;
      //If the final position is above the canvas
      if(final < 0) {
        distance = Math.abs(totalTravel + ball.y) - (compPaddle.height / 2);
        console.log(final);
        console.log(distance);
        //if the final position is going to be less than 0, move the paddle against it
        if(distance < 0) {
          distance = 1;
        }
      }
      //else if the final position is below the canvas
      else if(final > canvas.height) {
        distance = canvas.height - (totalTravel - (canvas.height - ball.y)) - (compPaddle.height/2);
        if(distance > canvas.height) {
          distance = canvas.height - compPaddle.height;
        }
      }
      else {
        if(ball.speedY > 0) {
          distance = final - (compPaddle.height / 2);
          if(distance > canvas.height) {
            distance = canvas.height - compPaddle.height;
          }
        }
        else{
          console.log(ball.speedY);
          distance = final - (compPaddle.height / 2);
          if(distance < 0) {
            distance = 0;
          }
        }
      }
    }
  }
}

function moveComp() {
  if(distance != 0) {
    if(distance > compPaddle.y) {
      compPaddle.y += 9;
    }
    if(distance < compPaddle.y){
      compPaddle.y -= 9;
    }
  }
}
//-----------------------------------Draw-------------------------------------------//
function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  moveComp();
  drawBall();
  drawUserPaddle();
  ballWallCollision();
  paddleOnWall();
  moveBall();
  userPaddleWithBall();
  drawCompPaddle();
  compPaddleWithBall();
  calcDistance();
}
//Execution
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var interval = setInterval(draw, 10);

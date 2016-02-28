// VARIABLES //
///////////////

// CANVAS //
var canvas = document.getElementById("main-canvas"),
  ctx = canvas.getContext("2d");

// BALL VARS //
var xb = canvas.width / 2, // x-axis
  yb = canvas.height - 30, // y-axis
  br = 8, // radius
  dxb = 1, // speed x-axis
  dyb = -1; // speed y-axis

// PADDLE VARS //
var phl = 10,
  pwl = 40,
  pxl = (canvas.width - pwl) / 2 - 20;

var phr = 10,
  pwr = 40,
  pxr = (canvas.width - pwr) / 2 + 20;

// BRICK VARS //
var brCount = 4,
  bcCount = 7,
  bw = 60,
  bh = 20,
  bp = 2,
  boTop = 30,
  boLeft = 24,
  bricks = [];

for (c = 0; c < bcCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

// SCORE VARS //
var score = 0;

// PAUSE VARS //
var pause = false;

// CONTROLS //
var right = false,
  left = false;

// SOUND FX //
var bounce = new Audio("bounce.wav"),
  music = new Audio("music.mp3"),
  paused = new Audio("pause.wav"),
  unpaused = new Audio("unpause.wav"),
  smash = new Audio("brick.wav"),
  contact = new Audio("contact.wav"),
  sound = true;

///////////////////
// END VARIABLES //

// EVENT FUNCTIONS //
/////////////////////

$(document).keydown(function() {
  keyDown(event);
});

$(document).keyup(function() {
  keyUp(event);
});

function keyDown(e) {
  if (e.keyCode == 39) {
    right = true;
  } else if (e.keyCode == 37) {
    left = true;
  } else if (e.keyCode == 32) {
    togglePause();
  } else if (e.keyCode == 83) {
    toggleSound();
  }
}

function keyUp(e) {
  if (e.keyCode == 39) {
    right = false;
  } else if (e.keyCode == 37) {
    left = false;
  }
}


$('#restart').click(function() {
  document.location.reload();
});

$("#sound").click(function() {
  toggleSound();
});

$('#pause').click(function() {
  togglePause();
});

/////////////////////////
// END EVENT FUNCTIONS //

//  FUNCTIONS //
////////////////

function toggleSound() {
  var d = "btn-danger",
    s = "btn-success";

  if (sound) {
    sound = false;
    $("#sound").addClass(d);
    $("#sound").removeClass(s);
    music.pause();
  } else {
    sound = true;
    $("#sound").addClass(s);
    $("#sound").removeClass(d);
    if (!pause) {
      music.play();
    }
  }
}

function togglePause() {
  var d = "btn-danger",
    s = "btn-warning";

  pause = pause ? false : true;
  if (pause) {
    $("#pause").addClass(d);
    $("#pause").removeClass(s);
    if (sound) {
      paused.play();
      music.pause();
    }
  } else {
    $("#pause").addClass(s);
    $("#pause").removeClass(d);
    if (sound) {
      unpaused.play();
      music.play();
    }
  }
}

function ball() {
  ctx.beginPath();
  ctx.arc(xb, yb, br, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function paddleL() {
  ctx.beginPath();
  ctx.rect(pxl, canvas.height - phl, pwl, phl);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function paddleR() {
  ctx.beginPath();
  ctx.rect(pxr, canvas.height - phr, pwr, phr);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function brick() {
  var brickX, brickY;
  var gradient = ctx.createLinearGradient(0, 0, 170, 300);
  gradient.addColorStop(0, "#4096ee");
  gradient.addColorStop(1, "#7abcff");

  for (c = 0; c < bcCount; c++) {
    for (r = 0; r < brCount; r++) {
      if (bricks[c][r].status == 1) {
        brickX = (c * (bw + bp)) + boLeft;
        brickY = (r * (bh + bp)) + boTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, bw, bh);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collision() {
  for (c = 0; c < bcCount; c++) {
    for (r = 0; r < brCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (xb > b.x && xb < b.x + bw && yb > b.y && yb < b.y + bh) {
          if (sound) {
            smash.play();
          }
          // Reverse y-axis direction //
          dyb = -dyb;
          // Remove block //
          b.status = 0;
          // Increase score //
          score++;
          // If no more blocks, you win! //
          if (score == brCount * bcCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function points() {
  ctx.font = "14px Helvetica";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function gameScreen() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,.25)";
  ctx.fill();
  ctx.closePath();
}

function gamePaused() {
  ctx.font = "20px Helvetica";
  ctx.fillStyle = "#333";
  ctx.fillText("Paused", canvas.width / 2 - 35, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball();
  paddleL();
  paddleR();
  brick();
  collision();
  points();

  // CHECKS HORIZONTAL / VERTICAL PLACEMENT //
  if (!pause) {
    if (xb + dxb > canvas.width - br || xb + dxb < br) {
      dxb = -dxb;
      if (sound) {
        bounce.play();
      }
    }
    if (yb + dyb < br) {
      dyb = -dyb;
      if (sound) {
        bounce.play();
      }
    } else if (yb + dyb > canvas.height - br) {
      if (yb + dyb < br) {
        dyb = -dyb;

      } else if (yb + dyb > canvas.height - br) {
        if (xb > pxl && xb < pxl + pwl) {
          if (sound) {
            contact.play();
          }
          dyb = -dyb;
          dxb += dxb < 3 ? -1 : 0;

        } else if (xb > pxr && xb < pxr + pwr) {
          if (sound) {
            contact.play();
          }
          dyb = -dyb;
          dxb += dxb < 3 ? 1 : 0;

        } else {
          console.log("Game Over");
        }
      }
    }

    // PADDLE MOVEMENT //
    if (right && pxl < canvas.width - (pwl + pwr)) {
      pxl += 5;
      pxr += 5;
    } else if (left && pxl > 0) {
      pxl -= 5;
      pxr -= 5;
    }

    xb += dxb;
    yb += dyb;
  } else {
    gamePaused();
    gameScreen();
  }
}

function init() {
  music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  music.play();
}

///////////////////
// END FUNCTIONS //

// INIT //
//////////

init();

setInterval(draw, 10);

//////////////
// END INIT //

const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 40;
const EMPTY = "rgb(33, 32, 51)";

// Draw a Square



function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ,y * SQ, SQ, SQ);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * SQ,y * SQ, SQ, SQ);
}

// Timestamp: 52:12
// Link: https://www.youtube.com/watch?v=HEsAr2Yt2do

// Create the board

let board = [];
for (r = 0; r<ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = EMPTY;
    }
}

// Draw the board
function drawBoard(){
    for (r = 0; r<ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// Pieces and colors

const PIECES = [
    [Z, "#f00000"],
    [S, "#00f000"],
    [T, "#a000f0"],
    [O, "#f0f000"],
    [L, "#f0a000"],
    [J, "#0000f0"],
    [I, "#00f0f0"]
];

let hold = "";
let random1 = [];

var bgm = document.getElementById("bgmusic");
    bgm.volume = 0.2;
    bgm.play();
var clrL = document.getElementById("clearL");
var lUp = document.getElementById("lvlUp");
var tetrS = document.getElementById("trsC");

var myAudio = document.getElementById("bgmusic");
var isPlaying = true;

function togglePlay() {
  if (isPlaying) {
    myAudio.pause()
  } else {
    myAudio.play();
  }
};
myAudio.onplaying = function() {
  isPlaying = true;
};
myAudio.onpause = function() {
  isPlaying = false;
};


//Refill block array
function arrayFill(){
    if (random1.length == 0){
        random1 = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];}
    return random1
}

function spliceArray(){
    let t = arrayFill();
    let r = random1.splice(Math.floor(Math.random() * random1.length),1);
    return r;
}

function queueBlock(){
    while (queue.length != 4){
        queue.push(spliceArray());
    }
    // console.log(queue);
    let away = queue.shift();
    // console.log(queue);
    let stay = queue[0];
    return [away, stay];
}

function fillImage(num){
    document.getElementById("nextBlock").style.backgroundImage="url("+num+".png)";
    document.getElementById("nextBlock").style.backgroundSize="cover";
    document.getElementById("nextBlock").style.width="150px";
    document.getElementById("nextBlock").style.height="150px";
}


// function subBlock(){
//     let grab = spliceArray();
//     let image = grab +".png";
//     // console.log(image);
//     // console.log(grab);
//     fillImage(grab);
//     return new Piece(PIECES[grab][0], PIECES[grab][1]);
// }

// function startBlock(){
//     let split = spliceArray();
//     return new Piece(PIECES[split][0], PIECES[split][1]);
// }

function mainBlock(){
    let opt1 = queueBlock();
    let op2 = opt1[1];
    let op3 = opt1[0];
    // console.log(ja);
    fillImage(op2);
    // console.log(nee);
    return new Piece(PIECES[op3][0], PIECES[op3][1]);
}

let queue = [];
let p = mainBlock();

// The object piece
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // Starting from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // Coordinates for control
    this.x = 3;
    this.y = -2;
}
// score
var score = 0;
var tetris = 0;
var lineCleared = 0;
var level = 1;
var currentHI = 0;
var HIscore = localStorage.getItem("highScore");
document.getElementById("scoreHTML").innerHTML = score;
document.getElementById("tetrisHTML").innerHTML = tetris;
document.getElementById("levelHTML").innerHTML = level;

function HIsys(){
    console.log(HIscore);
    if (HIscore == null){
        HIscore = score;
    }else if(HIscore >= score){
        document.getElementById("HI-HTML").innerHTML = HIscore;
    }else{
        document.getElementById("HI-HTML").innerHTML = score;
        currentHI = score;
    }
    
}
// function levelUp(){
//     let spd = 700;
//     let lvlCalc = (100 * level);
//     let formLvl = 0;
//     if (lvlCalc <= 600){
//         let formLvl = spd - lvlCalc;
//     }else{
//         let formLvl = 1;
//     }
//     return formLvl;
// }


Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function(){
    this.fill(this.color);
}

Piece.prototype.unDraw = function(){
    this.fill(EMPTY);
}

// Move down

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        if (level >= 2){
            this.y = Math.floor(this.y + (level * 0.2));
        }
        this.draw();
    }else{
        // Lock the piece and generate a new one
        this.lock();
        p = mainBlock();
    }
    
}

//Drop down

Piece.prototype.dropDown = function(){
    // if(!this.collision(0,1,this.activeTetromino)){
    //     this.unDraw();
    //     this.y++;
    //     this.draw();
    // }else{
    //     // Lock the piece and generate a new one
    //     this.lock();
    //     p = mainBlock();
    // }
    while(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
    this.lock();
    p = mainBlock();
}

// Hold a piece WIP!!!

// var holdPiece = '';
// var holdPiece2 = '';
// var canHold = "true";
// function pieceHold(){
//     if (holdPiece === '' && canHold){
//         holdPiece = p;
//         console.log(p);
//         p.unDraw();
//         canHold = "false";
//         p = mainBlock();
//     }else{
//         p.unDraw();
//         if (holdPiece != ''){
//             holdPiece2 = p;
//         }
//         p = holdPiece;
//         let show = holdPiece.tetrominoN;
//         console.log(show);
//         currentHold(show);
//         p.draw();
//         if (holdPiece2 != ''){
//             holdPiece = holdPiece2;
//             let show = holdPiece.tetrominoN;
//             console.log(show);
//             currentHold(show);
//         }

//     }
//     canHold = "true";
// }

function currentHold(sum){
        document.getElementById("holdBlock").style.backgroundImage="url("+sum+".png)";
        document.getElementById("holdBlock").style.backgroundSize="cover";
        document.getElementById("holdBlock").style.width="150px";
        document.getElementById("holdBlock").style.height="150px";
}

// Move right

Piece.prototype.moveRight = function(){
    if(!this.collision(1, 0, this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
   
}

// Move left

Piece.prototype.moveLeft = function(){
    if(!this.collision(-1, 0, this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
    
}

// Rotate

Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // Right wall
            kick = -1;
        }else{
            // Left wall
            kick = 1;
        }
    }

    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

function reloadGame(){
     if (gameOver = true){
         location.reload();
     }   
}


Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                document.getElementById("gameOverBG").style.opacity = 1;
                bgm.pause();
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            var plcB = document.getElementById("placeB");
            plcB.play();
            board[this.y+r][this.x+c] = this.color;
        }
    }

    
    // remove full rows
    let count = 0;

    for(r=0; r < ROW; r++){
        let isRowFull = true;
        for (c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != EMPTY);
        }
        if(isRowFull){
            count++;
            clrL.play();
            // Move all rows above down
            for( y = r; y > 1; y--){
                for (c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // top row board [0][..] has no row above
            for (c = 0; c < COL; c++){
                board[0][c] = EMPTY;
            }
        }
    }

    // Increase Score
     if (count < 4){
         score+=(count * 10);
         lineCleared+=count;
         count=0;
     }else{
         tetris++;
         showTetris();
         tetrS.play();
         score+=100;
         count=0;
         lineCleared+=4;
     }

    drawBoard();
}

function showTetris(){
    // let g = 0;
    // while (g != 12){
    //     document.getElementById("huTetris").style.opacity = 1;
    //     g++;
    // }
    // document.getElementById("huTetris").style.opacity = 0;
    // g = 0;
    document.getElementById("huTetris").style.opacity = 1;
    setTimeout(function(){document.getElementById("huTetris").style.opacity =0;}, 2000);
    
}

function showLvlUp(){
    // let m = 0;
    // while (m != 12){
    //     document.getElementById("huLvlUp").style.opacity = 1;
    //     m++;
    // }
    // document.getElementById("huLvlUp").style.opacity = 0;
    // m = 0;
    document.getElementById("huLvlUp").style.opacity = 1;
    setTimeout(function(){document.getElementById("huLvlUp").style.opacity =0;}, 2000);
}

// collision
Piece.prototype.collision = function(x, y, piece){
    for (r = 0; r<piece.length; r++){
        for(c = 0; c < piece.length; c++){
           if(!piece[r][c]){
               continue;
           }
           let newX=this.x + c + x ;
           let newY=this.y + r + y ;

           if(newX < 0 || newX >= COL ||  newY >= ROW){
                return true;
           }
        //    Skip newY < 0, no board[-1] exists.
           if (newY < 0){
               continue;
           }
        //    Check for locked piece
            if (board[newY][newX] != EMPTY){
                return true;
            }
        }
    }
    return false;
}

// Control the piece

document.addEventListener("keydown", CONTROL);
function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        let dropStart = Date.now();
        let gameOver = false;

        function drop(){
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > 700){
                p.moveDown();
                dropStart = Date.now();
            }
        }
        if (!gameOver){
            requestAnimationFrame(drop);
        }
    }else if(event.keyCode == 38){
        p.rotate();
        let dropStart = Date.now();
        let gameOver = false;

        function drop(){
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > 700){
                p.moveDown();
                dropStart = Date.now();
            }
            if (!gameOver){
                requestAnimationFrame(drop);
            }
    
}
    }else if(event.keyCode == 39){
        p.moveRight();
        let dropStart = Date.now();
        let gameOver = false;

        function drop(){
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > 700){
                p.moveDown();
                dropStart = Date.now();
            }
            if (!gameOver){
                requestAnimationFrame(drop);
            }
        }
    }else if(event.keyCode == 40){
        p.moveDown();
        let dropStart = Date.now() +100;
        let gameOver = false;

        function drop(){
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > 700){
                p.moveDown();
                dropStart = Date.now();
            }
            if (!gameOver){
                requestAnimationFrame(drop);
            }
        }
    }else if(event.keyCode == 32){
        p.dropDown();
        let dropStart = Date.now() +3000;
        let gameOver = false;
    }else if(event.keyCode == 16){
        pieceHold();
        let dropStart = Date.now() +100;
        let gameOver = false;
    }
}

// Drop piece every sec
let dropStart = Date.now();
let gameOver = false;

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 700){
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver){
        requestAnimationFrame(drop);
        document.getElementById("scoreHTML").innerHTML = score;
        document.getElementById("tetrisHTML").innerHTML = tetris;
        document.getElementById("levelHTML").innerHTML = level;
        document.getElementById("endHTML").innerHTML = score;
        HIsys();
        localStorage.setItem("highScore", currentHI);
        if(lineCleared >= 10){
            level++;
            showLvlUp();
            lUp.play();
            lineCleared =0;
        }}
    // }else{
    //     // location.reload();
    // }
    
}

drop();
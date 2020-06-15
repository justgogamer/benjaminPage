const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 40;
const EMPTY = "#26292B";

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
    [Z, "#E8423C"],
    [S, "#26FF3F"],
    [T, "#BD1DF7"],
    [O, "yellow"],
    [L, "#FFAA0C"],
    [J, "#004AD6"],
    [I, "#3AD4FF"]
];

//Generate a piece

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length); //Numbers from 0 to 6
    return new Piece( PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

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

var score = 0;
document.getElementById("scoreHTML").innerHTML = score;

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
        this.draw();
    }else{
        // Lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
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


Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r=0; r < ROW; r++){
        let isRowFull = true;
        for (c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != EMPTY);
        }
        if(isRowFull){
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
            // Increase Score
             score += 10;
        }
    }
    drawBoard();
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
        if (!gameOver){
            requestAnimationFrame(drop);
        }
            
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
    }
    
}

drop();
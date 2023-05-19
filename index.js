const canvas = document.getElementById("gameField");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("resetBtn");
const scoreLabel = document.getElementById("scoreLabel");
const highScoreLabel = document.getElementById("highScoreLabel");
const snakeLengthLabel = document.getElementById("snakeLengthLabel");

let bonusSound = new Audio('./sounds/bonus.wav');
let loseSound = new Audio('./sounds/lose.wav');
let winSound = new Audio('./sounds/win.wav');

let score = 0;
let highScore = 0;
let gameSpeed = prompt("Enter game speed in miliseconds: ");
let gameStarted = false;

let block = {
    ofset: 2,
    size: 16,
    draw: function (color, body, length) {
        for (let i = 0; i < length; i++) {
            let posX = body[i].col * block.size;
            let posY = body[i].row * block.size;
            ctx.fillStyle = color;
            ctx.fillRect(posX + 1, posY + 1, block.size - block.ofset, block.size - block.ofset)

        }
    }
}

let gameCanvas = {
    widthInBlocks: canvas.width / block.size,
    heightInBlocks: canvas.height / block.size,
    clear: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

let snake = {
    color: "green",
    colVelocity: -1,
    rowVelocity: 0,
    body: [
        { col: 15, row: 15 },
        { col: 16, row: 15 },
        { col: 17, row: 15 },
    ],
    move: function (body) {
        const head = {
            col: body[0].col + snake.colVelocity,
            row: body[0].row + snake.rowVelocity
        };

        body.unshift(head);

        if (body[0].col == apple.body[0].col && body[0].row == apple.body[0].row) {
            bonusSound.volume = 1;
            bonusSound.play();
            score++;
            scoreLabel.innerHTML = `Score: ${score}`;
            snakeLengthLabel.innerHTML = `Snake length: ${body.length}`;
            apple.move();
        } else {
            body.pop();
        }
    },
    changeDirection: function (event) {
        const keyPressed = event.keyCode;
        console.log(keyPressed);
        const keys = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        }

        const direction = {
            goingUp: snake.rowVelocity == -1,
            goingDown: snake.rowVelocity == 1,
            goingRight: snake.colVelocity == 1,
            goingLeft: snake.colVelocity == -1
        }

        switch (true) {
            case (keyPressed == keys.left && !direction.goingRight):
                snake.colVelocity = -1;
                snake.rowVelocity = 0;
                break;
            case (keyPressed == keys.up && !direction.goingDown):
                snake.colVelocity = 0;
                snake.rowVelocity = -1;
                break;
            case (keyPressed == keys.right && !direction.goingLeft):
                snake.colVelocity = 1;
                snake.rowVelocity = 0;
                break;
            case (keyPressed == keys.down && !direction.goingUp):
                snake.colVelocity = 0;
                snake.rowVelocity = 1;
                break;
        }
    },
    checkCollision: function (body, length) {
        switch (true) {
            case (body[0].col < 0):
                gameOver();
                break;
            case (body[0].col >= gameCanvas.widthInBlocks):
                gameOver();
                break;
            case (body[0].row < 0):
                gameOver();
                break;
            case (body[0].row >= gameCanvas.heightInBlocks):
                gameOver();
                break;
        }

        for (let i = 1; i < length; i++) {
            if (body[i].col == body[0].col && body[i].row == body[0].row) {
                gameOver();
            }
        }
    }
}

let apple = {
    color: "red",
    body: [
        { col: 12, row: 12 },
    ],
    move: function () {
        apple.body[0].col = Math.floor(Math.random() * (gameCanvas.widthInBlocks - 2)) + 1;
        apple.body[0].row = Math.floor(Math.random() * (gameCanvas.heightInBlocks - 2)) + 1;
        for (let i = 1; i < snake.body.length; i++) {
            if (snake.body[i].col == apple.body[0].col && snake.body[i].row == apple.body[0].row) {
                apple.move();
            }
        }
    }
}

window.addEventListener("keydown", snake.changeDirection);
resetBtn.addEventListener("click", resetGame);
if (gameSpeed > 0) {
    gameStarted = true;
    scoreUpdate();
    startGame();
}

function scoreUpdate() {
    if ((score < highScore || score == 0) && gameStarted == false) {
        loseSound.play();
    } else if(score > highScore && gameStarted == false){
        winSound.play();
        highScore = score;
        highScoreLabel.innerHTML = `High score: ${highScore}`;
    }
    score = 0;
    scoreLabel.innerHTML = `Score: ${score}`;
    snakeLengthLabel.innerHTML = `Snake length: ${snake.body.length}`;
}

function startGame() {
    intervalId = setInterval(function () {
        gameCanvas.clear();
        block.draw(apple.color, apple.body, apple.body.length);
        snake.move(snake.body);
        block.draw(snake.color, snake.body, snake.body.length);
        snake.checkCollision(snake.body, snake.body.length);
    }, gameSpeed);
}

function resetGame() {
    clearInterval(intervalId);
    gameStarted = false;
    gameSpeed = prompt("Enter game speed in miliseconds: ");
    snake.colVelocity = -1;
    snake.rowVelocity = 0;
    snake.body = [
        { col: 15, row: 15 },
        { col: 16, row: 15 },
        { col: 17, row: 15 },
    ];
    startGame();
}

function gameOver() {
    clearInterval(intervalId);
    gameStarted = false;
    ctx.font = "50px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
    ctx.strokeText("GAME OVER!", canvas.width / 2, canvas.height / 2);
    scoreUpdate();
}

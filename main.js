const playBoard = document.querySelector(".play-board");
const keyControls = document.querySelectorAll(".controls i");

const currScoreElement = document.querySelector(".current-score");
const highScoreElement = document.querySelector(".highest-score");

let setIntervalId;
let gameOver = false;
let snakeBody = [];

let foodX, foodY;
let snakeX = 5,
    snakeY = 5;
let velocityX = 0,
    velocityY = 0;

let currentScore = 0;

// Fetch the Highest Score from the Local Storage
let highestScore = localStorage.getItem("highest-score") || 0;

highScoreElement.innerText = `Highest Score: ${highestScore}`;

const addGardenElement = (type, elementX, elementY) => {

    return `<div class="${type}" style="grid-area: ${elementY} / ${elementX}"></div>`;
};

const updateFoodPosition = () => {

    // Random (1 - 30) value are Food Positions
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {

    // Clearing the Timer
    clearInterval(setIntervalId);
    alert("Game over! Press OK to replay.");

    // Reloading the Page
    location.reload();
};

const changeSnakeDirection = (pressed) => {

    // Changing the Velocity based on Key Presses

    if (pressed.key === "ArrowUp" && velocityY != 1) {

        velocityX = 0;
        velocityY = -1;

    } else if (pressed.key === "ArrowDown" && velocityY != -1) {

        velocityX = 0;
        velocityY = 1;

    } else if (pressed.key === "ArrowLeft" && velocityX != 1) {

        velocityX = -1;
        velocityY = 0;

    } else if (pressed.key === "ArrowRight" && velocityX != -1) {

        velocityX = 1;
        velocityY = 0;
    }
};

keyControls.forEach((button) =>

    // Call `changeSnakeDirection` for each Key click
    button.addEventListener("click", () =>

        // Pass the value of `key` dataset as an Object
        changeSnakeDirection({ key: button.dataset.key })
    )
);

const startSnakeGame = () => {

    if (gameOver) return handleGameOver();

    let gardenArea = addGardenElement("food", foodX, foodY);

    // Check if the Snake has eaten the Food
    if (snakeX === foodX && snakeY === foodY) {

        updateFoodPosition();

        snakeBody.push([foodY, foodX]); // Extend the Snake with the Food

        currentScore += 1; // Increment the Current Score by 1

        highestScore = (currentScore >= highestScore) ? currentScore : highestScore;

        localStorage.setItem("highest-score", highestScore);

        currScoreElement.innerText = `Current Score: ${currentScore}`;
        highScoreElement.innerText = `Highest Score: ${highestScore}`;
    }

    // Update the position of the Snake's head based on the current Velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifting forward the parts in Snake's body by one place
    for (let part = snakeBody.length - 1; part > 0; part -= 1) {

        snakeBody[part] = snakeBody[part - 1];
    }

    // Set the first element of Snake's body as its current position
    snakeBody[0] = [snakeX, snakeY];

    // Check whether the Snake's head hits any Wall(s) of garden
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {

        return (gameOver = true); // Return with the `gameOver` set as `true`
    }

    for (let part = 0; part < snakeBody.length; part += 1) {

        const snakePartX = snakeBody[part][0];
        const snakePartY = snakeBody[part][1];

        // Keep on adding new `div` for each part of the Snake's body
        gardenArea += addGardenElement("head", snakePartX, snakePartY);

        if (part !== 0 && // Check whether the Snake's head has hit its body
            snakeBody[0][0] === snakePartX && snakeBody[0][1] === snakePartY) {

            gameOver = true; // Set the `gameOver` as `true`
        }
    }

    playBoard.innerHTML = gardenArea;
};

updateFoodPosition();

setIntervalId = setInterval(startSnakeGame, 100);

document.addEventListener("keyup", changeSnakeDirection);

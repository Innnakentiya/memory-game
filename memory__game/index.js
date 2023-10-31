const gameCards = document.querySelectorAll(".game__card");
let firstCard;
let secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let clicksCount = 0;
let movesCount = 0;
let cardsFlippedCount = 0;
let isFinishedGame = false;
let timerRunning = false;
// let firstClickTime;
// let finishTime;

function flipCard() {
  // if (!firstClickTime) {
  //   firstClickTime = new Date();
  //   console.log(firstClickTime);
  // }
  startTimer();
  if (lockBoard || this.classList.contains("flipped")) return; // avoid double click
  // if (lockBoard || this === firstCard) return;// avoid double click as well

  this.classList.add("flipped");
  clicksCount++;

  if (!hasFlippedCard) {
    lockBoard = false;
    hasFlippedCard = true;
    firstCard = this;
  } else {
    hasFlippedCard = false;
    secondCard = this;
    movesCount++;
    updateMovesCount(movesCount);
    checkMatching();
    updateCardsFlippedCount(cardsFlippedCount);
    finishGame(cardsFlippedCount);
  }
}

function checkMatching() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    // finishGame(cardsFlippedCount);
    cardsFlippedCount++;
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      lockBoard = false;
    }, 1500);
  }
}
//////////////
let totalMovesCount;

function updateMovesCount(movesCount) {
  const movesCountElement = document.querySelector(".card__content-info");
  movesCountElement.textContent = `Moves: ${movesCount}`;
  movesCountElement.classList.add("show");

  totalMovesCount = movesCount;
}
/////////////

function updateCardsFlippedCount(cardsFlippedCount) {
  const openCardsNumberElement = document.querySelector(
    ".opened__cards-number"
  );
  openCardsNumberElement.textContent = `Opened : ${cardsFlippedCount}`;
  openCardsNumberElement.classList.add("show");
}

function finishGame() {
  if (cardsFlippedCount === 12) {
    // finishTime = new Date();
    // const elapsedTime = finishTime - firstClickTime;
    // const elapsedTimeInSec = Math.round(elapsedTime / 1000);
    // //////////////////////////////////

    // ///////////////////////////////////
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`Game is finished!`);
      // alert(`Game is finished! Your time is ${elapsedTimeInSec} seconds `);
      isFinishedGame = true;
      lockBoard = true;
      startNewGame();
      showModalBtn();
      saveGameResults(gameTime, totalMovesCount); //?
      // displayGameResults(existingGameResults);
      displayGameResults(JSON.parse(localStorage.getItem("gameResults")) || []);
    }, 1000);
  }
}

//Show and close modal window(scores)

const gameModalElement = document.querySelector(".game__modal-window");
const gameOverlayElement = document.querySelector(".game__overlay");

function showModalBtn() {
  if (isFinishedGame) {
    const gameModalBtn = document.createElement("button");
    const gameSectionElement = document.querySelector(".game__section");
    gameModalBtn.classList.add("game__modal_btn");
    gameModalBtn.textContent = "High Score Table";
    gameSectionElement.appendChild(gameModalBtn);

    setTimeout(() => {
      gameModalBtn.classList.add("show");
    }, 1000);
    gameModalBtn.addEventListener("click", showModal);
  }
}

function showModal() {
  gameModalElement.classList.add("active");
  gameOverlayElement.classList.add("active");
  closeModal();
}

function closeModal() {
  let closeElements = document.querySelectorAll(
    ".game__modal_close, .game__overlay"
  );
  closeElements.forEach((element) => {
    element.addEventListener("click", () => {
      gameModalElement.classList.remove("active");
      gameOverlayElement.classList.remove("active");
    });
  });
}

// Start new game

function startNewGame() {
  if (isFinishedGame) {
    const startGameButton = document.createElement("button");
    const gameSectionElement = document.querySelector(".game__section");
    startGameButton.classList.add("start__btn");
    startGameButton.textContent = "Start New Game";
    gameSectionElement.appendChild(startGameButton);

    setTimeout(() => {
      startGameButton.classList.add("show");
    }, 1000);
    startGameButton.addEventListener("click", resetGame);
  }
}

function resetGame() {
  firstCard = null;
  secondCard = null;
  hasFlippedCard = false;
  lockBoard = false;
  clicksCount = 0;
  movesCount = 0;
  cardsFlippedCount = 0;
  isFinishedGame = false;
  timerRunning = false;
  const movesCountElement = document.querySelector(".card__content-info");
  const openCardsNumberElement = document.querySelector(
    ".opened__cards-number"
  );
  movesCountElement.textContent = "Find a pair";
  openCardsNumberElement.textContent = "";
  gameTimerElement.textContent = "";

  //Remove button after resetting
  const startGameButton = document.querySelector(".start__btn");
  startGameButton.remove();
  const gameModalBtn = document.querySelector(".game__modal_btn");
  gameModalBtn.remove();

  //Reset all cards to face down
  gameCards.forEach((card) => {
    card.classList.remove("flipped");
    card.addEventListener("click", flipCard);
  });

  //Shuffle the cards again
  shuffleGameCards();
}

const gameTimerElement = document.querySelector(".game__timer");
let startTime;
let timerInterval;

function startTimer() {
  if (!timerRunning) {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
  }
}

function updateTimer() {
  let currentTime = new Date();
  let elapsedTime = currentTime - startTime;
  let elapsedTimeInSec = Math.floor(elapsedTime / 1000);
  gameTimerElement.textContent = `Time : ${elapsedTimeInSec} s`;
  gameTimerElement.classList.add("show");
  gameTime = elapsedTimeInSec; //?
}

function shuffleGameCards() {
  gameCards.forEach((card) => {
    let cardRandomPosition = Math.floor(Math.random() * 24);
    card.style.order = cardRandomPosition;
  });
}
shuffleGameCards();

gameCards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

//Local storage

function saveGameResults(gameTime, totalMovesCount) {
  const gameResult = {
    time: gameTime,
    moves: totalMovesCount,
  };

  const existingGameResults =
    JSON.parse(localStorage.getItem("gameResults")) || [];
  existingGameResults.push(gameResult);

  // existingGameResults.sort((a, b) => a.moves - b.moves);
  existingGameResults.sort(compareResults);

  if (existingGameResults.length > 10) {
    existingGameResults.shift();
  }

  localStorage.setItem("gameResults", JSON.stringify(existingGameResults));
}

const gameMovesElements = document.querySelectorAll(".game__moves p");
const gameTimeElements = document.querySelectorAll(".game__time p");

function displayGameResults(existingGameResults) {
  existingGameResults.forEach((gameResult, index) => {
    gameMovesElements[index].textContent = `${gameResult.moves} moves`;

    gameTimeElements[index].textContent = `${gameResult.time} sec`;
  });
}

const existingGameResults =
  JSON.parse(localStorage.getItem("gameResults")) || [];
displayGameResults(existingGameResults);

function compareResults(result1, result2) {
  if (result1.moves === result2.moves) {
    return result1.time - result2.time;
  } else {
    return result1.moves - result2.moves;
  }
}

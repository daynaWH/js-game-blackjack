// Variables

// Game Table
const startPage = document.querySelector(".start-page");
const gamePage = document.querySelector(".in-game");

// Buttons
const btnStart = document.getElementById("btn-start");
const btnControls = document.querySelector(".game-controls");
const btnGameplay = document.querySelectorAll(".game-controls button");
const btnHit = document.getElementById("btn-hit");
const btnStand = document.getElementById("btn-stand");
const btnHome = document.getElementById("btn-main");

// EOG
const results = document.querySelector(".results");
const eogMsg = document.getElementById("player-message");
const btnPlayAgain = document.getElementById("btn-play-again");
const btnEogHome = document.getElementById("btn-eog-main");

// Audio
const audioClick = new Audio("audio/click.mp3");
const audioFlipCard = new Audio("audio/flipcard.mp3");
const audioBlackjack = new Audio("audio/blackjack.mp3");
const audioBust = new Audio("audio/bust.mp3");
const audioEog = new Audio("audio/eog.mp3");

// Player HTML Elements Object
const elementsPlayer = {
    pts: document.getElementById("player-pts-value-one"),
    secondPts: document.getElementById("player-pts-value-two"),
    or: document.getElementById("player-or"),
    popup: document.getElementById("player-popup"),
};

// Dealer HTML Elements Object
const elementsDealer = {
    pts: document.getElementById("dealer-pts-value-one"),
    secondPts: document.getElementById("dealer-pts-value-two"),
    or: document.getElementById("dealer-or"),
    popup: document.getElementById("dealer-popup"),
};

// --------- Main ---------

const tenPts = ["0", "j", "q", "k"];

// A deck of playing cards object
const deck = {
    suits: ["clubs", "diamonds", "hearts", "spades"],
    numbers: ["a", 2, 3, 4, 5, 6, 7, 8, 9, 10, "j", "q", "k"],
    newDeck: [],

    // Function to shuffle the deck
    shuffle() {
        for (i = 0; i < this.suits.length; i++) {
            for (j = 0; j < this.numbers.length; j++) {
                // Generate random suit from the deck
                let s = Math.floor(Math.random() * this.suits.length); // outputs random # between #0-3
                let suit = this.suits[s];

                // Generate random card number from the deck
                let n = Math.floor(Math.random() * this.numbers.length); // outputs random # between 0-12
                let number = this.numbers[n];

                let x = `${suit}_${number}`;

                this.newDeck.push(x);
            }
        }
    },
};

// Player class
class Player {
    constructor(role) {
        this.role = role;
        this.hand = [];
        this.score = 0;
        this.secondScore = 0;
    }

    // Default state of each player
    default() {
        this.hand = [];
        this.score = 0;
        this.secondScore = 0;

        document.getElementById(`${this.role}-pts-value-one`).style.display =
            "inline-block";
        document.getElementById(`${this.role}-pts-value-two`).style.display =
            "none";
        document.getElementById(`${this.role}-or`).style.display = "none";
        document.getElementById(`${this.role}-popup`).style.display = "none";
        elementsPlayer.pts.innerHTML = 0;
        elementsDealer.pts.innerHTML = "🃏";

        const cardsInHand = document.getElementById(`${this.role}-cards`);
        let countImg = cardsInHand.childElementCount;
        for (let i = 0; i < countImg; i++) {
            cardsInHand.removeChild(cardsInHand.firstChild);
        }
    }

    // Initial Deal
    initialCards() {
        for (let i = 0; i < 2; i++) {
            this.hand.push(deck.newDeck.shift());
            const cardsInHand = document.getElementById(`${this.role}-cards`);
            const newImg = document.createElement("img");
            const newBack = document.createElement("img");
            newImg.src = `images/${this.hand[i]}.svg`;
            newImg.classList.add("card-front");

            newBack.src = `images/back.svg`;
            newBack.id = `card-back-${this.role}${i + 1}`;
            newBack.classList.add("card-back");

            setTimeout(() => {
                audioFlipCard.play();
                cardsInHand.appendChild(newImg);
                cardsInHand.appendChild(newBack);
                setTimeout(() => {
                    newBack.classList.add("flip");
                    newImg.classList.add("flip");
                }, 500);
            }, 1000 * i);
        }
    }

    // Initial score
    initialScore() {
        for (let i = 0; i < this.hand.length; i++) {
            let lastDigit = this.hand[i].slice(-1);
            if (tenPts.includes(lastDigit)) {
                this.score += 10;
                this.secondScore += 10;
            } else if (lastDigit == "a") {
                this.score += 1;
                this.secondScore = this.score + 10;
                if (player.hand[i].slice(-1) == "a") {
                    elementsPlayer.or.style.display = "inline-block";
                    elementsPlayer.secondPts.style.display = "inline-block";
                }
            } else {
                this.score += Number(lastDigit);
                this.secondScore += Number(lastDigit);
            }
        }
        elementsPlayer.secondPts.textContent = player.secondScore;
        return this.score;
    }

    // Functions upon adding cards to the hand
    getCard() {
        this.hand.push(deck.newDeck.shift());
        const cardsInHand = document.getElementById(`${this.role}-cards`);
        const newImg = document.createElement("img");
        const newBack = document.createElement("img");
        newImg.src = `images/${this.hand[this.hand.length - 1]}.svg`;
        newImg.classList.add("card-front");

        newBack.src = `images/back.svg`;
        newBack.classList.add("card-back");

        cardsInHand.appendChild(newImg);
        cardsInHand.appendChild(newBack);

        setTimeout(() => {
            audioFlipCard.play();
            newBack.classList.add("flip");
            newImg.classList.add("flip");
        }, 50);
    }

    addScore() {
        for (let i = this.hand.length - 1; i < this.hand.length; i++) {
            let lastDigit = this.hand[i].slice(-1);
            if (tenPts.includes(lastDigit)) {
                this.score += 10;
                this.secondScore += 10;
            } else if (lastDigit == "a") {
                this.score += 1;
                this.secondScore = this.score + 10;
                document.getElementById(`${this.role}-or`).style.display =
                    "inline-block";
                document.getElementById(
                    `${this.role}-pts-value-two`
                ).style.display = "inline-block";
            } else {
                this.score += Number(lastDigit);
                this.secondScore += Number(lastDigit);
            }
        }
        document.getElementById(`${this.role}-pts-value-two`).textContent =
            this.secondScore;
        return this.score;
    }

    // BlackJack
    showBlackjack() {
        // setTimeout(() => {
        audioBlackjack.play();
        document.getElementById(`${this.role}-popup`).style.display = "block";
        document.getElementById(`${this.role}-popup`).textContent =
            "Blackjack!";
        document.getElementById(`${this.role}-or`).style.display = "none";
        // }, 500);
    }

    // Bust
    showBust() {
        // setTimeout(() => {
        audioBust.play();
        document.getElementById(`${this.role}-popup`).style.display = "block";
        document.getElementById(`${this.role}-popup`).textContent = "Bust!";
        // }, 500);
    }
}

function btnDisabled() {
    btnGameplay.forEach((btn) => {
        btn.disabled = true;
    });
}

function btnEnabled() {
    btnGameplay.forEach((btn) => {
        btn.disabled = false;
    });
}

function startGame() {
    // Set everything in the game page to default state
    gamePage.style.opacity = 1;
    deck.newDeck = [];
    player.default();
    dealer.default();
    deck.shuffle();

    // btnControls.style.display = "block";
    btnControls.style.display = "flex";
    btnDisabled();

    // Deal initial cards for both players
    player.initialCards();
    setTimeout(() => {
        dealer.initialCards();
    }, 500);

    setTimeout(() => {
        elementsPlayer.pts.innerHTML = player.initialScore();
        dealer.initialScore();
        btnEnabled();

        if (player.secondScore == 21) {
            player.showBlackjack();
            elementsPlayer.pts.style.display = "none";
            setTimeout(() => {
                dealerOpen();
                showResults();
            }, 1000);
        }
    }, 3000);

    console.log(
        deck.newDeck[0],
        deck.newDeck[1],
        deck.newDeck[2],
        dealer.hand,
        player.hand
    ); //testing
}

// Function to reveal dealer's second card & final score
// Need 4 timeframes - 1. opencard 2. initial score 3. get cards one at a time 4. show score
function dealerOpen() {
    // #1
    // Disable the buttons
    btnDisabled();

    // The dealer opens the second card & score is displayed
    audioFlipCard.play();
    document.getElementById("card-back-dealer2").style.display = "none";

    // #2
    // elementsDealer.pts.innerHTML = dealer.initialScore();
    if (dealer.hand[0].slice(-1) == "a" || dealer.hand[1].slice(-1) == "a") {
        elementsDealer.secondPts.innerHTML = dealer.secondScore;
        elementsDealer.or.style.display = "inline-block";
        elementsDealer.secondPts.style.display = "inline-block";
        if (dealer.secondScore == 21) {
            elementsDealer.pts.style.display = "none";
            elementsDealer.or.style.display = "none";
        }
    }
    elementsDealer.pts.innerHTML = dealer.score;

    // #3
    // Dealer plays its hand while the score is less than 17
    setTimeout(() => {
        while (dealer.score < 17 && dealer.secondScore !== 21) {
            dealer.getCard();
            // #4
            elementsDealer.pts.innerHTML = dealer.addScore();
        }

        // If the total == 21 without A > display 'Blackjack'
        if (dealer.score == 21) {
            dealer.showBlackjack();
        }
        // If the total exceeds 21 > display 'Bust'
        else if (dealer.score > 21) {
            dealer.showBust();
        }

        // If dealer hand includes A
        if (elementsDealer.secondPts.style.display == "inline-block") {
            if (dealer.secondScore == 21) {
                dealer.showBlackjack();
                elementsDealer.pts.style.display = "none";
            } else if (dealer.secondScore > 21) {
                elementsDealer.secondPts.style.display = "none";
                elementsDealer.or.style.display = "none";
            } else if (dealer.secondScore < 21) {
                elementsDealer.pts.style.display = "none";
                elementsDealer.or.style.display = "none";
            }
        }
    }, 600);
}

// Compare both hands - show results at the end

// Win
function win() {
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "You Win!";
}

// Lose
function lose() {
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "You Lose!";
}

// Tie
function tie() {
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "It's a Tie!";
}

// Function to display eog results pop up
function showResults() {
    if (elementsPlayer.secondPts.style.display == "none") {
        if (elementsDealer.secondPts.style.display == "none") {
            if (
                (player.score > 21 && dealer.score > 21) ||
                player.score === dealer.score
            ) {
                setTimeout(tie, 1500);
                console.log("tie");
            } else if (
                (player.score < dealer.score && dealer.score <= 21) ||
                (player.score > 21 && dealer.score <= 21)
            ) {
                setTimeout(lose, 1500);
                console.log("lose");
            } else if (
                player.score > dealer.score ||
                (player.score <= 21 && dealer.score > 21)
            ) {
                setTimeout(win, 1500);
                console.log("win");
            }
        }
        // When dealer has A = 11
        else if ((elementsDealer.secondPts.style.display = "inline-block")) {
            if (player.score === dealer.secondScore) {
                setTimeout(tie, 1500);
                console.log("tie");
            } else if (player.score < dealer.secondScore) {
                setTimeout(lose, 1500);
                console.log("lose");
            } else if (player.score > dealer.secondScore) {
                setTimeout(win, 1500);
                console.log("win");
            }
        }
    }

    // When player has A = 11
    else if (elementsPlayer.secondPts.style.display == "inline-block") {
        // When dealer also has A = 11
        if (elementsDealer.secondPts.style.display == "inline-block") {
            if (player.secondScore === dealer.secondScore) {
                setTimeout(tie, 1500);
                console.log("tie");
            } else if (player.secondScore < dealer.secondScore) {
                setTimeout(lose, 1500);
                console.log("lose");
            } else if (player.secondScore > dealer.secondScore) {
                setTimeout(win, 1500);
                console.log("win");
            }
            // When dealer has A = 1
        } else if ((elementsDealer.secondPts.style.display = "none")) {
            if (player.secondScore == dealer.score) {
                setTimeout(tie, 1500);
                console.log("tie");
            } else if (
                player.secondScore < dealer.score &&
                dealer.score <= 21
            ) {
                setTimeout(lose, 1500);
                console.log("lose");
            } else if (
                player.secondScore > dealer.score ||
                (player.secondScore < dealer.score && dealer.score > 21)
            ) {
                setTimeout(win, 1500);
                console.log("win");
            }
        }
    }

    setTimeout(() => {
        gamePage.style.opacity = 0.5;
    }, 1500);
}

const dealer = new Player("dealer");
const player = new Player("player");

btnStart.addEventListener("click", function (e) {
    e.preventDefault;
    audioClick.play();
    startPage.style.display = "none";
    gamePage.style.display = "grid";

    startGame();
});

// When the player clicks the 'Hit' button > add a card to the player hand and add the total point
// Need 2 timeframes - 1. getcard 2. then show score
btnHit.addEventListener("click", function () {
    audioClick.play();
    player.getCard();
    setTimeout(() => {
        elementsPlayer.pts.innerHTML = player.addScore();
        console.log(deck.newDeck[0], dealer.hand, player.hand); //testing

        // If the total == 21 > display 'Blackjack' & the player wins
        if (player.score == 21) {
            player.showBlackjack();
            elementsPlayer.secondPts.style.display = "none";
            setTimeout(() => {
                dealerOpen();
                showResults();
            }, 800);
        }
        // If the total exceeds 21 > display 'Bust & the player loses
        else if (player.score > 21) {
            player.showBust();
            setTimeout(() => {
                dealerOpen();
                showResults();
            }, 800);
        }

        if (elementsPlayer.secondPts.style.display == "inline-block") {
            // If hand includes A & the second Score == 21 > display 'Blackjack'
            if (player.secondScore == 21) {
                player.showBlackjack();
                elementsPlayer.pts.style.display = "none";
                dealerOpen();
                showResults();
            }
            // If hand includes A & one exceeds 21 > remove it
            else if (player.secondScore > 21) {
                elementsPlayer.or.style.display = "none";
                elementsPlayer.secondPts.style.display = "none";
            }
        }
    }, 800);
});

// When the player clicks the 'Stand' button
// > Show the results div
// Need 4 timeframes - 1. opencard 2. initial score 3. get cards one at a time 4. show score
btnStand.addEventListener("click", function () {
    audioClick.play();
    // #1 - #4
    dealerOpen();

    // If the hand has A & secondScore < 21
    if (
        elementsPlayer.secondPts.style.display == "inline-block" &&
        player.secondScore < 21
    ) {
        elementsPlayer.pts.style.display = "none";
        elementsPlayer.or.style.display = "none";
    }

    // #5
    showResults();
});

// Audio Event Listeners
btnPlayAgain.addEventListener("click", function (e) {
    audioClick.play();
    e.preventDefault;
    results.style.display = "none";

    startGame();
});

btnHome.addEventListener("click", function () {
    audioClick.play();
    startPage.style.display = "flex";
    gamePage.style.display = "none";
});

btnEogHome.addEventListener("click", function () {
    audioClick.play();
    results.style.display = "none";
    startPage.style.display = "flex";
    gamePage.style.display = "none";
});

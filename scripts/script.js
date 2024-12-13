// Single user plays a single round of Blackjack against the dealer (computer)
// Rule:
// Whoever gets closer to 21 without going over it wins

/*
Steps
1. The player is initially dealt two cards
2. The player's hand is totaled
- If there's an ace > display both totals (with +1 and +11)
- if the hand goes over 21, its value is automatically 1
3. The player is given the option to: hit or stand
3-1. hit > dealt another card > hand is totaled
3-2. stand > the dealer plays its cards
4. The player automatically loses if they go over 21
5. The player can continue to ask for cards until they click on stand
5-1. If the player stands > the dealer plays its hand

Dealer's rule
- While the dealer's hand's total points < 17, it continues to get more cards
- If the dealer's points >= 17, it holds
- The hand is totaled
- Compare both hands & the player with higher points wins
- If the dealer's points > 21, it automatically loses

EoG
- Display win/lose message
- Display a button to play a new game
*/

/* 
https://lasatlantis.com/game/single-deck-blackjack-n/
https://ga6.gahypergaming.com/rgs/views/gameart/gameartdemo.js?game=423
https://www.blackjacksimulator.net/simulators/classic-blackjack/
*/

// Game Table
const startPage = document.querySelector(".start-page");
const gamePage = document.querySelector(".in-game");
const dealerHand = document.querySelector(".dealer-hand");
const playerHand = document.querySelector(".player-hand");
let dealerPts = document.getElementById("dealer-pts-value-one");
let dealerSecondPts = document.getElementById("dealer-pts-value-two");
let playerPts = document.getElementById("player-pts-value-one");
let playerSecondPts = document.getElementById("player-pts-value-two");
// const acePts = document.getElementById("ace-card");
const textOr = document.getElementById("player-or");

// Buttons
const btnStart = document.getElementById("btn-start");
const btnControls = document.querySelector(".game-controls");
const btnGameplay = document.querySelectorAll(".game-controls button");
const btnHit = document.getElementById("btn-hit");
const btnStand = document.getElementById("btn-stand");
const btnHome = document.getElementById("btn-main");

// EOG
const eogMsg = document.getElementById("player-message");
const results = document.querySelector(".results");
const btnPlayAgain = document.getElementById("btn-play-again");
const btnEogHome = document.getElementById("btn-eog-main");

// Audio
const audioClick = new Audio("audio/click.mp3");
const audioFlipCard = new Audio("audio/flipcard.mp3");
const audioBlackjack = new Audio("audio/blackjack.mp3");
const audioBust = new Audio("audio/bust.mp3");
const audioEog = new Audio("audio/eog.mp3");

// Main

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
        this.scoreArr = [this.score, this.secondScore];
    }

    default() {
        this.hand = [];
        this.score = 0;
        this.secondScore = 0;

        playerPts.innerHTML = 0;
        playerPts.style.display = "inline-block";
        playerSecondPts.style.display = "none";

        dealerPts.innerHTML = "🃏";
        dealerPts.style.display = "inline-block";
        dealerSecondPts.style.display = "none";

        document.getElementById(`${this.role}-or`).style.display = "none";
        document.getElementById(`${this.role}-popup`).style.display = "none";
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
            newBack.src = `images/back.svg`;
            newBack.id = `card-back-${this.role}${i + 1}`;
            newImg.src = `images/${this.hand[i]}.svg`;

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

    // Functions upon adding cards to the hand
    getCard() {
        this.hand.push(deck.newDeck.shift());
        const cardsInHand = document.getElementById(`${this.role}-cards`);
        const newImg = document.createElement("img");
        const newBack = document.createElement("img");
        newBack.src = `images/back.svg`;
        newImg.src = `images/${this.hand[this.hand.length - 1]}.svg`;

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

    // Win
    win() {
        audioEog.play();
        results.style.display = "block";
        eogMsg.textContent = "You Win!";
    }

    // Lose
    lose() {
        audioEog.play();
        results.style.display = "block";
        eogMsg.textContent = "You Lose!";
    }

    // Tie
    tie() {
        audioEog.play();
        results.style.display = "block";
        eogMsg.textContent = "It's a Tie!";
    }
}

function btnDisabled() {
    btnGameplay.forEach((btnGameplay) => {
        btnGameplay.disabled = true;
    });
}

function btnEnabled() {
    btnGameplay.forEach((btnGameplay) => {
        btnGameplay.disabled = false;
    });
}

function startGame() {
    gamePage.style.opacity = 1;

    deck.newDeck = [];
    player.default();
    dealer.default();
    deck.shuffle();

    btnControls.style.display = "block";
    btnDisabled();

    player.initialCards();

    setTimeout(() => {
        dealer.initialCards();
    }, 500);

    setTimeout(() => {
        playerPts.innerHTML = player.initialScore();
        btnEnabled();

        if (player.secondScore === 21) {
            document.getElementById("player-popup").style.display = "block";
            document.getElementById("player-popup").textContent = "Blackjack!";
            audioBlackjack.play();
            playerPts.style.display = "none";
            textOr.style.display = "none";

            playerEnd();
            showResults();
        }
    }, 2500);

    console.log(
        deck.newDeck[0],
        deck.newDeck[1],
        deck.newDeck[2],
        dealer.hand,
        player.hand
    ); //testing
}

function playerEnd() {
    // Disable the buttons
    btnDisabled();

    // The dealer opens the second card & score is displayed
    document.getElementById("card-back-dealer2").style.display = "none";
    dealerPts.innerHTML = dealer.initialScore();

    if (dealer.secondScore == 21) {
        document.getElementById("dealer-popup").style.display = "block";
        document.getElementById("dealer-popup").textContent = "Blackjack!";
        audioBlackjack.play();
        dealerPts.style.display = "none";
        dealerSecondPts.style.display = "inline-block";
        document.getElementById("dealer-or").style.display = "none";
    }

    // Dealer plays its hand
    while (dealer.score < 17 && dealer.secondScore !== 21) {
        // get more cards
        dealer.getCard();
        dealerPts.innerHTML = dealer.addScore();
    }

    // If the total == 21 > display 'Blackjack' (default)
    if (dealer.score == 21) {
        document.getElementById("dealer-popup").style.display = "block";
        document.getElementById("dealer-popup").textContent = "Blackjack!";
        audioBlackjack.play();
    }
    // If the total exceeds 21 > display 'bust'
    else if (dealer.score > 21) {
        document.getElementById("dealer-popup").style.display = "block";
        document.getElementById("dealer-popup").textContent = "Bust!";
        audioBust.play();
    }

    // If dealer hand includes A
    if (dealerSecondPts.style.display == "inline-block") {
        if (dealer.secondScore == 21) {
            document.getElementById("dealer-popup").style.display = "block";
            document.getElementById("dealer-popup").textContent = "Blackjack!";
            audioBlackjack.play();

            dealerPts.style.display = "none";
            document.getElementById("dealer-or").style.display = "none";
        } else if (dealer.secondScore > 21) {
            document.getElementById("dealer-or").style.display = "none";
            dealerSecondPts.style.display = "none";
        } else if (dealer.secondScore < 21) {
            dealerPts.style.display = "none";
            document.getElementById("dealer-or").style.display = "none";
        }
    }
}

// Compare both hands - show results at the end
function showResults() {
    if (playerSecondPts.style.display == "none") {
        if (dealerSecondPts.style.display == "none") {
            if (
                (player.score > 21 && dealer.score > 21) ||
                player.score === dealer.score
            ) {
                setTimeout(player.tie, 1500);
                console.log("tie");
            } else if (
                (player.score < dealer.score && dealer.score <= 21) ||
                (player.score > 21 && dealer.score <= 21)
            ) {
                setTimeout(player.lose, 1500);
                console.log("lose");
            } else if (
                player.score > dealer.score ||
                (player.score <= 21 && dealer.score > 21)
            ) {
                setTimeout(player.win, 1500);
                console.log("win");
            }
        }
        // When dealer has A = 11
        else if ((dealerSecondPts.style.display = "inline-block")) {
            if (player.score === dealer.secondScore) {
                setTimeout(player.tie, 1500);
                console.log("tie");
            } else if (player.score < dealer.secondScore) {
                setTimeout(player.lose, 1500);
                console.log("lose");
            } else if (player.score > dealer.secondScore) {
                setTimeout(player.win, 1500);
                console.log("win");
            }
        }
    }

    // When player has A = 11
    else if (playerSecondPts.style.display == "inline-block") {
        if ((dealerSecondPts.style.display = "none")) {
            if (player.secondScore == dealer.score) {
                setTimeout(player.tie, 1500);
                console.log("tie");
            } else if (
                player.secondScore < dealer.score &&
                dealer.score <= 21
            ) {
                setTimeout(player.lose, 1500);
                console.log("lose");
            } else if (
                player.secondScore > dealer.score ||
                (player.secondScore < dealer.score && dealer.score > 21)
            ) {
                setTimeout(player.win, 1500);
                console.log("win");
            }
        }
        // When dealer also has A = 11
        else if ((dealerSecondPts.style.display = "inline-block")) {
            if (player.secondScore === dealer.secondScore) {
                setTimeout(player.tie, 1500);
                console.log("tie");
            } else if (player.secondScore < dealer.secondScore) {
                setTimeout(player.lose, 1500);
                console.log("lose");
            } else if (player.secondScore > dealer.secondScore) {
                setTimeout(player.win, 1500);
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
    audioClick.play();
    e.preventDefault;
    startPage.style.display = "none";
    gamePage.style.display = "grid";

    startGame();
});

// When the player clicks the 'Hit' button > add a card to the player hand and add the total point
btnHit.addEventListener("click", function () {
    audioClick.play();
    player.getCard();
    playerPts.innerHTML = player.addScore();
    console.log(deck.newDeck[0], dealer.hand, player.hand); //testing

    // If the total == 21 > display 'Blackjack' & the player wins
    if (player.score == 21) {
        document.getElementById("player-popup").style.display = "block";
        document.getElementById("player-popup").textContent = "Blackjack!";
        audioBlackjack.play();

        playerSecondPts.style.display = "none";
        textOr.style.display = "none";

        playerEnd();
        showResults();
    }
    // If the total exceeds 21 > display 'Bust & the player loses
    else if (player.score > 21) {
        document.getElementById("player-popup").style.display = "block";
        document.getElementById("player-popup").textContent = "Bust!";
        audioBust.play();

        playerEnd();
        showResults();
    }

    if (playerSecondPts.style.display == "inline-block") {
        // If hand includes A & the second Score == 21 > display 'Blackjack'
        if (player.secondScore == 21) {
            document.getElementById("player-popup").style.display = "block";
            document.getElementById("player-popup").textContent = "Blackjack!";
            audioBlackjack.play();

            playerPts.style.display = "none";
            textOr.style.display = "none";
            showResults();
        }
        // If hand includes A & one exceeds 21 > remove it
        else if (player.secondScore > 21) {
            textOr.style.display = "none";
            playerSecondPts.style.display = "none";
        }
    }
});

// When the player clicks the 'Stand' button
// > Show the results div
btnStand.addEventListener("click", function () {
    audioClick.play();
    playerEnd();

    // If the hand has A & secondScore < 21
    if (
        playerSecondPts.style.display == "inline-block" &&
        player.secondScore < 21
    ) {
        playerPts.style.display = "none";
        textOr.style.display = "none";
    }

    showResults();
});

btnPlayAgain.addEventListener("click", function (e) {
    audioClick.play();
    e.preventDefault;
    results.style.display = "none";

    startGame();
});

btnHome.addEventListener("click", function () {
    audioClick.play();
    startPage.style.display = "block";
    gamePage.style.display = "none";
});

btnEogHome.addEventListener("click", function () {
    audioClick.play();
    results.style.display = "none";
    startPage.style.display = "block";
    gamePage.style.display = "none";
});

// Bug found:
// Duplicated cards displayed
// Issues when hands have A (ex. dealercard)

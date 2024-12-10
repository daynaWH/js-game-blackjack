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
const mainPage = document.querySelector(".main-page");
const gamePage = document.querySelector(".in-game");
const dealerHand = document.querySelector(".dealer-hand");
const playerHand = document.querySelector(".player-hand");
let dealerPts = document.getElementById("dealer-pts-value-one");
let dealerSecondPts = document.getElementById("dealer-pts-value-two");
let playerPts = document.getElementById("player-pts-value-one");
let playerSecondPts = document.getElementById("player-pts-value-two");
const textOr = document.getElementById("player-or");
const cardBack = document.getElementById("card-back");

// Buttons
const btnStart = document.getElementById("btn-start");
const btnGameplay = document.querySelectorAll(".game-controls button");
const btnHit = document.getElementById("btn-hit");
const btnStand = document.getElementById("btn-stand");

// EOG
const eogMsg = document.getElementById("player-message");
const results = document.querySelector(".results");
const btnPlayAgain = document.getElementById("btn-play-again");

const tenPts = ["0", "j", "q", "k"];

// A deck of playing cards object
const deck = {
    suits: ["clubs", "diamonds", "hearts", "spades"],
    numbers: ["a", 2, 3, 4, 5, 6, 7, 8, 9, 10, "j", "q", "k"],
    newDeck: [],

    // Function to shuffle the deck
    shuffle: function () {
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

    // Initial Deal
    initialCards() {
        for (let i = 0; i < 2; i++) {
            const cardsInHand = document.getElementById(`${this.role}-cards`);
            const newImg = document.createElement("img");
            this.hand.push(deck.newDeck.shift());
            newImg.src = `images/${this.hand[i]}.svg`;
            cardsInHand.appendChild(newImg);
            cardsInHand.appendChild;
        }
    }

    // Player's initial score
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
        const cardsInHand = document.getElementById(`${this.role}-cards`);
        const newImg = document.createElement("img");
        this.hand.push(deck.newDeck.shift());
        newImg.src = `images/${this.hand[this.hand.length - 1]}.svg`;
        cardsInHand.appendChild(newImg);
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
        results.style.display = "flex";
        eogMsg.textContent = "You Win!";
    }

    // Lose
    lose() {
        results.style.display = "flex";
        eogMsg.textContent = "You Lose!";
    }

    // Tie
    tie() {
        results.style.display = "flex";
        eogMsg.textContent = "It's a Tie!";
    }
}

function playerEnd() {
    // Disable the buttons
    btnGameplay.forEach((btnGameplay) => {
        btnGameplay.disabled = true;
    });

    // The dealer opens the second card & score is displayed
    cardBack.style.display = "none";
    dealerPts.innerHTML = dealer.initialScore();

    if (dealer.secondScore == 21) {
        document.getElementById("dealer-popup").style.display = "block";
        dealerPts.style.display = "none";
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
    }
    // If the total exceeds 21 > display 'bust'
    else if (dealer.score > 21) {
        document.getElementById("dealer-popup").style.display = "block";
        document.getElementById("dealer-popup").textContent = "Bust!";
    }

    // If dealer hand includes A
    if (dealerSecondPts.style.display == "inline-block") {
        if (dealer.secondScore == 21) {
            document.getElementById("dealer-popup").style.display = "block";
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
    if (
        (player.score > 21 && dealer.score > 21) ||
        player.score === dealer.score
    ) {
        setTimeout(player.tie, 2000);
        console.log("tie");
    } else if (
        (player.score < dealer.score && dealer.score <= 21) ||
        (player.score > 21 && dealer.score <= 21)
    ) {
        setTimeout(player.lose, 2000);
        console.log("lose");
    } else if (
        player.score > dealer.score ||
        (player.score <= 21 && dealer.score > 21)
    ) {
        setTimeout(player.win, 2000);
        console.log("win");
    }

    // When either hand has an A card
    // if (playerSecondPts.style.display == "inline-block") {
    //     if (
    //         player.secondScore > dealer.score ||
    //         player.secondScore > dealer.secondScore
    //     ) {
    //         setTimeout(player.win, 2000);
    //     } else if (
    //         player.secondScore < dealer.score ||
    //         player.secondScore < dealer.secondScore
    //     ) {
    //         setTimeout(player.lose, 2000);
    //     } else if (player.secondScore == dealer.secondScore) {
    //         setTimeout(player.tie, 2000);
    //     }
    // }
}

const dealer = new Player("dealer");
const player = new Player("player");

btnStart.addEventListener("click", function (e) {
    e.preventDefault;
    mainPage.style.display = "none";
    gamePage.style.display = "block";
    deck.shuffle();

    player.initialCards();
    playerPts.innerHTML = player.initialScore();

    dealer.initialCards();
    // dealerPts.innerHTML = dealer.addScore() - Number(dealer.hand[1].slice(-1));

    // If the total == 21 > display 'Blackjack' & the player wins
    if (player.secondScore == 21) {
        document.getElementById("player-popup").style.display = "block";
        playerPts.style.display = "none";
        textOr.style.display = "none";

        playerEnd();
        showResults();
    }

    console.log(
        deck.newDeck[0],
        deck.newDeck[1],
        deck.newDeck[2],
        dealer.hand,
        player.hand
    ); //testing
});

// When the player clicks the 'Hit' button > add a card to the player hand and add the total point
btnHit.addEventListener("click", function () {
    player.getCard();
    playerPts.innerHTML = player.addScore();
    console.log(deck.newDeck[0], dealer.hand, player.hand); //testing

    // If the total == 21 > display 'Blackjack' & the player wins
    if (player.score == 21) {
        document.getElementById("player-popup").style.display = "block";
        playerSecondPts.style.display = "none";
        playerEnd();
        showResults();
    }
    // If the total exceeds 21 > display 'Bust & the player loses
    else if (player.score > 21) {
        document.getElementById("player-popup").style.display = "block";
        document.getElementById("player-popup").textContent = "Bust!";

        playerEnd();
        showResults();
    }

    if (playerSecondPts.style.display == "inline-block") {
        // If hand includes A & the second Score == 21 > display 'Blackjack' & the player wins
        if (player.secondScore == 21) {
            document.getElementById("player-popup").style.display = "block";
            playerPts.style.display = "none";
            textOr.style.display = "none";
            showResults();
        }
        // If hand includes A & one exceeds 21 > remove it
        else if (player.secondScore > 21) {
            textOr.style.display = "none";
            playerSecondPts.style.display = "none";
            showResults();
        }
    }
});

// When the player clicks the 'Stand' button
// > Show the results div
btnStand.addEventListener("click", function () {
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

// btnPlayAgain.addEventListener("click", reset());

// function reset() {
//     mainPage.style.display = "none";
//     gamePage.style.display = "block";
//     deck.shuffle();

//     player.initialCards();
//     playerPts.innerHTML = player.initialScore();

//     dealer.initialCards();
//     dealerPts.innerHTML = "??";
// }

// Bug found:
// Duplicated cards displayed
// player bust & higher than dealer - wins

// Features that can be added:
// rules

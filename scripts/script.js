//-------- Variables --------//

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

//-------- Main --------//

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
        this.blackjack;
        this.bust;
    }

    // Default state of each player
    default() {
        this.hand = [];
        this.score = 0;
        this.secondScore = 0;
        this.blackjack = false;
        this.bust = false;

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

    // Initial Deal - Deal two cards to each player
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

    // Initial score - sum of the values of the initial cards
    initialScore() {
        for (let i = 0; i < this.hand.length; i++) {
            let lastDigit = this.hand[i].slice(-1);
            if (tenPts.includes(lastDigit)) {
                this.score += 10;
                this.secondScore += 10;
            } else if (lastDigit === "a") {
                this.score += 1;
                this.secondScore = this.score + 10;
                if (player.hand[i].slice(-1) === "a") {
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
    // Referred to the following stackoverflow for Async/Await:
    // https://stackoverflow.com/questions/68143222/trying-to-delay-using-settimeout-in-a-while-loop
    async getCard() {
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

        await new Promise((resolve) => setTimeout(resolve, 100));
        audioFlipCard.play();
        newBack.classList.add("flip");
        newImg.classList.add("flip");
    }

    addScore() {
        for (let i = this.hand.length - 1; i < this.hand.length; i++) {
            let lastDigit = this.hand[i].slice(-1);
            if (tenPts.includes(lastDigit)) {
                this.score += 10;
                this.secondScore += 10;
            } else if (lastDigit === "a") {
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

    // BlackJack - Function when the score === 21
    async showBlackjack() {
        document.getElementById(`${this.role}-or`).style.display = "none";

        await new Promise((resolve) => setTimeout(resolve, 300));
        audioBlackjack.play();
        document.getElementById(`${this.role}-popup`).style.display = "block";
        document.getElementById(`${this.role}-popup`).style.backgroundColor =
            "black";
        document.getElementById(`${this.role}-popup`).textContent =
            "Blackjack!";

        this.blackjack = true;
    }

    // Bust - Function when the score exceeds 21
    async showBust() {
        await new Promise((resolve) => setTimeout(resolve, 300)); //the promise resolves after 30 seconds
        audioBust.play();
        document.getElementById(`${this.role}-popup`).style.display = "block";
        document.getElementById(`${this.role}-popup`).style.backgroundColor =
            "red";
        document.getElementById(`${this.role}-popup`).textContent = "Bust!";
        this.bust = true;
    }
}

// Function to disable all game control buttons
function btnDisabled() {
    btnGameplay.forEach((btn) => {
        btn.disabled = true;
    });
}

// Function to enable all game control buttons
function btnEnabled() {
    btnGameplay.forEach((btn) => {
        btn.disabled = false;
    });
}

// Default function upon starting the game
async function startGame() {
    // Set everything in the game page to default state
    gamePage.style.opacity = 1;
    deck.newDeck = [];
    player.default();
    dealer.default();
    deck.shuffle();

    // Reset game control buttons
    btnControls.style.display = "flex";
    btnDisabled();

    // Deal initial cards for both players
    player.initialCards();
    setTimeout(() => {
        dealer.initialCards();
    }, 500);

    // Generate initial scores for both players
    await new Promise((resolve) => setTimeout(resolve, 2500));

    elementsPlayer.pts.innerHTML = player.initialScore();
    dealer.initialScore();
    btnEnabled();

    // If player has blackjack, end the game
    if (player.secondScore === 21) {
        elementsPlayer.pts.style.display = "none";
        await player.showBlackjack();
        await dealerOpen();
        showResults();
    }
}

// Function to reveal dealer's second card & final score
async function dealerOpen() {
    // Disable the buttons
    btnDisabled();

    // The dealer opens the second card & score is displayed
    audioFlipCard.play();
    document.getElementById("card-back-dealer2").style.display = "none";

    if (dealer.hand[0].slice(-1) === "a" || dealer.hand[1].slice(-1) === "a") {
        elementsDealer.secondPts.innerHTML = dealer.secondScore;
        elementsDealer.or.style.display = "inline-block";
        elementsDealer.secondPts.style.display = "inline-block";

        // if dealer.secondScore is equal or greater than 17 -> dealer holds & game ends
        if (dealer.secondScore >= 17) {
            elementsDealer.pts.style.display = "none";
            elementsDealer.or.style.display = "none";
            if (dealer.secondScore === 21) {
                await dealer.showBlackjack();
            }
            return;
        }
    }

    elementsDealer.pts.innerHTML = dealer.score;

    while (
        dealer.score < 17 ||
        (elementsDealer.secondPts.style.display === "inline-block" &&
            dealer.secondScore < 17)
    ) {
        await new Promise((resolve) => setTimeout(resolve, 800)); //the promise resolves after 30 seconds
        dealer.getCard();
        elementsDealer.pts.innerHTML = dealer.addScore();

        if (elementsDealer.secondPts.style.display === "inline-block") {
            if (dealer.secondScore === 21) {
                elementsDealer.pts.style.display = "none";
                await dealer.showBlackjack();
            } else if (dealer.secondScore > 21) {
                elementsDealer.secondPts.style.display = "none";
                elementsDealer.or.style.display = "none";
            } else if (dealer.secondScore >= 17 && dealer.secondScore < 21) {
                elementsDealer.pts.style.display = "none";
                elementsDealer.or.style.display = "none";
                return;
            }
        }

        // If the total === 21 without A -> display 'Blackjack'
        if (dealer.score === 21) {
            dealer.showBlackjack();
            break;
        }
        // If the total exceeds 21 -> display 'Bust'
        else if (dealer.score > 21) {
            dealer.showBust();
            break;
        } else if (dealer.score >= 17) {
            return;
        }
    }
}

// Compare both hands - show results at the end

// Win
async function win() {
    console.log("win");
    await new Promise((resolve) => setTimeout(resolve, 800));
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "You Win!";
}

// Lose
async function lose() {
    console.log("lose");
    await new Promise((resolve) => setTimeout(resolve, 800));
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "You Lose!";
}

// Tie
async function tie() {
    console.log("tie");
    await new Promise((resolve) => setTimeout(resolve, 800));
    audioEog.play();
    results.style.display = "block";
    eogMsg.textContent = "It's a Tie!";
}

// Function to display eog results pop-up
async function showResults() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Results depending on the blackjack or bust states
    if (
        (player.blackjack && dealer.blackjack) ||
        (player.bust && dealer.bust)
    ) {
        await tie();
        return;
    } else if (
        (!player.blackjack && dealer.blackjack) ||
        (player.bust && !dealer.bust)
    ) {
        await lose();
        return;
    } else if (
        (player.blackjack && !dealer.blackjack) ||
        (!player.bust && dealer.bust)
    ) {
        await win();
        return;
    }

    // Results when there's no blackjack or bust
    // If the player doesn't have A or A is greater than 21
    if (elementsPlayer.secondPts.style.display === "none") {
        if (elementsDealer.secondPts.style.display === "none") {
            if (player.score === dealer.score) {
                await tie();
            } else if (player.score < dealer.score) {
                await lose();
            } else if (player.score > dealer.score) {
                await win();
            }
        } else if (elementsDealer.secondPts.style.display === "inline-block") {
            if (player.score === dealer.secondScore) {
                await tie();
            } else if (player.score < dealer.secondScore) {
                await lose();
            } else if (player.score > dealer.secondScore) {
                await win();
            }
        }

        // If the player has A and is less than 21
    } else if (elementsPlayer.secondPts.style.display === "inline-block") {
        if (elementsDealer.secondPts.style.display === "none") {
            if (player.secondScore === dealer.score) {
                await tie();
            } else if (player.secondScore < dealer.score) {
                await lose();
            } else if (player.secondScore > dealer.score) {
                await win();
            }
        } else if (elementsDealer.secondPts.style.display === "inline-block") {
            if (player.secondScore === dealer.secondScore) {
                await tie();
            } else if (player.secondScore < dealer.secondScore) {
                await lose();
            } else if (player.secondScore > dealer.secondScore) {
                await win();
            }
        }
    }

    gamePage.style.opacity = 0.5;
}

const dealer = new Player("dealer");
const player = new Player("player");

// Event Listeners

// The player clicks the 'Start' button -> start the game
btnStart.addEventListener("click", function (e) {
    e.preventDefault;
    audioClick.play();
    startPage.style.display = "none";
    gamePage.style.display = "grid";

    startGame();
});

// The player clicks the 'Hit' button -> add a card to the player hand and add the total point
btnHit.addEventListener("click", function () {
    audioClick.play();
    player.getCard();
    setTimeout(async () => {
        elementsPlayer.pts.innerHTML = player.addScore();
        console.log(deck.newDeck[0], dealer.hand, player.hand); //testing

        // If the total === 21 -> display 'Blackjack' & the player wins
        if (player.score === 21) {
            elementsPlayer.secondPts.style.display = "none";
            await player.showBlackjack();
            await dealerOpen();
            await showResults();
        }
        // If the total exceeds 21 -> display 'Bust & the player loses
        else if (player.score > 21) {
            await player.showBust();
            await dealerOpen();
            await showResults();
        }

        // If the hand includes A
        if (elementsPlayer.secondPts.style.display === "inline-block") {
            // If the second score is 21 -> display 'Blackjack'
            if (player.secondScore === 21) {
                elementsPlayer.pts.style.display = "none";
                await player.showBlackjack();
                await dealerOpen();
                await showResults();
            }
            // If the second score exceeds 21 -> remove it
            else if (player.secondScore > 21) {
                elementsPlayer.or.style.display = "none";
                elementsPlayer.secondPts.style.display = "none";
            }
        }
    }, 800);
});

// The player clicks the 'Stand' button -> dealer plays -> show the results
btnStand.addEventListener("click", async function () {
    audioClick.play();

    // If the hand has A & secondScore is less than 21 -> display the second score
    if (
        elementsPlayer.secondPts.style.display === "inline-block" &&
        player.secondScore < 21
    ) {
        elementsPlayer.pts.style.display = "none";
        elementsPlayer.or.style.display = "none";
    }

    await dealerOpen();
    await showResults();
});

// The player clicks the 'Play Again' button -> restart the game
btnPlayAgain.addEventListener("click", function (e) {
    audioClick.play();
    e.preventDefault;
    results.style.display = "none";

    startGame();
});

// The player clicks the 'Home' button while in game -> display the main start page
btnHome.addEventListener("click", function () {
    audioClick.play();
    startPage.style.display = "flex";
    gamePage.style.display = "none";
});

// The player clicks the 'Home' button in the eog -> display the main start page
btnEogHome.addEventListener("click", function () {
    audioClick.play();
    results.style.display = "none";
    startPage.style.display = "flex";
    gamePage.style.display = "none";
});

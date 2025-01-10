//-------- Variables --------//

// Game Table
const startPage = document.querySelector(".start-page");
const gamePage = document.querySelector(".in-game");
const rulesPage = document.querySelector(".rules");

// Buttons
const btnStart = document.getElementById("btn-start");
const btnControls = document.querySelector(".game-controls");
const btnGameplay = document.querySelectorAll(".game-controls button");
const btnHit = document.getElementById("btn-hit");
const btnStand = document.getElementById("btn-stand");
const btnHome = document.querySelectorAll(".btn-home");
const btnPlayAgain = document.getElementById("btn-play-again");
const btnRules = document.getElementById("btn-rules");

// EOG
const results = document.querySelector(".results");
const eogMsg = document.getElementById("player-message");

// Audio Object
const audio = {
    click: new Audio("audio/click.mp3"),
    flipCard: new Audio("audio/flipcard.mp3"),
    blackjack: new Audio("audio/blackjack.mp3"),
    bust: new Audio("audio/bust.mp3"),
    eog: new Audio("audio/eog.mp3"),
};

//-------- Main (Objects/Methods/Functions)--------//

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
        this.cardsInHand = document.getElementById(`${this.role}-cards`);

        this.scoreEl = {
            pts: document.getElementById(`${this.role}-pts-value-one`),
            secondPts: document.getElementById(`${this.role}-pts-value-two`),
            or: document.getElementById(`${this.role}-or`),
            popup: document.getElementById(`${this.role}-popup`),
        };
    }

    // Default state of each player
    default() {
        this.hand = [];
        this.score = 0;
        this.secondScore = 0;
        this.blackjack = false;
        this.bust = false;

        // Default Score Display
        this.scoreEl.pts.style.display = "inline-block";
        this.scoreEl.secondPts.style.display = "none";
        this.scoreEl.or.style.display = "none";
        this.scoreEl.popup.style.display = "none";
        player.scoreEl.pts.textContent = "0";
        dealer.scoreEl.pts.textContent = "🃏";

        // Remove all cards in hand
        let countImg = this.cardsInHand.childElementCount;
        for (let i = 0; i < countImg; i++) {
            this.cardsInHand.removeChild(this.cardsInHand.firstChild);
        }
    }

    // Initial Deal - Deal two cards to each player
    initialCards() {
        for (let i = 0; i < 2; i++) {
            this.hand.push(deck.newDeck.shift());
            const newImg = document.createElement("img");
            const newBack = document.createElement("img");
            newImg.src = `images/${this.hand[i]}.svg`;
            newImg.classList.add("card-front");

            newBack.src = `images/back.svg`;
            newBack.id = `card-back-${this.role}${i + 1}`;
            newBack.classList.add("card-back");

            // Referred to the following stackoverflow for appendChild with Animation
            // https://stackoverflow.com/questions/68143222/trying-to-delay-using-settimeout-in-a-while-loop
            setTimeout(() => {
                audio.flipCard.play();
                this.cardsInHand.appendChild(newImg);
                this.cardsInHand.appendChild(newBack);
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
                    player.scoreEl.or.style.display = "inline-block";
                    player.scoreEl.secondPts.style.display = "inline-block";
                }
            } else {
                this.score += Number(lastDigit);
                this.secondScore += Number(lastDigit);
            }
        }
        player.scoreEl.secondPts.textContent = player.secondScore;
        return this.score;
    }

    // Functions upon adding cards to the hand
    // Referred to the following stackoverflow for Async/Await:
    // https://stackoverflow.com/questions/68143222/trying-to-delay-using-settimeout-in-a-while-loop
    async getCard() {
        this.hand.push(deck.newDeck.shift());
        const newImg = document.createElement("img");
        const newBack = document.createElement("img");

        newImg.src = `images/${this.hand[this.hand.length - 1]}.svg`;
        newImg.classList.add("card-front");
        newBack.src = `images/back.svg`;
        newBack.classList.add("card-back");

        this.cardsInHand.appendChild(newImg);
        this.cardsInHand.appendChild(newBack);

        await new Promise((resolve) => setTimeout(resolve, 100));
        audio.flipCard.play();
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
                this.scoreEl.or.style.display = "inline-block";
                this.scoreEl.secondPts.style.display = "inline-block";
            } else {
                this.score += Number(lastDigit);
                this.secondScore += Number(lastDigit);
            }
        }
        this.scoreEl.secondPts.textContent = this.secondScore;
        return this.score;
    }

    // BlackJack - Function when the score === 21
    async showBlackjack() {
        this.blackjack = true;
        this.scoreEl.or.style.display = "none";

        await new Promise((resolve) => setTimeout(resolve, 300));
        audio.blackjack.play();
        this.scoreEl.popup.style.display = "block";
        this.scoreEl.popup.style.backgroundColor = "black";
        this.scoreEl.popup.textContent = "Blackjack!";
    }

    // Bust - Function when the score exceeds 21
    async showBust() {
        this.bust = true;

        await new Promise((resolve) => setTimeout(resolve, 300));
        audio.bust.play();
        this.scoreEl.popup.style.display = "block";
        this.scoreEl.popup.style.backgroundColor = "red";
        this.scoreEl.popup.textContent = "Bust!";
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

    player.scoreEl.pts.textContent = player.initialScore();
    dealer.initialScore();
    btnEnabled();

    // If player has blackjack -> end the game
    if (player.secondScore === 21) {
        player.scoreEl.pts.style.display = "none";
        await player.showBlackjack();
        await dealerOpen();
        await showResults();
    }
}

// Function to reveal dealer's second card & final score
async function dealerOpen() {
    // Disable the buttons
    btnDisabled();

    // The dealer opens the second card & score is displayed
    audio.flipCard.play();
    document.getElementById("card-back-dealer2").style.display = "none";

    if (dealer.hand[0].slice(-1) === "a" || dealer.hand[1].slice(-1) === "a") {
        dealer.scoreEl.secondPts.textContent = dealer.secondScore;
        dealer.scoreEl.or.style.display = "inline-block";
        dealer.scoreEl.secondPts.style.display = "inline-block";

        // if dealer.secondScore is equal or greater than 17 -> dealer holds & game ends
        if (dealer.secondScore >= 17) {
            dealer.scoreEl.pts.style.display = "none";
            dealer.scoreEl.or.style.display = "none";
            if (dealer.secondScore === 21) {
                await dealer.showBlackjack();
            }
            return;
        }
    }

    dealer.scoreEl.pts.textContent = dealer.score;

    while (
        dealer.score < 17 ||
        (dealer.scoreEl.secondPts.style.display === "inline-block" &&
            dealer.secondScore < 17)
    ) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        dealer.getCard();
        dealer.scoreEl.pts.textContent = dealer.addScore();

        if (dealer.scoreEl.secondPts.style.display === "inline-block") {
            if (dealer.secondScore === 21) {
                dealer.scoreEl.pts.style.display = "none";
                await dealer.showBlackjack();
                return;
            } else if (dealer.secondScore > 21) {
                dealer.scoreEl.secondPts.style.display = "none";
                dealer.scoreEl.or.style.display = "none";
            } else if (dealer.secondScore >= 17 && dealer.secondScore < 21) {
                dealer.scoreEl.pts.style.display = "none";
                dealer.scoreEl.or.style.display = "none";
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

// End of Game Results Text
const eogMsgText = ["It's a Tie!", "You Lose!", "You Win!"];

async function eog(result) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    audio.eog.play();
    results.style.display = "block";

    let i;
    if (result == "tie") {
        i = 0;
    } else if (result == "lose") {
        i = 1;
    } else if (result == "win") {
        i = 2;
    }
    eogMsg.textContent = eogMsgText[i];
}

// Function to display eog results pop-up
async function showResults() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Results depending on the blackjack or bust states
    if (
        (player.blackjack && dealer.blackjack) ||
        (player.bust && dealer.bust)
    ) {
        await eog("tie");
        return;
    } else if (
        (!player.blackjack && dealer.blackjack) ||
        (player.bust && !dealer.bust)
    ) {
        await eog("lose");
        return;
    } else if (
        (player.blackjack && !dealer.blackjack) ||
        (!player.bust && dealer.bust)
    ) {
        await eog("win");
        return;
    }

    // Results when there's no blackjack or bust
    // If the player doesn't have A or A is greater than 21
    if (player.scoreEl.secondPts.style.display === "none") {
        if (dealer.scoreEl.secondPts.style.display === "none") {
            if (player.score === dealer.score) {
                await eog("tie");
            } else if (player.score < dealer.score) {
                await eog("lose");
            } else if (player.score > dealer.score) {
                await eog("win");
            }
        } else if (dealer.scoreEl.secondPts.style.display === "inline-block") {
            if (player.score === dealer.secondScore) {
                await eog("tie");
            } else if (player.score < dealer.secondScore) {
                await eog("lose");
            } else if (player.score > dealer.secondScore) {
                await eog("win");
            }
        }

        // If the player has A and is less than 21
    } else if (player.scoreEl.secondPts.style.display === "inline-block") {
        if (dealer.scoreEl.secondPts.style.display === "none") {
            if (player.secondScore === dealer.score) {
                await eog("tie");
            } else if (player.secondScore < dealer.score) {
                await eog("lose");
            } else if (player.secondScore > dealer.score) {
                await eog("win");
            }
        } else if (dealer.scoreEl.secondPts.style.display === "inline-block") {
            if (player.secondScore === dealer.secondScore) {
                await eog("tie");
            } else if (player.secondScore < dealer.secondScore) {
                await eog("lose");
            } else if (player.secondScore > dealer.secondScore) {
                await eog("win");
            }
        }
    }

    gamePage.style.opacity = 0.5;
}

const dealer = new Player("dealer");
const player = new Player("player");

//-------- Event Listeners --------//

// The player clicks the 'Start' button -> start the game
btnStart.addEventListener("click", function () {
    audio.click.play();
    startPage.style.display = "none";
    gamePage.style.display = "grid";

    startGame();
});

// The player clicks the 'Hit' button -> add a card to the player hand and add the total point
btnHit.addEventListener("click", function () {
    audio.click.play();
    player.getCard();
    setTimeout(async () => {
        player.scoreEl.pts.textContent = player.addScore();

        // If the total === 21 -> display 'Blackjack' & the player wins
        if (player.score === 21) {
            player.scoreEl.secondPts.style.display = "none";
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
        if (player.scoreEl.secondPts.style.display === "inline-block") {
            // If the second score is 21 -> display 'Blackjack'
            if (player.secondScore === 21) {
                player.scoreEl.pts.style.display = "none";
                await player.showBlackjack();
                await dealerOpen();
                await showResults();
            }
            // If the second score exceeds 21 -> remove it
            else if (player.secondScore > 21) {
                player.scoreEl.or.style.display = "none";
                player.scoreEl.secondPts.style.display = "none";
            }
        }
    }, 800);
});

// The player clicks the 'Stand' button -> dealer plays -> show the results
btnStand.addEventListener("click", async function () {
    audio.click.play();

    // If the hand has A & secondScore is less than 21 -> display the second score
    if (
        player.scoreEl.secondPts.style.display === "inline-block" &&
        player.secondScore < 21
    ) {
        player.scoreEl.pts.style.display = "none";
        player.scoreEl.or.style.display = "none";
    }

    await dealerOpen();
    await showResults();
});

// The player clicks the 'Play Again' button -> restart the game
btnPlayAgain.addEventListener("click", function () {
    audio.click.play();
    results.style.display = "none";

    startGame();
});

// The player clicks the 'Home' button in game or in the eog -> display the main start page
btnHome.forEach((btn) => {
    btn.addEventListener("click", function () {
        audio.click.play();
        startPage.style.display = "flex";
        gamePage.style.display = "none";
        results.style.display = "none";
        rulesPage.style.display = "none";
    });
});

btnRules.addEventListener("click", function () {
    audio.click.play();
    startPage.style.display = "none";
    gamePage.style.display = "none";
    rulesPage.style.display = "flex";
});

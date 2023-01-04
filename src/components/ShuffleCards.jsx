import PrimaryButton from "./PrimaryButton";
import "../App.css";
import { useEffect, useState } from "react";

const ShuffleCards = () => {
  let [yourSum, setYourSum] = useState(0);
  let [dealerSum, setDealerSum] = useState(0);

  var dealerAceCount = 0;
  var yourAceCount = 0;

  let [hidden, setHidden] = useState(null);

  var deck;

  var canHit = true;
  window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
  };

  function buildDeck() {
    let values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    let types = ["♦️", "♥️", "♣️", "♠️"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + `` + types[i]);
      }
    }
  }

  function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
      let j = Math.floor(Math.random() * deck.length);
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    console.log(deck);
  }

  const startGame = () => {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
      let cardContainer = document.createElement("div");
      let card = deck.pop();
      cardContainer.innerHTML = ` ${card}`;
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      document.getElementById("dealer-cards").append(cardContainer);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
      let cardContainer = document.createElement("div");
      let card = deck.pop();
      cardContainer.innerHTML = ` ${card}`;
      yourSum += getValue(card);
      yourAceCount += checkAce(card);
      document.getElementById("your-cards").append(cardContainer);
    }
  };

  function hit() {
    if (!canHit) {
      return;
    }

    let cardContainer = document.createElement("div");
    let card = deck.pop();
    cardContainer.innerHTML = ` ${card}`;
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardContainer);

    if (reduceAce(yourSum, yourAceCount) > 21) {
      canHit = false;
    }
  }

  const [message, setMessage] = useState("");

  function stay() {
    setDealerSum(reduceAce(dealerSum, dealerAceCount));
    setYourSum(reduceAce(yourSum, yourAceCount));

    canHit = false;
    setHidden(hidden);

    if (dealerSum > 21 && yourSum > 21) {
      setMessage(
        `Both loses, your total score this round was ${yourScore} points`
      );
    } else if (dealerSum > 21) {
      setMessage("You Win!");
    } else if (yourSum > 21) {
      setMessage(
        `You lost, your total score this round was ${yourScore} points`
      );
    } else if (yourSum === dealerSum) {
      setMessage("Tie!");
    } else if (yourSum > dealerSum) {
      setMessage("You Win!");
    } else if (yourSum < dealerSum) {
      setMessage(
        `You lost, your total score this round was ${yourScore} points`
      );
    }

    console.log(yourSum);
  }

  function getValue(card) {
    let data = card.split("");
    let value = data[0];

    if (isNaN(value)) {
      if (value === "A") {
        return 11;
      }
      if (value === "K" || "Q" || "J") {
        return 10;
      }
      if (value === "10") {
        return 10;
      }
      if (value === "9") {
        return 9;
      }
    }
    return parseInt(value);
  }

  function checkAce(card) {
    if (card[0] === "A") {
      return 1;
    }
    return 0;
  }

  function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
      playerSum -= 10;
      playerAceCount -= 1;
    }
    return playerSum;
  }

  const [yourScore, setScore] = useState(0);
  const [highScore, setHighscore] = useState(0);

  useEffect(() => {
    let newScore = 0;
    if (message === "You Win!" || message === "Tie!") {
      setScore((newScore += yourScore + yourSum));
    }
    if (
      message ===
        `Both loses, your total score this round was ${yourScore} points` ||
      message ===
        `You lost, your total score this round was ${yourScore} points`
    ) {
      setScore(0);

      if (yourScore > highScore) {
        setHighscore(yourScore);
      }
    }
  }, [yourSum]);

  const LOCAL_STORAGE_KEY = `Blackjack.app`;
  const SESSION_STORAGE_KEY = `Blackjack1.app`;

  useEffect(() => {
    const storedHighscore = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedHighscore) setScore(storedHighscore);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(yourScore));
  }, [yourScore]);

  useEffect(() => {
    const storedTopTen = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY)
    );
    if (storedTopTen) setHighscore(storedTopTen);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(highScore));
  }, [highScore]);

  return (
    <div>
      <div id="hitNstay">
        <PrimaryButton disableBtn={false} text={"Hit"} onClick={hit} />
        <PrimaryButton disableBtn={false} text={"Stay"} onClick={stay} />
      </div>
      <h2 id="dealer-sum">Dealer: {dealerSum}</h2>
      <div id="dealer-cards">
        <div id="hidden">
          <p id="hidden-tag">{hidden != null ? null : "Hidden Card"}</p>
          {hidden}
        </div>
      </div>

      <h1 id="results">{message} </h1>

      <h2 id="your-sum">You: {yourSum}</h2>
      <div id="your-cards"></div>
      <h2>Score:</h2>
      <p id="score">{yourScore}. points</p>
      <br />
      <hr />

      <div id="Highscore">
        <h1>Your Highest Score:</h1>
        <h2> {highScore}. points</h2>
      </div>
    </div>
  );
};

export default ShuffleCards;

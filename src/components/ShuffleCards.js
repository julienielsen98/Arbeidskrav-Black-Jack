import PrimaryButton from "./PrimaryButton";

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
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + "-" + types[i]);
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
      let cardImg = document.createElement("div");
      let card = deck.pop();
      cardImg.innerHTML = ` ${card}`;
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
      let cardImg = document.createElement("div");
      let card = deck.pop();
      cardImg.innerHTML = ` ${card}`;
      yourSum += getValue(card);
      yourAceCount += checkAce(card);
      document.getElementById("your-cards").append(cardImg);
    }
  };

  function hit() {
    if (!canHit) {
      return;
    }

    let cardImg = document.createElement("div");
    let card = deck.pop();
    cardImg.innerHTML = ` ${card}`;
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

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
      setMessage("Both Loses!");
    } else if (dealerSum > 21) {
      setMessage("You Win!");
    } else if (yourSum > 21) {
      setMessage(" You Lost!");
    } else if (yourSum === dealerSum) {
      setMessage("Tie!");
    } else if (yourSum > dealerSum) {
      setMessage("You Win!");
    } else if (yourSum < dealerSum) {
      setMessage("You Lost!");
    }

    console.log(yourSum);
  }

  function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
      if (value === "A") {
        return 11;
      }
      return 10;
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

  const [highScore, setHighScore] = useState(0);
  const [topTenList, setTopTenList] = useState(0);

  useEffect(() => {
    let newScore = 0;
    if (message === "You Win!" || message === "Tie!") {
      setHighScore((newScore += highScore + yourSum));
      console.log(highScore);
      console.log(newScore);
    }
    if (message === "Both Loses!" || message === "You Lost!") {
      setHighScore(0);
      setMessage(`You lost, your total score this round was ${highScore}`);

      if (highScore > topTenList) {
        setTopTenList(highScore);
      }
    }
  }, [yourSum]);

  const LOCAL_STORAGE_KEY = `Blackjack.app`;
  const SESSION_STORAGE_KEY = `Blackjack1.app`;

  useEffect(() => {
    const storedHighscore = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedHighscore) setHighScore(storedHighscore);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(highScore));
  }, [highScore]);

  useEffect(() => {
    const storedTopTen = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY)
    );
    if (storedTopTen) setTopTenList(storedTopTen);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(topTenList));
  }, [topTenList]);

  return (
    <div>
      <div id="dealer-cards">
        <h1 id="dealer-sum">Dealer: {dealerSum}</h1>
        <div id="hidden">
          Hidden Card: {<br />}
          {hidden}
        </div>
      </div>
      <hr />
      <div id="your-cards">
        <h1 id="your-sum">You: {yourSum}</h1>
      </div>

      <PrimaryButton disableBtn={false} text={"Hit"} onClick={hit} />
      <PrimaryButton disableBtn={false} text={"Stay"} onClick={stay} />

      <p id="results">{message}</p>

      <p id="highscore">Your highScore: {highScore}</p>
      <hr />
      <ul id="TOP 10:">
        TOP 10:
        <li>{topTenList}</li>
      </ul>
    </div>
  );
};

export default ShuffleCards;

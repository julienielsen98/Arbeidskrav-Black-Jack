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
      let cardImg = document.createElement("div");
      let card = deck.pop();
      cardImg.innerHTML = ` ${card}`;
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(`Dealer sum: ${dealerSum}`);

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
      setMessage(
        `Both loses, your total score this round was ${highScore} points`
      );
    } else if (dealerSum > 21) {
      setMessage("You Win!");
    } else if (yourSum > 21) {
      setMessage(
        `You lost, your total score this round was ${highScore} points`
      );
    } else if (yourSum === dealerSum) {
      setMessage("Tie!");
    } else if (yourSum > dealerSum) {
      setMessage("You Win!");
    } else if (yourSum < dealerSum) {
      setMessage(
        `You lost, your total score this round was ${highScore} points`
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
  const [topTenList, setTopTenList] = useState([0]);

  useEffect(
    (e) => {
      let newScore = 0;
      if (message === "You Win!" || message === "Tie!") {
        setHighScore((newScore += yourSum + highScore));
        console.log(highScore);
        console.log(newScore);
      }
      if (
        message ===
          `Both loses, your total score this round was ${highScore} points` ||
        message ===
          `You lost, your total score this round was ${highScore} points`
      )
        setHighScore(0);
      {
        if (highScore > topTenList[0]) {
          setTopTenList((prevList) => [highScore, ...prevList]);
        }
      }
    },
    [yourSum]
  );

  const LOCAL_STORAGE_KEY1 = `HIGHSCORE VALUES`;
  const LOCAL_STORAGE_KEY2 = `TOP TEN SCORE VALUES`;

  useEffect(() => {
    const storedHighscore = JSON.parse(
      sessionStorage.getItem(LOCAL_STORAGE_KEY1)
    );
    if (storedHighscore) setHighScore(storedHighscore);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(LOCAL_STORAGE_KEY1, JSON.stringify(highScore));
  }, [highScore]);

  useEffect(() => {
    const storedTopTen = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY2));
    if (storedTopTen) setTopTenList(storedTopTen);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY2, JSON.stringify(topTenList));
    console.log(`TopTenList:${topTenList}`);
  }, [topTenList]);

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
      <h1 id="results">{message}</h1>
      <br />
      <h2 id="your-sum">You: {yourSum}</h2>
      <div id="your-cards"></div>
      <h2>Score:</h2>
      <p id="highscore">{highScore}. points</p>
      <br />
      <hr />

      <div id="TOP-10">
        <h1>Highest Score:</h1>
        <ol>
          <li>
            {topTenList.map((item, i) => (
              <p key={i}>{item}. points</p>
            ))}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ShuffleCards;

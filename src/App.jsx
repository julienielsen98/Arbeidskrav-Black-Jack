import { useState, useEffect } from "react";
import "./App.css";
import PrimaryButton from "./components/PrimaryButton";
import ShuffleCards from "./components/ShuffleCards";

function App() {
  function reload() {
    window.location.reload(false);
  }
  return (
    <div className="App">
      <header className="App-header">Black Jack Game</header>
      <hr />
      <PrimaryButton disableBtn={false} text={"reload"} onClick={reload} />
      <hr />
      <ShuffleCards />
    </div>
  );
}

export default App;

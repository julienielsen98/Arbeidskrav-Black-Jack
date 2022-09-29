import "./App.css";
import PrimaryButton from "./components/PrimaryButton";
import ShuffleCards from "./components/ShuffleCards";

function App() {
  function reload() {
    window.location.reload(false);
  }
  return (
    <div className="App">
      <header className="App-header">BLACKJACK</header>

      <PrimaryButton
        className="reload-button"
        disableBtn={false}
        text={"Restart"}
        onClick={reload}
      />
      <div className="cards-container">
        <ShuffleCards />
      </div>
    </div>
  );
}

export default App;

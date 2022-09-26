import "./App.css";
import ShuffleCards from "./components/ShuffleCards";

function App() {
  return (
    <div className="App">
      <header className="App-header">Black Jack Game</header>

      {
        <div>
          <h2>
            Dealer: <span id="dealer-sum"></span>
          </h2>
          <div id="dealer-cards">
            <div id="hidden">Hidden card</div>
          </div>

          <h2>
            You: <span id="your-sum"></span>
          </h2>
        </div>
      }
      <div id="your-cards"></div>

      <ShuffleCards />
      <p id="results"></p>
    </div>
  );
}

export default App;

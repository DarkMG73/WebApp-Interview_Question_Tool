import "./App.css";
import Home from "./pages/Home/Home";
import CardPrimary from "./UI/Cards/Card-Primary/Card-Primary";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CardPrimary>
          <Header />
        </CardPrimary>
      </header>
      <Home />
    </div>
  );
}

export default App;

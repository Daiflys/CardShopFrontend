import Header from "./components/Header";
import Banner from "./components/Banner";
import Trends from "./components/Trends";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto">
        <Banner />
        <Trends />
      </main>
    </div>
  );
}

export default App;

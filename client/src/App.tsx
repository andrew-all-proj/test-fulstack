import { useState } from "react";
import LeftPane from "./components/LeftPane";
import RightPane from "./components/RightPane";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <h1 className="title">Тестовое задание на фулстек разработчика</h1>
      <div className="panes">
        <LeftPane onDataChanged={handleDataChanged} refreshKey={refreshKey} />
        <RightPane refreshKey={refreshKey} onDataChanged={handleDataChanged} />
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";

import "./global.css";

import "./App.css";
import "./Sidebar.css";
import "./Main.css";

import api from "./services/api";

import Dev from "./components/Dev";
import DevForm from "./components/DevForm";

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const res = await api.get("/devs");

      setDevs(res.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const res = await api.post("devs", data);

    setDevs([...devs, res.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>

        <DevForm onSubmit={handleAddDev}></DevForm>
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <Dev key={dev._id} dev={dev}></Dev>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;

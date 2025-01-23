import React, { useState, useEffect } from "react";
import RotationCanvas from "./components/RotationCanvas";
import DataTable from "./components/DataTable";
import StartButton from "./components/StartButton";

const App = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({
    positionX: 0,
    positionY: 0,
    angle: 0,
    scale: 1,
  });

  const backendBaseURL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000";
  const wsBaseURL = process.env.REACT_APP_WS_BASE_URL || "ws://localhost:8000/ws";

  useEffect(() => {
    const ws = new WebSocket(wsBaseURL);

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setCurrent(parsedData);
      setData((prev) => [...prev, parsedData].slice(-10));
    };

    ws.onclose = () => console.log("WebSocket cerrado.");

    return () => ws.close();
  }, [wsBaseURL]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Visualización de Ejecuciones</h1>
      <StartButton backendBaseURL={backendBaseURL} />
      <RotationCanvas {...current} />
      <DataTable data={data} />
    </div>
  );
};

export default App;

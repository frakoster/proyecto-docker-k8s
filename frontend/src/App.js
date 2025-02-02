import React, { useState, useEffect } from "react";
import RotationCanvas from "./components/RotationCanvas";
import DataTable from "./components/DataTable";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({
    positionX: 0,
    positionY: 0,
    angle: 0,
    scale: 1,
  });
  const [ws, setWs] = useState(null);
  const [isRotating, setIsRotating] = useState(false);

  const backendBaseURL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000";
  const wsBaseURL = process.env.REACT_APP_WS_BASE_URL || "ws://localhost:8000/ws";

  const startRotation = () => {
    if (ws) {
      ws.close(); // Cerrar cualquier conexión existente antes de abrir una nueva
    }

    const websocket = new WebSocket(wsBaseURL);
    setWs(websocket);
    setIsRotating(true);

    websocket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("WebSocket Data:", parsedData);
        setCurrent(parsedData);
        setData((prev) => [...prev, parsedData].slice(-10));
      } catch (error) {
        console.error("Error al procesar datos del WebSocket:", error);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket cerrado.");
      setIsRotating(false);
    };
  };

  const stopRotation = async () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("STOP");
      console.log("Señal STOP enviada al servidor.");
      ws.close(); // Cerrar el WebSocket al detener la rotación
      setWs(null);
      setIsRotating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close(); // Asegurar que el WebSocket se cierre al desmontar el componente
      }
    };
  }, [ws]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Visualización de Rotación</h1>
      <RotationCanvas {...current} />
      {!isRotating ? (
        <button onClick={startRotation}>Iniciar Rotación</button>
      ) : (
        <button onClick={stopRotation}>Detener Rotación</button>
      )}
    </div>
  );
};

export default App;
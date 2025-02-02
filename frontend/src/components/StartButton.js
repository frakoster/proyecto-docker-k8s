import React, { useState } from "react";
import axios from "axios";

const StartButton = ({ backendBaseURL }) => {
  const [loading, setLoading] = useState(false);

  const startExecution = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendBaseURL}/start`);
      alert(`Ejecución iniciada: ID ${response.data.execution_id}`);
    } catch (error) {
      alert("Error al iniciar la ejecución.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startExecution}
      style={{ margin: "20px" }}
      disabled={loading}
    >
      {loading ? "Iniciando..." : "Iniciar Ejecución"}
    </button>
  );
};

export default StartButton;
import React from "react";
import axios from "axios";

const StartButton = ({ backendBaseURL }) => {
  const startExecution = async () => {
    try {
      const response = await axios.post(`${backendBaseURL}/start`);
      alert(`Ejecución iniciada: ID ${response.data.execution_id}`);
    } catch (error) {
      alert("Error al iniciar la ejecución.");
      console.error(error);
    }
  };

  return (
    <button onClick={startExecution} style={{ margin: "20px" }}>
      Iniciar Ejecución
    </button>
  );
};

export default StartButton;

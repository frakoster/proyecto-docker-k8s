import React from "react";

const DataTable = ({ data }) => {
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return "No Disponible"; // Manejo de valores nulos o indefinidos

      // Convertir a objeto Date
      const date = new Date(timestamp);

      // Validar si es una fecha válida
      if (isNaN(date.getTime())) {
        return "Formato Inválido";
      }

      // Retornar la hora en formato legible
      return date.toLocaleTimeString();
    } catch (error) {
      return "Error al formatear";
    }
  };

  return (
    <table border="1" style={{ margin: "20px auto", width: "80%" }}>
      <thead>
        <tr>
          <th>Posición X</th>
          <th>Posición Y</th>
          <th>Ángulo</th>
          <th>Escala</th>
          <th>Hora de Actualización</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.positionX.toFixed(2)}</td>
            <td>{row.positionY.toFixed(2)}</td>
            <td>{row.angle.toFixed(2)}°</td>
            <td>{row.scale.toFixed(2)}</td>
            <td>{formatDate(row.timestamp)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

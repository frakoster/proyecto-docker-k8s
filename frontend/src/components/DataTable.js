import React from "react";

const DataTable = ({ data }) => {
  return (
    <table border="1" style={{ margin: "20px auto", width: "80%" }}>
      <thead>
        <tr>
          <th>Posición X</th>
          <th>Posición Y</th>
          <th>Ángulo</th>
          <th>Escala</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.positionX.toFixed(2)}</td>
            <td>{row.positionY.toFixed(2)}</td>
            <td>{row.angle.toFixed(2)}°</td>
            <td>{row.scale.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

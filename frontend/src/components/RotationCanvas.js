import React, { useRef, useEffect } from "react";

const RotationCanvas = ({ positionX, positionY, angle, scale }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el triángulo escalado y rotado
      ctx.save();
      ctx.translate(canvas.width / 2 + positionX, canvas.height / 2 + positionY);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Triángulo
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(43, 25);
      ctx.lineTo(-43, 25);
      ctx.closePath();
      ctx.fillStyle = "blue";
      ctx.fill();

      ctx.restore();

      // Agregar texto con la información
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(`Posición X: ${positionX.toFixed(2)}`, 10, 20);
      ctx.fillText(`Posición Y: ${positionY.toFixed(2)}`, 10, 40);
      ctx.fillText(`Ángulo: ${angle.toFixed(2)}°`, 10, 60);
      ctx.fillText(`Escala: ${scale.toFixed(2)}`, 10, 80);
    };

    draw();
  }, [positionX, positionY, angle, scale]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default RotationCanvas;
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
    };

    draw();
  }, [positionX, positionY, angle, scale]);

  return <canvas ref={canvasRef} width={500} height={500} style={{ border: "1px solid black" }} />;
};

export default RotationCanvas;

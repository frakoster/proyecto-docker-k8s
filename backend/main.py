import logging
import asyncio
from math import sin, cos, radians
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Configuración de la base de datos
DATABASE_URL = "postgresql://postgres:password@db/executions"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos de la base de datos
class Execution(Base):
    __tablename__ = "executions"
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    movements = relationship("Movement", back_populates="execution")

class Movement(Base):
    __tablename__ = "movements"
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("executions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    position_x = Column(Float)
    position_y = Column(Float)
    angle = Column(Float)
    scale = Column(Float)
    execution = relationship("Execution", back_populates="movements")

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Configuración de FastAPI
app = FastAPI()

# Configuración de logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

# Middleware para permitir CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta para iniciar una nueva ejecución
@app.post("/start")
async def start_execution():
    db = SessionLocal()
    execution = Execution()
    try:
        db.add(execution)
        db.commit()
        db.refresh(execution)
        logging.info(f"Ejecución iniciada con ID: {execution.id}")
        return {"message": "Ejecución iniciada", "execution_id": execution.id}
    except Exception as e:
        db.rollback()
        logging.error(f"Error al iniciar la ejecución: {e}")
        return {"error": "No se pudo iniciar la ejecución"}
    finally:
        db.close()

# Ruta WebSocket para datos en tiempo real
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    db = SessionLocal()
    try:
        logging.info("Intentando aceptar conexión WebSocket")
        await websocket.accept()
        logging.info("Conexión WebSocket aceptada")
        angle = 0

        # Crear una nueva ejecución para los movimientos
        execution = Execution()
        db.add(execution)
        db.commit()
        db.refresh(execution)
        execution_id = execution.id

        while True:
            angle = (angle + 5) % 360
            x = cos(radians(angle)) * 5
            y = sin(radians(angle)) * 5
            scale = 1 + 0.1 * sin(radians(angle))

            # Guardar movimiento en la base de datos
            movement = Movement(
                execution_id=execution_id,
                position_x=x,
                position_y=y,
                angle=angle,
                scale=scale
            )
            db.add(movement)
            db.commit()

            # Enviar datos dinámicos por WebSocket
            await websocket.send_json({
                "positionX": x,
                "positionY": y,
                "angle": angle,
                "scale": scale,
            })
            await asyncio.sleep(1.0)  # Pausa de 1.0 segundos entre iteraciones
    except WebSocketDisconnect:
        logging.warning("WebSocket desconectado.")
    except Exception as e:
        logging.error(f"Error en WebSocket: {e}")
    finally:
        db.close()
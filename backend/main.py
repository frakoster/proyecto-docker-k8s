import logging
import asyncio
from math import sin, cos, radians
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
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
    end_time = Column(DateTime, nullable=True)
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

# Variable de control para la rotación
is_rotating = True

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

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ruta para iniciar una nueva ejecución
@app.post("/start")
async def start_execution(db: Session = Depends(get_db)):
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

# Ruta WebSocket para datos en tiempo real
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global is_rotating
    db = SessionLocal()
    execution_id = None
    try:
        await websocket.accept()
        logging.info("Conexión WebSocket aceptada")

        execution = Execution()
        db.add(execution)
        db.commit()
        db.refresh(execution)
        execution_id = execution.id

        angle = 0
        is_rotating = True  # Reiniciar al iniciar una nueva conexión

        while is_rotating:
            try:
                # Verificar si hay mensaje WebSocket para detener la rotación
                message = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                if message == "STOP":
                    logging.info("Rotación detenida por el cliente WebSocket.")
                    
                    # Actualizar end_time en la base de datos
                    execution.end_time = datetime.utcnow()
                    db.commit()
                    
                    is_rotating = False
                    break
            except asyncio.TimeoutError:
                pass  # No se recibió mensaje, continuar con la rotación

            # Simulación de movimiento en círculo
            angle = (angle + 5) % 360
            x = cos(radians(angle)) * 5
            y = sin(radians(angle)) * 5
            scale = 1 + 0.1 * sin(radians(angle))
            timestamp = datetime.utcnow()

            movement = Movement(
                execution_id=execution_id,
                position_x=x,
                position_y=y,
                angle=angle,
                scale=scale,
                timestamp=timestamp
            )
            db.add(movement)
            db.commit()

            await websocket.send_json({
                "positionX": x,
                "positionY": y,
                "angle": angle,
                "scale": scale,
                "timestamp": timestamp.isoformat()
            })
            await asyncio.sleep(1.0)

        logging.info("Rotación detenida en el backend.")

    except WebSocketDisconnect:
        logging.warning("WebSocket desconectado.")
    except Exception as e:
        logging.error(f"Error en WebSocket: {e}")
    finally:
        db.close()

# Agregar un log para identificar los parámetros enviados desde el frontend
def log_frontend_parameters(endpoint: str, params: dict):
    logging.info(f"Solicitud recibida en {endpoint} con parámetros: {params}")

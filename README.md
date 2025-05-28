# Información sobre el proyecto y su ejecución

## 1.  Iniciar el proyecto 
Para iniciar el sistema debes estar en el directorio raíz "proyecto-docker-k8s", y ejecutar el siguiente comando:
    
   ```bash
   $sudo docker compose up
   ```

## 2. Detener el proyecto
Para detener el sistema debes estar en el directorio raíz del proyecto "proyecto-docker-k8s", y ejecutar el siguiente comando:
  ```bash
    $sudo docker compose stop
  ```
## 3.Eliminar el proyecto 
Para eliminar el proyecto debes estar en el directorio raíz del proyecto "proyecto-docker-k8s", y ejecutar el siguiente comando:
  ```bash
    $sudo docker compose down
  ```
## 4.Visualización del sistema
Abrir el navegador y cargar la siguiente url: http://localhost:3000

Verás el siguiente frontend:

![forntend](https://github.com/user-attachments/assets/40a9da38-55dc-4bcf-9ce1-97b1737a8b95)

Al presionar "Iniciar Rotación" se creará una instancia de rotación en el backend, la que será almacenada
en la base de datos y luego transmitida al frontend, donde podras visualizar el movimiento del objeto "triangulo" en 360°.

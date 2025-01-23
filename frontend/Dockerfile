# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./
COPY . ./

# Instalar dependencias
RUN npm install

# Construir la aplicación para producción
RUN npm run build

# Servir el frontend con un servidor HTTP estático
RUN npm install -g serve

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["serve", "-s", "build", "-l", "3000"]

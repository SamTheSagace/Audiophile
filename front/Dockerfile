# Utilisation de la même version Node LTS
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Le port par défaut de Vite
EXPOSE 5173

# IMPORTANT: --host est nécessaire pour exposer le serveur hors du conteneur Docker
CMD ["npm", "run", "dev", "--", "--host"]
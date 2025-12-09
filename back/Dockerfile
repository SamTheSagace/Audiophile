# Utilisation de l'image Node LTS (version 20 actuellement) en version légère (Alpine)
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Le port par défaut de NestJS
EXPOSE 3000

# Commande de démarrage en mode développement (hot-reload)
CMD ["npm", "run", "start:dev"]
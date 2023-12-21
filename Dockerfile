# Stage 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copiez les fichiers de prisma et générez le client
COPY prisma ./prisma
RUN npx prisma generate

# Copiez le reste de vos fichiers d'application
COPY . .

# Construisez l'application
RUN npm run build

# Stage 2: Production Environment
FROM node:18-slim
WORKDIR /app

# Installez les dépendances nécessaires pour le runtime
RUN apt-get update && apt-get install -y libssl-dev dumb-init --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copiez les fichiers construits et les fichiers de configuration nécessaires depuis le stage de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Installez uniquement les dépendances nécessaires pour la production
RUN npm install --omit=dev

# Paramètres d'environnement (Vous pouvez ajuster ces valeurs selon vos besoins)
ENV NODE_ENV=production
ENV PORT=3000

# Exposez le port sur lequel votre application s'exécutera
EXPOSE 3000

# Utilisez dumb-init pour gérer correctement les processus
ENTRYPOINT ["dumb-init", "--"]

# Commande pour démarrer votre application
CMD ["npm", "run", "start:migrate:prod"]

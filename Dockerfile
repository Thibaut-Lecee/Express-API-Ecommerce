FROM node:18 as build
WORKDIR src/app
COPY package*.json ./
RUN npm install
COPY . .

COPY /prisma ./prisma
RUN npx prisma generate
RUN npm run build

# Path: Dockerfile
FROM node:18-slim
RUN apt-get update && apt-get install libssl-dev dumb-init -y -no-install-recommends
WORKDIR src/app
COPY --chown=node:node --from=build src/app/dist ./dist
COPY --chown=node:node --from=build src/app/package.json .
COPY --chown=node:node --from=build src/app/package-lock.json .
COPY --chown=node:node --from=build src/app/prisma ./prisma

RUN npm install --omit=dev
COPY --chown=node:node --from=build src/app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]

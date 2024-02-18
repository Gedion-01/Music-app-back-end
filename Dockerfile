FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .env ./dist

WORKDIR /app/dist

ENV PORT=5000

EXPOSE 5000

CMD [ "node", "index.js" ]
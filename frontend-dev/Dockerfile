FROM node:20-alpine

WORKDIR /src/app

RUN npm install -g vite

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
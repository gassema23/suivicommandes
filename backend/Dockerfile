FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

RUN npm install -g @nestjs/cli nodemon

EXPOSE 4010

CMD ["npm", "run", "start:dev"]
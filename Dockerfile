FROM node:20.10-alpine

WORKDIR /app

COPY ./app .

EXPOSE 3000

RUN npm install
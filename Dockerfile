FROM node:16.17.0-alpine3.15

RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY  . .

EXPOSE 3000

CMD ["npm", "run", "start"]
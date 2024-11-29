FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --build-from-source  # Install dependencies inside the container

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]

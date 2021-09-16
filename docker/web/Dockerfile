FROM node:14-alpine

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm i -g npm
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]

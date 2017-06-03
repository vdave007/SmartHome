FROM node:latest

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install the dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT 8080
EXPOSE $PORT

CMD ["npm", "start"]
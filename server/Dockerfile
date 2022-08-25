FROM node:16.13.1-alpine3.13
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD npm run start:prod
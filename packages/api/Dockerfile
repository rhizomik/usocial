FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .
COPY .eslintrc .
COPY src ./src
RUN npm install --loglevel notice

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD [ "npm", "run", "serve" ]
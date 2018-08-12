FROM node:8

WORKDIR /app
COPY . .

RUN apt-get install make gcc g++ python
RUN npm install --production

EXPOSE 8080
CMD ["node", "server.js"]

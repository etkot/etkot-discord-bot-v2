FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY ./src ./src
COPY package*.json ./
RUN npm install --quiet --only=production

CMD ["npm", "run", "start"]

FROM node:23-alpine3.20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN chown -R node:node /app
USER node
RUN chmod -R a+x node_modules/.bin && chmod -R a+x node_modules

EXPOSE 5173
CMD ["npm", "run", "dev"]



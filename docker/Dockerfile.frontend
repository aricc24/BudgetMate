FROM node:16
WORKDIR /app
COPY package*.json ./
RUN mkdir -p node_modules/.cache && chown -R node:node /app
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "start"]
FROM node:14-alpine

USER node

COPY --chown=node:node . /home/node/stock-monitor-service-backend

WORKDIR /home/node/stock-monitor-service-backend

RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "server"]
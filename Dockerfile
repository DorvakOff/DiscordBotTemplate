FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY dist ./dist
COPY node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

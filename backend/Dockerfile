FROM node:14.19.0
COPY package.json .
RUN npm install
COPY . .
RUN npm build
CMD ["npm","run","start:prod"]
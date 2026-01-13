FROM node
WORKDIR /AUTHENTICATION
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_PATH=/AUTHENTICATION/dist
EXPOSE 3014
CMD [ "node","dist/index.js" ]


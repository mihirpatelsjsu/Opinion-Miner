FROM node:12-alpine
WORKDIR /app
ADD . /app
EXPOSE 3000
RUN npm install
CMD ["node", "index.js"]
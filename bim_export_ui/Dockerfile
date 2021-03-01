FROM node:12.18-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build-prod

RUN npm install -g http-server
# COPY ./boot.sh /app
# RUN chmod +x /app/boot.sh

EXPOSE 8100

CMD http-server ./dist/bimexport -a 0.0.0.0 --port 8100


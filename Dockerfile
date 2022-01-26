FROM node:16-alpine
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 8080

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY ./ .

CMD /wait && npm start
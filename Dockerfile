
FROM node:10.3.0-stretch
RUN apt-get update && apt-get install -y build-essential inotify-tools
RUN mkdir -p /app
WORKDIR /app
ADD . ./app
COPY package.json package-lock.json ./app/
RUN npm install -g @angular/cli
RUN npm install @angular/cli
RUN npm install
EXPOSE 4200


FROM node:10.3.0-stretch
RUN apt-get update && apt-get install -y build-essential inotify-tools
RUN mkdir -p /app
WORKDIR /app
ADD . ./
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install @angular/cli
EXPOSE 4200

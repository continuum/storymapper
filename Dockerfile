
FROM node:10.3.0-stretch
RUN apt-get update && apt-get install -y build-essential inotify-tools
RUN mkdir -p /app
WORKDIR /app
ADD . ./
EXPOSE 4200

FROM keymetrics/pm2:latest-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /app
ADD . /usr/src/app

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install --production

CMD ["pm2-runtime", "index.js"]
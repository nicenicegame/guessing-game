FROM node:14.16.0-alpine3.13
WORKDIR /app
EXPOSE 80

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./app/package.json ./
RUN npm install &>/dev/null

# Bundle app source
COPY ./app/ .

# start your server
CMD [ "npm", "start" ]
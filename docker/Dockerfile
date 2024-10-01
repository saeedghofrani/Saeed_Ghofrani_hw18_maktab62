FROM node:17.4.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

copy . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "./bin/www" ]
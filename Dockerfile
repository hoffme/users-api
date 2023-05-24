FROM node:18

WORKDIR /app

COPY package.json tsconfig.json yarn.lock ./
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
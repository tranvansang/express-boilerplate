FROM node:20.1.0-alpine3.17 as build

RUN mkdir -p /app
WORKDIR /app
COPY .yarnrc.yml package.json tsconfig.json yarn.lock /app/
COPY .yarn /app/.yarn
COPY src /app/src
RUN yarn
RUN yarn build

FROM node:20.1.0-alpine3.17 as prod

RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml /app/
COPY .yarn /app/.yarn
RUN yarn workspaces focus --all --production

FROM node:20.1.0-alpine3.17 as app

RUN mkdir -p /app
WORKDIR /app
COPY --from=build /app/lib /app/lib
COPY --from=prod /app/node_modules /app/node_modules
COPY package.json /app/
ENV NODE_ENV production
CMD ["node", "lib/main.js"]

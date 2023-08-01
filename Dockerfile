
# build stage
FROM node:16.14.0
WORKDIR /ccp
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./.env
COPY tsconfig.json ./
COPY nest-cli.json ./
RUN yarn install
COPY . ./
RUN yarn run build
CMD ["yarn", "start"]


# --------- production stage
FROM node:16.14.0
WORKDIR /ccp
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /ccp/dist ./dist
COPY package*.json ./

# install depency only in product:
RUN yarn install --prod    
# remove package
RUN rm package*.json

EXPOSE 3000

CMD ["node", "dist/main.js"]
# CMD ["yarn start:prod"] -- this depend on package.json but we have delete package.js, to do this we should not delete pakage.js

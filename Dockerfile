FROM node:10.16.0

# create user and switch to it to avoid runing everything as root
# to make npm run postinstall script
USER node
RUN mkdir /home/node/src

WORKDIR /home/node/src

# set default node environment as production to ignore dev dependencies
# this will be overridden in development by passing --build-arg NODE_ENV=dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/src


# copy package.json and package-lock.json to app folder and install dependencies first
COPY --chown=node:node ./package*.json /home/node/src/
# add typescript from node_modules folder to path
ENV PATH="/home/node/src/node_modules/typescript/bin/:./node_modules/tsc-watch/:${PATH}"
# install dev dependencies to use it to transpile the code
RUN npm install --only=dev
RUN npm install -qy


COPY --chown=node:node ./ ./
EXPOSE 4000

# run app
CMD [ "node", "dist/index.js"]
FROM node
WORKDIR /app
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build
ENV TS_NODE_BASEURL=./.build
CMD ["npm", "run", "serve"]
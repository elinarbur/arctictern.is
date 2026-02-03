FROM node
WORKDIR /app
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build
ENV TS_NODE_BASEURL=./.build
CMD ["npm", "run", "serve"]
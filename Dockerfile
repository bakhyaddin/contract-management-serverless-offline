FROM node:16.10.0

USER root

# create work directory
WORKDIR /opt/app-root/contracts-manager
COPY . .

# install jre
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless && \
    apt-get clean;

# install packages and dynamodb
RUN npm install \
    && npm run dynamodb:install

EXPOSE 3000
EXPOSE 8000

CMD ["npm", "run", "start"]

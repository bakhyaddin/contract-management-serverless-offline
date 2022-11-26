FROM node:16.10.0-alpine

USER root

# create work directory
WORKDIR /opt/app-root/contracts-manager
COPY . .

# install packages
RUN npm install \
    # && npm run serverless dynamodb install \
    && chmod +x ./docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
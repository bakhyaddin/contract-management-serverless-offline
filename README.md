# Contract Management

## Description
This is the service in which you can create contracts for users.

## Installation
Note: Make sure you have installed `Node` on your local machine.\
Installing packages first
```bash
npm run install
```
Project dependencies will be installed separately by Docker. This ensures your IDE can find package information and keeps package-lock.json up to date.

## Running the app
### Local dev env

Note: Make sure `JRE` is installed on your local machine.\
After installing the packages we need to download `Dynamodb` on our local machine
```bash
npm run dynamodb:install
```

Then we need to run the following command to start the dev env
```bash
npm run start
```

### Docker
Note: Make sure `Docker` and `docker-compose` are installed\
Before bringing the container up we need to get image built first. This project uses `docker-compose` for better container management

```bash
docker-compose build
```

Then we start the container
```bash
docker-compose up
```

To have a better insight regarding the endpoints please open `swagger.yaml` file on [Swagger editor](https://editor.swagger.io/) or import `postman-collection.json` file
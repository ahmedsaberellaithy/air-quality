## Description

Air Quality mini-project is providing APIs for getting pollution data from IQAir platform.

Application is built using nest js

## Installation and build

```bash
$ npm install

$ npm run build
```

## Running the app

```bash
# development
$ npm run start

# or run in watch mode
$ npm run start:dev

```

## Running the app using docker

> This container contains postgres as well as nest-js application

```bash
# Copy .env.docker to .env
$ cb .env.docker .env

# Run docker compose to build
$ docker-compose up --build

```

## Quick Health Check to make sure app is running

reach out the localhost (3031 is the port used in env, if you didn't use env try 3000) http://localhost:3031

```
{"message":"I am alive!","dateTime":"2024-01-22T12:03:13.678Z"}
```

## Swagger API docs

Link: http://localhost:3031/api

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Test Coverage Report

![Alt text](/test-coverage-report.png 'Test Coverage Report')

## Stay in touch

- Author - Ahmed Saber
- Github - [ahmedsaberellaithy](https://github.com/ahmedsaberellaithy)
- Linkedin - [ahmed-saber-ellaithy](https://www.linkedin.com/in/ahmed-saber-ellaithy/)

## License

Nest is [MIT licensed](LICENSE).

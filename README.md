# Details 
A Smart-lock app 

## Docker Compose to Install Dependencies
- docker-compose up -d 

## Installation
- set your .env file as example from .env.example
- type `yarn` in your command line to install the dependencies
- type `yarn migration:run` to run all needed migrations and seeding [DON'T FORGET]
- type `yarn generate-token:dev` to generate an initial access token for tuya [DON'T FORGET]
- type `yarn seed` to seed the db with unit and lock [DON'T FORGET]
- type `yarn start:dev`

## Without Docker
- Install postgres in your local machine
- Install Redis

## Testing
- Write the following command 
  
    ```bash
    yarn test
    ```
## Build Docker Image
- Write the following command 
  
    ```bash
    docker build .
    ```
## Major Tools
- Nodejs
- TypeScript
- Postgres
- Apollo Graphql
- Jest
- axios
- Redis
- Bull [for background tasks queue]

## Performance Improvements
### Child Process
- encrypt password inside another process using worker-farm package
### Background Jobs
- create/update/remove access code from the external APIs using bull message queue from redis
  
## Near future improvements 
- ADD CD
- pagination for reservations
- Logging
- linting
- Add more tests
- Allow dependency injection for the services


## Limitation
- github actions will always fail because it has no access to Tuya APIs

  

## Diagrams 

### Flow of creating reservation from the client side
- use `createReservation` mutation, you can get the result with status `PENDING`
- pool until the status is `CREATED`
  
### Reservation Flow
![image](https://user-images.githubusercontent.com/22199342/179476239-d648f379-d99d-43ec-b42d-5aad16124f75.png)

### High level sketch 
![image](https://user-images.githubusercontent.com/22199342/179476790-1d710566-3dab-4879-8bb9-6d3600abfef2.png)


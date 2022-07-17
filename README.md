# Details 
A Smart-lock app

# Docker Compose to Install Dependencies
- docker-compose up -d 

# Installation
- set your .env file as example from .env.example
- type `yarn` in your command line to install the dependencies
- type `yarn migration:run` to run all needed migrations and seeding [DON'T FORGET]
- type `yarn generate-token:dev` to generate an initial access token for tuya [DON'T FORGET]
- type `yarn seed` to seed the db with unit and lock [DON'T FORGET]
- type `yarn start:dev`


# Build Docker Image
- docker build .

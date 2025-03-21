# Development
Clone the repository
- git clone https://github.com/PatanSharuKhan/restaurant-backend.git

Install dependencies
- yarn install

Add database Url in the environment
- export RESTAURANT_DATABASE_URL='mongodb://localhost:3000/mydb'

To start the development server
- yarn dev:start


# Testing
- yarn test

Inmemory database is used in the testing.
No need to add the environment variable [RESTAURANT_DATABASE_URL].

# Sms Manager
[![Build Status](https://travis-ci.org/njeri-ngigi/sms-manager.svg?branch=develop)](https://travis-ci.org/njeri-ngigi/sms-manager)
[![Coverage Status](https://coveralls.io/repos/github/njeri-ngigi/sms-manager/badge.svg?branch=develop)](https://coveralls.io/github/njeri-ngigi/sms-manager?branch=develop)

A node API that models users sending and receiving sms. The API allows users to register where they receive a jwt token which can be used to:
- send messages
- retrieve sent message
- retrieve received messages
- retrieve all messages (both sent and received)
- delete their account

## Setting up
- clone this repo
- install the dependencies using `yarn install`
- create a `.env` file similar to the `.env.sample` on the root directory of this project
- start the serve and test out the endpoints on postman

## Endpoints available
| Endpoints  | Method  | Description  |
|------------|---------|--------------|
|  /      | GET    | Serve API documentation  |
|  /user  | POST   | Create a new user  |
|  /user  | GET    | Returns a list of all registered phone numbers  |
|  /user  | DELETE | Deletes a user's account  |
|  /login | POST   | Logs in a user and return a token  |
|  /user  | GET    | Returns a list of all registered phone numbers  |
|  /sms                  | POST   | Send and SMS  |
|  /sms/users            | GET    | Retrieve all user's messages  |
|  /sms/users/sent       | GET    | Retrieve all user's sent messages  |
|  /sms/users/received   | GET    | Retrieve all user's received messages  |


## Documentation

## Hosting

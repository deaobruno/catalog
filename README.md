#### Docker

If you haver Docker configured in your local machine, use the following command to build the containers:
```
docker-compose up -d
```


#### Shell

Otherwise, to build the services in your local machine, you may run each one e a separate terminal window, using the following commands:
```
cd services/{service name}
npm install
npm run dev
```

After that, you may access each service with the following addresses:

##### Auth
```
localhost:8081/auth
```

##### Users
```
localhost:8082/users
```

##### Products
```
localhost:8083/products
```

##### Endpoints documentation

You may follow the same steps mentioned above to run the documentation server 
```
cd services/docs
npm install
npm run dev
```
And access the docs page at:
```
localhost:8084/docs

```


#### Technologies used:

NodeJS

* [express](https://github.com/expressjs/express) - Web framework for Node.js
* [nodemon](https://github.com/remy/nodemon) - Monitor for changes in Node.js applications and automatically restart the server
* [express-validator](https://github.com/express-validator/express-validator) - An express.js middleware for validator.js
* [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware
* [mongoose](https://github.com/Automattic/mongoose) - MongoDB object modeling for Node.js
* [eslint](https://github.com/eslint/eslint) - Find and fix problems in your JavaScript code
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JsonWebToken implementation for Node.js
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - bcrypt for Node.js
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and Node.js
* [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env for Node.js projects
* [express-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi) - An OpenAPI framework for express.js
* [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) - Middleware to serve the Swagger UI bound to your Swagger document
* [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML parser and dumper
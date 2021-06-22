### Docker

If you haver Docker configured in your local machine, run the following command to get the app up and running:
```
docker-compose up -d
```

### Shell

Otherwise, to build the services in the same terminal window you may run:
```
./build.sh
```
If you want to build each service separately (each one will need a terminal window) run:

#### Auth
```
./build.sh auth
```

#### Users
```
./build.sh users
```

#### Products
```
./build.sh products
```

After that, you may access each service with the following addresses:

#### Auth
```
localhost:8081/auth
```

#### Users
```
localhost:8082/users
```

#### Products
```
localhost:8083/products
```

You can find endpoints documentation in:


Technologies used in this app:
NodeJS
Express

axios
bcrypt
body-parser
dotenv
express-openapi
express-validator
js-yaml
jsonwebtoken
mongoose
swagger-ui-express
@babel/core
@babel/preset-env
babel-jest
eslint
jest
nodemon
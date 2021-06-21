import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import {app as router} from './src/routes/index.js';

const app = express();
const port = process.env.APP_PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(router);

app.listen(port, err => {
  if (err) {
    console.log(err.message);
  }

  console.log(`Server running on port ${port}`);
});
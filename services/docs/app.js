import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import {initialize} from 'express-openapi';
import jsYaml from 'js-yaml';
import swaggerUI from 'swagger-ui-express';

const app = express();
const port = process.env.APP_PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

fs.readFile('./openapi/openapi.yaml', 'utf8', async (err, yamlFile) => {
  if (err) {
    console.log(err.message);
  }

  const apiDoc = await jsYaml.load(yamlFile);

  initialize({
    app,
    apiDoc: apiDoc,
    paths: './openapi/paths'
  });

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(apiDoc));
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(err.stack);

  if (err) {
    res.status(500).send('Internal server error');
  }
});

app.listen(port, err => {
  if (err) {
    console.log(err.message);
  }

  console.log(`Docs server running on port ${port}`);
});
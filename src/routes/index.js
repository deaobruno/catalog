import express from 'express';
import fs from 'fs';
import {initialize} from 'express-openapi';
import jsYaml from 'js-yaml';
import swaggerUI from 'swagger-ui-express';

const app = express();

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

export {app};
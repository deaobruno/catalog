import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, err => {
  if (err) {
    console.log(err.message);
  }

  console.log(`Server running on port ${port}`);
});
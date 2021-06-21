import mongoose from 'mongoose';

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbString = `${host}:${port}/${dbName}`;

mongoose.connect(
  `mongodb://${dbString}`,
  { 
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      console.log(err.message);
      return;
    }

    mongoose.set('returnOriginal', false);
    
    console.log('Connected to auth DB');
  }
);


export {mongoose};
import mongoose from 'mongoose';

mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
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
    
    console.log('Connected to DB');
  }
);


export {mongoose};
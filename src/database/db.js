import mongoose from 'mongoose';

mongoose.connect(
  process.env.DB_STRING,
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

    console.log('Connected to DB');
  }
);

export {mongoose};
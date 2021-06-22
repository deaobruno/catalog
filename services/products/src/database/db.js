import mongoose from 'mongoose';

mongoose.connect(
  process.env.DB_URL,
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
    
    console.log('Connected to products DB');
  }
);

export {mongoose};
import {mongoose} from '../database/db.js';

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
  email: {
    type: String,
    required: [true, 'Missing attribute!'],
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 
      'Wrong format!'
    ],
  },
  role: {
    type: String,
    required: [true, 'Missing attribute!'],
    enum: ['client', 'admin'],
  },
  password: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, 'Missing attribute!'],
  },
  updatedAt: {
    type: Date,
  },
});

const User = mongoose.model('User', UserSchema);

export {User};
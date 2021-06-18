import {mongoose} from '../database/db.js';

const AccessTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
});

const accessToken = mongoose.model('accessToken', AccessTokenSchema);

export {accessToken};
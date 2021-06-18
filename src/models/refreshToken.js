import {mongoose} from '../database/db.js';

const RefreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
});

const refreshToken = mongoose.model('refreshToken', RefreshTokenSchema);

export {refreshToken};
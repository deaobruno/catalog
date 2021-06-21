import {mongoose} from '../database/db.js';

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
  description: {
    type: String,
    required: [true, 'Missing attribute!'],
  },
  value: {
    type: Number,
    required: [true, 'Missing attribute!'],
    match: /([0-9]+[\,])?([0-9]+[\.,])+([0-9]{2})+/, // eslint-disable-line
  },
  active: {
    type: Number,
    required: [true, 'Missing attribute!'],
    enum: [0, 1],
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

const Product = mongoose.model('Product', ProductSchema);

Product.createIndexes({description: 'text'});

export {Product};
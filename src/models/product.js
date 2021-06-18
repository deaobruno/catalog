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
  },
  active: {
    type: Boolean,
    required: [true, 'Missing attribute!'],
  },
  image: {
    type: String,
    required: [true, 'Missing attribute!'],
    match: [/(^.*\.{1})+[a-z]{1,4}$/, 'Wrong format!'],
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
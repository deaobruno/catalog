import {Product} from '../models/product.js';

class ProductMiddleware {
  async validateId(req, res, next) {
    const {id} = req.params;

    if (id && typeof id === 'undefined') {
      let err = new Error('Missing id');

      err.statusCode = 400;

      next(err);

      return;
    }

    let product = await Product.findById(id);

    if (!product) {
      let err = new Error('Not found');

      err.statusCode = 404;

      next(err);
      
      return;
    }

    next();
  }

  async validateFind(req, res, next) {
    const {title, tag, value, minValue, maxValue, active} = req.query;

    if (typeof title !== 'undefined' && !title) {
      let err = new Error('Missing title');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof tag !== 'undefined' && !tag) {
      let err = new Error('Missing tag');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof value !== 'undefined' && !value) {
      let err = new Error('Missing value');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof value !== 'undefined') {
      req.query.value = req.query.value.match(/[0-9]\d*/g).join('');
    }

    if (typeof minValue !== 'undefined' && !minValue) {
      let err = new Error('Missing minValue');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof minValue !== 'undefined') {
      req.query.minValue = req.query.minValue.match(/[0-9]\d*/g).join('');
    }

    if (typeof maxValue !== 'undefined' && !maxValue) {
      let err = new Error('Missing maxValue');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof maxValue !== 'undefined') {
      req.query.maxValue = req.query.maxValue.match(/[0-9]\d*/g).join('');
    }

    if (typeof active !== 'undefined' && !active) {
      let err = new Error('Missing active');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (active && ![true, false].includes(active)) {
      let err = new Error('Invalid active');

      err.statusCode = 400;

      next(err);

      return;
    }

    next();
  }

  async validateCreate(req, res, next) {
    const {title, description, value, active, image} = req.body;

    if (!title) {
      let err = new Error('Missing title');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!description) {
      let err = new Error('Missing description');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!value) {
      let err = new Error('Missing value');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!value.match(/([0-9]+[\,])?([0-9]+[\.,])+([0-9]{2})+/)) {
      let err = new Error('Wrong value format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!active) {
      let err = new Error('Missing active');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (![true, false].includes(active)) {
      let err = new Error('Invalid active');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!image) {
      let err = new Error('Missing image');

      err.statusCode = 400;

      next(err);

      return;
    }

    req.body.value = req.body.value.match(/[0-9]\d*/g).join('');

    const product = await Product.findOne(req.body);

    if (product) {
      let err = new Error('Product already registered');

      err.statusCode = 409;

      next(err);

      return;
    }

    next();
  }

  async validateUpdate(req, res, next) {
    const {title, description, value, active, image} = req.body;

    if (typeof title !== 'undefined' && !title) {
      let err = new Error('Missing title');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof description !== 'undefined' && !description) {
      let err = new Error('Missing description');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof value !== 'undefined' && !value) {
      let err = new Error('Missing value');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof value !== 'undefined' && !value.match(/([0-9]+[\,])?([0-9]+[\.,])+([0-9]{2})+/)) {
      let err = new Error('Wrong value format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof value !== 'undefined') {
      req.body.value = req.body.value.match(/[0-9]\d*/g).join('');
    }

    if (typeof active !== 'undefined' && !active) {
      let err = new Error('Missing active');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof active !== 'undefined' && ![true, false].includes(active)) {
      let err = new Error('Invalid active');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof image !== 'undefined' && !image) {
      let err = new Error('Missing image');

      err.statusCode = 400;

      next(err);

      return;
    }

    if ([title, description, value, active, image].filter(attribute => typeof attribute !== 'undefined').length === 0) {
      let err = new Error('No attributes provided');

      err.statusCode = 400;

      next(err);

      return;
    }

    const product = await Product.findOne(req.body);

    if (product) {
      let err = new Error('Product already registered');

      err.statusCode = 409;

      next(err);

      return;
    }

    next();
  }
}

const productMiddleware = new ProductMiddleware();

export {productMiddleware};
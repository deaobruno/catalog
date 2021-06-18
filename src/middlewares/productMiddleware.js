import {body, param, query, validationResult} from 'express-validator';
import {Product} from '../models/product.js';

const currencyRegEx = /[0-9]\d*/g;

class ProductMiddleware {
  constructor() {
    this.idRules = [
      param('id')
        .notEmpty()
        .isMongoId()
        .withMessage('Wrong format')
    ];

    this.findRules = [
      query('title')
        .if(title => typeof title !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      query('tag')
        .if(tag => typeof tag !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      query('value')
        .if(value => typeof value !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isCurrency()
        .withMessage('Wrong format'),
      query('minValue')
        .if(minValue => typeof minValue !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isCurrency()
        .withMessage('Wrong format'),
      query('maxValue')
        .if(maxValue => typeof maxValue !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isCurrency()
        .withMessage('Wrong format'),
      query('active')
        .if(active => typeof active !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn([0, 1]),
    ];

    this.createRules = [
      body('title')
        .notEmpty()
        .trim()
        .escape(),
      body('description')
        .notEmpty()
        .trim()
        .escape(),
      body('value')
        .notEmpty()
        .trim()
        .escape()
        .isCurrency()
        .withMessage('Wrong format'),
      body('active')
        .notEmpty()
        .trim()
        .escape()
        .isIn([1, 0]),
    ];

    this.updateRules = [
      body('title')
        .if(title => typeof title !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      body('description')
        .if(description => typeof description !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      body('value')
        .if(value => typeof value !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isCurrency()
        .withMessage('Wrong format'),
      body('active')
        .if(active => typeof active !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn([1, 0]),
    ];
  }

  async validateId(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    await Product.findById(req.params.id, (err, result) => {
      if (err) {
        next(err);

        return;
      }

      if (!result) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);
        
        return;
      }

      next();
    });
  }

  async validateFind(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    const {value, minValue, maxValue} = req.query;

    if (typeof value !== 'undefined') {
      req.query.value = value.match(currencyRegEx).join('');
    }

    if (typeof minValue !== 'undefined') {
      req.query.minValue = minValue.match(currencyRegEx).join('');
    }

    if (typeof maxValue !== 'undefined') {
      req.query.maxValue = maxValue.match(currencyRegEx).join('');
    }

    if (!req.isAdmin) {
      req.query.active = 1;
    }

    next();
  }

  async validateProduct(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    await Product.findOne(req.body, (err, result) => {
      if (err) {
        next(err);

        return;
      }

      if (result) {
        let err = new Error('Product already registered');

        err.statusCode = 409;

        next(err);

        return;
      }

      next();
    });
  }
}

const productMiddleware = new ProductMiddleware();

export {productMiddleware};
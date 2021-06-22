import axios from 'axios';
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
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);
        
        return;
      }

      next();
    } catch(err) {
      next(err);
    }
  }

  async validateFind(req, res, next) {
    try {
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
    } catch(err) {
      next(err);
    }
  }

  async validateProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      const product = await Product.findOne(req.body);

      if (product) {
        let err = new Error('Product already registered');

        err.statusCode = 409;

        next(err);

        return;
      }

      next();
    } catch(err) {
      next(err);
    }
  }

  async buildQuery(req, res, next) {
    try {
      req.updateQuery = {};
      
      if (req.query.title) {
        req.updateQuery.title = req.query.title;
      }

      if (req.query.tag) {
        req.updateQuery.$text = {$search: `\"${req.query.tag}\"`}; // eslint-disable-line
      }
      
      if (req.query.value) {
        req.updateQuery.value = req.query.value;
      }

      if (req.query.minValue && !req.query.maxValue) {
        req.updateQuery.value = {$gte: parseInt(req.query.minValue)};
      }

      if (req.query.maxValue && !req.query.minValue) {
        req.updateQuery.value = {$lte: parseInt(req.query.maxValue)};
      }

      if (req.query.maxValue && req.query.minValue) {
        req.updateQuery.$and = [
          {value: {$gte: parseInt(req.query.minValue)}},
          {value: {$lte: parseInt(req.query.maxValue)}}
        ];
      }
      
      if (req.query.active) {
        req.updateQuery.active = req.query.active;
      }

      next();
    } catch(err) {
      next(err);
    }
  }

  async paginate(req, res, next) {
    try {
      let {page = 0, limit = 5} = req.query;
      
      page = parseInt(page);
      limit = parseInt(limit);

      req.limit = limit;
      req.skip = page * limit;

      const total = await Product.countDocuments(req.updateQuery);

      const data = {
        page: page,
        pages: Math.ceil(total / limit),
        limit: limit,
        total: total
      };

      req.data = data;

      next();
    } catch(err) {
      next(err);
    }
  }

  async validateToken(req, res, next) {
    try {
      await axios.get(`${process.env.AUTH_URL}/auth/validateToken`, {
        headers: {
          authorization: req.headers.authorization
        }
      })
        .then(() => next())
        .catch(err => {
          err.statusCode = 401;

          next(err);
        });
    } catch(err) {
      err.statusCode = 401;

      next(err);
    }
  }

  async isAdmin(req, res, next) {
    try {
      const response = await axios.get(`${process.env.AUTH_URL}/auth/isAdmin`, {
        headers: {
          authorization: req.headers.authorization
        }
      });

      if (!response.data.isAdmin) {
        throw new Error('Forbidden');
      }

      next();
    } catch(err) {
      err.statusCode = 403;

      next(err);
    }
  }
}

const productMiddleware = new ProductMiddleware();

export {productMiddleware};
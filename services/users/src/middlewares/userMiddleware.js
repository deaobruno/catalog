import axios from 'axios';
import {body, param, query, validationResult} from 'express-validator';
import {Bcrypt} from '../helpers/bcrypt.js';
import {User} from '../models/user.js';

class UserMiddleware {
  constructor() {
    this.idRules = [
      param('id')
        .notEmpty()
        .isMongoId()
        .withMessage('Wrong format')
    ];

    this.findRules = [
      query('name')
        .if(name => typeof name !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      query('email')
        .if(email => typeof email !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      query('role')
        .if(role => typeof role !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
      query('page')
        .if(page => typeof page !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isNumeric(),
      query('limit')
        .if(limit => typeof limit !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isNumeric(),
    ];

    this.createRules = [
      body('name')
        .notEmpty()
        .trim()
        .escape(),
      body('email')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      body('role')
        .if(role => typeof role !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
      body('password')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];

    this.updateRules = [
      body('name')
        .if(name => typeof name !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      body('email')
        .if(email => typeof email !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      body('role')
        .if(role => typeof role !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
      body('password')
        .if(password => typeof password !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];
  }

  async validateId(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      await User.findById(req.params.id, (err, result) => {
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

      next();
    } catch(err) {
      next(err);
    }
  }

  async validateUser(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      const user = await User.findOne({email: req.body.email});

      if (user) {
        let err = new Error('Email already registered');

        err.statusCode = 409;

        next(err);

        return;
      }

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

  async hashPassword(req, res, next) {
    try {
      let {password} = req.body;

      if (password) {
        const hash = await Bcrypt.generateHash(password);
        
        if (hash) {
          req.body.password = hash;
        }
      }

      next();
    } catch(err) {
      next(err);
    }
  }

  async paginate(req, res, next) {
    try {
      let {page = 0, limit = 10} = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      req.limit = limit;
      req.skip = page * limit;

      delete req.query.page;
      delete req.query.limit;

      const total = await User.countDocuments(req.query);

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
}

const userMiddleware = new UserMiddleware();

export {userMiddleware};
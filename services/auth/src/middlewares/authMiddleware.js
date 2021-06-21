import axios from 'axios';
import {body, validationResult} from 'express-validator';
import {Bcrypt} from '../helpers/bcrypt.js';
import {JWT} from '../helpers/jwt.js';

class AuthMiddleware {
  constructor() {
    this.authRules = [
      body('email')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      body('password')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];

    this.registerRules = [
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
      body('password')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];

    this.refreshTokenRules = [
      body('refreshToken')
        .notEmpty()
        .trim()
        .escape()
        .isJWT(),
    ];
  }

  async isAdmin(req, res, next) {
    try {
      if (!req.isAdmin) {
        throw new Error('Forbidden');
      }

      next();
    } catch(err) {
      err.statusCode = 403;

      next(err);
    }
  }

  async validateToken(req, res, next) {
    try {
      const {authorization} = req.headers;
      const token = authorization && authorization.split(' ')[1];

      if (!token) {
        throw new Error('No token provided');
      }

      const validatedToken = await JWT.validateAccessToken(token);

      const foundToken = await JWT.checkAccessToken(token);

      if (!foundToken) {
        throw new Error('Invalid token');
      }

      await axios.get(
        `http://localhost:8002/user/email/${validatedToken.email}`
      )
        .then(response => {
          const user = response.data;
          
          req.isAdmin = user.role === 'admin';

          next();
        })
        .catch(err => next(err));
    } catch(err) {
      err.statusCode = 401;

      next(err);
    }
  }

  async validateLogin(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      await axios.get(
        `http://localhost:8002/user/email/${req.body.email}`
      )
        .then(async response => {
          const user = response.data;

          const passwordsMatch = await Bcrypt.comparePasswords(
            req.body.password,
            user.password
          );

          if (!passwordsMatch) {
            let err = new Error('Unauthorized');

            err.statusCode = 401;

            next(err);

            return;
          }

          next();
        })
        .catch((err) => next(err));
    } catch(err) {
      next(err);
    }
  }

  async validateRegister(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      await axios.get(
        `http://localhost:8002/user/email/${req.body.email}`
      )
        .then(() => {
          let err = new Error('Email already registered');

          err.statusCode = 409;

          next(err);

          return;
        })
        .catch(() => next());
    } catch(err) {
      next(err);
    }
  }

  async validateRefresh(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
      }

      const foundToken = await JWT.checkRefreshToken(req.body.refreshToken);

      if (!foundToken) {
        let err = new Error('Unauthorized');

        err.statusCode = 401;

        next(err);

        return;
      }

      next();
    } catch(err) {
      next(err);
    }
  }
}

const authMiddleware = new AuthMiddleware();

export {authMiddleware};
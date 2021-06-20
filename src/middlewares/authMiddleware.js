import {body, validationResult} from 'express-validator';
import {Bcrypt} from '../helpers/bcrypt.js';
import {JWT} from '../helpers/jwt.js';
import {User} from '../models/user.js';

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

  async hashPassword(req, res, next) {
    try {
      const {password} = req.body;

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

      const user = await User.findOne({email: validatedToken.email});

      req.isAdmin = user.role === 'admin';

      next();
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

      const user = await User.findOne({email: req.body.email});

      if (!user) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);

        return;
      }

      const passwordsMatch = await Bcrypt.comparePasswords(
        req.body.password,
        user.password
      );

      if (!passwordsMatch) {
        let err = new Error('Unauthorized');

        err.statusCode = 403;

        next(err);

        return;
      }

      next();
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

      const user = await User.find({email: req.body.email});

      if (user.length > 0) {
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
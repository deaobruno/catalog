import {JWT} from '../helpers/jwt.js';
import {User} from '../models/user.js';

class AuthMiddleware {
  async validateToken(req, res, next) {
    const {authorization} = req.headers;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
      let err = new Error('Forbidden');

      err.statusCode = 403;

      next(err);

      return;
    }

    await JWT.validateAccessToken(token, async (err, decoded) => {
      if (err) {
        let err = new Error('Unauthorized');

        err.statusCode = 401;

        next(err);

        return;
      }

      req.userEmail = decoded.email;

      await JWT.checkAccessToken(token, async (err, check) => {
        if (err) {
          next(err);

          return;
        }

        if (!check) {
          let err = new Error('Unauthorized');

          err.statusCode = 401;

          next(err);

          return;
        }

        await User.findOne({email: decoded.email}, (err, user) => {
          if (err) {
            next(err);

            return;
          }

          req.isAdmin = user.role === 'admin';

          next();
        });
      });
    });
  }

  async isAdmin(req, res, next) {
    await User.findOne({email: req.userEmail}, (err, user) => {
      if (err) {
        next(err);

        return;
      }

      if (user.role !== 'admin') {
        let err = new Error('Forbidden');

        err.statusCode = 403;

        next(err);

        return;
      }

      next();
    });
  }

  async validateLogin(req, res, next) {
    const {email, password} = req.body;

    if (!email) {
      let err = new Error('Missing email');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      let err = new Error('Wrong email format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!password) {
      let err = new Error('Missing password');

      err.statusCode = 400;

      next(err);

      return;
    }

    const user = await User.find(req.body);

    if (user.length <= 0) {
      let err = new Error('Not found');

      err.statusCode = 404;

      next(err);

      return;
    }

    next();
  }

  async validateRegister(req, res, next) {
    const {name, email, password} = req.body;

    if (!name) {
      let err = new Error('Missing name');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!email) {
      let err = new Error('Missing email');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      let err = new Error('Wrong email format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!password) {
      let err = new Error('Missing password');

      err.statusCode = 400;

      next(err);

      return;
    }

    const user = await User.find({email: req.body.email});

    if (user.length > 0) {
      let err = new Error('Email already registered');

      err.statusCode = 409;

      next(err);

      return;
    }

    next();
  }

  async validateRefresh(req, res, next) {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(400).send({error: 'Missing refresh token'});
    }

    await JWT.checkRefreshToken(refreshToken, (err, check) => {
      if (err) {
        next(err);

        return;
      }

      if (!check) {
        let err = new Error('Unauthorized');

        err.statusCode = 401;

        next(err);

        return;
      }

      next();
    });
  }
}

const authMiddleware = new AuthMiddleware();

export {authMiddleware};
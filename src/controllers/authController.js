import bcrypt from 'bcrypt';
import {JWT} from '../helpers/jwt.js';
import {User} from '../models/user.js';

class AuthController {
  async login(req, res, next) {
    try {
      const accessToken = await JWT.getAccessToken(req.body);
      const refreshToken = await JWT.getRefreshToken(req.body);

      res.status(200).send({accessToken, refreshToken});
    } catch(err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const saltRounds = 10;

      await bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          next(err);

          return;
        }

        req.body.password = hash;
        req.body.role = 'client';

        await User.create(req.body, (err, result) => {
          if (err) {
            next(err);

            return;
          }

          const {_id, name, email} = result;

          res.status(201).send({_id, name, email});
        });
      });
    } catch(err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      await JWT.validateRefreshToken(
        req.body.refreshToken,
        async (err, user) => {
          if (err) {
            next(err);
          }

          JWT.deleteRefreshToken(req.body.refreshToken);
          
          const accessToken = await JWT.getAccessToken(user);
          const refreshToken = await JWT.getRefreshToken(user);

          res.status(200).send({accessToken, refreshToken});
        });
    } catch(err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      JWT.deleteAccessToken(req.accessToken);

      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }
}

const authController = new AuthController();

export {authController};
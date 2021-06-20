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
      const user = await User.create(req.body);

      const {_id, name, email} = user;

      res.status(201).send({_id, name, email});
    } catch(err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const token = req.body.refreshToken;

      const validatedToken = await JWT.validateRefreshToken(token);

      await JWT.deleteRefreshToken(token);
      
      const accessToken = await JWT.getAccessToken(validatedToken);
      const refreshToken = await JWT.getRefreshToken(validatedToken);

      res.status(200).send({accessToken, refreshToken});
    } catch(err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await JWT.deleteAccessToken(req.accessToken);

      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }
}

const authController = new AuthController();

export {authController};
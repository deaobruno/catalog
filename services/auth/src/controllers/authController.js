import axios from 'axios';
import {JWT} from '../helpers/jwt.js';

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
      await axios.post(`${process.env.USERS_URL}/user`, req.body)
        .then((response) => {
          const user = response.data;

          res.status(201).send(user);
        })
        .catch(err => next(err));
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

  async isAdmin(req, res, next) {
    try {
      res.status(200).send({isAdmin: req.isAdmin});
    } catch(err) {
      err.statusCode = 403;

      next(err);
    }
  }
}

const authController = new AuthController();

export {authController};
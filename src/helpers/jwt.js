import 'dotenv/config';
import jwt from 'jsonwebtoken';
import {accessToken} from '../models/accessToken.js';
import {refreshToken} from '../models/refreshToken.js';

class jwtHelper {
  async getAccessToken(data) {
    const token = await jwt.sign(
      data,
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: process.env.TOKEN_EXPIRATION_TIME}
    );

    await accessToken.create({token});

    return token;
  }

  async getRefreshToken(data) {
    const token = await jwt.sign(
      data,
      process.env.REFRESH_TOKEN_SECRET
    );

    await refreshToken.create({token});

    return token;
  }

  async validateAccessToken(token, callback) {
    await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, data) => {
        if (callback) {
          callback(err, data);
        }
      });
  }

  async validateRefreshToken(token, callback) {
    await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, data) => {
        if (callback) {
          callback(err, data);
        }
      });
  }

  async checkAccessToken(token, callback) {
    await accessToken.find({token}, (err, data) => {
      if (callback) {
        callback(err, data.length > 0);
      }
    });
  }

  async checkRefreshToken(token, callback) {
    await refreshToken.find({token}, (err, data) => {
      if (callback) {
        callback(err, data.length > 0);
      }
    });
  }

  async deleteAccessToken(token) {
    await accessToken.findOneAndDelete({token});
  }

  async deleteRefreshToken(token) {
    await refreshToken.findOneAndDelete({token});
  }
}

const JWT = new jwtHelper();

export {JWT};
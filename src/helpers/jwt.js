import 'dotenv/config';
import jwt from 'jsonwebtoken';
import {accessToken} from '../models/accessToken.js';
import {refreshToken} from '../models/refreshToken.js';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

class jwtHelper {
  async getAccessToken(data) {
    const token = await jwt.sign(
      data,
      accessTokenSecret,
      {expiresIn: '5m'}
    );

    await accessToken.create({token});

    return token;
  }

  async getRefreshToken(data) {
    const token = await jwt.sign(
      data,
      refreshTokenSecret
    );

    await refreshToken.create({token});

    return token;
  }

  async validateAccessToken(token, callback) {
    await jwt.verify(
      token,
      accessTokenSecret,
      async (err, data) => {
        if (callback) {
          callback(err, data);
        }
      });
  }

  async validateRefreshToken(token, callback) {
    await jwt.verify(
      token,
      refreshTokenSecret,
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
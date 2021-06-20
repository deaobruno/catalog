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

  async validateAccessToken(token) {
    return await jwt.verify(token, accessTokenSecret);
  }

  async validateRefreshToken(token) {
    return await jwt.verify(token, refreshTokenSecret);
  }

  async checkAccessToken(token) {
    return await accessToken.findOne({token});
  }

  async checkRefreshToken(token) {
    return await refreshToken.findOne({token});
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
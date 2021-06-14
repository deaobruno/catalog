/* eslint-disable */
import jwt from 'jsonwebtoken';
import {authController} from '../../src/controllers/authController.js';
import {userModel} from '../../src/models/user.js';
import {tokenModel} from '../../src/models/token.js';

jest.mock('jsonwebtoken');
jest.mock('../../src/models/user.js');
jest.mock('../../src/models/token.js');

let req = {};
let res = {};
let next = jest.fn();

describe('authController', () => {
  beforeEach(() => {
    req = {};
    res = {};

    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);

    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
  });

  describe('auth', () => {
    test('it should fail with no email and return 400', async () => {
      req.body.password = '12345';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with no password and return 400', async () => {
      req.body.email = 'user@email.com';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with empty email return 400', async () => {
      req.body.email = '';
      req.body.password = '12345';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with empty password return 400', async () => {
      req.body.email = 'user@email.com';
      req.body.password = '';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with malformated email and return 400', async () => {
      req.body.email = 'useremail.com';
      req.body.password = '12345';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong email format'});
    });

    test('it should fail with a wrong email and return 404', async () => {
      req.body.email = 'user2@email.com';
      req.body.password = '12345';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({error: 'Not found'});
    });

    test('it should fail with wrong password and return 404', async () => {
      req.body.email = 'user@email.com';
      req.body.password = '12346';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({error: 'Not found'});
    });

    test('it should log a user in and return 200', async () => {
      req.body.email = 'user@email.com';
      req.body.password = '12345';

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({accessToken: expect.any(String), refreshToken: expect.any(String)});
    });
  });

  describe('register', () => {
    test('it should fail with no name and return 400', async () => {
      req.body.email = 'user@email.com';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing name'});
    });

    test('it should fail with no email and return 400', async () => {
      req.body.name = 'Some User';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with no password and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with empty name return 400', async () => {
      req.body.name = '';
      req.body.email = 'user@email.com';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing name'});
    });

    test('it should fail with empty email return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = '';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with empty password return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.password = '';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with malformated email and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'useremail.com';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong email format'});
    });

    test('it should fail with a existing user and return 409', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.password = '12345';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'User already registered'});
    });

    test('it should regist a user and return 201', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user4@email.com';
      req.body.password = '45678';

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({id: expect.any(Number), name: expect.any(String), email: expect.any(String)});
    });
  });

  describe('logout', () => {
    test('it should fail with no id and return 400', async () => {
      await authController.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty id and return 400', async () => {
      req.body.id = '';

      await authController.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with id not found and return 404', async () => {
      req.body.id = 1623458405135;
      
      await authController.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({error: 'Not found'});
    });

    test('it should log the user out and return 204', async () => {
      req.body.id = 1623458405126;

      await authController.logout(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
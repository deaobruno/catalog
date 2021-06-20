/* eslint-disable */
import {userController} from '../../src/controllers/userController.js';
import {User} from '../../src/models/user.js';

jest.mock('../../src/models/user.js');

let req = {};
let res = {};
let next = jest.fn();

describe('userController', () => {
  beforeEach(() => {
    req.body = {
      value: jest.fn().mockReturnValue(req),
      writable: true
    };
    req.params = jest.fn().mockReturnValue(req);
    req.query = jest.fn().mockReturnValue(req);

    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  describe('create', () => {
    test('it should pass and return 201', async () => {
      const expected = {
        _id: '60cef666c0e7dc39bcc074d7',
        name: 'Some User',
        email: 'user@email.com'
      }

      req.body = {
        name: 'Some User',
        email: 'user@email.com',
        role: 'client',
        password: '45678'
      }

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expected);
    });
  });

  describe('findOne', () => {
    test('it should pass and return 200', async () => {
      const expected = {
        _id: '60cef666c0e7dc39bcc074d7',
        name: 'Some User',
        email: 'user@email.com'
      }

      req.body.id = '60cef666c0e7dc39bcc074d7';

      await userController.findOne(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expected);
    });
  });

  describe('find', () => {
    test.only('it should pass and return 200', async () => {
      const users = [
        {
          _id: '60cef666c0e7dc39bcc074d7',
          name: 'Client User',
          email: 'user@email.com',
          role: 'client'
        },
        {
          _id: '60cef666c0e7dc39bcc074d8',
          name: 'Another User',
          email: 'user2@email.com',
          role: 'client'
        },
        {
          _id: '60cef666c0e7dc39bcc074d9',
          name: 'Admin User',
          email: 'admin@email.com',
          role: 'admin'
        },
      ];

      const expected = {
        page: 0,
        pages: 1,
        limit: 5,
        total: 3,
        items: users
      };

      await userController.find(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expected);
    });
  });

  describe('update', () => {
    test('it should fail with no id and return 400', async () => {
      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty name and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.name = '';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing name'});
    });

    test('it should fail with empty email and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.email = '';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with empty role and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.role = '';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing role'});
    });

    test('it should fail with empty password and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.password = '';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with malformated email and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.email = 'useremail.com';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong email format'});
    });

    test('it should fail with user not found and return 404', async () => {
      req.params.id = 1623458405135;
      
      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({error: 'Not found'});
    });

    test('it should fail with an existing email and return 409', async () => {
      req.params.id = 1623458405126;
      req.body.email = 'user2@email.com';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'Email already registered'});
    });

    test('it should update user information and return 200', async () => {
      req.params.id = 1623458405126;
      req.body.name = 'Some User 2';
      req.body.email = 'user4@email.com';

      await userController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'Email already registered'});
    });
  });

  describe('delete', () => {
    test('it should fail with no id and return 400', async () => {
      await userController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';

      await userController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should delete a user and return 204', async () => {
      req.params.id = 1623458405126;

      await userController.delete(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
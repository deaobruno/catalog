/* eslint-disable */
import {userController} from '../../src/controllers/userController.js';
import {userModel} from '../../src/models/user.js';

jest.mock('../../src/models/user.js');

let req = {};
let res = {};
let next = jest.fn();

describe('userController', () => {
  beforeEach(() => {
    req = {};
    res = {};

    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);

    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
  });

  describe('create', () => {
    test('it should fail with no name and return 400', async () => {
      req.body.email = 'user@email.com';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing name'});
    });

    test('it should fail with no email and return 400', async () => {
      req.body.name = 'Some User';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with no role and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing role'});
    });

    test('it should fail with no password and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.role = 'client';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with empty name and return 400', async () => {
      req.body.name = '';
      req.body.email = 'user@email.com';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing name'});
    });

    test('it should fail with empty email and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = '';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing email'});
    });

    test('it should fail with empty role and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.role = '';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing role'});
    });

    test('it should fail with empty password and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.role = 'client';
      req.body.password = '';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing password'});
    });

    test('it should fail with malformated email and return 400', async () => {
      req.body.name = 'Some User';
      req.body.email = 'useremail.com';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong email format'});
    });

    test('it should fail with a existing user and return 409', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user@email.com';
      req.body.role = 'client';
      req.body.password = '12345';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'Email already registered'});
    });

    test('it should create a user and return 201', async () => {
      req.body.name = 'Some User';
      req.body.email = 'user4@email.com';
      req.body.role = 'client';
      req.body.password = '45678';

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({id: expect.any(Number), name: expect.any(String), email: expect.any(String)});
    });
  });

  describe('read', () => {
    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';
      
      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should find an user by id and return 200', async () => {
      req.params.id = 1623458405126;

      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).toHaveLength(1);
    });

    test('it should find users by name and return 200', async () => {
      req.params.name = 'Some User';

      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find an user by email and return 200', async () => {
      req.params.email = 'user@email.com';

      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).toHaveLength(1);
    });

    test('it should find users by role and return 200', async () => {
      req.params.role = 'client';

      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should get all users and return 200', async () => {
      await userController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
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
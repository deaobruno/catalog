/* eslint-disable */
import {productController} from '../../src/controllers/productController.js';
import {productModel} from '../../src/models/product.js';

jest.mock('../../src/models/product.js');

let req = {};
let res = {};
let next = jest.fn();

describe('productController', () => {
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
    test('it should fail with no title and return 400', async () => {
      req.body.description = 'A great book';
      req.body.value = '49.99';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing title'});
    });

    test('it should fail with no description and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.value = '49.99';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing description'});
    });

    test('it should fail with no value and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing value'});
    });

    test('it should fail with no image and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '49.99';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing image'});
    });

    test('it should fail with empty title and return 400', async () => {
      req.body.title = '';
      req.body.description = 'A great book';
      req.body.value = '49.99';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing title'});
    });

    test('it should fail with empty description and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = '';
      req.body.value = '49.99';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing description'});
    });

    test('it should fail with empty value and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing value'});
    });

    test('it should fail with empty image and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '49.99';
      req.body.image = '';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing image'});
    });

    test('it should fail with malformated value and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '4999';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong value format'});
    });

    test('it should fail with malformated image and return 400', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '49.99';
      req.body.image = 'bookimagepathjpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong image format'});
    });

    test('it should fail with a existing product and return 409', async () => {
      req.body.title = 'Awesome watch';
      req.body.description = 'A great watch';
      req.body.value = '299.99';
      req.body.image = 'watchimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'Product already registered'});
    });

    test('it should create a product and return 201', async () => {
      req.body.title = 'Awesome Book';
      req.body.description = 'A great book';
      req.body.value = '49.99';
      req.body.image = 'bookimagepath.jpg';

      await productController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        value: expect.any(String),
        image: expect.any(String)
      });
    });
  });

  describe('read', () => {
    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';
      
      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should find a product by id and return 200', async () => {
      req.params.id = 1623458405126;

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).toHaveLength(1);
    });

    test('it should find products by title and return 200', async () => {
      req.params.title = 'Awesome Book';

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find products filtering description by tag and return 200', async () => {
      req.params.tag = 'book';

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find products with value greater than minValue and return 200', async () => {
      req.params.minValue = '1.99';

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find products with value lesser than maxValue and return 200', async () => {
      req.params.maxValue = '100.00';

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find active products and return 200', async () => {
      req.params.active = true;

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should find inactive products and return 200', async () => {
      req.params.active = false;

      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });

    test('it should get all products and return 200', async () => {
      await productController.read(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.send)).toBeTruthy();
      expect(res.send).not.toHaveLength(0);
    });
  });

  describe('update', () => {
    test('it should fail with no id and return 400', async () => {
      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty title and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.title = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing title'});
    });

    test('it should fail with empty description and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.description = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing description'});
    });

    test('it should fail with empty value and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.value = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing value'});
    });

    test('it should fail with empty active and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.active = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing active'});
    });

    test('it should fail with empty image and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.image = '';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing image'});
    });

    test('it should fail with malformated value and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.value = '4999';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong value format'});
    });

    test('it should fail with malformated image and return 400', async () => {
      req.params.id = 1623458405126;
      req.body.image = 'bookimagepathjpg';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Wrong image format'});
    });

    test('it should fail with product not found and return 404', async () => {
      req.params.id = 1623458405135;
      
      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({error: 'Not found'});
    });

    test('it should fail with an existing product and return 409', async () => {
      req.params.id = 1623458405126;
      req.body.title = 'Awesome watch';
      req.body.description = 'A great watch';
      req.body.value = '299.99';
      req.body.image = 'watchimagepath.jpg';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({error: 'Product already registered'});
    });

    test('it should update a product and return 201', async () => {
      req.params.id = 1623458405126;
      req.body.title = 'Awesome Book 2';
      req.body.description = 'A great book 2';
      req.body.value = '59.99';
      req.body.image = 'bookimagepath2.jpg';

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        value: expect.any(String),
        image: expect.any(String)
      });
    });
  });

  describe('delete', () => {
    test('it should fail with no id and return 400', async () => {
      await productController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should fail with empty id and return 400', async () => {
      req.params.id = '';

      await productController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({error: 'Missing id'});
    });

    test('it should delete a product and return 204', async () => {
      req.params.id = 1623458405126;

      await productController.delete(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
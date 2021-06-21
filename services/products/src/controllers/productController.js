import {Product} from '../models/product.js';

class ProductController {
  async create(req, res, next) {
    try {
      let product = await Product.create(req.body);

      product = product.toJSON();

      product.value = (product.value / 100).toLocaleString();

      const {_id, title, description, value} = product;

      res.status(201).send({_id, title, description, value});
    } catch(err) {
      next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      let product = await Product.findById(
        req.params.id,
        '_id title description value'
      );

      product = product.toJSON();

      product.value = (product.value / 100).toLocaleString();

      res.status(200).send(product);
    } catch(err) {
      next(err);
    }
  }

  async find(req, res, next) {
    try {
      let products = await Product.find(
        req.updateQuery,
        '_id title description value'
      )
        .skip(req.skip)
        .limit(req.limit);

      if (products.length <= 0) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);

        return;
      }

      req.data.items = products;

      res.status(200).send(req.data);
    } catch(err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      req.body.updatedAt = Date.now();

      let product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {select: '_id title description value'}
      );

      product = product.toJSON();

      product.value = (product.value / 100).toLocaleString();

      res.status(200).send(product);
    } catch(err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await Product.findByIdAndDelete(req.params.id);

      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }
}

const productController = new ProductController();

export {productController};
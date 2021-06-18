import {Product} from '../models/product.js';

class ProductController {
  async create(req, res, next) {
    await Product.create(req.body, (err, result) => {
      if (err) {
        next(err);

        return;
      }

      res.status(201).send(result);
    });
  }

  async findOne(req, res, next) {
    await Product.findById(req.params.id, (err, result) => {
      if (err) {
        next(err);

        return;
      }

      if (!result) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);

        return;
      }

      result = result.toJSON();

      result.value = (result.value / 100).toLocaleString();

      res.status(200).send(result);
    });
  }

  async find(req, res, next) {
    let {page = 0, limit = 5} = req.query;
    let query = {};
    
    page = parseInt(page);
    limit = parseInt(limit);
    
    if (req.query.title) {
      query.title = req.query.title;
    }

    if (req.query.tag) {
      query.$text = {$search: `\"${req.query.tag}\"`};
    }
    
    if (req.query.value) {
      query.value = req.query.value;
    }

    if (req.query.minValue && !req.query.maxValue) {
      query.value = {$gte: parseInt(req.query.minValue)};
    }

    if (req.query.maxValue && !req.query.minValue) {
      query.value = {$lte: parseInt(req.query.maxValue)};
    }

    if (req.query.maxValue && req.query.minValue) {
      query.$and = [
        {value: {$gte: parseInt(req.query.minValue)}},
        {value: {$lte: parseInt(req.query.maxValue)}}
      ];
    }
    
    if (req.query.active) {
      query.active = req.query.active;
    }

    await Product.find(query, async (err, result) => {
      if (err) {
        next(err);

        return;
      }

      if (result.length <= 0) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);

        return;
      }

      result = JSON.parse(JSON.stringify(result));

      for (let item of result) {
        item.value = (item.value / 100).toLocaleString();
      }

      const total = await Product.countDocuments(query);

      const data = {
        page: page,
        pages: Math.ceil(total / limit),
        limit: limit,
        total: total,
        items: result
      };

      res.status(200).send(data);
    })
      .skip(page * limit)
      .limit(limit);
  }

  async update(req, res, next) {
    let _id = req.params.id;

    await Product.findByIdAndUpdate(
      _id,
      req.body,
      {new: true},
      (err, result) => {
        if (err) {
          next(err);

          return;
        }

        res.status(200).send(result);
      });
  }

  async delete(req, res, next) {
    await Product.findByIdAndDelete(req.params.id, err => {
      if (err) {
        next(err);

        return;
      }

      res.sendStatus(204);
    });
  }
}

const productController = new ProductController();

export {productController};
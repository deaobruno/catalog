import {User} from '../models/user.js';

class UserController {
  async create(req, res, next) {
    await User.create(req.body, (err, result) => {
      if (err) {
        next(err);
        
        return;
      }

      res.status(201).send(result);
    });
  }

  async findOne(req, res, next) {
    await User.findById(req.params.id, (err, result) => {
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

      res.status(200).send(result);
    });
  }

  async find(req, res, next) {
    let {page = 0, limit = 5} = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);

    delete req.query.page;
    delete req.query.limit;

    await User.find(req.query, async (err, result) => {
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

      const total = await User.countDocuments(req.query);

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

    await User.findByIdAndUpdate(_id, req.body, {new: true}, (err, result) => {
      if (err) {
        next(err);
        
        return;
      }

      res.status(200).send(result);
    });
  }

  async delete(req, res, next) {
    await User.findByIdAndDelete(req.params.id, err => {
      if (err) {
        next(err);
        
        return;
      }

      res.sendStatus(204);
    });
  }
}

const userController = new UserController();

export {userController};
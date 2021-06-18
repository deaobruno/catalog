import bcrypt from 'bcrypt';
import {User} from '../models/user.js';

const saltRounds = 10;

class UserController {
  async create(req, res, next) {
    await bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      if (err) {
        next(err);

        return;
      }

      req.body.password = hash;

      await User.create(req.body, (err, result) => {
        if (err) {
          next(err);
          
          return;
        }

        const {_id, name, email} = result;

        res.status(201).send({_id, name, email});
      });
    });
  }

  async findOne(req, res, next) {
    await User.findById(req.params.id, (err, result) => {
      if (err) {
        next(err);
        
        return;
      }

      const {_id, name, email} = result;

      res.status(200).send({_id, name, email});
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

      result = JSON.parse(JSON.stringify(result));

      for (let item of result) {
        delete item.__v;
        delete item.password;
        delete item.role;
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
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      
      if (hash) {
        req.body.password = hash;
      }
    }

    req.body.updatedAt = Date.now();

    await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
      (err, result) => {
        if (err) {
          next(err);
          
          return;
        }

        const {_id, name, email} = result;

        res.status(200).send({_id, name, email});
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
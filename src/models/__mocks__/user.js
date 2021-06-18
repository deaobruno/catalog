class UserModel {
  // find() {
  //   const users = [
  //     {
  //       _id: 1622928299857,
  //       name: 'Client User',
  //       email: 'user@email.com',
  //       role: 'client'
  //     },
  //     {
  //       _id: 1622928299858,
  //       name: 'Another User',
  //       email: 'user2@email.com',
  //       role: 'client'
  //     },
  //     {
  //       _id: 1622928299859,
  //       name: 'Admin User',
  //       email: 'admin@email.com',
  //       role: 'admin'
  //     },
  //   ];

  //   const data = {
  //     page: 0,
  //     perPage: 10,
  //     total: 3,
  //     users: users
  //   };

  //   return {err: null, result: data};
  // }

  create() {
    const data = {
      _id: 1622928299857,
      name: 'Some User',
      email: 'user4@email.com',
      // role: 'client'
    };

    return {err: null, result: data};
  }

  // findOneAndUpdate() {
  //   const data = {
  //     _id: 1622928299857,
  //     name: 'Client User 2',
  //     email: 'user2@email.com',
  //     role: 'client'
  //   };

  //   return {err: null, result: data};
  // }

  // deleteOne() {
  //   return {err: null};
  // }
}

const User = new UserModel();

export {User};
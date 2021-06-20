class UserModel {
  create() {
    const data = {
      _id: '60cef666c0e7dc39bcc074d7',
      name: 'Some User',
      email: 'user@email.com'
    };

    return data;
  }

  findById() {
    const data = {
      _id: '60cef666c0e7dc39bcc074d7',
      name: 'Some User',
      email: 'user@email.com'
    };

    return data;
  }

  find() {
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

    return users;
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
import bcrypt from 'bcrypt';

class bcryptHelper {
  async generateHash(data) {
    const saltRounds = 10;
    
    return await bcrypt.hash(data, saltRounds);
  }

  async comparePasswords(sentPassword, userPassword) {
    return await bcrypt.compare(sentPassword, userPassword);
  }
}

const Bcrypt = new bcryptHelper();

export {Bcrypt};
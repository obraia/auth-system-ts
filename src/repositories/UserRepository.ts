/* eslint-disable no-unused-vars */
import sql from 'mssql';
import { Database } from '../database/Database';
import { IRepository } from '../interfaces/IRepository';
import { IUser } from '../interfaces/IUser';
import { CustomError } from '../utils/CustomError';

class UserRepository implements IRepository {
  async index (username: string):Promise<IUser> {
    const database = new Database();

    try {
      const connection = await database.getConnection();

      const query = 'SELECT * FROM Users WHERE username = @Username';

      const result = await connection
        .request()
        .input('Username', username)
        .query(query);

      const user = result.recordset[0];

      return user;
    } catch (err) {
      throw new CustomError('Database error', 500);
    }
  }

  async create (user: IUser) {
    const database = new Database();

    try {
      const connection = await database.getConnection();

      const query = 'INSERT INTO Users VALUES(@Username, @Password)';

      const result = await connection.request()
        .input('Username', sql.VarChar, user.username)
        .input('Password', sql.VarChar, user.password)
        .query(query);

      return result.rowsAffected[0];
    } catch (err) {
      throw new CustomError('Database error', 500);
    }
  }

  async update (user: IUser) {

  }

  async delete (username: string) {

  }
}

export { UserRepository };

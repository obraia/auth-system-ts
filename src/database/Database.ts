import mssql from 'mssql';

class Database {
  private config: mssql.config;

  constructor () {
    this.config = {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      server: process.env.DATABASE_SERVER,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME
    };
  }

  getConnection () {
    return new mssql.ConnectionPool(this.config, (err) => {
      console.log(err);
      throw new Error('Database connection error.');
    }).connect();
  }
}

export { Database };

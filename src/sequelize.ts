/**
 * sequelize
 */
import * as createDebug from 'debug';
import * as Sequelize from 'sequelize';
import { initialize } from './domain';

const debug = createDebug('web-admin:sequelize');

const sequelize = new Sequelize.Sequelize(
  process.env.MYSQL_DATABASE!,
  <any>null,
  <any>null,
  {
    dialect: 'mysql',
    benchmark: true,
    // port: parseInt(<string>process.env.MYSQL_PORT, 10),
    logging: (logStr: string, time: number) => {
      debug(`${logStr} (took ${time}ms)`);
    },
    replication: {
      read: [
        {
          host: process.env.MYSQL_HOST,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          port: Number(process.env.MYSQL_PORT)
        }
      ],
      write: {
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: Number(process.env.MYSQL_PORT)
      }
    },
    timezone: '+07:00'
  }
);

sequelize
  .authenticate()
  .then(() => {
    debug('MySQL server connected');
  })
  .catch((err: any) => {
    debug(`MySQL connection error ${err}`);
    process.exit();
  });

// initialize all repo and export it
export default initialize(sequelize);

const mongoose = require('mongoose');
const { DB_URI, DB_NAME } = require('../../config.json');

module.exports = () => {
  mongoose.connection.on('error', (err) => {
    console.error('DB connection error: ', err);
  });

  mongoose.connection.on('connected', () => {
    console.log('connected to DB');
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('DB connection termintated');
      process.exit(0);
    });
  });
  return mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    dbName: DB_NAME,
  });
};

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connect = mongoose.connection;
mongoose.set('strictQuery', true);

const MODE = process.env.MODE === 'production';

const locale = MODE ? process.env.MONGO_URI : process.env.DEBUG_MONGO_URI;

/**
 * Mongodb Connector 
 * @param {string} [url] Mongodb Url `Optional`
 */
const connectDB = async (url) => {
  const serverUrl = url ? url : locale;
  connect.on('connected', async () => {
    console.log('MongoDB Connection Established');
  });

  connect.on('reconnected', async () => {
    console.log('MongoDB Connection Reestablished');
  });

  connect.on('disconnected', () => {
    console.log('Mongo Connection Disconnected');
    console.log('Trying to reconnect to Mongo ...');

    setTimeout(() => {
      mongoose.connect(serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000
      });
    }, 3000);
  });

  connect.on('close', () => {
    console.log('Mongo Connection Closed');
  });
  connect.on('error', (error) => {
    console.log('Mongo Connection ERROR: ' + error);
  });

  await mongoose
    .connect(serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch((error) => console.log(error));
};

module.exports = { connectDB, connect };

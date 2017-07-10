const
  Koa = require('koa'),
  app = new Koa(),
  bodyParser = require('koa-bodyparser'),
  mongoose = require('mongoose'),
  amqp = require('amqplib'),
  queues = require('./queues');

mongoose.Promise = Promise;

// TODO: Move to config
const PORT = 3002;
const DB = 'mongodb://localhost/foobot-messages';
const AMQP_CONNECTION = 'amqp://localhost';
const EXCHANGE_NAME = 'messages';  // The name of the incoming messages exchange
const AMQP_CONNECTION_RETRY_INTERVAL = 3000;
const AMQP_CONNECTION_ATTEMPTS = 3;
const DB_CONNECTION_ATTEMPTS = 10;
const DB_CONNECTION_RETRY_INTERVAL = 3000;

function connect(func, attempts, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await func());
    } catch(err) {
      console.error(err)
      if(attempts === 1) {
        reject(new Error('Max connection attempts reached'));
        return;
      }
      setTimeout(async () => {
        resolve(await connect(func, --attempts, interval));
      }, interval);
    }
  });
}

async function main() {
  app.use(require('./routes'));
  app.use(bodyParser());

  const dbConnect = async () => {
    console.log('attempting db connection');
    const connection = await mongoose.createConnection(DB, {useMongoClient: true});
    console.log('db connection successful');
    return connection;
  };

  const amqpConnect = async () => {
    console.log('attempting amqp connection');    
    const connection = await amqp.connect(AMQP_CONNECTION);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic');
    channel.close();
    console.log('amqp connection successful');
    return connection;
  }

  const dbConnection = await connect(dbConnect, DB_CONNECTION_ATTEMPTS, DB_CONNECTION_RETRY_INTERVAL);
  const amqpConnection = await connect(amqpConnect, AMQP_CONNECTION_ATTEMPTS, AMQP_CONNECTION_RETRY_INTERVAL);
  
  queues.consume(amqpConnection);
  app.listen(PORT);


  console.log('messages service ready');
}

main();
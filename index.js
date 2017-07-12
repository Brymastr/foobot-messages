const
  Koa = require('koa'),
  app = new Koa(),
  bodyParser = require('koa-bodyparser'),
  mongoose = require('mongoose'),
  queues = require('./queues'),
  config = require('./config')(),
  actions = require('./actions');

mongoose.Promise = Promise;


main();

async function main() {
  app.use(require('./routes'));
  app.use(bodyParser());

  await connect(dbConnect, config.DB_CONNECTION_ATTEMPTS, config.DB_CONNECTION_RETRY_INTERVAL);
  await connect(queues.setup, config.AMQP_CONNECTION_ATTEMPTS, config.AMQP_CONNECTION_RETRY_INTERVAL);
  
  queues.consume(
    config.INCOMING_QUEUE_NAME,
    config.MESSAGES_EXCHANGE_NAME,
    config.INCOMING_ROUTE_KEY,
    actions.process
  );

  app.listen(config.PORT);

  console.log('messages service ready');
}

function dbConnect() {
  console.log('attempting db connection');
  mongoose.connect(config.DB, {useMongoClient: true});
  console.log('db connection successful');
}

function connect(func, attempts, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await func());
    } catch(err) {
      // console.error(err)
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
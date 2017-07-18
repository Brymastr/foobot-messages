const
  amqp = require('amqplib');

let connection;

exports.setup = async function() {
  console.log('attempting amqp connection');

  // Connect
  connection = await amqp.connect(config.AMQP_CONNECTION);
  const channel = await connection.createChannel();

  // Assert exchange
  await channel.assertExchange(config.MESSAGES_EXCHANGE_NAME, 'topic');

  // Assert incoming queue
  await channel.assertQueue(config.INCOMING_QUEUE_NAME);
  channel.bindQueue(config.INCOMING_QUEUE_NAME, config.MESSAGES_EXCHANGE_NAME, config.INCOMING_ROUTE_KEY);

  // Close channel and return
  // channel.close();
  console.log('amqp connection successful');
  return connection;
};

exports.consume = async function(queueName, exchangeName, routeKey, func) {
  const channel = await connection.createChannel();

  channel.consume(queueName, async message => {
    const m = JSON.parse(message.content.toString());

    try {
      await func(m);
      channel.ack(message);
    } catch(err) {
      console.log(err)
      channel.nack(message);
    }

  });
};

exports.publish = async function(message, routeKey, exchangeName) {
  const channel = await connection.createChannel();
  channel.publish(exchangeName, routeKey, new Buffer(JSON.stringify(message)));
  channel.close();  
};
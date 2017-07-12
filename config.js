module.exports = () => {
  const env = process.env;
  return config = {
    PORT: env.PORT || 3002,
    DB: env.DB || 'mongodb://localhost/foobot-messages',
    
    DB_CONNECTION_ATTEMPTS: 10,
    DB_CONNECTION_RETRY_INTERVAL: 3000,

    AMQP_CONNECTION: env.AMQP_CONNECTION || 'amqp://localhost',
    MESSAGES_EXCHANGE_NAME: 'messages',
    AMQP_CONNECTION_RETRY_INTERVAL: 5000,
    AMQP_CONNECTION_ATTEMPTS: 20,
    INCOMING_QUEUE_NAME: 'incoming_messages',
    INCOMING_ROUTE_KEY: 'message.*.incoming',

    USERS_SERVICE: env.USERS_SERVICE || 'http://localhost:3003'
  }
};


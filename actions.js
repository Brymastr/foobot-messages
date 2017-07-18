const
  users = require('./users'),
  Message = require('./Message'),
  queues = require('./queues');

exports.process = async function(message) {
  await saveMessage(message);

  queues.publish(message, config.PROCESSING_PUBLISH_KEY, config.MESSAGES_EXCHANGE_NAME);
};

async function saveMessage(message) {
  
  try {
    await Message.create(message);
    console.log(`message saved: ${message.text}`);
  } catch(err) {
    console.error(`Error saving message: ${err}`);
  }
}
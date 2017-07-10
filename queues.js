const amqp = require('amqplib');

const INCOMING_QUEUE_NAME = 'incoming_messages';
const EXCHANGE_NAME = 'messages';
const ROUTE_KEY = 'message.*.incoming';

exports.consume = async function(connection) {
  const channel = await connection.createChannel();
  const queue = await channel.assertQueue(INCOMING_QUEUE_NAME);
  channel.bindQueue(INCOMING_QUEUE_NAME, EXCHANGE_NAME, ROUTE_KEY);


  channel.consume(INCOMING_QUEUE_NAME, async message => {
    const m = JSON.parse(message.content.toString());
    console.log(`read: ${m}`);

    const user = await getUser(m);

    try {
      await saveMessage(m);

      // TODO: Remove. This is to simulate some work being done
      setTimeout(() => {
        console.log('ack');
      }, 2000);

      message.ack();

    } catch(err) {
      message.nack();
    }

  });
}

async function saveMessage(message) {
  try {
    await Message.create(message);
  } catch(err) {
    console.error('Error saving message');
  }
}

async function getUser(message) {
  // TODO: Get a user from the user service based on the user_id and platform fields of the message.
  // If there exists a foobot user for this platform/id, return the foobot user id
  return message.user_id;
}
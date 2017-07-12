const
  users = require('./users'),
  Message = require('./Message');

exports.process = async function(message) {
  // message.user_id is the id from the platform
  const user_id = await users.getUserByPlatformId(message.user_id);
  message.user_id = user_id;
  return await saveMessage(message);

  // TODO: Send message to the next step
};

async function saveMessage(message) {
  
  try {
    await Message.create(message);
    console.log(`message saved: ${message.text}`);
  } catch(err) {
    console.error(`Error saving message: ${err}`);
  }
}
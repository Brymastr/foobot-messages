const
  users = require('./users'),
  Message = require('./Message'),
  queues = require('./queues'),
  request = require('request-promise-native'),
  config = require('./config')();

exports.process = async function(message) {
  await Promise.all([
    saveMessage(message),
    updateUserInfo(message)
  ]);

  queues.publish(message, config.PROCESSING_PUBLISH_KEY, config.MESSAGES_EXCHANGE_NAME);
};

function saveMessage(message) {
  
  try {
    Message.create(message);
    console.log(`message saved: ${message.text}`);
  } catch(err) {
    console.error(`Error saving message: ${err}`);
  }
}

function updateUserInfo(message) {
  
  const { user_info } = message;

  try {
    return request.post(`${config.USERS_SERVICE}/${message.user_id}`, { json: {
      user_id: message.user_id,
      first_name: user_info.first_name,
      last_name: user_info.last_name,
      phone: user_info.phone,
      email: user_info.email,
      username: user_info.username,
      gender: user_info.gender,
      platform: message.platform
    }});

  } catch(err) {
    console.error(`Error updating user info: ${err}`);    
  }

}
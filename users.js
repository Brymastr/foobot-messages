const
  request = require('request-promise-native'),
  config = require('./config')();

exports.getUserByPlatformId = async function(id) {
  // TODO: Write the users service
  return '182463781';
  // return await request(`${config.USERS_SERVICE}/byPlatform/${id}`);
};
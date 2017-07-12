const
  request = require('request-promise-native'),
  config = require('./config')();

exports.getUserByPlatformId = async function(id) {
  return await request.post(`${config.USERS_SERVICE}/${id}`);
};
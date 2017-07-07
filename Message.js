const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Message', Schema({
  text: String,         // content of the message
  date: Date,           // Date the message was received (platform time)
  platform: String,     // platform that the message came from
  user_id: String,      // foobot id for a user. This comes from the telegram service as telegram user ID and is converted in this service to a foobot user id before saving
  group_id: String      // id of the conversation that this message was a part of
}));
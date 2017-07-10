const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


/**
 * NORMALIZED INCOMING message
 */
module.exports = mongoose.model('Message', Schema({
  text: String,         // content of the message
  date: Date,           // date the message was received (platform time)
  platform: String,     // platform that the message came from
  user_id: String,      // foobot id for a user. This comes from the telegram service as telegram user ID and is converted in this service to a foobot user id before saving
  group_id: String,     // id of the conversation that this message was a part of
  is_group: {type: Boolean, default: false}  // is this message a part of a group chat?
}));

/**
 * NORMALIZED OUTGOING message
 */
const message = {
  text: String,
  chat_id: String,
  keyboard: Object      // Generic keyboard to be denormalized for each platform
};
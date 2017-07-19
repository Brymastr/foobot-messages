const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


/**
 * NORMALIZED INCOMING message
 */
module.exports = mongoose.model('Message', Schema({
  message_id: String,   // id of the message in the platform. This is needed for updating and referencing existing messages
  text: String,         // content of the message
  date: Date,           // date the message was received (platform time)
  platform: String,     // platform that the message came from
  user_id: String,      // platform id for a user (telegram chat_id)
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
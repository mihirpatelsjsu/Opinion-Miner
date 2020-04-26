const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
    topic: String,
    hashtags: [String],
    tweets: [{
      name: String,
      screen_name: String,
      tweet: String,
      time: String,
      retweet_count: String,
      location: String,
      followers_count: Number,

    }]}, { collection: 'twitter' }
  );
  
module.exports = mongoose.model('tweetSchema',tweetSchema);  
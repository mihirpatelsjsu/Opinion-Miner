const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String} , { collection: 'user' }
);
  
module.exports = mongoose.model('userSchema',userSchema);  
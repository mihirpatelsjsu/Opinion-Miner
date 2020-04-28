var mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Jainish:jainish@cluster0-beood.mongodb.net/cmpe280?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {mongoose};

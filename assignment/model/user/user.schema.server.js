
var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    username : {type:String, require:true},
    password : String,
    firstName : String,
    lastName : String,
    email : String,
    phone : String,
    facebook: {id:    String, token: String},
    websites : [{type : mongoose.Schema.Types.ObjectId, ref : 'website'}],
    dateCreated : {type : Date , default : Date.now()}
}, {collection : 'user'});


module.exports = userSchema;
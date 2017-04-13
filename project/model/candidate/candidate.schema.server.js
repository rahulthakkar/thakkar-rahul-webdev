var mongoose = require("mongoose");
var candidateSchema = mongoose.Schema({
    email : {type:String, require:true},
    password : String,
    firstName : String,
    lastName : String,
    phone : String,
    facebook: {id: String, token: String},
    // Applied jobs
    applications : [{type : mongoose.Schema.Types.ObjectId, ref : 'application'}],
    // Follows these companies
    companies : [{type : mongoose.Schema.Types.ObjectId, ref : 'company'}],
    skills : [{type : String}],
    ethnicity: String,
    education: String,
    resumeURI : String,
    photoURI : String,
    dateCreated : {type : Date , default : Date.now()}
}, {collection : 'candidate'});


module.exports = candidateSchema;
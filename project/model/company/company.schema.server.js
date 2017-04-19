var mongoose = require("mongoose");
var companySchema = mongoose.Schema({
    email : {type:String, require:true},
    password : String,
    name : {type:String, require:true},
    description: String,
    phone : String,
    // posted jobs
    jobs : [{type : mongoose.Schema.Types.ObjectId, ref : 'job'}],
    size : {type: String, enum : ['1-50', '51-200', '201-1000', '1001-10000', '10000+']},
    linkedinURL : String,
    facebookURL : String,
    twitterURL : String,
    siteURL : String,
    photoURI : String,
    followerCount : {type: String, default : 0},
    dateCreated : {type : Date , default : Date.now()}
}, {collection : 'company'});


module.exports = companySchema;
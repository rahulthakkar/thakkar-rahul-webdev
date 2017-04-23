var mongoose = require("mongoose");
var candidateSchema = mongoose.Schema({
    email : {type:String, require:true},
    password : String,
    firstName : String,
    lastName : String,
    phone : String,
    facebook: {id: String, token: String},
    // Applied jobs
    applications : [{type : mongoose.Schema.Types.ObjectId, ref : 'applicationModel'}],
    // Follows these companies
    companies : [{type : mongoose.Schema.Types.ObjectId, ref : 'companyModel'}],
    skills : [{type : String}],
    role: {type: String, enum : ['User', 'Admin'],  default:'User'},
    ethnicity: String,
    education: String,
    resumeURI : String,
    resumeName : String,
    photoURI : {type:String, default:'/uploads/candidate/pics/default-candidate-pic.png'},
    photoName : {type:String, default:''},
    dateCreated : {type : Date , default : Date.now()}
}, {collection : 'candidate'});


module.exports = candidateSchema;
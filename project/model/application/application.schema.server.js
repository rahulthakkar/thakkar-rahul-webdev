var mongoose = require("mongoose");
var applicationSchema;
applicationSchema = mongoose.Schema({
    status: {type: String, enum : ['Closed', 'In Process', 'New', 'Not Selected'],  default:'New'},
    job : {type : mongoose.Schema.Types.ObjectId, ref : 'jobModel'},
    applicant: {type : mongoose.Schema.Types.ObjectId, ref : 'candidateModel'},
    answers: [{type: String}],
    dateCreated: {type: Date, default: Date.now()}
}, {collection: 'application'});


module.exports = applicationSchema;
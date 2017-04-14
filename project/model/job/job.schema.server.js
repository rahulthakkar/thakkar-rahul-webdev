var mongoose = require("mongoose");
var jobSchema;
jobSchema = mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    location: String,
    jobType: {type: String, enum : ['full-time', 'part-time', 'remote', 'internship']},
    applications : [{type : mongoose.Schema.Types.ObjectId, ref : 'application'}],
    isActive: Boolean,
    salary: String,
    questions: [{type: String}],
    dateCreated: {type: Date, default: Date.now()}
}, {collection: 'job'});


module.exports = jobSchema;
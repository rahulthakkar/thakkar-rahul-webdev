var mongoose = require("mongoose");
var jobSchema;
jobSchema = mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    location: String,
    //jobType: {type: String, enum : ['full-time', 'part-time', 'remote', 'internship'], default:'full-time'},
    jobType: String,
    applications : [{type : mongoose.Schema.Types.ObjectId, ref : 'applicationModel'}],
    company:{type : mongoose.Schema.Types.ObjectId, ref : 'companyModel'},
    isActive: {type:Boolean, default: true},
    salary: String,
    questions: [{type: String}],
    dateCreated: {type: Date, default: Date.now()}
}, {collection: 'job'});

jobSchema.index({title:'text', description:'text'});


module.exports = jobSchema;
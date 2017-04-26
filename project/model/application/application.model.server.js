module.exports = function() {
    var mongoose = require("mongoose");
    var applicationSchema = require("./application.schema.server");
    var applicationModel  = mongoose.model("applicationModel", applicationSchema);
    var jobSchema = require("../job/job.schema.server");
    var jobModel  = mongoose.model("jobModel", jobSchema);
    var q = require("q");

    var api = {
        "createApplication": createApplication,
        "findApplicationsByJobId": findApplicationsByJobId,
        "findApplicationsByCandidateId": findApplicationsByCandidateId
    };
    return api;

    function createApplication(candidateId, jobId){
        //console.log("create application in model");
        var deferred = q.defer();
        var application = new Object();
        application.job = jobId;
        application.applicant = candidateId;
        applicationModel.create(application,
            function(err, application) {
                if (err) {
                    //console.log("error in application in model");
                    //console.log(err);
                    deferred.reject(err);
                } else {
                    //console.log("success in application in model");
                    //console.log(application);
                    deferred.resolve(application);
                }
            })
        return deferred.promise;
    }


    function findApplicationsByJobId(jobId){
        var deferred = q.defer();
        applicationModel.find({"job" : jobId})
            .populate('applicant', 'firstName lastName email resumeURI resumeName photoURI photoName education ethnicity')
            .exec(function(err, applications){
                if(err){
                    //console.log("error");
                    //console.log(err);
                    deferred.reject(err);
                }else{
                    //console.log("model application");
                    //console.log(applications);
                    deferred.resolve(applications);
                }
            });
        return deferred.promise;
    }

    function findApplicationsByCandidateId(candidateId){
        var deferred = q.defer();
        applicationModel.find({"applicant" : candidateId})
            .populate('job','title location jobType salary')
            .exec(function(err, applications){
                if(err){
                    //console.log("error");
                    //console.log(err);
                    deferred.reject(err);
                }else{
                    //console.log("model application");
                    //console.log(applications);
                    deferred.resolve(applications);
                }
            });
        return deferred.promise;
    }
};
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
        console.log("create application in model");
        var deferred = q.defer();
        var application = new Object();
        application.job = jobId;
        application.applicant = candidateId;
        applicationModel.create(application,
            function(err, application) {
                if (err) {
                    console.log("error in application in model");
                    console.log(err);
                    deferred.reject(err);
                } else {
                    console.log("success in application in model");
                    console.log(application);
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
                    console.log("error");
                    console.log(err);
                    deferred.reject(err);
                }else{
                    console.log("model application");
                    console.log(applications);
                    deferred.resolve(applications);
                }
            });
        return deferred.promise;
    }

    /*function searchApplications(term){
        console.log("model application");
        var deferred = q.defer();
        applicationModel.find({$text : {$search: term}},
            function(err, applications){
                if(err){
                    console.log("model error");
                    console.log(err);
                    deferred.reject(err);
                }else{
                    console.log("model applications");
                    console.log(applications);
                    deferred.resolve(applications);
                }
            });
        return deferred.promise;
    }

    function findApplicationById(applicationId){
        //console.log(applicationId)
        var deferred = q.defer();
        applicationModel.findById(applicationId)
            .populate('company')
            .exec(function(err, application){
                if(err){
                    //console.log("Error in model"+ err);
                    deferred.reject(err);
                }else{
                    //console.log("Application in model"+ JSON.stringify(application));
                    deferred.resolve(application);
                }
            });
        return deferred.promise;
    }

    function updateApplication(applicationId, newApplication){
        var deferred = q.defer();
        applicationModel.update({"_id" : applicationId},
            {$set : newApplication}, {multi : true},
            function(err, application){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(application);
                }
            });
        return deferred.promise;
    }

    function deleteApplication(applicationId){
        console.log("Deleting in model");
        var deferred = q.defer();
        applicationModel.remove({"_id" : applicationId},
            function(err, application){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(application);
                }
            });
        return deferred.promise;
    }*/
};
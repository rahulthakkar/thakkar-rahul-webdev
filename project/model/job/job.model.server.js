module.exports = function() {
    var mongoose = require("mongoose");
    var jobSchema = require("./job.schema.server");
    var jobModel  = mongoose.model("jobModel", jobSchema);
    var companySchema = require("../company/company.schema.server");
    var companyModel  = mongoose.model("companyModel", companySchema);
    var q = require("q");

    var api = {
        "createJobForCompany": createJobForCompany,
        "findAllJobsForCompany": findAllJobsForCompany,
        "findJobById": findJobById,
        "updateJob": updateJob,
        "deleteJob": deleteJob
    };
    return api;

    function createJobForCompany(companyId, job){
        var deferred = q.defer();
        job.company = companyId;
        jobModel.create(job,
            function(err, job) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(job);
                }
            })
        return deferred.promise;
    }

    function findAllJobsForCompany(companyId){
        var deferred = q.defer();
        jobModel.find({"company" : companyId},
            function(err, job){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(job);
                }
            });
        return deferred.promise;
    }

    function findJobById(jobId){
        //console.log(jobId)
        var deferred = q.defer();
        jobModel.findById(jobId)
            .populate('company')
            .exec(function(err, job){
                if(err){
                    //console.log("Error in model"+ err);
                    deferred.reject(err);
                }else{
                    //console.log("Job in model"+ JSON.stringify(job));
                    deferred.resolve(job);
                }
            });
        return deferred.promise;
    }

    function updateJob(jobId, newJob){
        var deferred = q.defer();
        jobModel.update({"_id" : jobId},
            {$set : newJob}, {multi : true},
            function(err, job){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(job);
                }
            });
        return deferred.promise;
    }

    function deleteJob(jobId){
        console.log("Deleting in model");
        var deferred = q.defer();
        jobModel.remove({"_id" : jobId},
            function(err, job){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(job);
                }
            });
        return deferred.promise;
    }
};
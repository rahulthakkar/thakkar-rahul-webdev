module.exports = function(app) {
    var mongoose = require("mongoose");
    //mongoose.Promise = require("q")
    var companySchema = require("./company.schema.server");
    var companyModel  = mongoose.model("companyModel", companySchema);
    var jobSchema = require("../job/job.schema.server");
    var jobModel  = mongoose.model("jobModel", jobSchema);

    var q = require("q");


    var api = {
        "createCompany": createCompany,
        "findById": findCompanyById,
        "findCompanyById": findCompanyById,
        "findCompanyByEmail": findCompanyByEmail,
        "findCompanyByCredentials": findCompanyByCredentials,
        "updateCompany": updateCompany,
        "deleteCompany": deleteCompany,
        "findAllCompany": findAllCompany,
        "removeJob": removeJob
    };
    return api;

    function createCompany(newCompany){
        var deferred = q.defer();
        companyModel.create(newCompany,
            function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    /*function findCompanyById(companyId){
        var deferred = q.defer();
        companyModel.findById(companyId)
            .populate(jobs)
            .exec(function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }*/

    function findCompanyById(companyId){
        var deferred = q.defer();
        companyModel.findById(companyId)
            .populate('jobs','title location jobType salary')
            .exec(function(err, company){
                if(err){
                    //console.log("error");
                    //console.log(err);
                    deferred.reject(err);
                }else{
                    //console.log("company");
                    //console.log(company);
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function findCompanyByEmail(email){
        ///console.log("findCompanyByEmail"+ email);
        var deferred = q.defer();
        companyModel.findOne({"email" : email},
            function(err, company){
                if(company){
                    //console.log("No error in model"+company);
                    deferred.resolve(company);

                }else{
                    //console.log("Error in model"+err);
                    deferred.reject(err);
                }
            });
        return deferred.promise;
    }

    function findCompanyByCredentials(email, password){
        var deferred = q.defer();
        companyModel.findOne({"email" : email, "password" : password},
            function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function updateCompany(companyId, newCompany){
        var deferred = q.defer();
        //console.log("update compnay model server");
        //console.log(companyId);
        //console.log("new Compnay", newCompany);

        companyModel.findOneAndUpdate({"_id" : companyId},
            {$set : newCompany}, {new : true},
            function(err, company){
                if(err){
                    //console.log("error", err);
                    deferred.reject(err);
                }else{
                    //console.log("updated company", company);
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function removeJob(companyId, jobId){
        var deferred = q.defer();
        companyModel.update({"_id" : companyId},
            {$pullAll : {"jobs": [jobId]}},
            function(err, company){
                if(err){
                    //console.log("error occured");
                    deferred.reject(err);
                }else{
                    //console.log("removed the job ");
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function deleteCompany(companyId) {
        var deferred = q.defer();
        companyModel.remove({"_id" : companyId},
            function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function findAllCompany() {
        return companyModel.find();
    }
};
module.exports = function(app) {
    var mongoose = require("mongoose");
    var companySchema = require("./company.schema.server");
    var companyModel  = mongoose.model("companyModel", companySchema);
    var q = require("q");

    var api = {
        "createCompany": createCompany,
        "findById": findCompanyById,
        "findCompanyById": findCompanyById,
        "findCompanyByEmail": findCompanyByEmail,
        "findCompanyByCredentials": findCompanyByCredentials,
        "updateCompany": updateCompany,
        "deleteCompany": deleteCompany,
        "findAllCompany": findAllCompany
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

    function findCompanyById(companyId){
        var deferred = q.defer();
        companyModel.findById(companyId,
            function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(company);
                }
            });
        return deferred.promise;
    }

    function findCompanyByEmail(email){
        console.log("findCompanyByEmail"+ email);
        var deferred = q.defer();
        companyModel.findOne({"email" : email},
            function(err, company){
                if(company){
                    console.log("No error in model"+company);
                    deferred.resolve(company);

                }else{
                    console.log("Error in model"+err);
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
        companyModel.update({"_id" : companyId},
            {$set : newCompany}, {multi : true},
            function(err, company){
                if(err){
                    deferred.reject(err);
                }else{
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
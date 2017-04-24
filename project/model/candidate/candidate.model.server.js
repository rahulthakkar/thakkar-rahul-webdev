module.exports = function(app) {
    var mongoose = require("mongoose");
    var candidateSchema = require("./candidate.schema.server");
    var candidateModel  = mongoose.model("candidateModel", candidateSchema);
    var q = require("q");

    var api = {
        "createCandidate": createCandidate,
        "findById": findCandidateById,
        "findCandidateById": findCandidateById,
        "findCandidateByEmail": findCandidateByEmail,
        "findCandidateByCredentials": findCandidateByCredentials,
        "updateCandidate": updateCandidate,
        "deleteCandidate": deleteCandidate,
        "findCandidateByFacebookId": findCandidateByFacebookId,
        "findAllCandidates": findAllCandidates,
        "followCompany": followCompany,
        "unfollowCompany": unfollowCompany
    };
    return api;

    function createCandidate(newCandidate){
        var deferred = q.defer();
        console.log("Craeting a new candidate"+ JSON.stringify(newCandidate));
        candidateModel.create(newCandidate,
            function(err, candidate){
                if(err){
                    console.log("error"+err);
                    deferred.reject(err);
                }else{
                    console.log("Not error"+candidate);
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateById(candidateId){
        var deferred = q.defer();
        candidateModel.findById(candidateId)
            .populate('applications','status job applicant')
            .exec(function(err, candidate){
                if(err){
                    console.log("Error in fetching candidate model");
                    console.log(err);
                    deferred.reject(err);
                }else{
                    console.log("found candidate");
                    console.log(candidate.applications);
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateByEmail(email){
        var deferred = q.defer();
        candidateModel.findOne({"email" : email})
            .populate('applications','status job applicant')
            .exec(function(err, candidate){
                if(err){
                    console.log("Error in fetching candidate model");
                    console.log(err);
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;

        /*candidateModel.findOne({"email" : email},
            function(err, candidate){
                if(candidate){
                    //console.log("No error in model"+candidate);
                    deferred.resolve(candidate);

                }else{
                    console.log("Error in model"+err);
                    deferred.reject(err);
                }
            });
        return deferred.promise;*/
    }

    function findCandidateByCredentials(email, password){
        var deferred = q.defer();
        candidateModel.findOne({"email" : email, "password" : password},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function updateCandidate(candidateId, newCandidate){
        var deferred = q.defer();
        candidateModel.findOneAndUpdate({"_id" : candidateId},
            {$set : newCandidate}, {new: true},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function unfollowCompany(candidateId, companyId) {
        console.log("unfollow");
        var deferred = q.defer();
        candidateModel.findByIdAndUpdate(
            candidateId,
            {$pullAll : {'companies': [companyId]}},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function followCompany(candidateId, companyId) {
        console.log("follow");
        var deferred = q.defer();
        candidateModel.findByIdAndUpdate(
            candidateId,
            {$push : {'companies': companyId}},
            {safe : true},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function deleteCandidate(candidateId) {
        var deferred = q.defer();
        candidateModel.remove({"_id" : candidateId},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateByFacebookId(facebookId) {
        var deferred = q.defer();
        candidateModel.findOne({'facebook.id': facebookId})
            .populate('applications','status job applicant')
            .exec(function(err, candidate){
                if(err){
                    console.log("Error in fetching candidate model");
                    console.log(err);
                    deferred.reject(err);
                }else{
                    console.log("found candidate");
                    console.log(candidate.applications);
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findAllCandidates() {
        return candidateModel.find();
    }
};
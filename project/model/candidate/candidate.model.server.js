module.exports = function(app) {
    var mongoose = require("mongoose");
    var candidateSchema = require("./candidate.schema.server");
    var candidateModel  = mongoose.model("candidateModel", candidateSchema);
    var q = require("q");

    var api = {
        "createCandidate": createCandidate,
        "findCandidateById": findCandidateById,
        "findCandidateByUsername": findCandidateByUsername,
        "findCandidateByCredentials": findCandidateByCredentials,
        "updateCandidate": updateCandidate,
        "deleteCandidate": deleteCandidate,
        "findCandidateByFacebookId": findCandidateByFacebookId
    };
    return api;

    function createCandidate(newCandidate){
        var deferred = q.defer();
        candidateModel.create(newCandidate,
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateById(candidateId){
        var deferred = q.defer();
        candidateModel.findById(candidateId,
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateByUsername(username){
        var deferred = q.defer();
        candidateModel.findOne({"username" : username},
            function(err, candidate){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(candidate);
                }
            });
        return deferred.promise;
    }

    function findCandidateByCredentials(username, password){
        var deferred = q.defer();
        candidateModel.findOne({"username" : username, "password" : password},
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
        candidateModel.update({"_id" : candidateId},
            {$set : newCandidate}, {multi : true},
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
        return candidateModel.findOne({'facebook.id': facebookId});
    }
};
module.exports = function() {
    var mongoose = require("mongoose");
    var websiteSchema = require("./website.schema.server");
    var websiteModel  = mongoose.model("websiteModel", websiteSchema);
    var userSchema = require("../user/user.schema.server");
    var userModel  = mongoose.model("userModel", userSchema);
    var q = require("q");

    var api = {
        "createWebsiteForUser": createWebsiteForUser,
        "findAllWebsitesForUser": findAllWebsitesForUser,
        "findWebsiteById": findWebsiteById,
        "updateWebsite": updateWebsite,
        "deleteWebsite": deleteWebsite
    };
    return api;

    function createWebsiteForUser(userId, website){
        var deferred = q.defer();
        website._user = userId;
        websiteModel.create(website,
            function(err, website) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(website);
                }
            })
        return deferred.promise;
    }

    function findAllWebsitesForUser(userId){
        var deferred = q.defer();
        websiteModel.find({"_user" : userId},
            function(err, website){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function findWebsiteById(websiteId){
        var deferred = q.defer();
        websiteModel.findById(websiteId,
            function(err, website){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function updateWebsite(websiteId, newWebsite){
        var deferred = q.defer();
        websiteModel.update({"_id" : websiteId},
            {$set : newWebsite}, {multi : true},
            function(err, website){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function deleteWebsite(websiteId){
        var deferred = q.defer();
        websiteModel.remove({"_id" : websiteId},
            function(err, website){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }
};
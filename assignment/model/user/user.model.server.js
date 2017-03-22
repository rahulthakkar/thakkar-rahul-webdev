module.exports = function(app) {
    var mongoose = require("mongoose");
    var userSchema = require("./user.schema.server");
    var userModel  = mongoose.model("userModel", userSchema);
    var q = require("q");

    var api = {
        "createUser": createUser,
        "findUserById": findUserById,
        "findUserByUsername": findUserByUsername,
        "findUserByCredentials": findUserByCredentials,
        "updateUser": updateUser,
        "deleteUser": deleteUser
    };
    return api;

    function createUser(newUser){
        var deferred = q.defer();
        userModel.create(newUser,
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserById(userId){
        var deferred = q.defer();
        userModel.findById(userId,
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByUsername(username){
        var deferred = q.defer();
        userModel.findOne({"username" : username},
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(userId, password){
        var deferred = q.defer();
        userModel.findOne({"username" : userId, "password" : password},
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function updateUser(userId, newUser){
        var deferred = q.defer();
        userModel.update({"_id" : userId},
            {$set : newUser}, {multi : true},
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        userModel.remove({"_id" : userId},
            function(err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
};
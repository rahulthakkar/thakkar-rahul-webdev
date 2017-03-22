module.exports = function () {
    var mongoose = require("mongoose");
    var pageSchema = require("./page.schema.server");
    var pageModel  = mongoose.model("pageModel", pageSchema);
    var websiteSchema = require("../website/website.schema.server");
    var websiteModel = mongoose.model("websiteModel", websiteSchema);
    var q = require("q");

    var api = {
        "createPage": createPage,
        "findAllPagesForWebsite": findAllPagesForWebsite,
        "findPageById": findPageById,
        "updatePage": updatePage,
        "deletePage": deletePage
    };
    return api;

    function createPage(websiteId, page){
        var deferred = q.defer();
        page._website = websiteId;
        pageModel.create(page,
            function(err, page) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function findAllPagesForWebsite(websiteId){
        var deferred = q.defer();
        pageModel.find({"_website" : websiteId},
            function(err, page){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function findPageById(pageId){
        var deferred = q.defer();
        pageModel.findById(pageId,
            function(err, page){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function updatePage(pageId, newPage){
        var deferred = q.defer();
        pageModel.update({"_id" : pageId},
            {$set : newPage}, {multi : true},
            function(err, page){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function deletePage(pageId){
        var deferred = q.defer();
        pageModel.remove({"_id" : pageId},
            function(err, page){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }
};
module.exports = function () {
    var mongoose = require("mongoose");
    var widgetSchema = require("./widget.schema.server");
    var widgetModel  = mongoose.model("widgetModel", widgetSchema);
    var pageSchema = require("../page/page.schema.server");
    var pageModel  = mongoose.model("pageModel", pageSchema);
    var q = require("q");

    var api = {
        "createWidget": createWidget,
        "findAllWidgetsForPage": findAllWidgetsForPage,
        "findWidgetById": findWidgetById,
        "updateWidget": updateWidget,
        "deleteWidget": deleteWidget
    };
    return api;

    function createWidget(pageId, widget){
        var deferred = q.defer();
        widget._page = pageId;
        widgetModel.create(widget,
            function(err, widget) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(widget);
            }
        });
        return deferred.promise;
    }

    function findAllWidgetsForPage(pageId){
        var deferred = q.defer();
        widgetModel.find({"_page" : pageId},
            function(err, widgets){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(widgets);
            }
        });
        return deferred.promise;
    }

    function findWidgetById(widgetId){
        var deferred = q.defer();
        widgetModel.findById(widgetId,
            function(err, widget){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(widget);
            }
        });
        return deferred.promise;
    }

    function updateWidget(widgetId, newWidget){
        var deferred = q.defer();
        widgetModel.update({"_id" : widgetId},
            {$set : newWidget}, {multi : true},
            function(err, widget){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(widget);
                }
            });
        return deferred.promise;
    }

    function deleteWidget(widgetId){
        var deferred = q.defer();
        widgetModel.remove({"_id" : widgetId},
            function(err, widget){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(widget);
                }
            });

        return deferred.promise;
    }
};
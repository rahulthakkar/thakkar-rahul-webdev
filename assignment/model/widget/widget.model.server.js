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
        "deleteWidget": deleteWidget,
        "updateIndices": updateIndices
    };
    return api;

    function createWidget(pageId, widget){
        var deferred = q.defer();
        widget._page = pageId;
        widget.index = 0;
        findAllWidgetsForPage(pageId)
            .then(function(widgets){
                //console.log("widgets" +widget);
                widget.index = widgets.length;
            }, function (err) {
            });
        //console.log("Index"+ widget.index);
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
        //console.log("id"+ widgetId + " new"+newWidget);
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

    function updateAllIndexGreaterOrEqual(widgetId){
        findWidgetById(widgetId)
            .then(function(widget){
                updateIndices(widget.pageId, widget.index, Number.MAX_VALUE);
            });
    }

    function deleteWidget(widgetId){
        var deferred = q.defer();
        updateAllIndexGreaterOrEqual(widgetId);
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

    function updateIndices(pageId, initialIndex, finalIndex) {
        var deferred = q.defer();
        findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                widgets = updateIndex(widgets, initialIndex, finalIndex);
                var promises = [];
                for( var w in widgets){
                    pomises.push(updateWidget(widgets[w]._id, widgets[w]))
                }
                Promise.all(promises)
                    .then(function (result) {
                        deferred.resolve(result);
                    }, function (err) {
                        deferred.reject(err);
                    })
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function updateIndex(widgets, initialIndex, finalIndex) {
        initialIndex = parseInt(initialIndex);
        finalIndex = parseInt(finalIndex);

        if(initialIndex != finalIndex) {
            var reverse = false;
            var index = -1;
            if(initialIndex>finalIndex){
                reverse = true;
            }
            var movedWidget;
            for(w in  widgets) {
                index = widgets[w].index;
                if(index == initialIndex) {
                    movedWidget = widgets[w];
                } else if(!reverse && index>initialIndex && index<=finalIndex) {
                    widgets.index -= 1;
                } else if(reverse && index<initialIndex && index>=finalIndex) {
                    widgets.index += 1;
                } else{

                }
            }
            movedWidget.index = finalIndex;
        }
        return widgets;
    }
};
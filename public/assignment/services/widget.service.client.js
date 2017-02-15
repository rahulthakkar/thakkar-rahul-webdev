(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", widgetService);

    function widgetService() {

        var widgets = [
            { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" },
            { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function createWidget(pageId, widget) {
            widget.pageId = pageId;
            widget._id = (new Date()).getTime();
            widgets.push(widget);
            return true;
        }

        function findWidgetsByPageId(pageId) {
            var wgets = [];
            for(var w in widgets) {
                if(widgets[w].pageId === pageId) {
                    wgets.push(widgets[w]);
                }
            }
            return wgets;
        }

        function findWidgetById(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id == widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            for(var w in widgets) {
                if(widgets[w]._id == widgetId) {
                    widgets[w].text = widget.text;
                    widgets[w].name = widget.name;
                    widgets[w].size = widget.size;
                    widgets[w].width = widget.width;
                    widgets[w].url = widget.url;
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }
        
        function deleteWidget(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();
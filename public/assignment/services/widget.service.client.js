(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", widgetService);

    function widgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findAllWidgetsForPage": findAllWidgetsForPage,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "updateIndex": updateIndex
        };
        return api;


        function createWidget(pageId, widget) {
            return $http.post("/api/page/"+pageId+"/widget", widget);
        }

        function findAllWidgetsForPage(pageId) {
            return $http.get("/api/page/"+pageId+"/widget");
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/"+widgetId);
        }

        function updateWidget(widgetId, widget) {
            return $http.put("/api/widget/"+widgetId, widget);
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/"+widgetId);
        }

        function updateIndex(pageId, intialIndex, finalIndex) {
            return $http.put("/api/page/"+pageId+"/widget?initial="+intialIndex+"&final="+finalIndex);
        }

    }
})();
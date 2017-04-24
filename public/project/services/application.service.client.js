(function () {
    angular
        .module("JobNowMaker")
        .service("ApplicationService", applicationService);

    function applicationService($http) {

        var api = {
            "apply" : apply
        };
        return api;


        function apply(candidateId, jobId) {
            console.log("apply client service");
            return $http.post("/api/application?candidateId="+ candidateId +"&jobId="+jobId);
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
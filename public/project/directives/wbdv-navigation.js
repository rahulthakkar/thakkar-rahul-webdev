(function () {
    angular
        .module('JobNowMaker')
        .directive('wbdvNavigation', ['$http', '$rootScope','$templateCache', '$compile', navigation]);

    function navigation($http, $rootScope, $compile) {
        //console.log("Navigation called");
        function getURL(scope, element, attributes) {
            return "views/common/navigation.view.client.html";
        }
        return {
            replace:true,
            templateUrl: getURL(),
            restrict: "E",
        };
    }
})();



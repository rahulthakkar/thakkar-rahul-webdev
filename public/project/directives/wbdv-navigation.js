(function () {
    angular
        .module('JobNowMaker')
        .directive('wbdvNavigation', ['$http', '$rootScope','$templateCache', '$compile', navigation])
        .controller('wbdvNavigationController', ['$scope', '$rootScope', function($scope, $rootScope) {
            var vm = this;
            console.log("controller Called");
            console.log($rootScope.currentUser);
            $scope.$on('candidateLoggedIn', function(event, data) {
                console.log("Called");
                $rootScope.currentUser = data;
                vm.currentUser = data;
            });

        }]);

    function navigation($http, $rootScope, $templateCache, $compile) {
        console.log("Navigation called");
        function getURL(scope, element, attributes) {
            return "views/common/candidate.navigation.view.client.html";
        }
        return {
            replace:true,
            templateUrl: getURL(),
            restrict: "E",
            //link: linker
        };
    }
})();



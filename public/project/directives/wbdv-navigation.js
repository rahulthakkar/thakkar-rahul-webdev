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
            /*if($rootScope.currentUser) {
             if($rootScope.currentUser.role) {
             if($rootScope.currentUser.role == 'Admin') {
             //return "views/common/admin.navigation.view.client.html";*/
            return "views/common/candidate.navigation.view.client.html";
            /*} else {
             console.log("candidate")
             return "views/common/candidate.navigation.view.client.html";
             }
             } else {
             console.log("company")
             return "views/common/company.navigation.view.client.html";
             }
             } else {
             console.log("regular")
             return "views/common/nouser.navigation.view.client.html";
             }*/
        }

        /*var linker = function (scope, element, attrs) {

         scope.$watch('data', function () {
         var templateUrl = getURL();
         var data = $templateCache.get(templateUrl);
         console.log("data"+ data);
         console.log("data"+ templateUrl);
         element.html(data);
         $compile(element.contents())(scope);

         });
         }*/

        return {
            replace:true,
            templateUrl: getURL(),
            restrict: "E",
            //link: linker
        };
    }
})();



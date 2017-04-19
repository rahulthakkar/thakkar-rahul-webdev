(function () {
    angular
        .module('JobNowMaker')
        .directive('wbdvNavigation', ['$http', '$rootScope', navigation]);
        //.direction('uploadImage', ['$arg', uploadImage]);

    function navigation($http, $rootScope) {
        function getURL(scope, element, attributes) {
            if(isCandidateLoggedin()){
                //if(isAdminLoggedin()){
                //    return "views/common/admin.navigation.view.client.html";
                //}
                console.log("candidate")
                return "views/common/candidate.navigation.view.client.html";
            } else if(isCompanyLoggedin()){
                console.log("company")
                return "views/common/company.navigation.view.client.html";
            }
            console.log("regular")
            return "views/common/nouser.navigation.view.client.html";
        }

        function isCandidateLoggedin () {
            //console.log("Check loggedin client");
            var isCandidate = false;
            $http.get('/api/candidate/loggedin')
                .then(function(res) {
                    user = res.data;
                    console.log("got response for candidate"+JSON.stringify(user));
                    $rootScope.errorMessage = null;
                    if (user !== '0') {
                        isCandidate = true;
                        console.log("candidate found");
                        $rootScope.currentUser = user;

                    }
                });
            return isCandidate;
        };

        function isCompanyLoggedin () {
            //console.log("Check loggedin client");
            var isCompany = false;
            $http.get('/api/company/loggedin')
                .then(function(res) {
                    user = res.data;
                    console.log("Company got response"+ JSON.stringify(user));
                    $rootScope.errorMessage = null;
                    if (user !== '0') {
                        isCompany = true;
                        console.log("Company found");
                        $rootScope.currentUser = user;

                    }
                });
            return isCompany;
        };

        function isAdminLoggedin () {
            //console.log("Check loggedin client");
            var isAdmin = false;
            $http.get('/api/admin/loggedin')
                .then(function(user) {
                    console.log("Admin got response");
                    $rootScope.errorMessage = null;
                    if (user !== '0') {
                        isAdmin = true;
                        console.log("Admin found"+ JSON.stringify(user));
                        $rootScope.currentUser = user;

                    }
                });
            return isAdmin;
        };

        return {
             templateUrl: getURL()
            //template: "<p>Hello World</p>"
        };
    }



})();



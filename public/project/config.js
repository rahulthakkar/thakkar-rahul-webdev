(function(){
    angular
        .module("JobNowMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider
            .when("/candidate/login",{
                templateUrl: "views/candidate/candidate.login.view.client.html",
                controller: "CandidateLoginController",
                controllerAs: "model",
                //resolve: { currentUser: checkCandidateLoggedin }
            })
            .when("/company/login",{
                templateUrl: "views/company/company.login.view.client.html",
                controller: "CompanyLoginController",
                controllerAs: "model",
                resolve: { currentUser: forwardToCompanyProfile }
            })
            .when("/candidate/register", {
                templateUrl: "views/candidate/candidate.register.view.client.html",
                controller: 'CandidateRegisterController',
                controllerAs: 'model'
            })
            .when("/company/register", {
                templateUrl: "views/company/company.register.view.client.html",
                controller: 'CompanyRegisterController',
                controllerAs: 'model'
            })
            .when("/candidate/logout",{
                templateUrl: "views/common/common.logout.view.client.html",
                controller: "CandidateLogoutController",
                controllerAs: "model"
            })
            .when("/company/logout",{
                templateUrl: "views/common/common.logout.view.client.html",
                controller: "CompanyLogoutController",
                controllerAs: "model"
            })
            .when("/candidate/view/:uid", {
                templateUrl: 'views/candidate/candidate.view.view.client.html',
                controller: 'CandidateViewController',
                controllerAs: 'model'
            })
            .when("/candidate/profile/", {
                templateUrl: 'views/candidate/candidate.profile.view.client.html',
                controller: 'CandidateProfileController',
                controllerAs: 'model',
                resolve: { currentUser: checkCandidateLoggedin }
            })
            .when("/company/view/:uid", {
                templateUrl: 'views/company/company.view.client.html',
                controller: 'CompanyViewController',
                controllerAs: 'model',
                resolve: {currentUser: checkCurrentUser}
            })
            .when("/company/profile/", {
                templateUrl: 'views/company/company.profile.view.client.html',
                controller: 'CompanyProfileController',
                controllerAs: 'model',
                resolve: { currentUser: checkCompanyLoggedin }
            })
            .when("/company/dashboard/", {
                templateUrl: 'views/company/company.dashboard.view.client.html',
                controller: 'CompanyDashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkCompanyLoggedin }
            })
            .when("/admin/company", {
                templateUrl: 'views/company/company.list.view.client.html',
                controller: 'CompanyListController',
                controllerAs: 'model',
                resolve: { currentUser: checkAdminLoggedin }
            })
            .when("/admin/candidate", {
                templateUrl: 'views/candidate/candidate.list.view.client.html',
                controller: 'CandidateListController',
                controllerAs: 'model',
                resolve: { currentUser: checkAdminLoggedin }
            })
            .when("/main", {
                templateUrl: 'views/job/job.indeed.search.view.client.html',
                controller: 'JobIndeedSearchController',
                controllerAs: 'model',
                resolve: { currentUser: checkCurrentUser }
            })


            .when("/company/job",{
                templateUrl: 'views/job/job.list.view.client.html',
                controller: "JobListController",
                controllerAs: "model",
                resolve: { currentUser: checkCompanyLoggedin }

            })
            .when("/company/job/new",{
                templateUrl: 'views/job/job.new.view.client.html',
                controller: "JobNewController",
                controllerAs: "model",
                resolve: { currentUser: checkCompanyLoggedin }

            })
            .when("/company/job/:jid",{
                templateUrl: 'views/job/job.edit.view.client.html',
                controller: "JobEditController",
                controllerAs: "model",
                resolve: { currentUser: checkCompanyLoggedin }

            })
            .when("/company/job/view/:jid",{
                templateUrl: 'views/job/job.company.view.client.html',
                controller: "JobCompanyViewController",
                controllerAs: "model",
                resolve: { currentUser: checkCompanyLoggedin }

            })
            .when("/job/view/:jid",{
                templateUrl: 'views/job/job.view.client.html',
                controller: "JobViewController",
                controllerAs: "model",
                resolve: {currentUser: checkCurrentUser}
            })
            .when("/job/:jid/apply",{
                templateUrl: 'views/application/job.apply.client.html',
                controller: "JobApplicationController",
                controllerAs: "model",
                resolve: {currentUser: checkCandidateLoggedin}
            })
            .when("/job/search",{
                templateUrl: 'views/job/job.search.view.client.html',
                controller: "JobSearchController",
                controllerAs: "model",
                resolve: { currentUser: checkCurrentUser}
            })
            .otherwise({redirectTo : '/main'});
    }

    var checkCandidateLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        //console.log("Check loggedin client");
        $http.get('/api/candidate/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            //console.log("Check loggedin client not 0" + JSON.stringify(user));
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/candidate/login');
            }
        });
        return deferred.promise;
    };

    var checkCompanyLoggedin = function($q, $timeout, $http, $location, $rootScope) {

        console.log("Check loggedin company client");
        var deferred = $q.defer();
        $http.get('/api/company/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                console.log($rootScope);
                if($rootScope.lastPath){
                    var path = $rootScope.lastPath;
                    $rootScope.lastPath = false;
                    $location.url(path);
                }
                deferred.resolve();
            } else {
                deferred.reject();
                //console.log("$location");
                //console.log($location.$$path);
                $rootScope.lastPath = $location.$$path
                $location.url('/company/login');
            }
        });
        return deferred.promise;
    };

    var checkAdminLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/admin/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/candidate/login');
            }
        });
        return deferred.promise;
    };


    var forwardToCompanyProfile = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        console.log("forward called")
        $http.get('/api/company/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
                $location.url("/company/profile");
            }
            deferred.resolve();
        });
        return deferred.promise;
    }

    var checkCurrentUser = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        console.log("checkCurrentUser called")
        $http.get('/api/admin/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                console.log("checkCurrentUser called candidate")
                $http.get('/api/candidate/loggedin').success(function (user) {
                    $rootScope.errorMessage = null;
                    // User is Authenticated
                    console.log("Got candidate");
                    console.log(user);
                    if (user !== '0') {
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    } else {
                        console.log("checkCurrentUser called company")
                        $http.get('/api/company/loggedin').success(function (user) {
                            $rootScope.errorMessage = null;
                            if (user !== '0') {
                                $rootScope.currentUser = user;
                                deferred.resolve();
                            }
                            deferred.resolve();
                        });
                    }
                });
            }
        });
        return deferred.promise;
    };
})();
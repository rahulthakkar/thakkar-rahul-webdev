(function(){
    angular
        .module("JobNowMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider
            .when("/candidate/login",{
                templateUrl: "views/candidate/candidate.login.view.client.html",
                controller: "CandidateLoginController",
                controllerAs: "model"
            })
            .when("/company/login",{
                templateUrl: "views/company/company.login.view.client.html",
                controller: "CompanyLoginController",
                controllerAs: "model",

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
                templateUrl: 'views/company/company.view.view.client.html',
                controller: 'CompanyViewController',
                controllerAs: 'model'
            })
            .when("/company/profile/", {
                templateUrl: 'views/company/company.profile.view.client.html',
                controller: 'CompanyProfileController',
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
                controllerAs: 'model'
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
            .when("/navigation",{
                templateUrl: 'views/job/job.edit.view.client.html',
                controller: "JobEditController",
                controllerAs: "model",
                resolve: { currentUser: checkCompanyLoggedin }

            })


            .when("/user/:uid/website/new",{
                templateUrl: 'views/company/company-new.view.client.html',
                controller: "WebsiteNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid",{
                templateUrl: 'views/company/company-edit.view.client.html',
                controller: "WebsiteEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page",{
                templateUrl: 'views/page/page-list.view.client.html',
                controller: "PageListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/new",{
                templateUrl: 'views/page/page-new.view.client.html',
                controller: "PageNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid",{
                templateUrl: 'views/page/page-edit.view.client.html',
                controller: "PageEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget",{
                templateUrl: 'views/application/widget-list.view.client.html',
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new",{
                templateUrl: 'views/application/widget-chooser.view.client.html',
                controller: "WidgetNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid",{
                templateUrl: 'views/application/widget-edit.view.client.html',
                controller: "WidgetEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid/flickr",{
                templateUrl: 'views/application/editors/widget-flickr-search.view.client.html',
                controller: "WidgetFlickrSearchController",
                controllerAs: "model"
            })
            .otherwise({redirectTo : '/candidate/login'});
    }

    var checkCandidateLoggedin = function($q, $timeout, $http, $location, $rootScope) {
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
                deferred.resolve();
            } else {
                deferred.reject();
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
                $location.url('/candidate/profile');
            }
        });
        return deferred.promise;
    };
})();
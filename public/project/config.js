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
                controllerAs: "model"
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
            .when("/candidate/profile/:uid", {
                templateUrl: 'views/candidate/candidate.profile.view.client.html',
                controller: 'CandidateProfileController',
                controllerAs: 'model',
                //resolve: { loggedin: checkCandidateLoggedin }
            })
            .when("/company/view/:uid", {
                templateUrl: 'views/company/company.view.view.client.html',
                controller: 'CompanyViewController',
                controllerAs: 'model'
            })
            .when("/company/profile/:uid", {
                templateUrl: 'views/company/company.profile.view.client.html',
                controller: 'CompanyProfileController',
                controllerAs: 'model',
                //resolve: { loggedin: checkCompanyLoggedin }
            })
            .when("/company", {
                templateUrl: 'views/company/company.list.view.client.html',
                controller: 'CompanyListController',
                controllerAs: 'model',
                //resolve: { loggedin: checkAdminLoggedin }
            })
            .when("/candidate", {
                templateUrl: 'views/candidate/candidate.list.view.client.html',
                controller: 'CandidateListController',
                controllerAs: 'model',
                //resolve: { loggedin: checkAdminLoggedin }
            })

            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/website",{
                templateUrl: 'views/company/company-list.view.client.html',
                controller: "WebsiteListController",
                controllerAs: "model"
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

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };
})();
(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        //$httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/login",{
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when("/user", {
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/website",{
                templateUrl: 'views/website/website-list.view.client.html',
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/new",{
                templateUrl: 'views/website/website-new.view.client.html',
                controller: "WebsiteNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid",{
                templateUrl: 'views/website/website-edit.view.client.html',
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
                templateUrl: 'views/widget/widget-list.view.client.html',
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new",{
                templateUrl: 'views/widget/widget-chooser.view.client.html',
                controller: "WidgetNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid",{
                templateUrl: 'views/widget/widget-edit.view.client.html',
                controller: "WidgetEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid/flickr",{
                templateUrl: 'views/widget/editors/widget-flickr-search.view.client.html',
                controller: "WidgetFlickrSearchController",
                controllerAs: "model"
            })
            .otherwise({redirectTo : '/login'});
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
(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", websiteListController)
        .controller("WebsiteEditController", websiteEditController)
        .controller("WebsiteNewController", websiteNewController);

    function websiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                });
        }
        init();
    }

    function websiteEditController($routeParams, $location ,WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        // event handlers
        vm.update = update;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                });

            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function (website) {
                    vm.website = website;
                });
        }
        init();

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/");
                })
                .error(function () {
                    vm.error = "Unable to delete the page";
                });
        }

        function update(updatedWebsite) {
            WebsiteService
                .updateWebsite(vm.websiteId, updatedWebsite)
                .success(function (website) {
                    if (website == null) {
                        vm.error = "Unable to update website";
                    } else {
                        $location.url("/user/"+vm.userId+"/website");
                    }
                })
                .error(function () {
                    vm.error = "Unable to update website";
                });
        }
    }


    function websiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        // event handlers
        vm.create = create;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                });
        }
        init();


        function create(newWebsite) {
            WebsiteService
                .createWebsite(vm.userId, newWebsite)
                .success(function (website) {
                    if (website == null) {
                        vm.error = "Unable to create new website";
                    } else {
                        $location.url("/user/" + vm.userId + "/website");
                    }
                });
        }
    }
})();
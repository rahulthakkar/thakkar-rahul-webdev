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
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
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
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();

        function deleteWebsite() {
            var hasDeleted = WebsiteService.deleteWebsite(vm.websiteId);
            if(!hasDeleted) {
                vm.error = "Unable to delete the page";
            } else {
                $location.url("/user/"+vm.userId+"/website/");
            }
        }

        function update(updatedWebsite) {
            var website = WebsiteService.updateWebsite(vm.websiteId, updatedWebsite);
            if(website == null) {
                vm.error = "Unable to update the website";
            } else {
                $location.url("/user/"+vm.userId+"/website");
            }
        }
    }


    function websiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        // event handlers
        vm.create = create;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();


        function create(newWebsite) {
            var website = WebsiteService.createWebsite(vm.userId, newWebsite);
            if(website == null) {
                vm.error = "Unable to create new website";
            } else {
                $location.url("/user/"+vm.userId+"/website");
            }
        }
    }
})();
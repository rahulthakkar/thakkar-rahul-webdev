(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", pageListController)
        .controller("PageEditController", pageEditController)
        .controller("PageNewController", pageNewController);


    function pageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        // event handlers


        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

    }

    function pageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        // event handlers
        vm.update = update;
        vm.deletePage = deletePage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        function deletePage() {
            var hasDeleted = PageService.deletePage(vm.pageId);
            if(!hasDeleted) {
                vm.error = "Unable to delete the page";
            } else {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }

        function update(updatedPage) {
            var page = PageService.updatePage(vm.pageId, updatedPage);
            if(page == null) {
                vm.error = "Unable to update the page";
            } else {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }


    }

    function pageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        // event handlers
        vm.create = create;


        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function create(newPage) {
            var hasCreated = PageService.createPage(vm.websiteId, newPage);
            if(!hasCreated) {
                vm.error = "Unable to create new page";
            } else {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }
    }
})();
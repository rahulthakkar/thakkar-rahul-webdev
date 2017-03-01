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
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                });
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
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                });

            PageService
                .findPageById(vm.pageId)
                .success(function (page) {
                    vm.page = page;
                });
        }
        init();

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = "Unable to delete the page";
                });
        }

        function update(updatedPage) {
            PageService
                .updatePage(vm.pageId, updatedPage)
                .success(function (page) {
                    if(page == null) {
                        vm.error = "Unable to update the page";
                    } else {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                })
                .error(function () {
                    vm.error = "Unable to update the page";
                });
        }


    }

    function pageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        // event handlers
        vm.create = create;


        function init() {
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                });
        }
        init();

        function create(newPage) {
            PageService
                .createPage(vm.websiteId, newPage)
                .success(function (page) {
                    if (page == null) {
                        vm.error = "Unable to create new page";
                    } else {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                });
        }
    }
})();
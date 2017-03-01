(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {

        var api = {
            "createPage": createPage,
            "findAllPagesForWebsite": findAllPagesForWebsite,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };
        return api;

        function createPage(websiteId, page) {
            return $http.post("/api/website/"+websiteId+"/page", page);
        }

        function findAllPagesForWebsite(websiteId) {
            return $http.get("/api/website/"+websiteId+"/page");
        }

        function findPageById(pageId) {
            return $http.get("/api/page/"+pageId);
        }

        function updatePage(pageId, page) {
            return $http.put("/api/page/"+pageId, page);
        }

        function deletePage(pageId) {
            return $http.delete("/api/page/"+pageId);
        }


        /*function createPage(websiteId, page) {
            page.websiteId = websiteId;
            page._id = (new Date()).getTime();
            pages.push(page);
            return true;
        }

        function findPageByWebsiteId(websiteId) {
            var page = [];
            for(var p in pages) {
                if(pages[p].websiteId == websiteId) {
                    page.push(pages[p]);
                }
            }
            return page;
        }

        function findPageById(pageId) {
            for(var p in pages) {
                if(pages[p]._id == pageId) {
                    return angular.copy(pages[p]);
                }
            }
            return null;
        }

        function updatePage(pageId, newPage){
            for(var p in pages) {
                if(pages[p]._id == pageId) {
                    pages[p].name = newPage.name;
                    pages[p].description = newPage.description;
                    return angular.copy(pages[p]);
                }
            }
            return null;
        }

        function deletePage(pageId) {
            for(var p in pages) {
                if(pages[p]._id == pageId) {
                    pages.splice(p, 1);
                    return true;
                }
            }
            return false;
        }*/
    }
})();



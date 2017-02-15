(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ]

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };
        return api;

        function createPage(websiteId, page) {
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
        }
    }
})();



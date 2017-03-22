module.exports = function (app, model) {
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    /*var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];*/

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var newPage = req.body;
        model.pageModel.createPage(websiteId, newPage)
            .then(function(page){
                model.websiteModel.findWebsiteById(websiteId)
                    .then(function (website) {
                        website.pages.push(page._id);
                        model.websiteModel.updateWebsite(websiteId, website)
                            .then(function (website) {
                                res.status(200).send(page);
                            }, function (err) {
                                res.sendStatus(404).send(err);
                            })
                        }, function (err) {
                        res.sendStatus(404).send(err);
                        })
                },
                function(err){
                    res.sendStatus(404).send(err);
                });
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var newPage = req.body;
        model.pageModel.updatePage(pageId, newPage)
            .then(function(page){
                    res.status(200).send(page);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        model.pageModel.findPageById(pageId)
            .then(function(page){
                    res.status(200).send(page);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        model.pageModel.deletePage(pageId)
            .then(function(result){
                    res.status(200).send(result);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;

        model.pageModel.findAllPagesForWebsite(websiteId)
            .then(function(pages){
                    res.status(200).send(pages);
                },
                function(err){
                    res.status(404).send(err);
                });
    }
};


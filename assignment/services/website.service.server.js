module.exports = function (app, model) {
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    /*var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem", created: new Date() }
    ];*/

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var newWebsite = req.body;
        model.websiteModel.createWebsiteForUser(userId, newWebsite)
            .then(function(website){
                    model.userModel.findUserById(userId)
                        .then(function (user) {
                            user.websites.push(website._id);
                            model.userModel.updateUser(userId, user)
                                .then(function (user) {
                                    res.status(200).send(website);
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

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var newWebsite = req.body;
        model.websiteModel.updateWebsite(websiteId, newWebsite)
            .then(function(website){
                    res.status(200).send(website);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        model.websiteModel.findWebsiteById(websiteId)
            .then(function(website){
                    res.status(200).send(website);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        model.websiteModel.deleteWebsite(websiteId)
            .then(function(result){
                    res.status(200).send(result);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        model.websiteModel.findAllWebsitesForUser(userId)
            .then(function(websites){
                    res.status(200).send(websites);
                },
                function(err){
                    res.status(404).send(err);
                });
    }
};


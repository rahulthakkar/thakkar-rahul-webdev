module.exports = function (app, model) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    /*var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder" , email: "alice@neu.edu"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley" , email: "bob@neu.edu"},
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia" , email: "charly@neu.edu"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jannunzi@neu.edu"}
    ];*/

    function createUser(req, res) {
        var newUser = req.body;
        //console.log(newUser);
        model.userModel.createUser(newUser)
            .then(function(user){
                    res.status(200).send(user);
                },
                function(err){
                    res.sendStatus(500).send(err);
                });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model.userModel.updateUser(userId, newUser)
            .then(function(user){
                    res.status(200).send(user);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.userModel.findUserById(userId)
            .then(function(user){
                    res.status(200).send(user);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.userModel.findUserByUsername(username)
            .then(function(user){
                    res.status(200).send(user);
                },
                function(err){
                    res.sendStatus(404).send(err);
                });
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        model.userModel.findUserByCredentials(username, password)
            .then(function(user){
                    res.status(200).send(user);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.userModel.deleteUser(userId)
            .then(function(result){
                    res.status(200).send(result);
                },
                function(err){
                    res.status(404).send(err);
                });
    }
}


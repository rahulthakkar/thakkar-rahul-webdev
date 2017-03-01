module.exports = function (app) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder" , email: "alice@neu.edu"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley" , email: "bob@neu.edu"},
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia" , email: "charly@neu.edu"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jannunzi@neu.edu"}
    ];

    function createUser(req, res) {
        var newUser = req.body;
        var user = users.find(function (u) {
            return u.username == newUser.username;
        });
        if(user) {
            res.sendStatus(404);
        } else {
            newUser._id = (new Date()).getTime();
            users.push(newUser);
            res.json(newUser);
        }
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        for(var u in users) {
            if( users[u]._id == userId ) {
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                users[u].email = newUser.email;
                res.json(users[u]);
                return;
            }
        }
        res.sendStatus(404);
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        var user = users.find(function (u) {
            return u._id == userId;
        });

        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
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
        var user = users.find(function (u) {
            return u.username == req.query.username;
        });
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        var user = users.find(function(user){
            return user.password == password && user.username == username;
        });
        res.json(user);
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        for(var w in users) {
            if(users[u]._id == userId) {
                users.splice(u, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
}


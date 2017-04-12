module.exports = function (app, model) {
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID: "1314009178653872",
        clientSecret: "9980976600eb559e546bd744cc88005d",
        callbackURL: "/auth/facebook/callback",
    };
    var bcrypt = require("bcrypt-nodejs");
    const util = require('util');
    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post('/api/register', register);
    app.get('/api/loggedin', loggedin);


    app.post('/api/login', passport.authenticate('local'), login);
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            //successRedirect: '/assignment/index.html#/user',
            failureRedirect: '/assignment/index.html#/login'
        }),
        function(req, res) {
            res.redirect('http://localhost:3000/assignment/index.html#/user/'+req._passport.session.user._id);
        });

    /*var users = [
     {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder" , email: "alice@neu.edu"},
     {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley" , email: "bob@neu.edu"},
     {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia" , email: "charly@neu.edu"},
     {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jannunzi@neu.edu"}
     ];*/

    function createUser(req, res) {
        var newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.password);

        //console.log(newUser);
        model.userModel.createUser(newUser)
            .then(function (user) {
                    res.status(200).send(user);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model.userModel.updateUser(userId, newUser)
            .then(function (user) {
                    res.status(200).send(user);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.userModel.findUserById(userId)
            .then(function (user) {
                    res.status(200).send(user);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findUserByCredentials(req, res);
        } else if (username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.userModel.findUserByUsername(username)
            .then(function (user) {
                    res.status(200).send(user);
                },
                function (err) {
                    res.sendStatus(404).send(err);
                });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model.userModel.findUserByCredentials(username, password)
            .then(function (user) {
                    res.status(200).send(user);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.userModel.deleteUser(userId)
            .then(function (result) {
                    res.status(200).send(result);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel.findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model.userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    //console.log(user);
                    //console.log("password1" + password);
                    //user = user[0];
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    //console.log("some error");
                    return done(null, false);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model.userModel
            .createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        console.log("Profile" + profile);
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                console.log("Found user"+ user);
                console.log("Done"+ done);

                if (user) {
                    return done(null, user);
                } else {

                    var nameList = profile.displayName.split(" ")
                    var firstname = nameList[0];
                    var lastname = nameList[nameList.length - 1];
                    var newUser = {
                        username: firstname,
                        firstname: firstname,
                        lastname: lastname,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    console.log("New user"+ newUser);

                    model.userModel.createUser(newUser).then(function (user) {
                        console.log("Returning"+ user);
                        return done(null, user);
                        }, function (err) {
                            console.log("Some error"+ user);
                            return done(err);
                        }
                    );
                }
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });

    }
}


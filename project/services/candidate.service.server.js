module.exports = function (app, model) {
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID: "1314009178653872",
        clientSecret: "9980976600eb559e546bd744cc88005d",
        callbackURL: "/auth/candidate/facebook/callback",
        profileFields: ['id', 'email', 'name']
    };
    var bcrypt = require("bcrypt-nodejs");
    const util = require('util');
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/api/candidate/loggedin', loggedin);
    app.post('/api/candidate/logout', logout);
    app.post('/api/candidate/login', passport.authenticate('local'), login);
    app.post("/api/candidate", createCandidate);
    app.get("/api/candidate", findCandidate);
    app.get("/api/admin/candidate", authorized, findAllCandidates);
    app.get("/api/candidate/:candidateId", findCandidateById);
    app.put("/api/candidate/:candidateId", updateCandidate);
    app.delete("/api/candidate/:candidateId", deleteCandidate);


    app.post('/api/candidate/register', register);



    app.get('/auth/candidate/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/candidate/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/project/#/candidate/login'
        }),
        function(req, res) {
            //console.log(req._passport.session);
            //console.log(req._passport.session.user._id);
            var url = 'http://localhost:3000/project/index.html#/candidate/profile/';
            res.redirect(url);
        });


    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function isAdmin (req, res, next) {
        if(user.roles.indexOf("admin") > 0) {
            return true
        }
        return false;
    }

    function createCandidate(req, res) {
        var newCandidate = req.body;
        newCandidate.password = bcrypt.hashSync(newCandidate.password);

        //console.log(newCandidate);
        model.candidateModel.createCandidate(newCandidate)
            .then(function (candidate) {
                    res.status(200).send(candidate);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                });
    }

    function updateCandidate(req, res) {
        var candidateId = req.params.candidateId;
        var newCandidate = req.body;
        model.candidateModel.updateCandidate(candidateId, newCandidate)
            .then(function (candidate) {
                    res.status(200).send(candidate);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findCandidateById(req, res) {
        var candidateId = req.params.candidateId;
        model.candidateModel.findCandidateById(candidateId)
            .then(function (candidate) {
                    res.status(200).send(candidate);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findCandidate(req, res) {
        var email = req.query.email;
        var password = req.query.password;
        if (email && password) {
            findCandidateByCredentials(req, res);
        } else if (email) {
            findCandidateByEmail(req, res);
        }
    }

    function findCandidateByEmail(req, res) {
        var email = req.query.email;
        model.candidateModel.findCandidateByEmail(email)
            .then(function (candidate) {
                    res.status(200).send(candidate);
                },
                function (err) {
                    res.sendStatus(404).send(err);
                });
    }

    function findAllCandidate(req, res) {
        model.candidateModel.findAllCandidate()
            .then(function (candidates) {
                    res.status(200).send(candidates);
                },
                function (err) {
                    res.sendStatus(404).send(err);
                });
    }

    function findCandidateByCredentials(req, res) {
        var email = req.query.email;
        var password = req.query.password;
        model.candidateModel.findCandidateByCredentials(email, password)
            .then(function (candidate) {
                    res.status(200).send(candidate);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function deleteCandidate(req, res) {
        var candidateId = req.params.candidateId;
        model.candidateModel.deleteCandidate(candidateId)
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
        //console.log("deserializeUser called" + JSON.stringify(user));
        model.candidateModel.findCandidateById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(email, password, done) {
        //console.log("localstartegy" + email +" " + password);
        model.candidateModel
            .findCandidateByEmail(email)
            .then(
                function(candidate) {
                    //console.log(candidate);
                    console.log("password1" + password);

                    if(candidate && bcrypt.compareSync(password, candidate.password)) {
                        return done(null, candidate);
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
        var candidate = req.user;
        console.log("login called server" + candidate);
        res.json(candidate);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var candidate = req.body;
        //console.log("Craeting a candidate"+ JSON.stringify(candidate));
        //console.log("Email"+ candidate.email);

        model.candidateModel.findCandidateByEmail(candidate.email)
            .then(function (candidate) {
                    //console.log("Found already"+ candidate);
                    res.sendStatus(404).send(err);
                },
                function (err) {
                    //console.log("Craeting a new one"+ candidate);
                    candidate.password = bcrypt.hashSync(candidate.password);
                    model.candidateModel
                        .createCandidate(candidate)
                        .then(
                            function (candidate) {
                                //console.log("Craeted successfully a candidate"+ candidate);
                                if (candidate) {
                                    req.login(candidate, function (err) {
                                        if (err) {
                                            res.status(404).send(err);
                                        } else {
                                            res.json(candidate);
                                        }
                                    });
                                }
                            }
                        );
                });
    }

    function loggedin(req, res) {
        console.log("Checking loggedin sever");
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        //console.log("Profile" + JSON.stringify(profile));
        model.candidateModel
            .findCandidateByFacebookId(profile.id)
            .then(function (candidate) {
                console.log("Found candidate"+ candidate);


                if (candidate) {
                    return done(null, candidate);
                } else {
                    var email = profile.emails ? profile.emails[0].value:"";
                    var firstName = profile.name.givenName;
                    var lastName = profile.name.familyName;
                    //console.log("email" + email);
                    //console.log("firstName" + firstName);
                    //console.log("lastName" + lastName);

                    var newCandidate = {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    //console.log("New candidate"+ JSON.stringify(newCandidate));

                    model.candidateModel.createCandidate(newCandidate).then(function (candidate) {
                            //console.log("Returning"+ candidate);
                            return done(null, candidate);
                        }, function (err) {
                            //console.log("Some error"+ candidate);
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


    function findAllCandidates(req, res) {
        if(isAdmin(req.user)) {
            model.candidateModel.
                .findAllCandidates()
                .then(
                    function (candidates) {
                        res.json(candidates);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }
}


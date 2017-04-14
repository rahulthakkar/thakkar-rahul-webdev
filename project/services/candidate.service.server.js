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

    passport.serializeUser(serializeCandidate);
    passport.deserializeUser(deserializeCandidate);

    app.post("/api/candidate", createCandidate);
    app.get("/api/candidate", findCandidate);
    app.get("/api/all/candidate", findAllCandidate);
    app.get("/api/candidate/:candidateId", findCandidateById);
    app.put("/api/candidate/:candidateId", updateCandidate);
    app.delete("/api/candidate/:candidateId", deleteCandidate);
    app.post('/api/candidate/login', passport.authenticate('local'), login);
    app.post('/api/candidate/logout', logout);
    app.post('/api/candidate/register', register);
    app.get('/api/candidate/loggedin', loggedin);


    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/project/index.html#/login'
        }),
        function(req, res) {
            res.redirect('http://localhost:3000/project/index.html#/candidate/profile/'+req._passport.session.candidate._id);
        });

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
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findCandidateByCredentials(req, res);
        } else if (username) {
            findCandidateByUsername(req, res);
        }
    }

    function findCandidateByUsername(req, res) {
        var username = req.query.username;
        model.candidateModel.findCandidateByUsername(username)
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

    function serializeCandidate(candidate, done) {
        done(null, candidate);
    }

    function deserializeCandidate(candidate, done) {
        model.candidateModel.findCandidateById(candidate._id)
            .then(
                function (candidate) {
                    done(null, candidate);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(email, password, done) {
        model.candidateModel
            .findCandidateByUsername(email)
            .then(
                function(candidate) {
                    //console.log(candidate);
                    //console.log("password1" + password);
                    //candidate = candidate[0];
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
        var candidate = req.candidate;
        res.json(candidate);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var candidate = req.body;
        candidate.password = bcrypt.hashSync(candidate.password);
        model.candidateModel
            .createCandidate(candidate)
            .then(
                function (candidate) {
                    if (candidate) {
                        req.login(candidate, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(candidate);
                            }
                        });
                    }
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.candidate : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        console.log("Profile" + profile);
        model.candidateModel
            .findCandidateByFacebookId(profile.id)
            .then(function (candidate) {
                console.log("Found candidate"+ candidate);
                console.log("Done"+ done);

                if (candidate) {
                    return done(null, candidate);
                } else {

                    var nameList = profile.displayName.split(" ")
                    var firstname = nameList[0];
                    var lastname = nameList[nameList.length - 1];
                    var newCandidate = {
                        email: firstname,
                        firstname: firstname,
                        lastname: lastname,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    console.log("New candidate"+ newCandidate);

                    model.candidateModel.createCandidate(newCandidate).then(function (candidate) {
                            console.log("Returning"+ candidate);
                            return done(null, candidate);
                        }, function (err) {
                            console.log("Some error"+ candidate);
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


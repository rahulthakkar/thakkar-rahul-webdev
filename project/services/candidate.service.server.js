module.exports = function (app, model) {
    var passport = require('passport');
    //var passport = new passport();
    //var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'email', 'name']
    };

    var multer = require('multer');
    var resumeStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/uploads/candidate/resumes/')
        },
        filename: function (req, file, cb) {

            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    var picStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/uploads/candidate/pics/')
        },
        filename: function (req, file, cb) {

            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    var resumeUpload = multer({ //multer settings
        storage: resumeStorage
    }).single('resume');

    var picUpload = multer({ //multer settings
        storage: picStorage
    }).single('pic');

    var bcrypt = require("bcrypt-nodejs");
    const util = require('util');
    passport.use('candidate', new LocalStrategy({usernameField: 'email', passwordField: 'password'},localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/candidate/resume/:candidateId', authorize, resumeUploadFunc);
    app.post('/api/candidate/pic/:candidateId', authorize, picUploadFunc);
    app.post('/api/candidate/logout', logout);
    app.post('/api/candidate/login', passport.authenticate('candidate'), login);
    app.post('/api/candidate/register', register);
    app.get('/api/candidate/loggedin', loggedin);
    app.get("/api/candidate", authorize, findCandidate);
    app.get("/api/admin/candidate", authorize, findAllCandidates);
    app.get("/api/admin/loggedin", adminLoggedin);
    app.get("/api/candidate/:candidateId", authorize, findCandidateById);
    app.put("/api/candidate/follow", authorize, followToggle);
    app.put("/api/candidate/:candidateId", authorize, updateCandidate);

    app.delete("/api/candidate/:candidateId", authorize, deleteCandidate);

    app.get('/auth/candidate/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/candidate/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: 'project/#/candidate/login'
        }),
        function(req, res) {
            var url = req.protocol + '://' + req.get('host');
            url = url+'/project/#/candidate/profile/';
            //console.log(url);
            //console.log(req.user);

            res.redirect(url);
        });




    function authorize (req, res, next) {
        //console.log("authorized called");
        if (!req.isAuthenticated()) {
            //console.log("authenticate err")
            res.send(401);
        } else {
            //console.log("next")
            next();
        }
    }

    function isAdmin (user) {
        if(user.role === "Admin") {
            return true
        }
        return false;
    }

    function sendTransformObject(candidate){
        //console.log("Before"+ JSON.stringify(candidate, null, 2));
        delete candidate.password;
        delete candidate.facebook;
        delete candidate.role;
        delete candidate.dateCreated;
        delete candidate._v;
        //console.log("After"+ JSON.stringify(candidate, null, 2))
        return candidate;
    }

    function updateTransformObject(candidate){
        //console.log("Before"+ JSON.stringify(candidate, null, 2))
        delete candidate.facebook;
        delete candidate._id;
        delete candidate.role;
        delete candidate.dateCreated;
        delete candidate._v;
        //console.log("After"+ JSON.stringify(candidate, null, 2))
        return candidate;
    }

    function resumeUploadFunc(req, res, next) {
        //console.log("starting 1");
        var candidateId = req.params.candidateId;
        if(isAdmin(req.user) || req.user._id == candidateId) {
            //console.log("authorized");
            resumeUpload(req, res, function (err) {
                //console.log("File upload called..1", req);
                if(req.file) {
                    if (err) {
                        res.status(404);
                    }
                    //console.log("Uploaded");
                    //console.log(req.file.filename);
                    model.candidateModel.findCandidateById(candidateId)
                        .then(function(candidate){
                            candidate.resumeURI = '/uploads/candidate/resumes/' + req.file.filename;
                            candidate.resumeName = req.file.originalname;
                            model.candidateModel.updateCandidate(candidateId, candidate)
                                .then(function (candidate) {
                                        res.status(200).send(sendTransformObject(candidate));
                                    },
                                    function (err) {
                                        res.status(404).send(err);
                                    });
                        });
                    res.status(200);
                } else {
                    console.log("Else");
                    res.status(404);
                }
            });
        } else{
            res.send(403);
        }

    }

    function picUploadFunc(req, res, next) {
        //console.log("starting 2");
        var candidateId = req.params.candidateId;
        if(isAdmin(req.user) || req.user._id == candidateId) {
            picUpload(req, res, function (err) {
                //console.log("File upload called..1");
                if (req.file) {
                    if (err) {
                        res.status(404);
                    }
                    //console.log("Uploaded");
                    //console.log(req.file.filename);
                    model.candidateModel.findCandidateById(candidateId)
                        .then(function (candidate) {
                            candidate.photoURI = '/uploads/candidate/pics/' + req.file.filename;
                            candidate.photoName = req.file.originalname;
                            model.candidateModel.updateCandidate(candidateId, candidate)
                                .then(function (candidate) {
                                        res.status(200).send(sendTransformObject(candidate));
                                    },
                                    function (err) {
                                        res.status(404).send(err);
                                    });
                        });
                    res.status(200);
                } else {
                    //console.log("Else");
                    res.status(404);
                }
            });
        } else{
            res.send(403);
        }
    }

    function updateCandidate(req, res) {
        var candidateId = req.params.candidateId;
        if(isAdmin(req.user) || req.user._id == candidateId) {
            var newCandidate = req.body;
            //console.log("New candidate"+ JSON.stringify(newCandidate));
            //console.log("candidateId"+ candidateId);
            model.candidateModel.updateCandidate(candidateId, updateTransformObject(newCandidate))
                .then(function (candidate) {
                        res.status(200).send(sendTransformObject(candidate));
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else{
            res.status(403);
        }

    }

    function followToggle(req, res) {
        //console.log("followToggle server called");
        var candidateId = req.query.candidateId;
        var companyId = req.query.companyId;
        //console.log(candidateId+" followcompany server called "+ companyId);
        if(candidateId && candidateId==req.user._id) {
            if(req.user.companies.indexOf(companyId) > -1){
                model.candidateModel.unfollowCompany(candidateId, companyId)
                    .then(function (candidate) {
                            res.status(200).send(sendTransformObject(candidate));
                        },
                        function (err) {
                            res.status(404).send(err);
                        });
            } else {
                model.candidateModel.followCompany(candidateId, companyId)
                    .then(function (candidate) {
                            res.status(200).send(sendTransformObject(candidate));
                        },
                        function (err) {
                            res.status(404).send(err);
                        });
            }
        } else {
            res.status(403);
        }
    }

    function findCandidateById(req, res) {
        var candidateId = req.params.candidateId;
        if(isAdmin(req.user) || req.user._id == candidateId) {
            model.candidateModel.findCandidateById(candidateId)
                .then(function (candidate) {
                        res.status(200).send(sendTransformObject(candidate));
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else{
            res.send(403);
        }

    }

    function findCandidate(req, res) {
        if(isAdmin(req.user)) {
            var email = req.query.email;
            var password = req.query.password;
            findCandidateByEmail(req, res);

        } else {
            res.status(403);
        }
    }

    function findCandidateByEmail(req, res) {
        if(isAdmin(req.user)) {
            var email = req.query.email;
            model.candidateModel.findCandidateByEmail(email)
                .then(function (candidate) {
                        res.status(200).send(sendTransformObject(candidate));
                    },
                    function (err) {
                        res.sendStatus(404).send(err);
                    });
        } else{
            res.status(403);
        }
    }

    function deleteCandidate(req, res) {
        var candidateId = req.params.candidateId;
        if(isAdmin(req.user) || req.user._id == candidateId) {
            model.candidateModel.deleteCandidate(candidateId)
                .then(function (result) {
                        res.status(200).send(result);
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else {
            res.status(403);
        }
    }

    function serializeUser(user, done) {
        //console.log("searilaizeUser called");
        done(null, user);
    }

    function deserializeUser(user, done) {
        //console.log("deserializeUser called");
        var isCandidate = user.role? true: false;
        //console.log("is canidadate", isCandidate);
        var collection = isCandidate? model.candidateModel: model.companyModel;
        //console.log("collection is ", collection);
        //console.log("User ID is ", user._id);

        collection.findById(user._id)
            .then(
                function (user) {
                    //console.log("Found user and User ID is ", user._id);
                    done(null, user);
                },
                function (err) {
                    //console.log("Some error occured");
                    done(err, null);
                });
    }

    function localStrategy(email, password, done) {
        //console.log("candidate localstartegy" + email +" " + password);
        model.candidateModel
            .findCandidateByEmail(email)
            .then(
                function(candidate) {
                    //console.log("password1" + bcrypt.hashSync(password));
                    //console.log("password " + candidate.password);
                    if(candidate && bcrypt.compareSync(password, candidate.password)) {
                        return done(null, sendTransformObject(candidate));
                    }
                    return done(null, false);
                },
                function(err) {
                    return done(null, false);
                }
            );
    }

    function login(req, res) {
        var candidate = req.user;
        //console.log("login called server" + candidate);
        res.json(sendTransformObject(candidate));
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var candidate = req.body;
        //console.log("register called");
        updateTransformObject(candidate);
        model.candidateModel.findCandidateByEmail(candidate.email)
            .then(function (candidate) {
                    //console.log("Already found one"+ candidate);
                    res.sendStatus(404);
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
                                            //console.log("error on login");
                                            res.status(404).send(err);
                                        } else {
                                            res.json(sendTransformObject(candidate));
                                        }
                                    });
                                }
                            });
                });
    }

    function loggedin(req, res) {
        //console.log("Checking loggedin sever",req.user);
        //console.log("Checking loggedin sever",req.isAuthenticated());
        res.send(req.isAuthenticated() && req.user.role? sendTransformObject(req.user) : '0');
    }

    function adminLoggedin(req, res) {
        res.send(req.isAuthenticated() && isAdmin(req.user) ? sendTransformObject(req.user) : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        //console.log("Profile" + JSON.stringify(profile));
        model.candidateModel
            .findCandidateByFacebookId(profile.id)
            .then(function (candidate) {
                //console.log("Found candidate"+ candidate);


                if (candidate) {
                    return done(null, sendTransformObject(candidate));
                } else {
                    var email = profile.emails ? profile.emails[0].value: "";
                    var firstName = profile.name? profile.name.givenName: "";
                    var lastName = profile.name? profile.name.familyName: "";
                    var newCandidate = {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };

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
                //console.log("err")
                if (err) {
                    return done(err);
                }
            });
    }


    function findAllCandidates(req, res) {
        if(isAdmin(req.user)) {
            model.candidateModel
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


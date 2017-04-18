module.exports = function (app, model) {
    //var passport = require('passport');
    var passport = require('passport');
    //var passport = new passport();
    //app.use(passport.initialize());
    //app.use(passport.session());
    var LocalStrategy = require('passport-local').Strategy;

    var bcrypt = require("bcrypt-nodejs");
    const util = require('util');
    passport.use('company', new LocalStrategy({usernameField: 'email', passwordField: 'password'},localStrategy));

    app.post('/api/company/login', passport.authenticate('company'), login);
    app.post('/api/company/logout', logout);
    app.post('/api/company/register', register);
    app.get('/api/company/loggedin', loggedin);
    app.get("/api/company", authorize, findCompany);
    app.get("/api/admin/company", authorize, findAllCompany);
    app.get("/api/company/:companyId", authorize, findCompanyById);
    app.put("/api/company/:companyId", authorize, updateCompany);
    app.delete("/api/company/:companyId", authorize, deleteCompany);

    function authorize (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function isAdmin (user) {
        if(user.role === "Admin") {
            return true
        }
        return false;
    }

    function sendTransformObject(company){
        delete company.password;
        delete company.dateCreated;
        delete company._v;
        return company;
    }

    function updateTransformObject(company){
        delete company._id;
        delete company.role;
        delete company.dateCreated;
        delete company._v;
        return company;
    }


    function updateCompany(req, res) {
        var companyId = req.params.companyId;
        var newCompany = req.body;
        if (companyId && companyId == req.user._id) {
            model.companyModel.updateCompany(companyId, updateTransformObject(newCompany))
                .then(function (company) {
                        res.status(200).send(sendTransformObject(company));
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else {
            res.status(403);
        }
    }

    function findCompanyById(req, res) {
        var companyId = req.params.companyId;
        model.companyModel.findCompanyById(companyId)
            .then(function (company) {
                    res.status(200).send(sendTransformObject(company));
                },
                function (err) {
                    res.status(404).send(err);
                });

    }

    function findCompany(req, res) {
        if(isAdmin(req.user)) {
            var email = req.query.email;
            var password = req.query.password;
            if (email && password) {
                findCompanyByCredentials(req, res);
            } else if (email) {
                findCompanyByEmail(req, res);
            }
        } else {
            res.status(403);
        }
    }

    function findCompanyByEmail(req, res) {
        if(isAdmin(req.user)) {
            var email = req.query.email;
            model.companyModel.findCompanyByEmail(email)
                .then(function (company) {
                        res.status(200).send(sendTransformObject(company));
                    },
                    function (err) {
                        res.sendStatus(404).send(err);
                    });
        } else{
            res.status(403);
        }
    }

    function deleteCompany(req, res) {
        if(isAdmin(req.user)) {
            var companyId = req.params.companyId;
            model.companyModel.deleteCompany(companyId)
                .then(function (result) {
                        res.status(200).send(result);
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else{
            res.status(403);
        }
    }

    function localStrategy(email, password, done) {
        console.log("Company localStrategy");
        model.companyModel
            .findCompanyByEmail(email)
            .then(
                function(company) {
                    console.log(company);
                    console.log("password1" + bcrypt.hashSync(password));
                    console.log("password " + company.password);
                    console.log("password check"+ bcrypt.compareSync(password, company.password));
                    if(company && bcrypt.compareSync(password, company.password)) {
                        return done(null, sendTransformObject(company));
                    }
                    console.log("some error");
                    return done(null, false);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var company = req.user;
        console.log("login called" + JSON.stringify(company));
        res.json(sendTransformObject(company));
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var company = req.body;
        console.log("Craeting a company"+ JSON.stringify(company));
        console.log("Email"+ company.email);
        updateTransformObject(company);
        model.companyModel.findCompanyByEmail(company.email)
            .then(function (company) {
                    console.log("Found already"+ company);
                    res.sendStatus(404).send(err);
                },
                function(err){
                    company.password = bcrypt.hashSync(company.password);
                    console.log("password " + company.password);
                    model.companyModel
                        .createCompany(company)
                        .then(
                            function (company) {
                                if (company) {
                                    console.log("Logining company" + JSON.stringify(company));
                                    req.login(company, function (err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.json(sendTransformObject(company));
                                        }
                                    });
                                }
                            });
                });
    }

    function loggedin(req, res) {
        //console.log("Company loggedin "+ util.inspect(req, {showHidden: false, depth: null}))
        console.log("Company loggedin "+ req.isAuthenticated());

        res.send(req.isAuthenticated() && !req.user.role? sendTransformObject(req.user) : '0');
    }

    function findAllCompany(req, res) {
        if(isAdmin(req.user)) {
            model.companyModel.findAllCompany()
                .then(function (companies) {
                        res.status(200).send(companies);
                    },
                    function (err) {
                        res.sendStatus(404).send(err);
                    });
        } else {
            res.status(403);
        }
    }
}


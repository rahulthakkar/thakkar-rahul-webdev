module.exports = function (app, model) {
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var LocalStrategy = require('passport-local').Strategy;

    var bcrypt = require("bcrypt-nodejs");
    const util = require('util');
    passport.use(new LocalStrategy(localStrategy));

    passport.serializeUser(serializeCompany);
    passport.deserializeUser(deserializeCompany);

    app.post("/api/company", createCompany);
    app.get("/api/company", findCompany);
    app.get("/api/all/company", findAllCompany);
    app.get("/api/company/:companyId", findCompanyById);
    app.put("/api/company/:companyId", updateCompany);
    app.delete("/api/company/:companyId", deleteCompany);
    app.post('/api/company/login', passport.authenticate('local'), login);
    app.post('/api/company/logout', logout);
    app.post('/api/company/register', register);
    app.get('/api/company/loggedin', loggedin);


    function createCompany(req, res) {
        var newCompany = req.body;
        newCompany.password = bcrypt.hashSync(newCompany.password);

        //console.log(newCompany);
        model.companyModel.createCompany(newCompany)
            .then(function (company) {
                    res.status(200).send(company);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                });
    }

    function updateCompany(req, res) {
        var companyId = req.params.companyId;
        var newCompany = req.body;
        model.companyModel.updateCompany(companyId, newCompany)
            .then(function (company) {
                    res.status(200).send(company);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findCompanyById(req, res) {
        var companyId = req.params.companyId;
        model.companyModel.findCompanyById(companyId)
            .then(function (company) {
                    res.status(200).send(company);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function findCompany(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findCompanyByCredentials(req, res);
        } else if (username) {
            findCompanyByUsername(req, res);
        }
    }

    function findAllCompany(req, res) {
        model.candidateModel.findAllCompany()
            .then(function (companies) {
                    res.status(200).send(companies);
                },
                function (err) {
                    res.sendStatus(404).send(err);
                });
    }

    function findCompanyByUsername(req, res) {
        var username = req.query.username;
        model.companyModel.findCompanyByUsername(username)
            .then(function (company) {
                    res.status(200).send(company);
                },
                function (err) {
                    res.sendStatus(404).send(err);
                });
    }

    function findCompanyByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model.companyModel.findCompanyByCredentials(username, password)
            .then(function (company) {
                    res.status(200).send(company);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function deleteCompany(req, res) {
        var companyId = req.params.companyId;
        model.companyModel.deleteCompany(companyId)
            .then(function (result) {
                    res.status(200).send(result);
                },
                function (err) {
                    res.status(404).send(err);
                });
    }

    function serializeCompany(company, done) {
        done(null, company);
    }

    function deserializeCompany(company, done) {
        model.companyModel.findCompanyById(company._id)
            .then(
                function (company) {
                    done(null, company);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model.companyModel
            .findCompanyByUsername(username)
            .then(
                function(company) {
                    //console.log(company);
                    //console.log("password1" + password);
                    //company = company[0];
                    if(company && bcrypt.compareSync(password, company.password)) {
                        return done(null, company);
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
        var company = req.company;
        res.json(company);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var company = req.body;
        company.password = bcrypt.hashSync(company.password);
        model.companyModel
            .createCompany(company)
            .then(
                function (company) {
                    if (company) {
                        req.login(company, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(company);
                            }
                        });
                    }
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.company : '0');
    }
}


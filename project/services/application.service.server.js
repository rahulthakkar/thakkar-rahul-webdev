    module.exports = function (app, model) {

        app.post('/api/application', authorize, createApplication);
        app.get('/api/application/job/:jobId', authorize, findApplicationsForJob);
        app.get('/api/application/candidate/:candidateId', authorize, findApplicationsForCandidate);


        function authorize (req, res, next) {
            console.log("authorized called");
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

        function createApplication(req, res) {
            var candidateId = req.query.candidateId;
            var jobId = req.query.jobId;
            if(candidateId == req.user._id) {
                model.applicationModel.createApplication(candidateId, jobId)
                    .then(function (application) {
                            model.jobModel.findJobById(jobId)
                                .then(function (job) {
                                    job.applications.push(application._id);
                                    model.jobModel.updateJob(jobId, job)
                                        .then(function (job) {
                                            model.candidateModel.findCandidateById(candidateId)
                                                .then(function (candidate) {
                                                    candidate.applications.push(application._id);
                                                    model.candidateModel.updateCandidate(candidateId, candidate)
                                                        .then(function (candidate) {
                                                            res.status(200).send(application);
                                                        }, function (err) {
                                                            //console.log("Error 1");
                                                            res.sendStatus(404).send(err);
                                                        })
                                                }, function (err) {
                                                    //console.log("Error 2");
                                                    res.sendStatus(404).send(err);
                                                });
                                        }, function (err) {
                                            //console.log("Error 3");
                                            res.sendStatus(404).send(err);
                                        })
                                }, function (err) {
                                    //console.log("Error 4");
                                    res.sendStatus(404).send(err);
                                });
                        },
                        function (err) {
                            //console.log("Error 5");
                            res.sendStatus(404).send(err);
                        });
            } else{
                //console.log("Error 6");
                res.sendStatus(401).send(err);
            }
        }


        function findApplicationsForJob(req, res) {
            //console.log("Server called");
            var jobId = req.params.jobId;
            if(req.user.jobs){
                var ids = req.user.jobs.map(function (obj) {
                    return String(obj._id);
                });
                if(ids.indexOf(jobId)> -1) {
                    //console.log("authorized");
                    model.applicationModel
                        .findApplicationsByJobId(jobId)
                        .then(
                            function (applications) {
                                //console.log("Found applications");
                                //console.log(applications);
                                res.json(applications);
                            },
                            function (err) {
                                //console.log("error");
                                //console.log(err);
                                res.status(400).send(err);
                            }
                        );
                } else {
                    //console.log("error 1");
                    res.status(403);
                }
            } else {
                //console.log("error 2");
                res.status(403);
            }

        }

        function findApplicationsForCandidate(req, res) {
            var candidateId = req.params.candidateId;
            if(req.user._id == candidateId){
                //console.log("authorized");
                model.applicationModel
                    .findApplicationsByCandidateId(candidateId)
                    .then(
                        function (applications) {
                            //console.log("Found applications");
                            //console.log(applications);
                            res.json(applications);
                        },
                        function (err) {
                            //console.log("error");
                            //console.log(err);
                            res.status(400).send(err);
                        });
            } else {
                //console.log("error 1");
                res.status(403);
            }
        }

    }


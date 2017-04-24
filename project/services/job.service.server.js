module.exports = function (app, model) {

    app.post("/api/company/:companyId/job", authorize, createJob);
    app.get("/api/jobs/search",  searchJobs);
    app.get("/api/company/:companyId/job", authorize, findAllJobsForCompany);
    app.get("/api/job/:jobId", findJobById);
    //app.get("/api/company/job/:jobId", authorize, findCompanyJobById);
    app.put("/api/company/job/:jobId", authorize, updateJob);
    app.delete("/api/company/job/:jobId", authorize, deleteJob);

    function authorize (req, res, next) {
        console.log("authorize called");
        if (!req.isAuthenticated() || req.user.role) {
            res.send(401);
        } else {
            next();
        }
    }

    /*function sendTransformObject(company){
     delete company.password;
     delete company.dateCreated;
     delete company._v;
     return company;
     }

     function updateTransformObject(company){
     delete company._id;
     delete company.dateCreated;
     delete company._v;
     return company;
     }*/

    function createJob(req, res) {
        var companyId = req.params.companyId;
        var newJob = req.body;
        model.jobModel.createJobForCompany(companyId, newJob)
            .then(function(job){
                    model.companyModel.findCompanyById(companyId)
                        .then(function (company) {
                            company.jobs.push(job._id);
                            model.companyModel.updateCompany(companyId, company)
                                .then(function (company) {
                                    res.status(200).send(job);
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

    function updateJob(req, res) {
        var jobId = req.params.jobId;
        var newJob = req.body;
        //console.log("updating "+ jobId);
        //console.log("updating "+ newJob);
        model.jobModel.updateJob(jobId, newJob)
            .then(function (job) {
                    res.status(200).send(job);
                },
                function (err) {
                    res.status(404).send(err);
                });

    }

    function findJobById(req, res) {
        var jobId = req.params.jobId;
        //console.log("Server job id"+ jobId);
        model.jobModel.findJobById(jobId)
            .then(function (job) {
                    res.status(200).send(job);
                },
                function (err) {
                    res.status(404).send(err);
                });

    }

    /*function findJobById(req, res) {
        var jobId = req.params.jobId;
        if(req.user.jobs && req.user.jobs.indexOf(jobId)>-1) {
            model.jobModel.findJobByIdPopulate(jobId)
                .then(function (job) {
                        res.status(200).send(job);
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else{
            res.status(403);
        }

    }*/

    function updateable(req, res, next){
        var jobId = req.params.jobId;
        model.jobModel.findJobById(jobId)
            .then(function (job) {
                console.log("can delete? "+job.company.toString() == company._id);
                if(job.company.toString() == req.user._id){
                    next();
                } else{
                    res.send(403);
                }
            }, function (err) {
                res.send(403);
            });
    }

    function deleteJob(req, res) {
        var jobId = req.params.jobId;
        console.log("Deleting the job");
        model.jobModel.deleteJob(jobId)
            .then(function (result) {
                console.log("Deleted the job");
                /*var index = req.user.jobs.indexOf(jobId);
                 console.log("Deleted the job index"+index);
                 if(index>-1){
                 req.user.jobs.splice(index);
                 }
                 console.log("Removed jobs "+ req.user);*/
                model.companyModel.removeJob(req.user_id, jobId)
                    .then(function (company) {
                        console.log("updated the company"+company);
                        res.status(200).send(result);
                    }, function (err) {
                        console.log("error1");
                        res.sendStatus(404).send(err);
                    })
            }, function (err) {
                console.log("error2");
                res.sendStatus(404).send(err);
            });
    }


    function findAllJobsForCompany(req, res) {
        var companyId = req.params.companyId;
        if(companyId == req.user._id) {
            model.jobModel.findAllJobsForCompany(companyId)
                .then(function (jobs) {
                        res.status(200).send(jobs);
                    },
                    function (err) {
                        res.status(404).send(err);
                    });
        } else {
            res.status(403);
        }
    }

    function searchJobs(req, res) {
        var term = req.query.term;
        console.log("search jobs"+ term);
        model.jobModel.searchJobs(term)
            .then(function (jobs) {
                    console.log("jobs");
                    console.log(jobs);
                    res.status(200).send(jobs);
                },
                function (err) {
                    console.log("error");
                    console.log(err);
                    res.status(404).send(err);
                });
    }
}


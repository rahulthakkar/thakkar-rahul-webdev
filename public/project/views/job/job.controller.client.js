(function () {
    angular
        .module("JobNowMaker")
        .controller("JobListController", JobListController)
        .controller("JobEditController", JobEditController)
        .controller("JobNewController", JobNewController)
        .controller("JobIndeedSearchController", JobIndeedSearchController)
        .controller("JobViewController", JobViewController)
        .controller("JobCompanyViewController", JobCompanyViewController)
        .controller("JobSearchController", JobSearchController);

    function JobListController($routeParams, JobService, $rootScope) {
        var vm = this;
        vm.companyId = $rootScope.currentUser._id;

        // event handlers


        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            JobService
                .findAllJobsForCompany(vm.companyId)
                .success(function (jobs) {
                    vm.jobs = angular.copy(jobs);
                });
        }
        init();

    }

    function JobEditController($routeParams, $location, JobService, $rootScope) {
        var vm = this;
        vm.companyId = $rootScope.currentUser._id;
        vm.jobId = $routeParams.jid;

        // event handlers
        vm.update = update;
        vm.deleteJob = deleteJob;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            JobService
                .findJobById(vm.jobId)
                .success(function (job) {
                    vm.job = angular.copy(job);
                })
                .error(function () {
                    $location.url("/company/dashboard/");
                });
        }
        init();

        function deleteJob() {
            JobService
                .deleteJob(vm.jobId)
                .success(function () {
                    $location.url("/company/dashboard/");
                })
                .error(function () {
                    vm.error = "Unable to delete the job";
                });
        }

        function update(updatedJob) {
            JobService
                .updateJob(vm.jobId, updatedJob)
                .success(function (job) {
                    if(job == null) {
                        vm.error = "Unable to update the job";
                    } else {
                        $location.url("/company/job/view/"+vm.jobId);
                    }
                })
                .error(function () {
                    vm.error = "Unable to update the job";
                });
        }


    }

    function JobNewController($routeParams, $location, JobService, $rootScope) {
        var vm = this;
        vm.companyId = $rootScope.currentUser._id;

        // event handlers
        vm.create = create;


        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }
        init();


        function create(newJob) {

            JobService
                .createJob(vm.companyId, newJob)
                .success(function (job) {
                    if (job == null) {
                        vm.error = "Unable to create new job";
                    } else {
                        $location.url("/company/job/view/"+job._id);
                    }
                });
        }
    }

    function JobIndeedSearchController($routeParams, $location, $rootScope, $scope) {
        var vm = this;
        vm.searchJobs = searchJobs

        var publisherKey = "3576802165611426";
        var indeed_client = new Indeed(publisherKey);
        vm.showSpinner = false;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }
        init();

        function searchJobs(searchTerm) {
            vm.noResults = false;
            vm.showSpinner = true;
            vm.searchTerm = searchTerm;
            //console.log("Started search");
            indeed_client.search({
                q: searchTerm,
                //l: 'US',
                limit:25,
                highlight:0,
                userip: '1.2.3.4',
                useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2)'
            }, function (response) {
                vm.showSpinner = false;
                //console.log("Got response");
                //console.log(response);
                vm.jobs = response.results;
                if(response.totalResults === 0){
                    vm.noResults = true;
                }
                if(!$scope.$$phase) {
                    $scope.$digest();
                }
            });
        }
    }

    function JobSearchController($routeParams, $location, $rootScope, JobService) {
        var vm = this;
        vm.searchJobs = searchJobs


        vm.showSpinner = false;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);

            if(vm.user && vm.user.role){
                vm.appliedJobs = vm.user.applications.map(function (obj) {
                    return obj.job;
                });
                //console.log(vm.appliedJobs);
            }
        }
        init();

        function searchJobs() {
            vm.noResults = false;
            vm.showSpinner = true;
            //console.log("Started search");
            vm.jobs = undefined;
            JobService
                .searchJobs(vm.searchTerm)
                .success(function (jobs) {
                    if(jobs == null || jobs.length<=0) {
                        vm.noResults = true;
                    } else {
                        if(vm.appliedJobs && vm.appliedJobs.length>0){
                            for(var j in jobs){
                                //console.log("Here"+jobs[j]._id);
                                if(vm.appliedJobs.indexOf(jobs[j]._id)> -1){
                                    //console.log("Here");
                                    jobs[j].applied = true;
                                }
                            }
                        }
                        vm.jobs = jobs;
                        //console.log(vm.jobs);
                    }
                })
                .error(function () {
                    vm.error = "Enable to search";
                });
        }
    }


    function JobViewController($routeParams, JobService, $rootScope, $location) {
        var vm = this;
        var jobId = $routeParams['jid'];

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            var promise = JobService.findJobById(jobId);
            promise.success(function (job) {
                vm.job = angular.copy(job);
            });
        }

        init();
    }

    function JobCompanyViewController($routeParams, JobService, ApplicationService, $rootScope, $location) {
        var vm = this;
        var jobId = $routeParams['jid'];

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            var promise = JobService.findJobById(jobId);
            promise.success(function (job) {
                vm.job = angular.copy(job);
                ApplicationService.findApplicationsForJob(jobId)
                    .success(function(applications) {
                        //console.log(applications);
                        vm.applications = applications;
                    });
            });

        }

        init();
    }

    function setLoginDetails(vm){

        vm.notLoggedIn = vm.user? false: true;
        if(!vm.notLoggedIn) {
            vm.companyName = vm.user.name;
            vm.isCompany = vm.companyName ? true : false;
            vm.candidateName = vm.user.firstName ? vm.user.firstName : vm.user.email;
            vm.isCandidate = vm.candidateName && vm.user.role == 'User' ? true : false;
            vm.isAdmin = vm.candidateName && vm.user.role == 'Admin' ? true : false;
        }
    }
})();
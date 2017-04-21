(function () {
    angular
        .module("JobNowMaker")
        .controller("JobListController", JobListController)
        .controller("JobEditController", JobEditController)
        .controller("JobNewController", JobNewController)
        .controller("JobIndeedSearchController", JobIndeedSearchController)
        .controller("JobViewController", jobViewController)
        .controller("JobCompanyViewController", jobCompanyViewController);

    function JobListController($routeParams, JobService, $rootScope) {
        var vm = this;
        vm.companyId = $rootScope.currentUser._id;

        // event handlers


        function init() {
            JobService
                .findAllJobsForCompany(vm.companyId)
                .success(function (jobs) {
                    vm.jobs = angular.copy(jobs);
                    setLoginDetails(vm, $rootScope);
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
            JobService
                .findJobById(vm.jobId)
                .success(function (job) {
                    vm.job = angular.copy(job);
                    setLoginDetails(vm, $rootScope);
                });
        }
        init();

        function deleteJob() {
            console.log("Deleting job "+vm.jobId);
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
            JobService
                .findAllJobsForCompany(vm.companyId)
                .success(function (jobs) {
                    vm.jobs = angular.copy(jobs);
                    setLoginDetails(vm, $rootScope);
                });
        }
        init();

        /*vm.test = test;
        function test() {
            console.log("test called");
            var job = {title: "Developer", description: "java developer", location: "Boston, MA", jobType: "full-time", isActive:"true"
                , salary:"90K-100K"};

            create(job);
        }*/

        function create(newJob) {
            //console.log("Create Job"+ newJob);
            //console.log("with company"+ vm.companyId);

            JobService
                .createJob(vm.companyId, newJob)
                .success(function (job) {
                    if (job == null) {
                        vm.error = "Unable to create new job";
                    } else {
                        $location.url("/company/job/");
                    }
                });
        }
    }

    function JobIndeedSearchController($routeParams, $location, $rootScope) {
        var vm = this;
        vm.searchJobs = searchJobs
        vm.searchTerm = "Web Developer"

        var publisherKey = "3576802165611426";
        var indeed_client = new Indeed(publisherKey);

        function init() {
            setLoginDetails(vm, $rootScope);
            searchJobs(vm.searchTerm, "US");
        }
        init();

        function searchJobs(searchTerm, location) {
            vm.searchTerm = searchTerm;
            indeed_client.search({
                q: searchTerm,
                l: location,
                limit:25,
                highlight:0,
                userip: '1.2.3.4',
                useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2)'
            }, function (response) {
                vm.jobs = angular.copy(response.results);
            });
        }
    }

    function jobViewController($routeParams, JobService, $rootScope, $location) {
        var vm = this;
        var jobId = $routeParams['jid'];

        function init() {
            var promise = JobService.findJobById(jobId);
            promise.success(function (job) {
                vm.job = angular.copy(job);
                //vm.job.description = hyperlinksAnchored(vm.job.description);
                setLoginDetails(vm);
            });
        }

        init();
    }

    function jobCompanyViewController($routeParams, JobService, $rootScope, $location) {
        var vm = this;
        var jobId = $routeParams['jid'];

        function init() {
            var promise = JobService.findJobById(jobId);
            promise.success(function (job) {
                vm.job = angular.copy(job);
                setLoginDetails(vm);
            });
        }

        init();
    }

    /*function setLoginDetails(vm){

        vm.notLoggedIn = vm.user? false: true;
        console.log(vm.user);
        console.log(vm.notLoggedIn);
        if(!vm.notLoggedIn) {
            vm.companyName = vm.user.name;
            vm.isCompany = vm.companyName ? true : false;
            vm.candidateName = vm.user.firstName ? vm.user.firstName : vm.user.email;
            vm.isCandidate = vm.candidateName && vm.user.role == 'User' ? true : false;
            vm.isAdmin = vm.candidateName && vm.user.role == 'Admin' ? true : false;
        }
    }*/

    function setLoginDetails(vm, $rootScope){

        vm.notLoggedIn = $rootScope.currentUser? false: true;
        console.log($rootScope.currentUser);
        console.log(vm.notLoggedIn);
        if(!vm.notLoggedIn) {
            vm.companyName = $rootScope.currentUser.name;
            vm.isCompany = vm.companyName ? true : false;
            vm.candidateName = $rootScope.currentUser.firstName ? $rootScope.currentUser.firstName : $rootScope.currentUser.email;
            vm.isCandidate = vm.candidateName && $rootScope.currentUser.role == 'User' ? true : false;
            vm.isAdmin = vm.candidateName && $rootScope.currentUser.role == 'Admin' ? true : false;
        }
    }
})();
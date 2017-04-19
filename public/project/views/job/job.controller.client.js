(function () {
    angular
        .module("JobNowMaker")
        .controller("JobListController", JobListController)
        .controller("JobEditController", JobEditController)
        .controller("JobNewController", JobNewController)
        .controller("JobIndeedSearchController", JobIndeedSearchController);

    function JobListController($routeParams, JobService, $rootScope) {
        var vm = this;
        vm.companyId = $rootScope.currentUser._id;

        // event handlers


        function init() {
            JobService
                .findAllJobsForCompany(vm.companyId)
                .success(function (jobs) {
                    vm.jobs = jobs;
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
                    vm.job = job;
                });
        }
        init();

        /*vm.testDelete = function(){
            deleteJob();
        };
        vm.testUpdate = function () {
            var job = {title: "New", description: "java developer", location: "Boston, MA", jobType: "full-time", isActive:"true"
                , salary:"190K-200K"};
            update(job);
        };*/

        function deleteJob() {
            console.log("Deleting job "+vm.jobId);
            JobService
                .deleteJob(vm.jobId)
                .success(function () {
                    $location.url("/company/job/");
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
                        $location.url("/company/job/");
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
                    vm.jobs = jobs;
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

    function JobIndeedSearchController($routeParams, $location) {
        var vm = this;
        vm.searchJobs = searchJobs
        vm.searchTerm = "Web Developer"

        var publisherKey = process.env.INDEED_PUBLISHER_KEY;
        var indeed_client = new Indeed(publisherKey);

        function init() {
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
                vm.jobs = response.results;
            });
        }

        /*function searchJobs(searchTerm) {
            console.log("searchTerm "+searchTerm);

            IndeedService
                .searchJobs(searchTerm)
                .then(function(response) {
                    //data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.jobs = data.results;
                });
        }*/
    }
})();
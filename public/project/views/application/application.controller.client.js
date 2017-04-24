(function () {
    angular
        .module("JobNowMaker")
        .controller("JobApplicationController", JobApplicationController);

    function JobApplicationController($location, ApplicationService, JobService, $rootScope, $routeParams) {

        var vm = this;
        var jobId = $routeParams['jid'];

        // event handlers
        vm.apply = apply;



        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            var promise = JobService.findJobById(jobId);
            promise.success(function (job) {
                vm.job = angular.copy(job);
                console.log("user");
                console.log(vm.user);
                console.log(vm.user.applications);
                var applied = vm.user.applications.filter(function (obj) {
                    return obj.job == job._id;
                });
                vm.isApplied = (applied.length>0);
                console.log(vm.isApplied);
            });
        }

        init();

        function apply() {
            //console.log("apply client controller")
            ApplicationService
                .apply(vm.user._id, jobId)
                .success(function (application) {
                    if (application == null) {
                        //console.log("server error");
                        vm.error = "Unable to apply to the job";
                    } else {
                        vm.application = application;
                        vm.appliedNow = true;
                    }
                });
        }
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
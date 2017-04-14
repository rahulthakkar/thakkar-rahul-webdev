(function () {
    angular
        .module("JobNowMaker")
        .controller("CandidateLoginController", candidateLoginController)
        .controller("CandidateProfileController", candidateProfileController)
        .controller("CandidateRegisterController", candidateRegisterController)
        .controller("CandidateListController", candidateListController);

    function candidateLoginController($location, CandidateService, $rootScope) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
            $window.document.title = "Job Seeker Login | JobNow";
        }
        init();

        function login(candidate) {
            CandidateService.login(candidate)
                .then(
                    function(response) {
                        var candidate = response.data;
                        $rootScope.currentUser = candidate;
                        $location.url("/candidate/profile/"+candidate._id);
                    },
                    function (response) {
                        vm.error = 'Wrong credentials';
                    });
        }
    }

    function candidateProfileController($routeParams, CandidateService, $rootScope, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;
        vm.logout = logout;


        function init() {
            var promise = CandidateService.findCandidateById(userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }

        init();

        function update(newCandidate) {
            var promise = CandidateService.updateCandidate(userId, newCandidate);
            promise
                .success(function (candidate) {
                    if (candidate == null) {
                        vm.error = "Unable to update user";
                    } else {
                        vm.message = "User successfully updated"
                    }
                })
                .error(function () {
                    vm.error = "Unable to update user";
                });
        }

        function logout() {
            CandidateService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/candidate/login");
                    },
                    function (res) {
                        vm.error = 'User not logged in';
                    });
        }
    }

    function candidateRegisterController($location, CandidateService, $rootScope) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
        }
        init();

        function register(newCandidate) {
            if(newCandidate.password === newCandidate.password2) {
                CandidateService
                    .register(newCandidate)
                    .then(
                        function(response) {
                            var candidate = response.data;
                            $rootScope.currentUser = candidate;
                            $location.url("/candidate/profile/"+candidate._id);
                        },
                        function (err) {
                            vm.error = "Unable to register user";
                        });
            } else {
                vm.error = "Passwords are not same";
            }
        }
    }

    function candidateListController($routeParams, CandidateService) {
        var vm = this;

        function init() {
            CandidateService
                .findAllCandidates()
                .success(function (candidates) {
                    vm.candidates = candidates;
                });
        }

        init();
    }
})();
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
        }
        init();

        vm.test = test;
        function test() {
            var candidate = {email: "rahul1@gmail.com", password: "rahul123"};

            login(candidate);
        }

        function login(candidate) {
            console.log("login called"+ JSON.stringify(candidate));

            CandidateService.login(candidate)
                .then(
                    function(response) {
                        var candidate = response.data;
                        $rootScope.currentUser = candidate;
                        console.log(candidate);
                        $location.url("/candidate/profile/");
                    },
                    function (response) {
                        vm.error = 'Wrong credentials';
                    });
        }
    }

    function candidateProfileController($routeParams, CandidateService, $rootScope, $location) {
        var vm = this;
        //var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;
        vm.logout = logout;


        function init() {
            console.log("Profile inti")
            console.log(JSON.stringify($rootScope.currentUser));
            var promise = CandidateService.findCandidateById($rootScope.currentUser._id);
            promise.success(function (user) {
                vm.user = user;
            });
        }

        init();

        function update(newCandidate) {
            var promise = CandidateService.updateCandidate($rootScope.currentUser._id, newCandidate);
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


        vm.test = test;
        function test() {
            console.log("test called");
            var candidate = {email: "rahul1@gmail.com", password: "rahul123", password2: "rahul123", firstName: "Rahul", lastName: "Thakkar", phone:"857-928-5539"
                ,skills: ["Java", "R", "Hadoop", "MapReduce"], ethnicity: "Asian", education: "Matsers"};

            register(candidate);
        }

        function register(newCandidate) {
            //console.log("register called with "+ JSON.stringify(newCandidate));
            if(newCandidate.password === newCandidate.password2) {
                CandidateService
                    .register(newCandidate)
                    .then(
                        function(response) {
                            var candidate = response.data;
                            $rootScope.currentUser = candidate;
                            $location.url("/candidate/profile/");
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
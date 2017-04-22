(function () {
    angular
        .module("JobNowMaker")
        .controller("CandidateLoginController", candidateLoginController)
        .controller("CandidateLogoutController", candidateLogoutController)
        .controller("CandidateProfileController", candidateProfileController)
        .controller("CandidateRegisterController", candidateRegisterController)
        .controller("CandidateListController", candidateListController)
        .controller("CandidateFollowController", candidateFollowController);

    function candidateLoginController($location, CandidateService, $rootScope, $templateCache) {
        var vm = this;


        // event handlers
        vm.login = login;

        function init() {
            setLoginDetails(vm);
        }
        init();

        /*vm.test = test;
        function test() {
            var candidate = {email: "rahul1@gmail.com", password: "rahul123"};

            login(candidate);
        }*/

        function login(candidate) {
            //console.log("login called"+ JSON.stringify(candidate));

            CandidateService.login(candidate)
                .then(
                    function(response) {
                        var candidate = response.data;
                        $rootScope.currentUser = candidate;
                        //console.log(candidate);
                        $location.url("/candidate/profile/");
                    },
                    function (response) {
                        vm.error = 'Wrong credentials';
                    });
        }
    }

    function candidateLogoutController($routeParams, CandidateService, $rootScope, $location, $templateCache) {
        var vm = this;
        vm.logout = logout;
        console.log("Logout called");

        function init() {
            setLoginDetails(vm);
            logout();
        }

        init();

        function logout() {
            CandidateService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        console.log("Forwarding to login");
                        $location.url("/candidate/login");
                    },
                    function (res) {
                        vm.error = 'User not logged in';
                    });
        }
    }

    function candidateProfileController($routeParams, CandidateService, $rootScope, $location) {
        var vm = this;
        //var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;
        vm.uploadResume = uploadResume;
        vm.uploadPic = uploadPic;



        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }

        init();

        function uploadResume() {
            var fd = new FormData();
            angular.forEach(vm.resume, function (file) {
                fd.append('resume', file);
            });

            var promise = CandidateService.uploadResume($rootScope.currentUser._id, fd);
            promise
                .success(function (candidate) {
                    if (candidate == null) {
                        console.log("Unable to upload resume");
                        vm.error = "Unable to upload resume";
                    } else {
                        console.log("Resume successfully updated");
                        vm.message = "Resume successfully updated"
                        setLoginDetails(vm);
                    }
                })
                .error(function () {
                    console.log("Unable to upload resume");
                    vm.error = "Unable to upload resume";
                });
        }

        function uploadPic() {
            var fd = new FormData();
            angular.forEach(vm.pic, function (file) {
                fd.append('pic', file);
            });

            var promise = CandidateService.uploadPic($rootScope.currentUser._id, fd);
            promise
                .success(function (candidate) {
                    if (candidate == null) {
                        console.log("Unable to upload pic");
                        vm.error = "Unable to upload pic";
                    } else {
                        console.log("Pic successfully updated");
                        vm.message = "Pic successfully updated"
                        setLoginDetails(vm);
                    }
                })
                .error(function () {
                    console.log("Unable to upload pic");
                    vm.error = "Unable to upload pic";
                });
        }

        function update(newCandidate) {
            /*var fd = new FormData();
            angular.forEach(vm.resume, function (file) {
               fd.append('resume', file);
            });
            angular.forEach(vm.pic, function (file) {
                fd.append('pic', file);
            });
            fd.append('data', JSON.stringify(newCandidate));
            console.log("Received request"+ vm.resume);
            */
            var promise = CandidateService.updateCandidate($rootScope.currentUser._id, newCandidate);
            promise
                .success(function (candidate) {
                    if (candidate == null) {
                        console.log("Unable to update user");
                        vm.error = "Unable to update user";
                    } else {
                        console.log("User successfully updated");
                        vm.message = "User successfully updated"
                        setLoginDetails(vm);
                    }
                })
                .error(function () {
                    console.log("User successfully updated");
                    vm.error = "Unable to update user";
                });

        }

    }

    function candidateRegisterController($location, CandidateService, $rootScope) {
        var vm = this;

        // event handlers
        vm.register = register;


        function init() {
            setLoginDetails(vm);
        }
        init();

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
                    vm.candidates = angular.copy(candidates);
                    setLoginDetails(vm);
                });

        }

        init();
    }

    function candidateFollowController($routeParams, CandidateService, $rootScope) {
        var vm = this;

        // event handlers
        vm.follow = follow;

        function init() {
            setLoginDetails(vm);
        }
        init();



        function follow(companyId) {
            //var promise = CandidateService.followCompany($rootScope.currentUser._id, companyId);
            var promise = CandidateService.followCompany("1", "");
            promise
                .success(function (candidate) {
                    if (candidate == null) {
                        vm.error = "Unable to update user";
                    } else {
                        vm.message = "User successfully updated"
                        //setLoginDetails(vm);
                    }
                })
                .error(function () {
                    vm.error = "Unable to update user";
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
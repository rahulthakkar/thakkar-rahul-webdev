(function(){
    angular
        .module("JobNowMaker")
        .controller("CompanyLoginController", companyLoginController)
        .controller("CompanyProfileController", companyProfileController)
        .controller("CompanyRegisterController", companyRegisterController)
        .controller("CompanyListController", companyListController)
        .controller("CompanyViewController", companyViewController)
        .controller("CompanyLogoutController", companyLogoutController)
        .controller("CompanyDashboardController", companyDashboardController);

    function companyLoginController($location, CompanyService, $rootScope) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }
        init();

        function login(company) {
            CompanyService.login(company)
                .then(
                    function(response) {
                        var company = response.data;
                        $rootScope.currentUser = company;
                        $location.url("/company/profile/");
                    },
                    function (response) {
                        vm.error = 'Wrong credentials';
                    });
        }
    }

    function companyProfileController($routeParams, CompanyService, $rootScope, $location) {
        var vm = this;

        // event handlers
        vm.update = update;
        vm.uploadPic = uploadPic;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }

        init();

        function uploadPic() {
            var fd = new FormData();
            angular.forEach(vm.pic, function (file) {
                fd.append('pic', file);
            });

            var promise = CompanyService.uploadPic($rootScope.currentUser._id, fd);
            promise
                .success(function (company) {
                    if (company == null) {
                        //console.log("Unable to upload pic");
                        vm.error = "Unable to upload pic";
                    } else {
                        //console.log(company);
                        vm.message = "Pic successfully updated"
                        $rootScope.currentUser = company;
                        vm.user = angular.copy($rootScope.currentUser);
                        setLoginDetails(vm);                    }
                })
                .error(function () {
                    //console.log("Unable to upload pic");
                    vm.error = "Unable to upload pic";
                });
        }

        function update(newCompany) {
            var promise = CompanyService.updateCompany($rootScope.currentUser._id, newCompany);
            promise
                .success(function (company) {
                    if (company == null) {
                        vm.error = "Unable to update the company info";
                    } else {
                        vm.user = angular.copy($rootScope.currentUser);
                        setLoginDetails(vm);
                        vm.message = "Company info successfully updated"
                    }
                })
                .error(function () {
                    vm.error = "Unable to update the company info";
                });
        }

    }

    function companyLogoutController($routeParams, CompanyService, $rootScope, $location) {
        var vm = this;
        vm.logout = logout;
        console.log("Logout called");

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
            logout();
        }

        init();

        function logout() {
            CompanyService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/company/login");
                    },
                    function (res) {
                        vm.error = 'No company logged in';
                    });
        }
    }

    function companyRegisterController($location, CompanyService, $rootScope) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }
        init();

        function register(newCompany) {
            console.log("register called with "+ JSON.stringify(newCompany));
            if(newCompany.password === newCompany.password2) {
                CompanyService
                    .register(newCompany)
                    .then(
                        function(response) {
                            var company = response.data;
                            $rootScope.currentUser = company;

                            $location.url("/company/profile/");
                        },
                        function (err) {
                            vm.error = "Unable to register the company";
                        });
            } else {
                vm.error = "Passwords are not same";
            }
        }
    }

    function companyListController($routeParams, CompanyService) {
        var vm = this;

        function init() {
            CompanyService
                .findAllCompanys()
                .success(function (companys) {
                    vm.companys = angular.copy(companys);
                    vm.user = angular.copy($rootScope.currentUser);
                    setLoginDetails(vm);
                });
        }

        init();
    }

    function companyDashboardController($routeParams, CompanyService, $rootScope, $location) {
        var vm = this;


        function init() {
            vm.company = angular.copy($rootScope.currentUser);
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }

        init();
    }

    function companyViewController($routeParams, CompanyService, $rootScope, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            var promise = CompanyService.findCompanyById(userId);
            promise.success(function (company) {
                vm.company = angular.copy(company);
                vm.user = angular.copy($rootScope.currentUser);
                setLoginDetails(vm);
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
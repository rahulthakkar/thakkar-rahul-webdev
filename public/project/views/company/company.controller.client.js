(function(){
    angular
        .module("JobNowMaker")
        .controller("CompanyLoginController", companyLoginController)
        .controller("CompanyProfileController", companyProfileController)
        .controller("CompanyRegisterController", companyRegisterController)
        .controller("CompanyListController", companyListController)
        .controller("CompanyViewController", companyViewController)
        .controller("CompanyLogoutController", companyLogoutController);

    function companyLoginController($location, CompanyService, $rootScope) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
            setLoginDetails(vm);
        }
        init();

        /*vm.test = test;
        function test() {
            var company = {email: "rahul1@fb.com", password: "Rahul123"};

            login(company);
        }*/

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
        //var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;
        //vm.logout = logout;


        function init() {
            vm.user = angular.copy($rootScope.currentUser);
            setLoginDetails(vm);
        }

        init();

        function update(newCompany) {
            var promise = CompanyService.updateCompany($rootScope.currentUser._id, newCompany);
            promise
                .success(function (company) {
                    if (company == null) {
                        vm.error = "Unable to update the company info";
                    } else {
                        vm.user = $rootScope.currentUser;
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
            setLoginDetails(vm);
        }
        init();

        /*vm.test = test;
        function test() {
            console.log("test called");
            var company = {email: "rahul1@fb.com", password: "Rahul123", password2: "Rahul123", name: "Facebook", phone:"857-928-5539"
                , size:"1001-10000", linkedinURL: "https://www.linkedin.com/company-beta/10667", facebookURL:"https://www.facebook.com/facebookcareers/"
                , twitterURL:"https://twitter.com/facebook", siteURL:"https://www.facebook.com/careers/"};

            register(company);
        }*/

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
                    setLoginDetails(vm);
                });
        }

        init();
    }

    function companyViewController($routeParams, CompanyService, $rootScope, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            var promise = CompanyService.findCompanyById(userId);
            promise.success(function (company) {
                vm.company = angular.copy(company);
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
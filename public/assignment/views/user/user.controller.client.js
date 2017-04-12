(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController)
        .controller("ProfileController", profileController)
        .controller("RegisterController", registerController);

    function loginController($location, UserService, $rootScope) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
        }
        init();

        function login(user) {
            UserService.login(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/user/"+user._id);
                    },
                    function (response) {
                        vm.error = 'user not found';
                    });
        }
    }

    function profileController($routeParams, UserService, $rootScope, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;
        vm.logout = logout;


        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }

        init();

        function update(newUser) {
            var promise = UserService.updateUser(userId, newUser);
            promise
                .success(function (user) {
                    if (user == null) {
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
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    },
                    function (res) {
                        vm.error = 'User not logged in';
                    });
        }
    }

    function registerController($location, UserService, $rootScope) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
        }
        init();

        function register(newUser) {
            if(newUser.password === newUser.password2) {
                UserService
                    .register(newUser)
                    .then(
                        function(response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/"+user._id);
                        },
                        function (err) {
                            vm.error = "Unable to register user";
                        });
            } else {
                vm.error = "Passwords are not same";
            }
        }
    }
})();
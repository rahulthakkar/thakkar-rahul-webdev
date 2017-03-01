(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController)
        .controller("ProfileController", profileController)
        .controller("RegisterController", registerController);

    function loginController($location, UserService) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
        }
        init();

        function login(user) {
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise.success(function(user){
                if(user) {
                    $location.url("/user/"+user._id);
                } else {
                    vm.error = "User not found";
                }
            });
        }
    }

    function profileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function(user){
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
    }

    function registerController($location, UserService) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
        }
        init();

        function register(newUser) {
            if(newUser.password === newUser.password2) {
                UserService
                    .createUser(newUser)
                    .success(function (user) {
                        $location.url("/user/" + user._id);
                    })
                    .error(function (err) {
                        vm.error = "Unable to register user";
                    });

            } else {
                vm.error = "Passwords are not same";
            }
        }
    }
})();
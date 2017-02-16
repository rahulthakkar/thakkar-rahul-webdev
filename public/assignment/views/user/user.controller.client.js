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
            var user = UserService.findUserByCredentials(user.username, user.password);
            if(user) {
                $location.url("/user/"+user._id);
            } else {
                vm.error = "User not found";
            }
        }
    }

    function profileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        // event handlers
        vm.update = update;

        function init() {
            var user = UserService.findUserById(userId);
            vm.user = user;
        }
        init();

        function update(newUser) {
            var user = UserService.updateUser(userId, newUser);
            if(user == null) {
                vm.error = "Unable to update user";
            } else {
                vm.message = "User successfully updated"
            }
        };
    }

    function registerController($location, UserService) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
        }
        init();

        function register(newUser) {
            var user = UserService.createUser(newUser);
            if(user) {
                $location.url("/user/"+user._id);
            } else {
                vm.error = "Unable to register user";
            }
        };
    }
})();
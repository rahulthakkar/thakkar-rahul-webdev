(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn
        };
        return api;

        function createUser(newUser) {
            return $http.post("/api/user/", newUser);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username="+username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function findUserById(userId) {
            return $http.get("/api/user/"+userId);
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/"+userId, newUser);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function checkLoggedIn() {
            return $http.get('/api/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();


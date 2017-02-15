(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);

    function userService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder" , email: "alice@neu.edu"},
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley" , email: "bob@neu.edu"},
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia" , email: "charly@neu.edu"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jannunzi@neu.edu"}
        ];
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return api;

        function createUser(newUser) {
            var existingUser = findUserByUsername(newUser.username);
            // User exists with the same username
            if(existingUser) {
                return null;
            } else {
                newUser._id = (new Date()).getTime();
                users.push(newUser);
                return angular.copy(newUser);
            }

        }

        function findUserById(userId) {
            for(var u in users) {
                if( users[u]._id == userId ) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for(var u in users) {
                if( users[u].username == username ) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for(var u in users) {
                if( users[u].username == username &&
                    users[u].password == password ) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function updateUser(userId, newUser) {
            for(var u in users) {
                if( users[u]._id == userId ) {
                    users[u].firstName = newUser.firstName;
                    users[u].lastName = newUser.lastName;
                    users[u].username = newUser.username;
                    users[u].email = newUser.email;
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function deleteUser(userId) {
            for(var u in users) {
                if(users[u]._id == userId) {
                    users.splice(w, 1);
                }
            }
        }


    }
})();


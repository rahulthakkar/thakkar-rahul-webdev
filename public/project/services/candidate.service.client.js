(function () {
    angular
        .module("JobNowMaker")
        .factory("CandidateService", candidateService);

    function candidateService($http) {

        var api = {
            "createCandidate": createCandidate,
            "findCandidateById": findCandidateById,
            "findCandidateByUsername": findCandidateByUsername,
            "findCandidateByCredentials": findCandidateByCredentials,
            "updateCandidate": updateCandidate,
            "deleteCandidate": deleteCandidate,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn
        };
        return api;

        function createCandidate(newCandidate) {
            return $http.post("/api/candidate/", newCandidate);
        }

        function findCandidateByUsername(email) {
            return $http.get("/api/candidate?email="+email);
        }

        function findCandidateByCredentials(email, password) {
            return $http.get("/api/candidate?email="+email+"&password="+password);
        }

        function findCandidateById(candidateId) {
            return $http.get("/api/candidate/"+candidateId);
        }

        function findAllCandidates() {
            return $http.get("/api/all/candidate");
        }

        function updateCandidate(candidateId, newCandidate) {
            return $http.put("/api/candidate/"+candidateId, newCandidate);
        }

        function deleteCandidate(candidateId) {
            return $http.delete("/api/candidate/"+candidateId);
        }

        function login(candidate) {
            return $http.post("/api/candidate/login", candidate);
        }

        function logout() {
            return $http.post("/api/candidate/logout");
        }

        function register(candidate) {
            return $http.post("/api/candidate/register", candidate);
        }

        function checkLoggedIn() {
            return $http.get('/api/candidate/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();


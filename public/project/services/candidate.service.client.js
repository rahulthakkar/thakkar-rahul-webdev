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
            "findAllCandidates": findAllCandidates,
            "followCompany": followCompany,
            "uploadPic": uploadPic,
            "uploadResume": uploadResume
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

        function updateCandidate(candidateId, newCandidate) {
            return $http.put("/api/candidate/"+candidateId, newCandidate);
        }

        function uploadPic(candidateId, fd) {
            return $http.post("/api/candidate/pic/"+candidateId, fd, {transformRequest: angular.identity, headers:{'Content-Type': undefined}});
        }

        function uploadResume(candidateId, fd) {
            return $http.post("/api/candidate/resume/"+candidateId, fd, {transformRequest: angular.identity, headers:{'Content-Type': undefined}});
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

        function findAllCandidates() {
            return $http.get("/api/admin/candidate");
        }

        function followCompany(candidateId, companyId) {
            console.log("Follows called");
            candidateId = "58f655531c22103a800e922b";
            companyId = "58f6bc0f3be00a47dca89b73";
            return $http.put("/api/candidate/follow?candidateId="+candidateId+"&companyId="+companyId);
        }

    }
})();


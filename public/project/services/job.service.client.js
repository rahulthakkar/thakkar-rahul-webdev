(function () {
    angular
        .module("JobNowMaker")
        .factory("JobService", JobService);

    function JobService($http) {

        var api = {
            "createJob": createJob,
            "findAllJobsForCompany": findAllJobsForCompany,
            "findJobById": findJobById,
            "findCompanyJobById": findCompanyJobById,
            "updateJob": updateJob,
            "deleteJob": deleteJob,
            "searchJobs": searchJobs
        };
        return api;

        function createJob(companyId, job) {
            return $http.post("/api/company/"+companyId+"/job", job);
        }

        function findAllJobsForCompany(companyId) {
            return $http.get("/api/company/"+companyId+"/job");
        }

        function searchJobs(term) {
            return $http.get("/api/jobs/search?term="+ term);
        }

        function findJobById(jobId) {
            return $http.get("/api/job/"+jobId);
        }

        function findCompanyJobById(jobId) {
            return $http.get("/api/company/job/"+jobId);
        }

        function updateJob(jobId, job) {
            return $http.put("/api/company/job/"+jobId, job);
        }

        function deleteJob(jobId) {
            console.log("Deleting job "+jobId);
            return $http.delete("/api/company/job/"+jobId);
        }
    }
})();



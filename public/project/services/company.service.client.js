(function () {
    angular
        .module("JobNowMaker")
        .factory("CompanyService", companyService);

    function companyService($http) {

        var api = {
            "createCompany": createCompany,
            "findCompanyById": findCompanyById,
            "findCompanyByUsername": findCompanyByUsername,
            "findCompanyByCredentials": findCompanyByCredentials,
            "updateCompany": updateCompany,
            "deleteCompany": deleteCompany,
            "findAllCompanys": findAllCompanys,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn
        };
        return api;

        function createCompany(newCompany) {
            return $http.post("/api/company/", newCompany);
        }

        function findCompanyByUsername(email) {
            return $http.get("/api/company?email="+email);
        }

        function findCompanyByCredentials(email, password) {
            return $http.get("/api/company?email="+email+"&password="+password);
        }

        function findCompanyById(companyId) {
            return $http.get("/api/company/"+companyId);
        }

        function findAllCompanys() {
            return $http.get("/api/all/company");
        }

        function updateCompany(companyId, newCompany) {
            return $http.put("/api/company/"+companyId, newCompany);
        }

        function deleteCompany(companyId) {
            return $http.delete("/api/company/"+companyId);
        }

        function login(company) {
            return $http.post("/api/company/login", company);
        }

        function logout() {
            return $http.post("/api/company/logout");
        }

        function register(company) {
            return $http.post("/api/company/register", company);
        }

        function checkLoggedIn() {
            return $http.get('/api/company/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();


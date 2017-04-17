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
            "login": login,
            "logout": logout,
            "register": register,
            "findAllCompanys": findAllCompanys
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

        function updateCompany(companyId, newCompany) {
            return $http.put("/api/company/"+companyId, newCompany);
        }

        function deleteCompany(companyId) {
            return $http.delete("/api/company/"+companyId);
        }

        function login(company) {
            console.log("Login called");
            return $http.post("/api/company/login", company);
        }

        function logout() {
            return $http.post("/api/company/logout");
        }

        function register(company) {
            return $http.post("/api/company/register", company);
        }

        function findAllCompanys() {
            return $http.get("/api/admin/company");
        }
    }
})();


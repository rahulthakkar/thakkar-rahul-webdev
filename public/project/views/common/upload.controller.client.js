(function(){
    angular
        .module("JobNowMaker")
        .controller("UploadController", UploadController);


    function UploadController($location, $rootScope, $http) {
        var vm = this;
        console.log("Controller found");
        // event handlers
        vm.fileUpload = fileUpload;

        function init() {
        }
        init();

        function fileUpload() {
            console.log("Upload called");
            var fd = new FormData();
            fd.append('file',  vm.file);

            var promise = $http.post("/api/candidate/file/upload", fd);
            promise
                .success(function (resp) {
                console.log(resp);
            });
        }
    }
})();
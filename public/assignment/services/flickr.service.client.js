(function() {
    angular
        .module("WebAppMaker")
        .factory('FlickrService', FlickrService);

    function FlickrService($http) {
        var key = "b7ff0df02869dbf54f6a7b6f8d6b384b";
        var secret = "df98275c71df7565";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        var api = {
            "searchPhotos": searchPhotos
        };
        return api;

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }

})();
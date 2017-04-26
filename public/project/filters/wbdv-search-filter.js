//Code taken from http://stackoverflow.com/questions/19784001/how-to-make-full-text-combination-filter-in-angularjs

(function () {
    angular
        .module('JobNowMaker')
        .filter('search', function ($filter) {
            return function (items, text) {
                if (!text || text.length === 0)
                    return items;

                /*console.log("text");
                console.log(text);
                console.log(items);
                */

                var searchTerms = text.split(' ');

                searchTerms.forEach(function (term) {
                    if (term && term.length)
                        items = $filter('filter')(items, term);
                });

                return items
            };
        });
})();

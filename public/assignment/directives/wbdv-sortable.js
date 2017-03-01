(function () {
    angular
        .module('WebAppMaker')
        .directive('wbdvSortable', sortableDir);

    function sortableDir() {
        function linkFunc(scope, element, attributes) {
            var initialIndex = -1;
            var finalIndex = -1;

            element.sortable({
                axis: 'y',
                start: function(event, ui){
                    initialIndex = ui.item.index();
                },
                stop: function(event, ui){
                    finalIndex = ui.item.index();
                    scope.updateIndex({initial: initialIndex, final: finalIndex});
                }
            });
        }
        return {
            scope: { updateIndex: '&' },
            link: linkFunc
        };
    }
})();



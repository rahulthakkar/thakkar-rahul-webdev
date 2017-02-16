(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", widgetListController)
        .controller("WidgetEditController", widgetEditController)
        .controller("WidgetNewController", widgetNewController);

    function widgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        // event handlers
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();


        function getWidgetTemplateUrl(widgetType) {
            return 'views/widget/widget-'+widgetType.toLowerCase()+'.view.client.html';
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function widgetEditController($routeParams, $location ,WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        // event handlers
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.update = update;
        vm.deleteWidget = deleteWidget;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();

        function deleteWidget() {
            var hasDeleted = WidgetService.deleteWidget(vm.widgetId);
            if(!hasDeleted) {
                vm.error = "Unable to delete the widget";
            } else {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
            }
        }

        function update(updatedWidget) {
            var widget = WidgetService.updateWidget(vm.widgetId, updatedWidget);
            if(widget == null) {
                vm.error = "Unable to update the widget";
            } else {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
            }
        }
        function getEditorTemplateUrl(type) {
            return 'views/widget/editors/widget-'+type.toLowerCase()+'-editor.view.client.html';
        }
    }


    function widgetNewController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        // event handlers
        vm.create = create;


        function init() {
        }
        init();

        function create(widgetType) {
            var widget = new Object();
            widget.widgetType = widgetType.toUpperCase();
            widget = WidgetService.createWidget(vm.pageId, widget);
            if(widget) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
            } else {
                vm.error = "Unable to delete the widget";
            }
        }
    }
})();
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
        vm.updateIndex = updateIndex;

        function init() {
            WidgetService
                .findAllWidgetsForPage(vm.pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                });
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

        function updateIndex(initial, final) {
            WidgetService
                .updateIndex(vm.pageId, initial, final);
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
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                    console.log(widget);
                });
        }
        init();

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Unable to delete the widget";
                });
        }

        function isEmpty(widget) {
            return widget.size==null && widget.text==null && widget.width==null && widget.url==null;
        }

        function update(updatedWidget) {
            if(isEmpty(updatedWidget)){
                deleteWidget();
            }

            WidgetService
                .updateWidget(vm.widgetId, updatedWidget)
                .success(function (widget) {
                    if(widget == null) {
                        vm.error = "Unable to update the widget";
                    } else {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    }
                })
                .error(function () {
                    vm.error = "Unable to update the widget";
                });
        }

        function getEditorTemplateUrl(type) {
            var widgetType = type.toLowerCase();
            return 'views/widget/editors/widget-'+widgetType+'-editor.view.client.html';
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
            WidgetService
                .createWidget(vm.pageId, widget)
                .success(function (widget) {
                    if(widget) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
                    } else {
                        vm.error = "Unable to delete the widget";
                    }
                });
        }
    }
})();
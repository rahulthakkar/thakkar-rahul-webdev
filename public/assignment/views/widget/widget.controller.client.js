(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", widgetListController)
        .controller("WidgetEditController", widgetEditController)
        .controller("WidgetNewController", widgetNewController)
        .controller("WidgetFlickrSearchController", widgetFlickrSearchController);

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


        function getWidgetTemplateUrl(type) {
            //console.log("widgetListController "+type);
            type = type.toLowerCase();
            //console.log("widgetListController" +type);
            return 'views/widget/widget-'+type+'.view.client.html';
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            //console.log(widgetUrl);
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            //console.log(url);
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
            //console.log("widgetEditController "+type);
            type = type.toLowerCase();
            //console.log("widgetEditController "+type);
            return 'views/widget/editors/widget-'+type+'-editor.view.client.html';
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
            widget.type = widgetType.toUpperCase();
            WidgetService
                .createWidget(vm.pageId, widget)
                .success(function (widget) {
                    if(widget) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
                    } else {
                        vm.error = "Unable to create the widget";
                    }
                });
        }
    }

    function widgetFlickrSearchController($routeParams, $location, WidgetService, FlickrService) {
        var vm = this;
        vm.searchPhotos = searchPhotos
        vm.selectPhoto = selectPhoto;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        function init() {
            //console.log("init flickr")
        }
        init();


        function searchPhotos(searchTerm) {
            //console.log("searchTerm "+searchTerm);

            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo){
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(function (widget) {
                    widget.url = url;
                    return WidgetService.updateWidget(vm.widgetId, widget);
                },function (err) {
                    vm.error = err;
                }).then(function (result) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+ vm.widgetId);
            }, function (err) {
                vm.error = err;
            });
        }
    }
})();
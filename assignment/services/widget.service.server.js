module.exports = function (app, model) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/api/page/:pageId/widget", updateIndex);
    app.post("/api/upload", upload.single('myFile'), uploadFile);



    /*var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];*/

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var newWidget = req.body;

        model.widgetModel.createWidget(pageId, newWidget)
            .then(function(widget){
                    model.pageModel.findPageById(pageId)
                        .then(function (page) {
                            page.widgets.push(widget._id);
                            model.pageModel.updatePage(pageId, page)
                                .then(function (page) {
                                    res.status(200).send(widget);
                                }, function (err) {
                                    res.sendStatus(404).send(err);
                                })
                        }, function (err) {
                            res.sendStatus(404).send(err);
                        })
                },
                function(err){
                    res.sendStatus(404).send(err);
                });
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var newWidget = req.body;
        model.widgetModel.updateWidget(widgetId, newWidget)
            .then(function(widget){
                    res.status(200).send(widget);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        model.widgetModel.findWidgetById(widgetId)
            .then(function(widget){
                    res.status(200).send(widget);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        model.widgetModel.deleteWidget(widgetId)
            .then(function(result){
                    res.status(200).send(result);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        model.widgetModel.findAllWidgetsForPage(pageId)
            .then(function(widgets){
                    res.status(200).send(widgets);
                },
                function(err){
                    res.status(404).send(err);
                });
    }

    function updateIndex(req, res) {
        var initialIndex = req.query.initial;
        var finalIndex = req.query.final;
        var pageId = req.params.pageId;
        model.widgetModel.updateIndices(pageId, initialIndex, finalIndex)
            .then(function(result){
                res.status(200).send(result);
            }, function(err) {
               res.status(404).send(err);
            });
    }

    /*function updateIndex(req, res) {
        var initialIndex = req.query.initial;
        var finalIndex = req.query.final;
        var pageId = req.params.pageId;

        if(initialIndex && finalIndex && pageId) {
            initialIndex = parseInt(initialIndex);
            finalIndex = parseInt(finalIndex);
            if(finalIndex != initialIndex) {
                var initialWidIndex = -1;
                var finalWidIndex = -1;
                var pageIndex = 0;
                for(w in widgets) {
                    if (pageId == widgets[w].pageId) {
                        if(pageIndex == initialIndex){
                            initialWidIndex = w;
                        } else if(pageIndex == finalIndex){
                            finalWidIndex = w;
                        }
                        pageIndex++;
                    }
                }
                var item = widgets[initialWidIndex];
                var lastIndex = initialWidIndex;
                var incr = 1;
                if (finalWidIndex < initialWidIndex) {
                    incr = -1;
                }
                var i = parseInt(initialWidIndex) + incr;
                while(i!=finalWidIndex){
                    if (widgets[i].pageId == pageId){
                        widgets[lastIndex] = widgets[i];
                        lastIndex = i;
                    }
                    i+=incr;
                }
                widgets[lastIndex] = widgets[finalWidIndex];
                widgets[finalWidIndex] = item;
            }
            res.sendStatus(200);
            return;
        }
        res.sendStatus(404);
    }*/

    function uploadFile(req, res) {

        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var myFile = req.file;
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var origin = req.headers.origin;

        if (myFile) {
            var filename = myFile.filename;     // new file name in upload folder
            model.widgetModel.findWidgetById(widgetId)
                .then(function(widget){
                        widget.url = '/uploads/' + filename;
                        widget.width = width;
                        model.widgetModel.updateWidget(widgetId, widget).then(
                            function(widget) {
                            });
                    });
        }
        var callbackUrl   = "/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/";

        res.redirect(callbackUrl);

    }

};
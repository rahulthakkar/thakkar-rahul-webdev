module.exports = function (app) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/api/page/:pageId/widget", updateIndex);
    app.post("/api/upload", upload.single('myFile'), uploadFile);



    var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        widget.pageId = pageId;
        widget._id = (new Date()).getTime();
        widgets.push(widget);
        res.json(widget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for(var w in widgets) {
            if(widgets[w]._id == widgetId) {
                widgets[w].text = widget.text;
                widgets[w].name = widget.name;
                widgets[w].size = widget.size;
                widgets[w].width = widget.width;
                widgets[w].url = widget.url;
                res.json(widgets[w]);
                return;
            }
        }
        res.sendStatus(404);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        var widget = widgets.find(function (w) {
            return w._id == widgetId;
        });

        if(widget) {
            res.json(widget);
        } else {
            res.sendStatus(404);
        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for(var w in widgets) {
            if(widgets[w]._id == widgetId) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        var wgets = [];
        for(var w in widgets) {
            if(widgets[w].pageId == pageId) {
                wgets.push(widgets[w]);
            }
        }
        res.json(wgets);
    }

    function updateIndex(req, res) {
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
    }

    function uploadFile(req, res) {

        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var myFile = req.file;
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        if (myFile) {
            var originalname = myFile.originalname; // file name on user's computer
            var filename = myFile.filename;     // new file name in upload folder
            //var path          = myFile.path;         // full path of uploaded file
            //var destination   = myFile.destination;  // folder where file is saved to
            //var size          = myFile.size;
            //var mimetype      = myFile.mimetype;

            var widget = widgets.find(function (w) {
                return w._id == widgetId;
            });

            widget.url = '/uploads/' + filename;
            widget.width = width;
            widget.originalname = originalname;

        }
        var callbackUrl   = "/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/";

        res.redirect(callbackUrl);

    }

};
module.exports = function (app) {
    var model = require("./model/models.server")();
    require("./services/job.service.server.js")(app, model);
    require("./services/candidate.service.server")(app, model);
    require("./services/application.service.server")(app, model);
    require("./services/company.service.server")(app, model);
}
module.exports = function(app) {
    var mongoose = require('mongoose');

    var connectionString = 'mongodb://127.0.0.1:27017/test';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    mongoose.createConnection(connectionString);

    var model = {
        //applicationModel : require("./application/application.model.server")(),
        jobModel : require("./job/job.model.server")(),
        candidateModel : require("./candidate/candidate.model.server")(),
        companyModel : require("./company/company.model.server")()
    };

    return model;
};
/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/30/13
 * Description:  This file will contain all of functions needed for the admin
 *              dashboard
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    response = require('../../response'),
    mysql = require('mysql');

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);

/**
 * This is function will find all the information
 * for the dashboard
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    var sql = 'SELECT (1) as id, ' +
        '(SELECT COUNT(*) FROM users) as num_of_users,' +
        '(SELECT COUNT(*) FROM events) as num_of_events,' +
        '(SELECT COUNT(*) FROM snapshots) as num_of_snapshots,' +
        '(SELECT COUNT(*) FROM flags) as num_of_flags,' +
        '(SELECT COUNT(*) FROM suggestions) as num_of_suggestions';
    db.query(sql, function(err, dashboard) {
        if ( err ) {
            console.log('{dashboard#findAll} - Error: ' + err);
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!dashboard ) {
            if(!res) {
                req.io.respond( {dashboards : {} } , response.SUCCESS.code);
            } else {
                res.send({dashboards : {}  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {dashboards : dashboard } , response.SUCCESS.code);
            } else {
                res.send({dashboards : dashboard }, response.SUCCESS.code);
            }
        }
    });
};
/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/27/13
 * Description:
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    response = require('../../response'),
    mysql = require('mysql');

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);

/**
 * This is function will find all the suggestions based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('select * from suggestions', function(err, suggestions) {
        if ( err || !suggestions) {
            if(!res) {
                req.io.respond("No suggestions returned.");
            } else {
                res.send("No suggestions returned.");
            }
        }
        else {
            response.SUCCESS.response = suggestions;
            if(!res) {
                req.io.respond(response.SUCCESS);
            } else {
                res.send(response.SUCCESS);
            }
        }
    });
};

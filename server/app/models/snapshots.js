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
 * This is function will find all the snapshots based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('select * from snapshots', function(err, snaps) {
        if ( err || !snaps) {
            if(!res) {
                req.io.respond("No snapshots returned.");
            } else {
                res.send("No snapshots returned.");
            }
        }
        else {
            response.SUCCESS.response = snaps;
            if(!res) {
                req.io.respond(response.SUCCESS);
            } else {
                res.send(response.SUCCESS);
            }
        }
    });
};

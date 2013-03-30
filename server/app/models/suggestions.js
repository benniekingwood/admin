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
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!suggestions ) {
            if(!res) {
                req.io.respond( {suggestions : new Array() } , response.SUCCESS.code);
            } else {
                res.send({suggestions : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {suggestions : suggestions } , response.SUCCESS.code);
            } else {
                res.send({suggestions : suggestions }, response.SUCCESS.code);
            }
        }
    });
};

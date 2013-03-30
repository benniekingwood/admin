/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description:  This script will handle all user CRUD, and special business
 *              logic.
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    response = require('../../response'),
    mysql = require('mysql');

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);

/**
 * This is function will find all the users based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('select * from users', function(err, users) {
        if ( err || !users) res.send("No users returned.");
        else {
            response.SUCCESS.response = users;
            if(!res) {
                req.io.respond(response.SUCCESS);
            } else {
                res.send(response.SUCCESS);
            }
        }
    });
};

/**
 * This function will find the specific user based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById =  function(req, res) {
    db.query('select * from users where id = '+req.params.id, function(err, user) {
        if ( err || !user) res.send("No user returned.");
        else {
            response.SUCCESS.response = user;
            res.send(response.SUCCESS);
        }
    });
};


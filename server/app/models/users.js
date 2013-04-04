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
var baseSelectSQL = 'select u.id, firstname first_name, lastname last_name, username, email, school_id, major' +
                    'year, school_status, bio, image_url, autopass, deactive, activation_key,'+
                    'created, twitter_username, twitter_enabled, s.name school_name inner join schools s on s.id = u.school_id';

/**
 * This is function will find all the users based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('select firstname, last from users', function(err, users) {
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!users ) {
            if(!res) {
                req.io.respond( {users : new Array() } , response.SUCCESS.code);
            } else {
                res.send({users : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {users : users } , response.SUCCESS.code);
            } else {
                res.send({users : users }, response.SUCCESS.code);
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
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!user ) {
            if(!res) {
                req.io.respond( {user : new Array() } , response.SUCCESS.code);
            } else {
                res.send({user : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {user : user } , response.SUCCESS.code);
            } else {
                res.send({user : user }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will create a new user
 * @param req
 * @param res
 */
exports.createUser = function(req, res) {
    if(!res) {
        req.io.respond( {user : {} } , response.SUCCESS.code);
    } else {
        res.send({user : {} }, response.SUCCESS.code);
    }
};

/**
 * This function will update a user
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
    if(!res) {
        req.io.respond( {} , response.SUCCESS.code);
    } else {
        res.send({}, response.SUCCESS.code);
    }
};

/**
 * This function will delete a user based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deleteUser = function(req, res) {
    var user = req.params;
    if(user.id > 0)
    {
        db.query('DELETE FROM users WHERE id = '+user.id, function(err, result) {
            if ( err ) {
                if(!res) {
                    req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {error: "There was a problem deleting your user.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error: "There was a problem deleting your user.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond( { } , response.SUCCESS.code);
                } else {
                    res.send({ }, response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {error : "An id is required to delete an user." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "An id is required to delete an user." }, response.VALIDATION_ERROR.code);
        }
    }
};
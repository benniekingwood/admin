/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/27/13
 * Description:  This file will contain all of the CRUD functionality for flags
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    response = require('../../response'),
    mysql = require('mysql');

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);

/**
 * This is function will find all the flags based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('select * from flags', function(err, flags) {
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!flags ) {
            if(!res) {
                req.io.respond( {flags : new Array() } , response.SUCCESS.code);
            } else {
                res.send({flags : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {flags : flags } , response.SUCCESS.code);
            } else {
                res.send({flags : flags }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will delete a flag based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deleteFlag = function(req, res) {
    var flag = req.params;
    if(flag.id > 0)
    {
        db.query('DELETE FROM flags WHERE id = '+flag.id, function(err, result) {
            if ( err ) {
                if(!res) {
                    req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {error: "There was a problem deleting the flag.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error: "There was a problem deleting the flag.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
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
            req.io.respond( {error : "An id is required to delete a flag." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "An id is required to delete a flag." }, response.VALIDATION_ERROR.code);
        }
    }
};

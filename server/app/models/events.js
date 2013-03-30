/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description: This script will handle all event CRUD
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    response = require('../../response'), 
    mysql      = require('mysql');

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);

/**
 * This is function will find all the events based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query('SELECT * FROM events', function(err, events) {
        if ( err ) {
            if(!res) {
                req.io.respond( {'response' : events } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : events }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!events ) {
            if(!res) {
                req.io.respond( {'response' : new Array() } , response.SUCCESS.code);
            } else {
                res.send({'response' : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {'response' : events } , response.SUCCESS.code);
            } else {
                res.send({'response' : events }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will find the specific event based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById = function(req, res) {
    db.query('SELECT * FROM events WHERE _id = '+req.params.id, function(err, event) {
        if ( err ) {
            if(!res) {
                req.io.respond( {'response' : event } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : event }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!events ) {
            if(!res) {
                req.io.respond( {'response' : new Array() } , response.SUCCESS.code);
            } else {
                res.send({'response' : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {'response' : event } , response.SUCCESS.code);
            } else {
                res.send({'response' : event }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will create a new event
 * @param req
 * @param res
 */
exports.createEvent = function(req, res) {
    var event = req.body;
    db.query('INSERT INTO events SET ?', {active: event.active, featured: event.featured}, function(err, result) {
        if ( err ) {
            if(!res) {
                req.io.respond( {'response' : result } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : result }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!result ) {
            if(!res) {
                req.io.respond( {'response' : "There was a problem creating your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : "There was a problem creating your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {'response' : result } , response.SUCCESS.code);
            } else {
                res.send({'response' : result }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will update a event
 * @param req
 * @param res
 */
exports.updateEvent = function(req, res) {
    var event = req.body;
    db.query('UPDATE events SET active = :active, featured = :featured', {active: event.active, featured: event.featured}, function(err, result) {
        if ( err ) {
            if(!res) {
                req.io.respond( {'response' : result } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : result }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!result ) {
            if(!res) {
                req.io.respond( {'response' : "There was a problem updating your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({'response' : "There was a problem updating your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {'response' : result } , response.SUCCESS.code);
            } else {
                res.send({'response' : result }, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will delete a event based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deleteEvent = function(req, res) {
    var event = req.params;
    if(event.id > 0)
    {
        db.query('DELETE FROM events WHERE _id = '+event.id, function(err, deleted) {
            if ( err ) {
                if(!res) {
                    req.io.respond( {'response' : result } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({'response' : result }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {'response' : "There was a problem deleting your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({'response' : "There was a problem deleting your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond( {'response' : "Event deleted." } , response.SUCCESS.code);
                } else {
                    res.send({'response' : "Event deleted." }, response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {'response' : "An id is required to delete an event." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({'response' : "An id is required to delete an event." }, response.VALIDATION_ERROR.code);
        }
    }
};
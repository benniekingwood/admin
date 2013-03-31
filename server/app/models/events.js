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
var baseSelectSQL = 'select _id id, active, featured, collegeID school_id, collegeName school_name, ' +
    'eventTitle title, eventDate date, eventInfo info, eventTime time, ' +
    'eventLocation location, imageURL image_url, userID user_id, userName user_name from events';

/**
 * This is function will find all the events based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.query(baseSelectSQL, function(err, events) {
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!events ) {
            if(!res) {
                req.io.respond( {events : new Array() } , response.SUCCESS.code);
            } else {
                res.send({events : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {events : events } , response.SUCCESS.code);
            } else {
                res.send({events : events }, response.SUCCESS.code);
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
    db.query(baseSelectSQL + ' WHERE _id = '+req.params.id, function(err, event) {
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error :  "There was an issue with your request."  }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!event ) {
            if(!res) {
                req.io.respond( {event : new Array() } , response.SUCCESS.code);
            } else {
                res.send({event : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {event : event } , response.SUCCESS.code);
            } else {
                res.send({event : event }, response.SUCCESS.code);
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
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!result ) {
            if(!res) {
                req.io.respond( {error : "There was a problem creating your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error: "There was a problem creating your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {event : result } , response.SUCCESS.code);
            } else {
                res.send({event : result }, response.SUCCESS.code);
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
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!result ) {
            if(!res) {
                req.io.respond( {error : "There was a problem updating your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error: "There was a problem updating your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {event: result } , response.SUCCESS.code);
            } else {
                res.send({event : result }, response.SUCCESS.code);
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
                    req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {error: "There was a problem deleting your event.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error: "There was a problem deleting your event.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond( {event : "Event deleted." } , response.SUCCESS.code);
                } else {
                    res.send({event : "Event deleted." }, response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {error : "An id is required to delete an event." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "An id is required to delete an event." }, response.VALIDATION_ERROR.code);
        }
    }
};
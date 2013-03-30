/*********************************************************************************
 * Copyright (C) 2013 uLink. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description:
 ********************************************************************************/
module.exports = function (app) {
    // event routes
    var event = require('../app/models/events');
    app.get('/api/events', event.findAll);
    app.get('/api/events/:id', event.findById);
    app.post('/api/events', event.createEvent);
    app.put('/api/events/:id', event.updateEvent);
    app.delete('/api/events/:id', event.deleteEvent);

    app.io.route('events', {
        find: function(req) {
            event.findAll(req);
        },
        findById: function(req) {
            event.findById
        },
        create: function(req) {
            event.createEvent
        },
        update: function(req) {
            event.updateEvent;
        },
        remove: function(req) {
            event.deleteEvent
        }
    });

    // TODO: add authenticate stuff to certain routes
    // app.param('userId', users.user) NOT Sure what this does

    // users routes
    var user = require('../app/models/users');
    app.get('/api/users/', user.findAll);
    app.get('/api/users/:id', user.findById);

    app.io.route('users', {
        find: function(req) {
            user.findAll(req);
        },
        create: function(req) {
        },
        update: function(req) {
        },
        remove: function(req) {
        }
    });

    // snapshots routes
    var snap = require('../app/models/snapshots');
    app.get('/api/snaps/', snap.findAll);
    //app.get('/api/snaps/:id', snap.findById);

    app.io.route('snaps', {
        find: function(req) {
            snap.findAll(req);
        },
        create: function(req) {
        },
        remove: function(req) {
        }
    });

    // suggestions routes
    var suggestion = require('../app/models/suggestions');
    app.get('/api/suggestions/', suggestion.findAll);

    app.io.route('suggestions', {
        find: function(req) {
            suggestion.findAll(req);
        },
        remove: function(req) {
        }
    });

    // flags routes
    var flag = require('../app/models/flags');
    //app.get('/api/flags/', flag.findAll);
    //app.get('/api/flags/:id', flag.findById);
    //app.delete('/api/flags/:id', flag.deleteFlag);
}
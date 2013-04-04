/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description:  This file will contain all of the routes for the models
 ********************************************************************************/
module.exports = function (app, verifyAuth) {
    // grab models
    var user = require('../app/models/users'),
        event = require('../app/models/events'),
        snap = require('../app/models/snapshots'),
        suggestion = require('../app/models/suggestions'),
        flag = require('../app/models/flags'),
        dashboard = require('../app/models/dashboard');

    // root route
    app.get('/', function(req, res) {
        if(!res) {
            req.io.redirect('/views/index.html');
        } else {
            res.redirect('/views/index.html');
        }
    });

    // dashboard routes
    app.get('/api/dashboards', verifyAuth, dashboard.findAll);

    // socket dashboard routes
    app.io.route('dashboards', {
        find: function(req) {
            dashboard.findAll(req);
        }
    });

    // event routes
    app.get('/api/events/:id', event.findById);
    app.get('/api/events', event.findAll);
    app.post('/api/events', verifyAuth, event.createEvent);
    app.put('/api/events/:id',verifyAuth, event.updateEvent);
    app.delete('/api/events/:id',verifyAuth, event.deleteEvent);

    // socket event routes
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

    // users routes
    app.get('/api/users', verifyAuth, user.findAll);
    app.get('/api/users/:id', verifyAuth, user.findById);
    app.post('/api/users', verifyAuth, user.createUser);
    app.put('/api/users/:id',verifyAuth, user.updateUser);
    app.delete('/api/users/:id',verifyAuth, user.deleteUser);

    // socket users routes
    app.io.route('users', {
        find: function(req) {
            user.findAll(req);
        },
        create: function(req) {
            user.createUser
        },
        update: function(req) {
            user.updateUser
        },
        remove: function(req) {
            user.deleteUser
        }
    });

    // snapshots routes
    app.get('/api/snaps', snap.findAll);

    // socket snaps routes
    app.io.route('snaps', {
        find: function(req) {
            snap.findAll(req);
        }
    });

    // suggestions routes
    app.get('/api/suggestions', verifyAuth, suggestion.findAll);
    app.delete('/api/suggestions/:id',verifyAuth, suggestion.deleteSuggestion);

    // socket suggestion routes
    app.io.route('suggestions', {
        find: function(req) {
            suggestion.findAll(req);
        },
        remove: function(req) {
            suggestion.deleteSuggestion
        }
    });

    // flag routes
    app.get('/api/flags', verifyAuth, flag.findAll);
    app.delete('/api/flags/:id',verifyAuth, flag.deleteFlag);

    // socket flag routes
    app.io.route('flags', {
        find: function(req) {
            flag.findAll(req);
        }, remove: function(req) {
            flag.deleteFlag
        }
    });
}
var path = require('path')
express = require('express.io')
app = express().http().io(),
response = require('./response'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
env = process.env.NODE_ENV || 'development',
config = require('./config/config')[env],
mysql      = require('mysql');

// allowing cross domain functions
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8889');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        if(!res) {
            req.io.respond(response.SUCCESS);
        } else {
            res.send(response.SUCCESS);
        }
    } else {
        next();
    }
};

////////////////////////////////
// passport section
var sessionusers = [];

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function verifyAuth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    else {
        if(!res) {
            req.io.respond({error:response.UNAUTHORIZED.response}, response.UNAUTHORIZED.code);
        } else {
            res.send({error:response.UNAUTHORIZED.response}, response.UNAUTHORIZED.code);
        }
    }
}
/**
 * Grabs the client session.  Down the road we can store the sessions with
 * ids and tokens in the db
 * @param id
 * @param fn
 */
function findClientSession(id, fn) {
    if (sessionusers[id]) {
        fn(null, sessionusers[id]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

// app configuration
app.configure(function () {
    app.set('port', process.env.PORT || 8889);
    app.use("/views", express.static(__dirname + '/views'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser('ua-auth-id'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret : "ua-auth-id",
       // maxAge : new Date(Date.now() + 3600000),
        secure: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(allowCrossDomain);
    app.use(app.router);
});

// development environment settings
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// production environment settings
app.configure('production', function(){
    app.use(express.errorHandler());
});

// make the connection to the mysql db
var db = mysql.createConnection(config.mysql_db_url);
// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        // asynchronous verification, for effect...
        // TODO: use hash module for password
        process.nextTick(function () {
            var sql = "select id, firstname, lastname, username, image_url, bio from users where " +
                " is_admin = 1 and email ="+db.escape(username)+
                " and password = "+ db.escape(password);
            console.log(sql);
            db.query(sql, function(err, user) {
                if (err) {return done(null, false,  {error : "There was an issue with your request." }); }
                if (!user || user.length==0) { return done(null, false,  {error: 'Invalid Credentials'} ); }
                // set the sid on the user
                return done(null, user[0]);
            });
        });
    }
));
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findClientSession(id, function (err, user) {
        done(err, user);
    });
});

// end passport section
///////////////////////////////

// auth routes - this needs to be below the app configurations
app.post('/auth', passport.authenticate('local'),
    function(req, res) {
        if(!req.user) {
            if(!res) {
                req.io.respond( {error: 'Invalid Credentials'} , response.VALIDATION_ERROR.code);
            } else {
                res.send({error: 'Invalid Credentials'}, response.VALIDATION_ERROR.code);
            }
        } else {
            // TODO: INSERT REQ INFO IN SESSION DB AND RETURN 200
           // console.log('INSERT REQ INFO IN SESSION DB AND RETURN 200');

            // TODO: store user in browser session cookie in sessionusers array instead of id

            var cookie = req.headers.cookie;
            var tokens = cookie.split(";");
            for(var x=0; x<tokens.length; x++) {
                if(tokens[x].indexOf("cookie.sid") !== -1) {
                    req.user.token = tokens[x];
                    break;
                }
            }

            sessionusers[req.user.id] = req.user;
            if(!res) {
                req.io.respond( {user: req.user} , response.SUCCESS.code);
            } else {
                res.send({user: req.user}, response.SUCCESS.code);
            }
        }
    }
);
app.get('/auth', verifyAuth, function(req, res) {
    if(!res) {
        req.io.respond( {user: req.user} , response.SUCCESS.code);
    } else {
        res.send({user: req.user}, response.SUCCESS.code);
    }
});
app.get('/deauth', function(req, res) {
    // logout route
    // delete req.session.user;
    req.logout();
    if(!res) {
        req.io.respond( {} , response.SUCCESS.code);
    } else {
        res.send({}, response.SUCCESS.code);
    }
});

// Bootstrap routes
require('./config/routes')(app, verifyAuth)

console.log('node server running on port ' + app.get('port'));
app.listen(app.get('port'));
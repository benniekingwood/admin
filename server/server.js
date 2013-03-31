var path = require('path')
express = require('express.io')
app = express().http().io()

// allowing cross domain functions
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        if(!res) {
            req.io.respond(200);
        } else {
            res.send(200);
        }
    } else {
        next();
    }
};

app.configure(function () {
    app.set('port', process.env.PORT || 8889);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
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

// Bootstrap routes
require('./config/routes')(app)

console.log('node server running on port ' + app.get('port'));
app.listen(app.get('port'));
var path = require('path')
express = require('express.io')
app = express().http().io()

app.configure(function () {
    app.set('port', process.env.PORT || 8889);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
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
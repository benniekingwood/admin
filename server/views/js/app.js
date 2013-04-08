App = Em.Application.create({
    title: 'uLink Administration',
    year: new Date().getFullYear()
});
App.REST_SERVER_URL ='http://admin.theulink.com:8889';
//App.REST_SERVER_URL ='http://localhost:8889';
App.Store = DS.Store.extend({
    revision: 12,
    adapter: DS.RESTAdapter.create({
        url: App.REST_SERVER_URL + '/api',
        bulkCommit: false,
        mappings: {
            dashboards: App.Dashboard,
            events: App.Event,
            users: App.User,
            flags: App.Flag,
            suggestions: App.Suggestion
        },
        plurals: {}
    })
});

// define router resources
App.Router.map(function() {
    this.resource('auth');
    this.resource('dashboard');
    this.resource('events', function() {
        this.resource('event', { path: ':event_id'});
    });
    this.resource('users', function() {
        this.resource('user', { path: ':user_id'});
    });
    this.resource('flags');
    this.resource('suggestions')
});

/////////////////
// Middleware
////////////////
function ajax (url, type, hash){
    hash.url = url;
    hash.type = type;
    hash.dataType = "json";
    hash.contentType = 'application/json; charset=utf-8';
    if (hash.data && hash.type !== 'GET') {
        hash.data = JSON.stringify(hash.data);
    }
    jQuery.ajax(hash);
}

/////////////////
// Index
////////////////
App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        var authModel = this.controllerFor('auth').get('authenticated');
        console.log(authModel);
        if(authModel) { this.transitionTo('dashboard'); }
        else {
            this.transitionTo('auth');
        }
    }
});

/////////////////
// Auth
////////////////
App.AuthController = Ember.ObjectController.extend({
    hasValidationErrors: false,
    isAuthenticating: false,
    authenticated: false,
    failedAttempts: 0,
    email: '',
    password: '',
    errors: '',
    model: function(){
        // Return default model for auth POST
        return {
            email: "",
            password: "",
            token: "",
            remember: false
        };
    },
    authenticate: function(){
        this.set('isAuthenticating', true);
        var data = {
            "email":this.get('email'), "password":this.get('password')
        };
        ajax(App.REST_SERVER_URL +"/auth", "POST", {
            data: data,
            context: this,
            success: function(json){
                Ember.run(this, function(){
                    // clear out the email and password attrs
                    this.set('email', '');
                    this.set('password', '');
                    this.send("didFindAuth", json);
                });
            },
            error: function(xhr){
                if (xhr.status === 401 || xhr.status === 422) {
                    this.set('hasValidationErrors', true);
                  //  console.log(xhr.responseText);
                   // var data = JSON.parse(xhr.responseText);
                    this.set('errors', xhr.responseText);
                }
            }
        });
    },
    deauthenticate: function() {
        ajax(App.REST_SERVER_URL +"/deauth", "GET", {
            data: {},
            context: this,
            success: function(json){
                this.set('model', undefined);
                this.set('authenticated', false);
            },
            error: function(xhr){
                this.set('logouterrors', true);
            }
        });
    },
    didFindAuth: function(json){
        var data = json || {};
        this.set('model', data);
        this.set('authenticated', true);
    },
    findAuth: function(){  // TODO: pass parameter here that will serve as the route to once auth is found
        ajax(App.REST_SERVER_URL +"/auth", "GET", {
            context: this,
            success: function(json){
               Ember.run(this, function(){
                   this.send("didFindAuth", json);
               });
            }
        });
    },
    authenticatedDidChange: function() {
        if (this.get('authenticated')) {
            this.transitionToRoute('dashboard');
        } else {
            this.transitionToRoute('auth');
        }
    }.observes('authenticated')
});

App.AuthRoute = Ember.Route.extend({
   redirect: function() {
       $('body').css({backgroundColor : '#004455'});
   }
});

/////////////////
// Dashboard
////////////////
App.Dashboard = DS.Model.extend({
    num_of_users: DS.attr('number'),
    num_of_events: DS.attr('number'),
    num_of_snapshots: DS.attr('number'),
    num_of_flags: DS.attr('number'),
    num_of_suggestions: DS.attr('number')
});
App.DashboardController = Ember.ObjectController.extend({
    needs: ['auth']
});
App.DashboardRoute = Ember.Route.extend({
    model: function() {
        return App.Dashboard.find();
    },
    // if they refresh, or hit this page, call FindAuth on the
    redirect: function(){
        $('body').css({backgroundColor : '#fff'});
        var isLoggedIn = this.controllerFor('auth').get('authenticated');
        if (!isLoggedIn) {
            // first check to see if we already authenticated with the server
            this.controllerFor('auth').findAuth();
            this.transitionTo('auth');
        }
    }
});
/////////////////
// Events
////////////////
App.Event = DS.Model.extend({
    user_id: DS.attr('number'),
    school_id: DS.attr('number'),
    active: DS.attr('boolean'),
    featured: DS.attr('boolean'),
    user_name: DS.attr('string'),
    school_name: DS.attr('string'),
    title: DS.attr('string'),
    info: DS.attr('string'),
    location: DS.attr('string'),
    time: DS.attr('string'),
    date: DS.attr('string'),
    image_url: DS.attr('string'),
    created: DS.attr('string')
});

App.EventsController = Ember.ObjectController.extend({
    needs: ['auth'],
    isEditing: false,
    doneEditing: function() {
        this.set('isEditing', false);
    },
    save: function() {
        this.get('store').commit();
    },
    edit: function() {
        this.set('isEditing', true);
    }
});
App.EventsRoute = Ember.Route.extend({
    model: function() {
        return App.Event.find();
    },
    // if they refresh, or hit this page, call FindAuth on the
    redirect: function(){
        var isLoggedIn = this.controllerFor('auth').get('authenticated');
        if (!isLoggedIn) {
            // first check to see if we already authenticated with the server
            this.controllerFor('auth').findAuth();
            this.transitionTo('auth');
        }
    }
});

/////////////////
// Users
////////////////
App.User = DS.Model.extend({
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    username: DS.attr('string'),
    school_id: DS.attr('number'),
    school_name: DS.attr('string'),
    email: DS.attr('string'),
    major: DS.attr('string'),
    autopass: DS.attr('boolean'),
    deactive: DS.attr('boolean'),
    active: DS.attr('boolean'),
    activation_key: DS.attr('string'),
    twitter_username: DS.attr('string'),
    twitter_enabled: DS.attr('boolean'),
    created: DS.attr('string'),
    name: function() {
        var first_name = this.get('first_name');
        var last_name = this.get('last_name');
        return first_name + ' ' + last_name;
    }.property('first_name', 'last_name')
});
App.UsersController = Ember.ObjectController.extend({
    needs: ['auth'],
    isEditing: false,
    doneEditing: function() {
        this.set('isEditing', false);
    },
    save: function() {
        this.get('store').commit();
    },
    edit: function() {
        this.set('isEditing', true);
    }
});
App.UsersRoute = Ember.Route.extend({
    model: function() {
        return App.User.find();
    },
    // if they refresh, or hit this page, call FindAuth on the
    redirect: function(){
        var isLoggedIn = this.controllerFor('auth').get('authenticated');
        if (!isLoggedIn) {
            // first check to see if we already authenticated with the server
            this.controllerFor('auth').findAuth();
            this.transitionTo('auth');
        }
    }
});

/////////////////
// Flags
////////////////
App.Flag = DS.Model.extend({
    reporter_user_id: DS.attr('number'),
    snap_id: DS.attr('number'),
    event_id: DS.attr('number'),
    listing_id: DS.attr('number'),
    inappropriate: DS.attr('boolean'),
    miscategorized: DS.attr('boolean'),
    spam: DS.attr('boolean'),
    created: DS.attr('string')
});
App.FlagsController = Ember.ObjectController.extend({
    needs: ['auth'],
    save: function() {
        this.get('store').commit();
    }
});
App.FlagsRoute = Ember.Route.extend({
    model: function() {
        return App.Flag.find();
    },
    // if they refresh, or hit this page, call FindAuth on the
    redirect: function(){
        var isLoggedIn = this.controllerFor('auth').get('authenticated');
        if (!isLoggedIn) {
            // first check to see if we already authenticated with the server
            this.controllerFor('auth').findAuth();
            this.transitionTo('auth');
        }
    }
});

/////////////////
// Suggestions
////////////////
App.Suggestion = DS.Model.extend({
    name: DS.attr('string'),
    created: DS.attr('string')
});
App.SuggestionsController = Ember.ObjectController.extend({
    needs: ['auth'],
    save: function() {
        this.get('store').commit();
    }
});
App.SuggestionsRoute = Ember.Route.extend({
    model: function() {
        return App.Suggestion.find();
    },
    // if they refresh, or hit this page, call FindAuth on the
    redirect: function(){
        var isLoggedIn = this.controllerFor('auth').get('authenticated');
        if (!isLoggedIn) {
            // first check to see if we already authenticated with the server
            this.controllerFor('auth').findAuth();
            this.transitionTo('auth');
        }
    }
});
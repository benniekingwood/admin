App = Ember.Application.create();

App.Store = DS.Store.extend({
    revision: 12,
  // adapter: 'DS.FixtureAdapter'
    adapter: DS.RESTAdapter.create({
        url: 'http://localhost:8889/api',
        bulkCommit: true,
        mappings: {
            dashboards: App.Dashboard,
            events: App.Event
        },
        // you can also define plurals, if there is a unregular plural
        // usually, RESTAdapter simply add a 's' for plurals.
        // for example at work we have to define something like this
        plurals: {
            business_process: 'business_processes'
            //else it tries to fetch business_processs
        }
    })
});

// define router resources
App.Router.map(function() {
    this.resource('dashboard');
    this.resource('events');
    this.resource('users');
});

// index page route
App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('dashboard');
    }
});

// dashboard models and routes
App.Dashboard = DS.Model.extend({
    num_of_users: DS.attr('number'),
    num_of_events: DS.attr('number'),
    num_of_snaps: DS.attr('number'),
    num_of_flags: DS.attr('number')
});

App.DashboardRoute = Ember.Route.extend({
    model: function() {
        return App.Dashboard.find();
    }
});

// Event model and routes
App.Event = DS.Model.extend({
    active: DS.attr('boolean'),
    featured: DS.attr('boolean'),
    user_id: DS.attr('number'),
    school_id: DS.attr('number'),
    school_name: DS.attr('string'),
    title: DS.attr('string'),
    info: DS.attr('string'),
    location: DS.attr('string'),
    time: DS.attr('string'),
    date: DS.attr('string'),
    created: DS.attr('string')
});

App.EventsRoute = Ember.Route.extend({
    model: function() {
        return App.Event.find();
    }
});


// FIXTURES
/*App.Dashboard.FIXTURES = [{
 id: 1,
 num_of_users:37,
 num_of_events: 45,
 num_of_snaps: 466,
 num_of_flags: 71
 }];*/
/*App.Event.FIXTURES = [
 {   id: 1,
 active: 0,
 featured: 1,
 user_id: 139,
 college_id:160,
 title: "Fixture event 1",
 info: "This is my first event",
 location: "event location 1",
 time: "8:00 AM",
 date: "10/10/13"
 },
 {
 id: 2,
 active: 1,
 featured: 1,
 user_id: 139,
 college_id:160,
 title: "Fixture event 2",
 info: "This is my second event",
 location: "event location 2",
 time: "8:00 AM",
 date: "10/10/13"
 }
 ];*/

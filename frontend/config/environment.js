/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'xtalus',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        contentSecurityPolicy: {
            'default-src': "'none' ",
            'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
            'font-src': "'self' data: use.typekit.net http://fonts.gstatic.com/",
            'connect-src': "'self' http://acc.xtalus.gedge.nl http://localhost:8000 http//dev.xtalus.nl",
            'img-src': "'self' www.facebook.com p.typekit.net data: http://www.gravatar.com/",
            'style-src': "'self' 'unsafe-inline' use.typekit.net http://fonts.googleapis.com/",
            'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com",
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
            API_HOST: "http://acc.xtalus.gedge.nl",
            API_NS: "simple/restful/v2",
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.APP.API_HOST = "//dev.xtalus.nl/api"
        //ENV.baseURL = '/';
        //ENV.locationType = 'none';

        // keep test console output quieter
        //ENV.APP.LOG_ACTIVE_GENERATION = false;
        //ENV.APP.LOG_VIEW_LOOKUPS = false;

        //ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }

    return ENV;
};

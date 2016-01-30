/* jshint node: true */

module.exports = function(environment) {
	var ENV = {
		modulePrefix: 'xtalus',
		environment: environment,
		baseURL: '/app/',
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
			'font-src': "'self' data: use.typekit.net https://fonts.gstatic.com/ https://maxcdn.bootstrapcdn.com/ http://localhost:8000 http//dev.xtalus.nl ",
			'connect-src': "'self' http://test.xtalus.gedge.nl http://acc.xtalus.gedge.nl",
			'img-src': "'self' www.facebook.com p.typekit.net data: http://www.gravatar.com/",
			'style-src': "'self' 'unsafe-inline' use.typekit.net https://fonts.googleapis.com/ https://fonts.gstatic.com/ https://maxcdn.bootstrapcdn.com/",
			'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com",
		},

		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
			API_HOST: "http://acc.xtalus.gedge.nl",
			API_NS: "simple/restful/v2",
			API_PHP_HOST: "http://localhost:8000/api",
		}
	};

	if (environment === 'development') {
		ENV.APP.API_HOST = "http://test.xtalus.gedge.nl";
		ENV.APP.API_NS = "simple/restful/v2";
		ENV.APP.API_PHP_HOST = "http://localhost:8000/api";
	}

	if (environment === 'testing') {
		ENV.APP.API_HOST = "http://test.xtalus.gedge.nl";
		ENV.APP.API_NS = "simple/restful/v2";
		ENV.APP.API_PHP_HOST = "//dev.xtalus.nl/api";
	}

	if (environment === 'acceptation') {
		ENV.APP.API_HOST = "http://acc.xtalus.gedge.nl";
		ENV.APP.API_NS = "simple/restful/v2";
		ENV.APP.API_PHP_HOST = "//acc.xtalus.nl/api";
	}

	if (environment === 'production') {
		ENV.APP.API_HOST = "//prod.xtalus.gedge.nl";
		ENV.APP.API_NS = "simple/restful/v2";
		ENV.APP.API_PHP_HOST = "//app.xtalus.nl/api";
	}

	return ENV;
};

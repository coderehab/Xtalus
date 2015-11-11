"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('xtalus/adapters/application', ['exports', 'ember-data', 'xtalus/config/environment'], function (exports, DS, ENV) {

    'use strict';

    var adapterSettings = {};

    exports['default'] = DS['default'].RESTAdapter.extend({
        host: ENV['default'].APP.API_HOST,
        namespace: ''
    });

});
define('xtalus/adapters/demand', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var adapterSettings = {};

    exports['default'] = DS['default'].RESTAdapter.extend({
        host: 'http://acc.xtalus.gedge.nl/simple/restful/v1',
        namespace: '',

        headers: (function () {

            var user_cookie = $ISIS.getCookie('auth');
            return {
                "Authorization": $ISIS.authHeader
            };
        }).property("session.authToken")
    });

});
define('xtalus/adapters/demandprofile', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var adapterSettings = {};

    exports['default'] = DS['default'].RESTAdapter.extend({
        host: 'http://acc.xtalus.gedge.nl/simple/restful/v1',
        namespace: '',

        headers: (function () {

            var user_cookie = $ISIS.getCookie('auth');
            return {
                "Authorization": $ISIS.authHeader
            };
        }).property("session.authToken")
    });

});
define('xtalus/adapters/email', ['exports', 'ember-data', 'xtalus/config/environment'], function (exports, DS, ENV) {

    'use strict';

    console.log(ENV['default']);

    exports['default'] = DS['default'].Adapter.extend({
        host: ENV['default'].APP.API_HOST,

        createRecord: function createRecord(store, type, snapshot) {
            var jdata = [];
            var data = this.serialize(snapshot, { includeId: true });
            var url = ENV['default'].APP.API_HOST + "/mail/" + data.type + "/" + data.subject;

            jdata = { "data": data };
            console.log(jdata);

            return new Ember.RSVP.Promise(function (resolve, reject) {
                Ember.$.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(jdata),
                    dataType: "json"
                }).then(function (data) {
                    Ember.run(null, resolve, data);
                }, function (jqXHR) {
                    jqXHR.then = null; // tame jQuery's ill mannered promises
                    Ember.run(null, reject, jqXHR);
                });
            });
        },

        headers: (function () {

            var user_cookie = $ISIS.getCookie('auth');
            return {
                "Content-Type": "application/javascript"
            };
        }).property("session.authToken")

    });

});
define('xtalus/adapters/isis', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	var adapterSettings = {};

	exports['default'] = DS['default'].FixtureAdapter.extend({});

});
define('xtalus/adapters/person', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var adapterSettings = {};

    exports['default'] = DS['default'].RESTAdapter.extend({
        host: 'http://acc.xtalus.gedge.nl/simple/restful/v1',
        namespace: '',

        headers: (function () {

            var user_cookie = $ISIS.getCookie('auth');
            return {
                "Authorization": $ISIS.authHeader
            };
        }).property("session.authToken")
    });

});
define('xtalus/adapters/supplyprofile', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var adapterSettings = {};

    exports['default'] = DS['default'].RESTAdapter.extend({
        host: 'http://acc.xtalus.gedge.nl/simple/restful/v1',
        namespace: '',

        headers: (function () {

            var user_cookie = $ISIS.getCookie('auth');
            return {
                "Authorization": $ISIS.authHeader
            };
        }).property("session.authToken")
    });

});
define('xtalus/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'xtalus/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

    'use strict';

    var App;

    Ember['default'].MODEL_FACTORY_INJECTIONS = true;
    Ember['default'].deprecate = function () {};

    App = Ember['default'].Application.extend({
        modulePrefix: config['default'].modulePrefix,
        podModulePrefix: config['default'].podModulePrefix,
        Resolver: Resolver['default']
    });

    $ISIS.settings = {
        baseurl: "http://acc.xtalus.gedge.nl/simple/restful/services/info.matchingservice.dom.Api.Api/",
        method: 'GET'
    };

    loadInitializers['default'](App, config['default'].modulePrefix);

    exports['default'] = App;

});
define('xtalus/components/date-picker', ['exports', 'ember', 'ember-cli-datepicker/components/date-picker'], function (exports, Em, Datepicker) {

	'use strict';

	exports['default'] = Datepicker['default'];

});
define('xtalus/components/file-picker', ['exports', 'ember-cli-file-picker/components/file-picker'], function (exports, file_picker) {

	'use strict';



	exports['default'] = file_picker['default'];

});
define('xtalus/components/matching-widget', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'section',
        classNames: 'matching-widget sortable',
        currentValue: '',
        placeholder: 'test',

        classNameBindings: ['collapsed'],
        collapsed: true,
        isNew: true,

        data: {},
        params: {},

        actions: {
            toggleStatus: function toggleStatus(e) {
                this.set('collapsed', !this.get('collapsed'));
            },

            previousValue: function previousValue(e) {
                this.set('currentValue', 'previous');
            },

            nextValue: function nextValue(e) {
                this.set('currentValue', 'next');
            },

            saveWidget: function saveWidget() {
                var params = JSON.parse(JSON.stringify(this.get('params')));
                delete params._subControllers;

                params.weight = 10;

                if (this.get('isPostal')) {
                    params.postcode = this.data.postcode;
                }
                if (this.get('isAge')) {
                    params.age = this.data.numericValue;
                }
                if (this.get('isHourlyRate')) {
                    params.hourlyRate = this.data.numericValue;
                }

                if (this.get('isTimePeriod')) {
                    params.startDate = this.data.startDate;
                    params.endDate = this.data.endDate;
                }

                if (this.get('isRole')) {
                    $.each(this.get('role_chkbox.values'), function (i, obj) {
                        params[obj.name] = obj.value;
                    });
                }

                if (this.get('isEducation')) {
                    params.dropDownValue = this.data.studyValue.value;
                }

                this.sendAction('onsave', this.get('data'), params);
                return false;
            },

            updateWidget: function updateWidget() {
                var _this = this;
                var params = {};
                params.weight = this.data.weight;

                var promise;

                //not working!
                if (this.get('isPostal')) {
                    params.postcode = this.data.postcode;
                    promise = this.data.updateLocation.invoke(params, false);
                }

                //works
                if (this.get('isAge')) {
                    params.age = this.data.numericValue;
                    promise = this.data.updateAge.invoke(params);
                }

                if (this.get('isHourlyRate')) {
                    params.hourlyRate = this.data.numericValue;
                    promise = this.data.updateHourlyRate.invoke(params);
                }

                promise.then(function () {
                    _this.sendAction('onupdate', _this.get('data'));
                });
            },

            removeWidget: function removeWidget() {
                var _this = this;

                this.data.deleteProfileElement.invoke({ confirmDelete: true }).then(function () {
                    _this.sendAction('onremove', _this.get('data'));
                });
            }
        },

        isPostal: (function () {
            return this.get('data.description') === 'LOCATION_ELEMENT';
        }).property('data.description'),

        isAge: (function () {
            return this.get('data.description') === 'AGE_ELEMENT';
        }).property('data.description'),

        //doing
        isHourlyRate: (function () {
            return this.get('data.description') === 'HOURLY_RATE_ELEMENT';
        }).property('data.description'),

        //TODO!!!!

        isRole: (function () {
            if (this.get('data.description') === 'REQUIRED_ROLE_ELEMENT') {
                this.data.roleValues = [];
                this.data.roles = [{ name: 'student', value: true }, { name: 'principal', value: true }, { name: 'professional', value: true }];
                return true;
            }

            return false;
        }).property('data.description'),

        isPassion: (function () {
            return this.get('data.description') === 'PASSION_TAGS_ELEMENT';
        }).property('data.description'),

        isBranch: (function () {
            return this.get('data.description') === 'BRANCHE_TAGS_ELEMENT';
        }).property('data.description'),

        isQuality: (function () {
            return this.get('data.description') === 'QUALITY_TAGS_ELEMENT';
        }).property('data.description'),

        isWeekdays: (function () {
            if (this.get('data.description') === 'WEEKDAY_TAGS_ELEMENT') {
                this.data.weekdaysValues = [];
                this.data.weekdays = [{ name: 'maandag', value: true }, { name: 'dinsdag', value: true }, { name: 'woensdag', value: true }, { name: 'donderdag', value: true }, { name: 'vrijdag', value: true }];
                return true;
            }

            return false;
        }).property('data.description'),

        isTimePeriod: (function () {
            return this.get('data.description') === 'TIME_PERIOD_ELEMENT';
        }).property('data.description'),

        isEducation: (function () {
            if (this.get('data.description') === 'EDUCATION_LEVEL') {
                this.role_chkbox = { values: [] };
                this.data.study = [{ name: 'MBO', value: "mbo" }, { name: 'HBO', value: "hbo" }, { name: 'WO', value: "wo" }];

                return true;
            }
            return false;
        }).property('data.description')

    });

});
define('xtalus/components/md-5', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    value: null,
    md5: (function () {
      if (Ember['default'].isEmpty(this.get('value'))) {
        return "";
      }
      return md5(this.get('value'));
    }).property('value')
  });

});
define('xtalus/components/multiselect-checkboxes', ['exports', 'ember-multiselect-checkboxes/components/multiselect-checkboxes'], function (exports, MultiselectCheckboxesComponent) {

	'use strict';

	exports['default'] = MultiselectCheckboxesComponent['default'];

});
define('xtalus/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ApplicationController = Ember['default'].Controller.extend({

        findPerson: (function () {
            this.set('globalSearchResults', null);
            var searchQuery = this.get('globalSearchQuery');
            if (!searchQuery || searchQuery == ' ') {
                searchQuery = "-";
            }
            var _this = this;
            $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/v1/find/' + searchQuery).then(function (response) {
                console.log(searchQuery, response);
                var result = response.results;
                if (result.Demand.length === 0 && result.Person.length === 0) result = null;

                _this.set('globalSearchResults', result);
            });
        }).observes('globalSearchQuery'),

        actions: {
            handleSearchResultClick: function handleSearchResultClick(type, id) {
                this.set('globalSearchQuery', '');
                this.set('globalSearchResults', null);
                switch (type) {
                    case 'person':
                        this.send('getProfile', id);
                        break;
                    case 'project':
                        this.send('getProject', id);
                        break;
                    default:
                        console.error('type not available, not able to handle "handleSearchResultClick"');
                        break;
                }
            }
        }

    });
    exports['default'] = ApplicationController;

});
define('xtalus/controllers/login', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var LoginController = Ember['default'].Controller.extend({

        actions: {
            login: function login() {
                $ISIS.auth.login(this.get("username"), this.get("password")).then((function (data) {
                    console.log(data);
                    if (data.message) {
                        this.set('message', data.message);
                        return;
                    } else {
                        this.get('target.router').refresh();
                    }
                }).bind(this));

                return false;
            }
        }

    });
    exports['default'] = LoginController;

});
define('xtalus/controllers/me', ['exports', 'ember', 'xtalus/controllers/application'], function (exports, Ember, App) {

	'use strict';

	var MeController = App['default'].extend({});

	exports['default'] = MeController;

});
define('xtalus/controllers/me/connections', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeConnectionController = Ember['default'].Controller.extend({

        actions: {
            showConnectionDetails: function showConnectionDetails(personData) {
                this.set("selectedPerson", this.store.find('person', personData.contactId));
                $('section#page').addClass('aside-right');
                return false;
            },

            hideConnectionDetails: function hideConnectionDetails() {
                $('section#page').removeClass('aside-right');
                return false;
            }
        }
    });

    exports['default'] = MeConnectionController;

});
define('xtalus/controllers/me/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeController = Ember['default'].Controller.extend({

        actions: {
            updatePerson: function updatePerson() {
                var app = this.controllerFor('application');
                this.model.get('isisObj').then((function (isisObj) {
                    console.log(isisObj);
                    isisObj.updatePerson.invoke({
                        firstName: this.model.get('firstName'),
                        middleName: this.model.get('middleName'),
                        lastName: this.model.get('lastName'),
                        dateOfBirth: this.model.get('birthDay')
                    }).then(function (result) {
                        app.send('changeView', 'page-left', 0);
                    });
                }).bind(this));
            }
        }

    });

    exports['default'] = MeController;

});
define('xtalus/controllers/me/projects', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeProjectsController = Ember['default'].Controller.extend({

        newProjectParams: {},

        actions: {

            showDetails: function showDetails(itemID) {
                $('section#page').addClass('aside-right');
                this.set('selectedDemand', this.store.find('demand', itemID));
            },

            hideDetails: function hideDetails() {
                $('section#page').removeClass('aside-right');
                return false;
            },

            createProject: function createProject() {
                var self = this;
                var store = this.store;
                var params = this.get('newProjectParams');
                this.model.get('isisObj').then(function (isisObj) {
                    console.log(isisObj);
                    isisObj.createPersonsDemand.invoke({
                        demandDescription: params.title,
                        demandSummary: params.summary,
                        demandStory: params.story
                    }).then(function () {
                        //self.send('refreshDemands');
                        self.send('closePopup', 'new-project');
                        self.set('newProjectParams', {});
                        self.model.reload();
                    });
                });
            }
        }
    });

    exports['default'] = MeProjectsController;

});
define('xtalus/controllers/profile', ['exports', 'ember', 'xtalus/controllers/application'], function (exports, Ember, App) {

    'use strict';

    var ProfileController = App['default'].extend({

        actions: {}

    });

    exports['default'] = ProfileController;

});
define('xtalus/controllers/profile/connections', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileNetworkController = Ember['default'].Controller.extend({

        actions: {
            showConnectionDetails: function showConnectionDetails(personData) {
                this.set("selectedPerson", this.store.find('person', personData.contactId));
                $('section#page').addClass('aside-right');
                return false;
            },

            hideConnectionDetails: function hideConnectionDetails() {
                $('section#page').removeClass('aside-right');
                return false;
            }
        }

    });

    exports['default'] = ProfileNetworkController;

});
define('xtalus/controllers/profile/projects', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProjectenController = Ember['default'].Controller.extend({

        actions: {
            showDetails: function showDetails(itemID) {
                $('section#page').addClass('aside-right');
                this.set('selectedDemand', this.store.find('demand', itemID));
            },

            hideDetails: function hideDetails() {
                $('section#page').removeClass('aside-right');
                return false;
            }
        }
    });

    exports['default'] = ProjectenController;

});
define('xtalus/controllers/project', ['exports', 'ember', 'xtalus/controllers/application'], function (exports, Ember, App) {

	'use strict';

	var ProjectController = App['default'].extend({});

	exports['default'] = ProjectController;

});
define('xtalus/controllers/project/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var ProjectIndexController = Ember['default'].Controller.extend({

		actions: {

			fileLoaded: function fileLoaded(file) {
				var _this = this;
				console.log(file);
				var post = this.get('store').createRecord('image', {
					image: file
				});
				post.save().then(function (response) {
					console.log(response);
					_this.model.set('updateParams.imageUrl', response.get('url'));
				});
			},

			updateDemand: function updateDemand() {
				var app = this.controllerFor('application');
				var _this = this;

				this.store.createRecord('image', {});

				this.model.get('isisObj').then((function (isisObj) {
					console.log(isisObj);

					$ISIS.get(isisObj.updateDemand.url).then(function (result) {

						$ISIS.post(result.links[2].href, _this.model.get('updateParams')).then(function (result) {

							console.log('---------OLEE DFDSF----', result);
						});
					});

					/*isisObj.updateDemand.invoke({
	    	firstName:this.model.get('firstName'),
	    	middleName:this.model.get('middleName'),
	    	lastName:this.model.get('lastName'),
	    	dateOfBirth:this.model.get('birthDay'),
	    }).then(function(result){
	    	app.send('changeView', 'page-left', 0)
	    });*/
				}).bind(this));
			}
		}

	});

	exports['default'] = ProjectIndexController;

});
define('xtalus/controllers/project/matching', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProjectMatchingController = Ember['default'].Controller.extend({
        newProfileParams: {},
        actions: {

            showCreateDemandProfileForm: function showCreateDemandProfileForm() {},

            createDemandProfile: function createDemandProfile() {
                var _this = this;
                var demand = this.get('model');
                var name = this.get('newProfileParams.name');
                demand.get('isisObj').then(function (demandObj) {
                    demandObj.createPersonDemandProfile.invoke({ profileName: name }).then(function (result) {
                        _this.send('closePopup', 'new-demand-profile');
                        _this.get('model').reload();
                    });
                });
            },

            deleteDemandProfile: function deleteDemandProfile() {
                var _this = this;
                this.get('selectedProfile').get('isisObj').then(function (profileObj) {
                    profileObj.deleteProfile.invoke({ confirmDelete: true }).then(function (result) {
                        _this.set('selectedProfile', undefined);
                        _this.get('model').reload();
                    });
                });
            },

            saveWidget: function saveWidget(element, params) {
                console.log(element, params);
                var profile = this.get('selectedProfile');
                var _this = this;

                profile.get('isisObj').then(function (isisProfile) {
                    //console.log(isisProfile, element.action);
                    isisProfile[element.action].invoke(params).then(function (result) {
                        profile.reload();

                        _this.send('calculateMatches');
                    });
                });
            },

            updateWidget: function updateWidget(element) {
                console.log('widget updated');
                this.send('calculateMatches');
                //this.get('selectedProfile').reload();
                this.get('selectedProfile').reload();
            },

            removeWidget: function removeWidget(element) {
                console.log('widget removed');
                console.log(this.get('selectedProfile').get('hasDirtyAttributes'));
                //this.get('selectedProfile').get('profileElements').removeObject(element);
                this.get('selectedProfile').reload();

                this.send('calculateMatches');
            },

            selectMatchingProfile: function selectMatchingProfile(id) {
                var profile = this.store.find('demandprofile', id).then((function (profile) {
                    this.set('selectedProfile', profile);
                    this.send('calculateMatches');
                }).bind(this));
            },

            calculateMatches: function calculateMatches(profile) {
                var profile = profile || this.get('selectedProfile');
                var _this = this;
                profile.get('isisObj').then(function (profileObj) {
                    profileObj.updateSupplyProfileComparisons.invoke({}, false).then(function (data) {

                        profileObj.collectSupplyProfileComparisons.getValues().then(function (matches) {
                            var a_promises = [];
                            var filteredMatches = Ember['default'].ArrayController.create({
                                model: [],
                                sortProperties: ['calculatedMatchingValue'],
                                sortAscending: false
                            });

                            $.each(matches, function (i, match) {
                                if (match) {
                                    match.collect().then(function (match) {
                                        match.proposedPersonName = match.proposedPerson.title;
                                        _this.initMatchInfo(match);
                                        filteredMatches.pushObject(match);
                                    });
                                }
                            });

                            profile.set('profileComparisons', filteredMatches);
                        });
                    });
                });
            },

            saveCandidate: function saveCandidate(candidate) {
                var profile = this.get('selectedProfile');
                console.log(candidate);
                candidate.SaveMatch.invoke({}, false).then(function () {
                    profile.reload();
                });
            },

            removeCandidate: function removeCandidate(candidate) {
                var profile = this.get('selectedProfile');
                var candidates = this.get('selectedProfile.candidates');
                var demand = this.get('model');
                candidate.deleteMatch.invoke({ confirmDelete: true }).then(function () {
                    candidates.removeObject(candidate);
                    //demand.reload();
                });
            },

            selectMatch: function selectMatch(candidate) {
                var profile = this.get('selectedProfile');
                var demand = this.get('model');
                candidate.updateCandidateStatus.invoke({ candidateStatus: "Chosen" }).then(function () {
                    demand.reload();
                    profile.reload();
                });
            },

            updateWidgetWeights: function updateWidgetWeights() {
                var _this = this;
                var profile = this.get('selectedProfile');
                var widgets = profile.get('widgets');
                var totalWeight = 100;
                var divider = 4;

                profile.set('profileComparisons', []);

                var a_promises = [];
                $.each(widgets, function (i, widget) {
                    widget.weight = totalWeight / divider + totalWeight / 2;
                    totalWeight -= widget.weight - totalWeight / 2;
                    a_promises.push(widget.updateWeight.invoke({ integer: widget.weight }));
                });

                return Ember['default'].RSVP.all(a_promises).then(function (widgets) {
                    _this.send('calculateMatches');
                });
            }
        },

        initMatchInfo: function initMatchInfo(match) {
            $ISIS.init(match.proposedPerson.href).then(function (person) {
                var picture = person.picture ? person.picture.split(':') : '';
                if (picture[2]) Ember['default'].set(match, 'profilePicture', 'data:image/png;base64,' + picture[2]);
                Ember['default'].set(match, 'roles', person.roles);
            });
        }
    });

    exports['default'] = ProjectMatchingController;

});
define('xtalus/controllers/registration', ['exports', 'ember', 'xtalus/mixins/validator'], function (exports, Ember, Validator) {

    'use strict';

    var RegistrationController = Ember['default'].Controller.extend(Validator['default'], {

        formdata: {
            username: 'edgar',
            password: 'pass',
            passwordConfirm: 'pass',
            email: 'edgar@code.rehab',
            firstname: 'Edgar',
            middlename: '',
            lastname: 'Ravenhorst',
            phone: '0627311410',
            birthdate: '1991-02-20',
            address: 'Haaksbergerstraat 149-119',
            postal: '7513 EL',
            city: 'Enschede',
            entity: { label: 'Student', value: 'student' }
        },
        form: {
            entities: [{ label: 'Student', value: 'student' }, { label: 'Zper', value: 'zp' }, { label: 'Mkber', value: 'mkb' }]
        },

        actions: {
            submitRegistration: function submitRegistration() {
                var validated = true;
                var formdata = this.get('formdata');
                var errors = {};

                //firstname
                validated = this.validateRequired(formdata.firstname) ? false : true;
                if (!validated) errors.firstname = 'Voornaam is verplicht';

                //lastname
                validated = this.validateRequired(formdata.lastname) ? false : true;
                if (!validated) errors.lastname = 'Achternaam is verplicht';

                //birthdate
                validated = this.validateRequired(formdata.birthday) ? false : true;
                if (!validated) errors.birthday = 'Uw birthdate is verplicht';

                //email
                validated = this.validateEmail(formdata.email) ? false : true;
                if (!validated) errors.email = this.validateEmail(formdata.email);

                //phone
                validated = this.validatePhone(formdata.phone) ? false : true;
                if (!validated) errors.phone = this.validatePhone(formdata.phone);

                //address
                validated = this.validateRequired(formdata.address) ? false : true;
                if (!validated) errors.address = 'Het adres is verplicht';

                //postal
                validated = this.validatePostal(formdata.postal) ? false : true;
                if (!validated) errors.postal = this.validatePostal(formdata.postal);

                //city
                validated = this.validateRequired(formdata.city) ? false : true;
                if (!validated) errors.city = 'Uw woonplaats is verplicht';

                //entity
                validated = this.validateRequired(formdata.entity) ? false : true;
                if (!validated) errors.entity = 'Uw entiteit is verplicht';

                //password
                validated = this.validateRequired(formdata.password) ? false : true;
                if (!validated) errors.password = 'wachtwoord is verplicht';

                //passwordConfirm
                validated = this.validateMatch(formdata.password, formdata.passwordConfirm) ? false : true;
                if (!validated) errors.passwordConfirm = 'Wachtwoorden komen niet overeen';

                this.set('errors', errors);
                console.log(Object.keys(errors).length);
                return Object.keys(errors).length === 0;
            }
        }
    });

    exports['default'] = RegistrationController;

});
define('xtalus/helpers/ivy-sortable', ['exports', 'ivy-sortable/helpers/ivy-sortable'], function (exports, ivy_sortable) {

	'use strict';



	exports['default'] = ivy_sortable['default'];

});
define('xtalus/initializers/app-version', ['exports', 'xtalus/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('xtalus/initializers/export-application-global', ['exports', 'ember', 'xtalus/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('xtalus/mixins/validator', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        validateRequired: function validateRequired(value, label) {
            var value = value || '';
            var error = false;

            label = label || 'Dit veld';
            if (value === '') error = label + 'is verplicht';

            return error;
        },

        validateMatch: function validateMatch(value1, value2, label) {
            var value1 = value1 || '';
            var value2 = value2 || '';

            var error = false;

            label = label || 'De waarde';
            if (value1 !== value2) error = label + ' komt niet overeen';

            return error;
        },

        validatePhone: function validatePhone(value) {
            var value = value || '';
            var error = false;
            var stripped = value.replace(/[\(\)\.\-\ ]/g, '');

            if (value == "") {
                error = "Uw telefoonnummer is verplicht";
            } else if (isNaN(stripped)) {
                error = "Het telefoonnummer heeft niet het juiste format";
            } else if (!(stripped.length == 10)) {
                error = "Het telefoonnummer heeft niet de juiste lengte";
            }

            return error;
        },

        validateEmail: function validateEmail(value) {
            var value = value || '';
            var error = false;
            var trimmedValue = value.replace(/^\s+|\s+$/, '');
            var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
            var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;

            if (value == "") {
                error = "Uw emailadres is verplicht";
            } else if (!emailFilter.test(trimmedValue)) {
                error = "Vul alstubieft een correct emailadres in";
            } else if (value.match(illegalChars)) {
                error = "Het emailadres bevat verkeerde characters";
            }

            return error;
        },

        validatePostal: function validatePostal(value) {
            var value = value || '';
            var error = false;
            var trimmedValue = value.replace(/\s/g, '');
            var postalFilter = /^[1-9][0-9]{3}[A-Z]{2}$/i;

            if (value == "") {
                error = "Uw postcode is verplicht";
            } else if (!postalFilter.test(trimmedValue)) {
                error = "Vul alstubieft een correcte postcode in";
            }

            return error;
        }
    });

});
define('xtalus/models/demand', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].Model.extend({
		URI: DS['default'].attr(),
		description: DS['default'].attr(),
		story: DS['default'].attr(),
		startDate: DS['default'].attr(),
		endDate: DS['default'].attr(),
		summary: DS['default'].attr(),
		profiles: DS['default'].attr(),
		owner: DS['default'].belongsTo('person'),
		imageUrl: DS['default'].attr(),

		updateParams: (function () {

			return {
				demandDescription: this.get('description'),
				demandSummary: this.get('summary'),
				demandStory: this.get('story')
			};
		}).property('description', 'summary', 'story'),

		initChoosenProfileMatch: (function () {
			var _this = this;
			var profiles = this.get('profiles');

			$.each(profiles, function (i, profile) {
				$.each(profile.profileMatches, function (i, candidate) {

					if (candidate.candidateStatus === "CHOSEN") {
						$ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + candidate.URI).then(function (person) {
							person.fullName = person.supplyCandidate.title;
							_this.initMatchInfo(person);
							Ember.set(profile, 'match', person);
						});
						return;
					}
				});
			});
		}).observes('profiles'),

		isisObj: (function () {
			return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/' + this.get('URI')).then(function (isisObjData) {

				console.log($ISIS.extractMembers(isisObjData));
				return $ISIS.extractMembers(isisObjData);
			});
		}).property('URI'),

		initMatchInfo: function initMatchInfo(match) {
			$ISIS.init(match.supplyCandidate.href).then(function (person) {
				var picture = person.picture ? person.picture.split(':') : '';
				if (picture[2]) Ember.set(match, 'profilePicture', 'data:image/png;base64,' + picture[2]);
				Ember.set(match, 'roles', person.roles);
			});
		}
	});

});
define('xtalus/models/demandprofile', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        URI: DS['default'].attr(),
        description: DS['default'].attr(),
        profileElements: DS['default'].attr(),
        profileElementChoices: DS['default'].attr(),
        availableWidgets: DS['default'].attr(),
        profileMatches: DS['default'].attr(),
        profileComparisons: DS['default'].attr(),
        chosenProfileMatchId: DS['default'].attr({ defaultValue: "" }),
        chosenProfileMatchURI: DS['default'].attr({ defaultValue: "" }),

        orderedProfileComparisons: (function () {
            var profileComparisons = this.get('profileComparisons');
            return Ember.ArrayController.create({
                model: profileComparisons,
                sortProperties: ['calculatedMatchingValue'],
                sortAscending: false
            });
        }).property('profileComparisons'),

        initMatch: (function () {
            var _this = this;
            if (this.get('chosenProfileMatchURI')) {
                $ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + this.get('chosenProfileMatchURI')).then(function (person) {
                    person.fullName = person.supplyCandidate.title;
                    _this.initMatchInfo(person);
                    _this.set('match', person);
                });
            }
        }).observes('chosenProfileMatchURI'),

        initWidgets: (function () {
            var widgets = this.get('profileElements');
            var a_promises = [];
            var _this = this;

            console.log(widgets);

            $.each(widgets, function (i, widget) {
                if (widget.URI) a_promises.push($ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + widget.URI));
            });

            if (a_promises.length > 0) {
                Ember.RSVP.all(a_promises).then(function (widgets) {
                    widgets.sort(function (a, b) {
                        return b.weight - a.weight;
                    });

                    var availableWidgets = _this.get('profileElementChoices');
                    var itemsRemoved = 0;
                    $.each(availableWidgets, function (i, availableWidget) {
                        availableWidget = availableWidgets[i - itemsRemoved];
                        $.each(widgets, function (j, widget) {
                            if (availableWidget && widget) {
                                if (availableWidget.description == widget.description) {
                                    availableWidgets.splice(i - itemsRemoved, 1);
                                    itemsRemoved += 1;
                                }
                            }
                        });
                    });

                    _this.set('widgets', widgets);
                    _this.set('availableWidgets', availableWidgets);
                });
            } else {
                _this.set('widgets', []);
                _this.set('availableWidgets', this.get('profileElementChoices'));
            }

            return [];
        }).observes('profileElements'),

        candidates: (function () {
            var _this = this;
            var profileMatches = this.get('profileMatches');

            var filteredMatches = Ember.ArrayController.create({
                model: [],
                sortProperties: ['calculatedMatchingValue'],
                sortAscending: false
            });

            $.each(profileMatches, function (i, match) {
                $ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + match.URI).then(function (match) {
                    match.contactName = match.supplyCandidate.title;
                    _this.initMatchInfo(match);
                    filteredMatches.pushObject(match);
                });
            });

            return filteredMatches;
        }).property('profileMatches'),

        isisObj: (function () {
            return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/' + this.get('URI')).then(function (isisObjData) {

                return $ISIS.extractMembers(isisObjData);
            });
        }).property('URI'),

        initMatchInfo: function initMatchInfo(match) {
            if (match) {
                $ISIS.init(match.supplyCandidate.href).then(function (person) {
                    var picture = person.picture ? person.picture.split(':') : '';
                    if (picture[2]) Ember.set(match, 'profilePicture', 'data:image/png;base64,' + picture[2]);
                    Ember.set(match, 'roles', person.roles);
                });
            }
        }

    });

});
define('xtalus/models/email', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        type: DS['default'].attr(),
        subject: DS['default'].attr(),
        email: DS['default'].attr(),
        firstname: DS['default'].attr(),
        lastname: DS['default'].attr()

    });

});
define('xtalus/models/image', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        image: DS['default'].attr(),
        url: DS['default'].attr(),
        name: DS['default'].attr()
    });

});
define('xtalus/models/isis', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        isis: DS['default'].attr({ defaultValue: {} }),
        activePerson: DS['default'].attr({ defaultValue: {} }),
        globalSearchQuery: DS['default'].attr()
    });

});
define('xtalus/models/person', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({

        URI: DS['default'].attr(),
        firstName: DS['default'].attr(),
        middleName: DS['default'].attr({ defaultValue: '' }),
        lastName: DS['default'].attr(),
        birthDay: DS['default'].attr(),
        email: DS['default'].attr(),
        roles: DS['default'].attr(),
        address: DS['default'].attr(),
        postalCode: DS['default'].attr(),
        town: DS['default'].attr(),

        demands: DS['default'].attr({ defaultValue: [] }),
        supplies: DS['default'].attr({ defaultValue: [] }),
        personalContacts: DS['default'].attr({ defaultValue: [] }),
        assessments: DS['default'].attr({ defaultValue: [] }),

        newProjectParams: DS['default'].attr(),

        birthday: (function (e) {
            return moment(this.get('birthDay')).format('DD-MM-YYYY');
        }).property('birthDay'),

        fullName: (function (e) {
            var fullname = '';
            var firstname = this.get('firstName');
            var middlename = this.get('middleName');
            var lastname = this.get('lastName');
            if (firstname) fullname += firstname;
            if (middlename) fullname += ' ' + middlename;
            if (lastname) fullname += ' ' + lastname;
            return fullname;
        }).property('firstName', 'middleName', 'lastName'),

        profilePicture: (function () {
            var picture = this.get('rawPicture') || false;
            if (!picture) return 'http://www.gravatar.com/avatar/' + md5(this.get('email')) + '?s=500';
            picture = picture.split(':');
            return 'data:image/png;base64,' + picture[2];
        }).property('rawPicture', 'email'),

        connections: (function () {
            var connections = this.get('personalContacts');
            var email = this.get('email');

            $.each(connections, function (i, connection) {
                console.log(connection);
                var picture = connection.picture || false;
                if (!picture) picture = 'http://www.gravatar.com/avatar/' + md5(connection.email);else {
                    picture = picture.split(':');
                    picture = 'data:image/png;base64,' + picture[2];
                }

                connection.picture = picture;
            });

            return connections;
        }).property('personalContacts'),

        isisObj: (function () {
            return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/' + this.get('URI')).then(function (isisObjData) {

                return $ISIS.extractMembers(isisObjData);
            });
        }).property('URI')
    });

});
define('xtalus/models/supplyprofile', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        URI: DS['default'].attr(),
        description: DS['default'].attr(),
        profileElements: DS['default'].attr(),
        matches: DS['default'].attr()
    });

});
define('xtalus/router', ['exports', 'ember', 'xtalus/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    exports['default'] = Router.map(function () {
        this.route('index');
        this.route('login', { path: "/" });
        this.route('registration');
        this.route('forgot');
        this.route('help');

        this.resource('me', function () {
            this.route('connections');
            this.route('projects');
            this.route('courses');
            this.route('references');
            this.route('settings');
        });

        this.resource('profile', { path: "profile/:user_id" }, function () {
            this.route('connections');
            this.route('projects');
            this.route('courses');
            this.route('references');
        });

        this.resource('project', { path: "project/:project_id" }, function () {
            this.route('matching');
        });
    });

});
define('xtalus/routes/application', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

    'use strict';

    var ApplicationRoute = Ember['default'].Route.extend({

        globalSearchQuery: "",

        model: function model() {
            var store = this.store;
            if ($ISIS.getCookie('auth')) {
                return $ISIS.init().then(function (isis) {
                    console.log("\nAPI referentie:\n", '--------------------------------------------------', isis, "===================================================\n");

                    return $ISIS.get("http://acc.xtalus.gedge.nl/simple/restful/v1").then(function (restData) {
                        console.log("\nPerson referentie:\n", '--------------------------------------------------', restData, "===================================================\n");

                        var person = store.find('person', restData.person.id);
                        var isis = store.createRecord('isis');
                        isis.set('isis', isis);
                        isis.set('activePerson', person);

                        return isis;
                    });
                });
            } else {
                return store.createRecord('isis');
            }
        },

        actions: {
            getProject: function getProject(id) {
                this.transitionTo('project', id);
            },

            getProfile: function getProfile(id) {
                this.transitionTo('profile', id);
            },

            toggleUsernav: function toggleUsernav() {
                Ember['default'].$('body').toggleClass('user-nav-small');
                return false;
            },

            changeView: function changeView(viewID, slideID, type) {

                for (var i = 0; i < 10; i++) {
                    $("#" + viewID).removeClass('slide-' + i);
                }

                $("#" + viewID).addClass('slide-' + slideID);
                console.log('slide-' + slideID);
                return false;
            },

            showPopup: function showPopup(name) {
                Ember['default'].$('section#page #' + name + '.popup').toggleClass('visible');
                Ember['default'].$('section#page').toggleClass('popup-' + name);
                return false;
            },

            closePopup: function closePopup(name) {
                Ember['default'].$('section#page #' + name + '.popup').removeClass('visible');
                Ember['default'].$('section#page').removeClass('popup-' + name);
                return false;
            },

            logout: function logout() {
                $ISIS.auth.logout();
                this.transitionTo('login');
            },

            createPersonalContact: function createPersonalContact(id) {
                var self = this;
                this.store.find('person', id).then(function (person) {
                    var ISISdemand = person.get('isisObj');
                    ISISdemand.then(function (profileObj) {
                        if (!profileObj.addAsPersonalContact) {
                            alert(profileObj.firstName + ' is al een connectie');
                            return;
                        }
                        profileObj.addAsPersonalContact.invoke().then(function () {
                            self.controller.model.get('activePerson').content.reload();
                            alert(profileObj.firstName + ' is toegevoegd aan uw connecties');
                        });
                    });
                });
            },

            deletePersonalContact: function deletePersonalContact() {}

        }
    });

    exports['default'] = ApplicationRoute;

});
define('xtalus/routes/auth', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var AuthRoute = Ember['default'].Route.extend({

        beforeModel: function beforeModel() {
            if (!$ISIS.getCookie('auth')) {
                this.transitionTo('login');
            }
        },

        setupController: function setupController(controller, model) {
            controller.set('activePerson', this.modelFor('application').get('activePerson'));
            controller.set('model', model);
            console.log("\nPage referentie:\n", '--------------------------------------------------', controller, "===================================================\n");
        },

        actions: {
            logout: function logout() {
                $ISIS.auth.logout();
                this.transitionTo('login');
            }
        }
    });

    exports['default'] = AuthRoute;

});
define('xtalus/routes/login', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var LoginRoute = Ember['default'].Route.extend({

        beforeModel: function beforeModel() {
            if ($ISIS.getCookie('auth')) {
                this.transitionTo('me');
            }
        }

    });

    exports['default'] = LoginRoute;

});
define('xtalus/routes/me', ['exports', 'ember', 'xtalus/routes/auth'], function (exports, Ember, Auth) {

    'use strict';

    var MeRoute = Auth['default'].extend({

        beforeModel: function beforeModel() {
            //if(this.controller) this.controller.init();
            if (!$ISIS.getCookie('auth')) {
                this.transitionTo('login');
            }
        },

        model: function model() {
            return this.modelFor('application').get('activePerson');
        },

        actions: {}
    });

    exports['default'] = MeRoute;

});
define('xtalus/routes/me/connections', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeConnectionsRoute = Ember['default'].Route.extend({
        model: function model() {
            return this.modelFor('me');
        }
    });

    exports['default'] = MeConnectionsRoute;

});
define('xtalus/routes/me/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeIndexRoute = Ember['default'].Route.extend({
        model: function model() {
            return this.modelFor('me');
        },

        actions: {}
    });

    exports['default'] = MeIndexRoute;

});
define('xtalus/routes/me/projects', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MeProjectsRoute = Ember['default'].Route.extend({

        model: function model() {
            return this.modelFor('me');
        }

    });

    exports['default'] = MeProjectsRoute;

});
define('xtalus/routes/profile', ['exports', 'ember', 'xtalus/routes/auth'], function (exports, Ember, Auth) {

    'use strict';

    var ProfileRoute = Auth['default'].extend({

        model: function model(params) {
            return this.store.find('person', params.user_id);
        }
    });

    exports['default'] = ProfileRoute;

});
define('xtalus/routes/profile/connections', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileConnectionsRoute = Ember['default'].Route.extend({

        model: function model() {
            return this.modelFor('profile');
        }
    });

    exports['default'] = ProfileConnectionsRoute;

});
define('xtalus/routes/profile/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var ProfileIndexRoute = Ember['default'].Route.extend({
		model: function model() {
			return this.modelFor('profile');
		},

		actions: {}
	});

	exports['default'] = ProfileIndexRoute;

});
define('xtalus/routes/profile/projects', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileProjectsRoute = Ember['default'].Route.extend({

        model: function model() {
            return this.modelFor('profile');
        }
    });

    exports['default'] = ProfileProjectsRoute;

});
define('xtalus/routes/project', ['exports', 'ember', 'xtalus/routes/auth'], function (exports, Ember, Auth) {

    'use strict';

    var ProjectRoute = Auth['default'].extend({
        model: function model(params) {
            var demand = this.store.find('demand', params.project_id);
            return demand;
        },

        actions: {
            selectMatchingProfile: function selectMatchingProfile(id) {
                this.controllerFor('project.matching').send('selectMatchingProfile', id);
                this.transitionTo('project.matching');
            }
        }

    });

    exports['default'] = ProjectRoute;

});
define('xtalus/routes/project/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProjectIndexRoute = Ember['default'].Route.extend({
        model: function model() {
            return this.modelFor('project');
        },

        actions: {

            delProject: function delProject() {
                var store = this.store;
                var self = this;
                console.log(this);
                var ISISdemand = this.controller.get('model.isisObj');

                var confirmed = confirm("Weet je het zeker?");

                if (confirmed) {
                    ISISdemand.then(function (demandObj) {
                        demandObj.deleteDemand.invoke({ confirmDelete: confirmed }).then(function () {
                            self.transitionTo('me.projects');
                            self.modelFor('me').reload();
                        });
                    });
                }
            }

        }
    });

    exports['default'] = ProjectIndexRoute;

});
define('xtalus/routes/project/matching', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProjectMatchingRoute = Ember['default'].Route.extend({
        model: function model() {
            var project = this.modelFor('project');
            return project;
        },

        setupController: function setupController(controller, model) {
            controller.set('model', model);
            if (model.get('profiles')[0]) controller.send('selectMatchingProfile', model.get('profiles')[0].id);
        }
    });

    exports['default'] = ProjectMatchingRoute;

});
define('xtalus/routes/registration', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var RegistrationRoute = Ember['default'].Route.extend({

        model: function model(params, transition) {
            return this.store.createRecord('person');
        },

        setupController: function setupController(controller, model) {},

        actions: {
            //{"username" : "hoi1234" , "password" : "hoi", "passwordConfirm" : "hoi", "email" : "email.johan@somewhere.nl"}
            //$ISIS.put('http://acc.xtalus.gedge.nl/simple/restful/register')

            submitRegistration: function submitRegistration(e) {
                var _this = this;
                var store = this.store;
                var appModel = this.modelFor('application');

                var formdata = this.controller.get('formdata');
                console.log(formdata);
                var params = {
                    username: formdata.username,
                    password: formdata.password,
                    passwordConfirm: formdata.passwordConfirm,
                    email: formdata.email
                    //,
                    //phone:formdata.phone,
                    //address:formdata.adress,
                    //city:formdata.city,
                    //postal:formdata.postal,

                };

                $ISIS.auth.logout();
                $ISIS.post('http://acc.xtalus.gedge.nl/simple/restful/register', params, false).then(function (result) {

                    if (result.success == 1) {

                        _this.store.createRecord('email', {
                            email: params.email,
                            type: "confirm",
                            subject: "registration",
                            title: "Xtalus registratie",
                            firstname: formdata.firstname,
                            middlename: formdata.middlename,
                            lastname: formdata.lastname
                        }).save();

                        _this.store.createRecord('email', {
                            email: 'info@xtalus.nl',
                            type: "notify",
                            subject: "new_registration",
                            title: "Nieuwe Aanmelding",
                            firstname: formdata.firstname,
                            middlename: formdata.middlename,
                            lastname: formdata.lastname
                        }).save();

                        $ISIS.auth.login(formdata.username, formdata.password).then(function (data) {
                            $ISIS.init().then(function (isis) {

                                //appModel.isis = isis;
                                appModel.set('isis', isis);

                                var personData = {
                                    firstName: formdata.firstname,
                                    middleName: formdata.middlename,
                                    lastName: formdata.lastname,
                                    dateOfBirth: formdata.birthday
                                };

                                if (formdata.entity.value === 'student') {
                                    isis.createStudent.invoke(personData).then(function (personID) {
                                        console.log(personID);
                                        return store.find('person', personID).then(function (person) {
                                            var isis = store.createRecord('isis');
                                            appModel.set('activePerson', person);
                                            _this.transitionTo('me');
                                        });
                                    });
                                }

                                if (formdata.entity.value === 'zp') {
                                    isis.createProfessional.invoke(personData).then(function (personID) {
                                        return store.find('person', personID).then(function (person) {
                                            var isis = store.createRecord('isis');
                                            appModel.set('activePerson', person);
                                            _this.transitionTo('me');
                                        });
                                    });
                                }

                                if (formdata.entity.value === 'mkb') {
                                    isis.createPrincipal.invoke(personData).then(function (personID) {
                                        return store.find('person', personID).then(function (person) {
                                            var isis = store.createRecord('isis');
                                            appModel.set('activePerson', person);
                                            _this.transitionTo('me');
                                        });
                                    });
                                }
                            });
                        });
                    } else {
                        alert('Registration failed');
                    }
                });
            }
        }
    });

    exports['default'] = RegistrationRoute;

});
define('xtalus/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/file-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","file-picker__dropzone");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","file-picker__preview");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","file-picker__progress");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","file-picker__progress__value");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var attrMorph0 = dom.createAttrMorph(element0, 'style');
          attribute(env, attrMorph0, element0, "style", get(env, context, "progressStyle"));
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        var morph2 = dom.createMorphAt(fragment,4,4,contextualElement);
        var morph3 = dom.createMorphAt(fragment,6,6,contextualElement);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "dropzone")], {}, child0, child1);
        block(env, morph1, context, "if", [get(env, context, "preview")], {}, child2, null);
        block(env, morph2, context, "if", [get(env, context, "progress")], {}, child3, null);
        inline(env, morph3, context, "input", [], {"type": "file", "value": get(env, context, "file"), "accept": get(env, context, "accept"), "multiple": get(env, context, "multiple"), "class": "file-picker__input"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widget', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Postcode");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element14 = dom.childAt(fragment, [0]);
          element(env, element14, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Leeftijd");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element13 = dom.childAt(fragment, [0]);
          element(env, element13, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Uurloon");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element12 = dom.childAt(fragment, [0]);
          element(env, element12, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Opleiding");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element11 = dom.childAt(fragment, [0]);
          element(env, element11, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Rol");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element10 = dom.childAt(fragment, [0]);
          element(env, element10, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Periode");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element9 = dom.childAt(fragment, [0]);
          element(env, element9, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Passie");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element8 = dom.childAt(fragment, [0]);
          element(env, element8, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Branches");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element7 = dom.childAt(fragment, [0]);
          element(env, element7, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child8 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Kwaliteiten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [0]);
          element(env, element6, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child9 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("Beschikbare dagen");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element5 = dom.childAt(fragment, [0]);
          element(env, element5, context, "action", ["toggleStatus"], {});
          return fragment;
        }
      };
    }());
    var child10 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Vul onderstaand de postcode in om mensen in de buurt voorkeur te geven.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "input", [], {"type": get(env, context, "text"), "value": get(env, context, "data.postcode"), "class": "cols-2"});
          return fragment;
        }
      };
    }());
    var child11 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Vul onderstaand de gewenste leeftijd in:");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "input", [], {"type": "number", "min": "1", "max": "100", "step": "1", "value": get(env, context, "data.numericValue")});
          return fragment;
        }
      };
    }());
    var child12 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Vul onderstaand het maximale uurloon in:");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "input", [], {"type": "number", "min": "1", "max": "100", "step": "1", "value": get(env, context, "data.numericValue")});
          return fragment;
        }
      };
    }());
    var child13 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","alert");
          var el2 = dom.createTextNode("Werkt nog niet!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Kies uit een van de onderstaande opleidingen");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
          inline(env, morph0, context, "view", [get(env, context, "Ember.Select")], {"contentBinding": "data.study", "selectionBinding": "data.studyValue", "optionLabelPath": "content.name", "optionValuePath": "content.value", "prompt": "Kies een studie"});
          return fragment;
        }
      };
    }());
    var child14 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","alert");
          var el2 = dom.createTextNode("Werkt nog niet!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Kies uit een of meer van de onderstaande rollen ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
          inline(env, morph0, context, "multiselect-checkboxes", [], {"options": get(env, context, "data.roles"), "labelProperty": "name", "selection": get(env, context, "data.roleValues")});
          return fragment;
        }
      };
    }());
    var child15 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","alert");
          var el2 = dom.createTextNode("Werkt nog niet!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Kies uit een of meer van de onderstaande dagen");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
          inline(env, morph0, context, "multiselect-checkboxes", [], {"options": get(env, context, "data.weekdays"), "labelProperty": "name", "selection": get(env, context, "data.weekdaysValues")});
          return fragment;
        }
      };
    }());
    var child16 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Start:\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        Eind:\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "date-picker", [], {"value": get(env, context, "data.startDate"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "yearRange": "-70,0"});
          inline(env, morph1, context, "date-picker", [], {"value": get(env, context, "data.endDate"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "yearRange": "-70,0"});
          return fragment;
        }
      };
    }());
    var child17 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","alert");
          var el2 = dom.createTextNode("Werkt nog niet!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Betrek de passie van een persoon bij de zoekresultaten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
          inline(env, morph0, context, "textarea", [], {"value": get(env, context, "params.value"), "class": "cols-2"});
          return fragment;
        }
      };
    }());
    var child18 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("ul");
          dom.setAttribute(el1,"class","tags");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("li");
          var el3 = dom.createTextNode("Tag 1 ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-trash-o");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("li");
          var el3 = dom.createTextNode("Tag 2 ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-trash-o");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","addItem");
          var el2 = dom.createTextNode("Toevoegen ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element4 = dom.childAt(fragment, [5]);
          var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
          element(env, element4, context, "action", ["addTag"], {"data": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    var child19 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("ul");
          dom.setAttribute(el1,"class","tags");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("li");
          var el3 = dom.createTextNode("Tag 1 ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-trash-o");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("li");
          var el3 = dom.createTextNode("Tag 2 ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-trash-o");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","addItem");
          var el2 = dom.createTextNode("Toevoegen ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [5]);
          var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
          inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
          element(env, element3, context, "action", ["addTag"], {"data": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    var child20 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Toevoegen ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          element(env, element2, context, "action", ["saveWidget"], {"data": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    var child21 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Update");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Delete");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          element(env, element0, context, "action", ["updateWidget"], {"data": get(env, context, "data")});
          element(env, element1, context, "action", ["removeWidget"], {"data": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","inner");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element15 = dom.childAt(fragment, [21, 1]);
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
        var morph2 = dom.createMorphAt(fragment,5,5,contextualElement);
        var morph3 = dom.createMorphAt(fragment,7,7,contextualElement);
        var morph4 = dom.createMorphAt(fragment,9,9,contextualElement);
        var morph5 = dom.createMorphAt(fragment,11,11,contextualElement);
        var morph6 = dom.createMorphAt(fragment,13,13,contextualElement);
        var morph7 = dom.createMorphAt(fragment,15,15,contextualElement);
        var morph8 = dom.createMorphAt(fragment,17,17,contextualElement);
        var morph9 = dom.createMorphAt(fragment,19,19,contextualElement);
        var morph10 = dom.createMorphAt(element15,1,1);
        var morph11 = dom.createMorphAt(element15,3,3);
        var morph12 = dom.createMorphAt(element15,5,5);
        var morph13 = dom.createMorphAt(element15,7,7);
        var morph14 = dom.createMorphAt(element15,9,9);
        var morph15 = dom.createMorphAt(element15,11,11);
        var morph16 = dom.createMorphAt(element15,13,13);
        var morph17 = dom.createMorphAt(element15,15,15);
        var morph18 = dom.createMorphAt(element15,17,17);
        var morph19 = dom.createMorphAt(element15,19,19);
        var morph20 = dom.createMorphAt(element15,21,21);
        block(env, morph0, context, "if", [get(env, context, "isPostal")], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "isAge")], {}, child1, null);
        block(env, morph2, context, "if", [get(env, context, "isHourlyRate")], {}, child2, null);
        block(env, morph3, context, "if", [get(env, context, "isEducation")], {}, child3, null);
        block(env, morph4, context, "if", [get(env, context, "isRole")], {}, child4, null);
        block(env, morph5, context, "if", [get(env, context, "isTimePeriod")], {}, child5, null);
        block(env, morph6, context, "if", [get(env, context, "isPassion")], {}, child6, null);
        block(env, morph7, context, "if", [get(env, context, "isBranch")], {}, child7, null);
        block(env, morph8, context, "if", [get(env, context, "isQuality")], {}, child8, null);
        block(env, morph9, context, "if", [get(env, context, "isWeekdays")], {}, child9, null);
        block(env, morph10, context, "if", [get(env, context, "isPostal")], {}, child10, null);
        block(env, morph11, context, "if", [get(env, context, "isAge")], {}, child11, null);
        block(env, morph12, context, "if", [get(env, context, "isHourlyRate")], {}, child12, null);
        block(env, morph13, context, "if", [get(env, context, "isEducation")], {}, child13, null);
        block(env, morph14, context, "if", [get(env, context, "isRole")], {}, child14, null);
        block(env, morph15, context, "if", [get(env, context, "isWeekdays")], {}, child15, null);
        block(env, morph16, context, "if", [get(env, context, "isTimePeriod")], {}, child16, null);
        block(env, morph17, context, "if", [get(env, context, "isPassion")], {}, child17, null);
        block(env, morph18, context, "if", [get(env, context, "isBranch")], {}, child18, null);
        block(env, morph19, context, "if", [get(env, context, "isQuality")], {}, child19, null);
        block(env, morph20, context, "if", [get(env, context, "isNew")], {}, child20, child21);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widgets-content/date', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widgets-content/number', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("Nummer\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widgets-content/select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widgets-content/tags', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/matching-widgets-content/text', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
        inline(env, morph0, context, "input", [], {"type": get(env, context, "type"), "value": get(env, context, "params.postcode"), "class": "cols-2"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/md-5', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "md5");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/components/multiselect-checkboxes', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          var morph1 = dom.createMorphAt(element0,3,3);
          set(env, context, "checkbox", blockArguments[0]);
          inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "checkbox.isSelected"), "disabled": get(env, context, "disabled")});
          content(env, morph1, context, "checkbox.label");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "each", [get(env, context, "checkboxes")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/forgot', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Nog geen account?");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("wachtwoord vergeten?");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page");
        dom.setAttribute(el1,"class","forgot");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Xtalus");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Together the perfect 'match-maker' for finding and growing talent");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createTextNode("Wachtwoord vergeten?");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","assets/images/login-header-bg.jpg");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3,"class","message");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn");
        var el5 = dom.createTextNode("Login ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-chevron-right");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [7]);
        var element3 = dom.childAt(element0, [5]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
        var morph1 = dom.createMorphAt(element2,1,1);
        var morph2 = dom.createMorphAt(element2,3,3);
        var morph3 = dom.createMorphAt(element3,1,1);
        var morph4 = dom.createMorphAt(element3,3,3);
        content(env, morph0, context, "message");
        element(env, element2, context, "action", ["login"], {"on": "submit"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "username"), "type": "text", "placeholder": "gebruikersnaam"});
        inline(env, morph2, context, "input", [], {"value": get(env, context, "password"), "type": "password", "placeholder": "wachtwoord"});
        block(env, morph3, context, "link-to", ["registration"], {}, child0, null);
        block(env, morph4, context, "link-to", ["forgot"], {}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/layout/main', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"id","logo");
          dom.setAttribute(el1,"src","assets/images/logo.png");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          var el2 = dom.createTextNode("Personen");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","profilePicture");
          dom.setAttribute(el2,"width","20");
          dom.setAttribute(el2,"height","20");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element4 = dom.childAt(fragment, [1]);
          var element5 = dom.childAt(element4, [1]);
          var attrMorph0 = dom.createAttrMorph(element5, 'src');
          var morph0 = dom.createMorphAt(element4,3,3);
          element(env, element4, context, "action", ["handleSearchResultClick", "person", get(env, context, "person.id")], {});
          attribute(env, attrMorph0, element5, "src", concat(env, [get(env, context, "person.picture")]));
          content(env, morph0, context, "person.fullName");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          var el2 = dom.createTextNode("Projecten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","profilePicture");
          dom.setAttribute(el2,"src","http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d5");
          dom.setAttribute(el2,"width","20");
          dom.setAttribute(el2,"height","20");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element3,3,3);
          element(env, element3, context, "action", ["handleSearchResultClick", "project", get(env, context, "demand.id")], {});
          content(env, morph0, context, "demand.description");
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-bars");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Mijn projecten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-heart");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Mijn netwerk");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-user");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Mijn profiel");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child8 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-cog");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Instellingen");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child9 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-info");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Help");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child10 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","projectImg");
          dom.setAttribute(el1,"width","40");
          dom.setAttribute(el1,"height","40");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Intranet GGnet");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [0]);
          var attrMorph0 = dom.createAttrMorph(element2, 'src');
          attribute(env, attrMorph0, element2, "src", concat(env, [get(env, context, "activePerson.profilePicture")]));
          return fragment;
        }
      };
    }());
    var child11 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","projectImg");
          dom.setAttribute(el1,"width","40");
          dom.setAttribute(el1,"height","40");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Ecologische auto");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [0]);
          var attrMorph0 = dom.createAttrMorph(element1, 'src');
          attribute(env, attrMorph0, element1, "src", concat(env, [get(env, context, "activePerson.profilePicture")]));
          return fragment;
        }
      };
    }());
    var child12 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","projectImg");
          dom.setAttribute(el1,"width","40");
          dom.setAttribute(el1,"height","40");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Duurzaam kantoor");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0]);
          var attrMorph0 = dom.createAttrMorph(element0, 'src');
          attribute(env, attrMorph0, element0, "src", concat(env, [get(env, context, "activePerson.profilePicture")]));
          return fragment;
        }
      };
    }());
    var child13 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Meer");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","template-main");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","app");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","globalSearchBox");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","result");
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","profileAccountInfo");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"id","profilePicture");
        dom.setAttribute(el4,"width","40");
        dom.setAttribute(el4,"height","40");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4,"id","account-nav");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        var el6 = dom.createTextNode("Account");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","fa fa-cog");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Instellingen");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","fa fa-info");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Help");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","fa fa-sign-out");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Uitloggen");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"id","profile-username");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-chevron-down");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("aside");
        dom.setAttribute(el2,"id","user-menu");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"id","toggle-user-menu");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-chevron-left");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","userinfo");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"class","profilePicture");
        dom.setAttribute(el4,"width","100");
        dom.setAttribute(el4,"height","100");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("nav");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","#");
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","fa fa-sign-out");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Uitloggen");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"style","display:none;");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Recente projecten");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","pagewrapper");
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, element = hooks.element, get = hooks.get, inline = hooks.inline, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element6 = dom.childAt(fragment, [0]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element7, [3]);
        var element9 = dom.childAt(element8, [3]);
        var element10 = dom.childAt(element7, [5]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element10, [3, 3, 5]);
        var element13 = dom.childAt(element6, [3]);
        var element14 = dom.childAt(element13, [1]);
        var element15 = dom.childAt(element13, [3]);
        var element16 = dom.childAt(element15, [1]);
        var element17 = dom.childAt(element13, [5]);
        var element18 = dom.childAt(element17, [1]);
        var element19 = dom.childAt(element18, [13, 0]);
        var element20 = dom.childAt(element17, [3]);
        var element21 = dom.childAt(element20, [5]);
        var morph0 = dom.createMorphAt(element7,1,1);
        var morph1 = dom.createMorphAt(element8,1,1);
        var morph2 = dom.createMorphAt(element9,1,1);
        var morph3 = dom.createMorphAt(element9,3,3);
        var morph4 = dom.createMorphAt(element9,5,5);
        var morph5 = dom.createMorphAt(element9,7,7);
        var attrMorph0 = dom.createAttrMorph(element11, 'src');
        var morph6 = dom.createMorphAt(dom.childAt(element10, [5]),0,0);
        var attrMorph1 = dom.createAttrMorph(element16, 'src');
        var morph7 = dom.createMorphAt(dom.childAt(element15, [3]),0,0);
        var morph8 = dom.createMorphAt(dom.childAt(element15, [5]),0,0);
        var morph9 = dom.createMorphAt(dom.childAt(element18, [1]),0,0);
        var morph10 = dom.createMorphAt(dom.childAt(element18, [3]),0,0);
        var morph11 = dom.createMorphAt(dom.childAt(element18, [5]),0,0);
        var morph12 = dom.createMorphAt(dom.childAt(element18, [9]),0,0);
        var morph13 = dom.createMorphAt(dom.childAt(element18, [11]),0,0);
        var morph14 = dom.createMorphAt(dom.childAt(element21, [1]),0,0);
        var morph15 = dom.createMorphAt(dom.childAt(element21, [3]),0,0);
        var morph16 = dom.createMorphAt(dom.childAt(element21, [5]),0,0);
        var morph17 = dom.createMorphAt(element20,7,7);
        var morph18 = dom.createMorphAt(dom.childAt(element6, [5]),1,1);
        block(env, morph0, context, "link-to", ["index"], {}, child0, null);
        element(env, element8, context, "bind-attr", [], {"class": ":searchbox globalSearchResults:hasresults"});
        inline(env, morph1, context, "input", [], {"id": "searchfield", "value": get(env, context, "globalSearchQuery")});
        block(env, morph2, context, "if", [get(env, context, "globalSearchResults.Person")], {}, child1, null);
        block(env, morph3, context, "each", [get(env, context, "globalSearchResults.Person")], {"keyword": "person"}, child2, null);
        block(env, morph4, context, "if", [get(env, context, "globalSearchResults.Demand")], {}, child3, null);
        block(env, morph5, context, "each", [get(env, context, "globalSearchResults.Demand")], {"keyword": "demand"}, child4, null);
        attribute(env, attrMorph0, element11, "src", concat(env, [get(env, context, "activePerson.profilePicture")]));
        element(env, element12, context, "action", ["logout"], {});
        content(env, morph6, context, "activePerson.fullName");
        element(env, element14, context, "action", ["toggleUsernav"], {});
        attribute(env, attrMorph1, element16, "src", concat(env, [get(env, context, "activePerson.profilePicture")]));
        content(env, morph7, context, "activePerson.fullName");
        content(env, morph8, context, "activePerson.roles");
        block(env, morph9, context, "link-to", ["me.projects"], {}, child5, null);
        block(env, morph10, context, "link-to", ["me.connections"], {}, child6, null);
        block(env, morph11, context, "link-to", ["me.index"], {}, child7, null);
        block(env, morph12, context, "link-to", ["me.settings"], {}, child8, null);
        block(env, morph13, context, "link-to", ["help"], {}, child9, null);
        element(env, element19, context, "action", ["logout"], {});
        block(env, morph14, context, "link-to", ["me.projects"], {}, child10, null);
        block(env, morph15, context, "link-to", ["me.projects"], {}, child11, null);
        block(env, morph16, context, "link-to", ["me.projects"], {}, child12, null);
        block(env, morph17, context, "link-to", ["me.projects"], {"class": "more-projects"}, child13, null);
        content(env, morph18, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Nog geen account?");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page");
        dom.setAttribute(el1,"class","login");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Xtalus");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Together the perfect 'match-maker' for finding and growing talent.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Welkom terug");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-user");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5,"class","message");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-lock");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5,"class","password message");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" {{input type=\"checkbox\" name=\"remember\" checked=remember}} Onthouden ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn");
        var el5 = dom.createTextNode("Login ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-sign-in");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("footer");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" {{#link-to 'forgot'}}Wachtwoord vergeten?{{/link-to}} ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 3]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element1, [5]);
        var morph0 = dom.createMorphAt(element2,2,2);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [4]),0,0);
        var morph2 = dom.createMorphAt(element3,2,2);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [4]),0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        element(env, element1, context, "action", ["login"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"value": get(env, context, "username"), "type": "text", "placeholder": "Gebruikersnaam"});
        content(env, morph1, context, "message");
        inline(env, morph2, context, "input", [], {"value": get(env, context, "password"), "type": "password", "placeholder": "Wachtwoord"});
        content(env, morph3, context, "message");
        block(env, morph4, context, "link-to", ["registration"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Algemeen");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Referenties");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Netwerk");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","page-header");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Profiel: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","submenu");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
        var morph4 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "model.fullName");
        block(env, morph1, context, "link-to", ["me.index"], {}, child0, null);
        block(env, morph2, context, "link-to", ["me.references"], {}, child1, null);
        block(env, morph3, context, "link-to", ["me.connections"], {}, child2, null);
        content(env, morph4, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me/connections', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","profilePicture");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"id","addProjectBtn");
          var el4 = dom.createTextNode("connect ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-plus");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(element7, [1]);
          var element9 = dom.childAt(element6, [3]);
          var element10 = dom.childAt(element6, [7, 0]);
          var attrMorph0 = dom.createAttrMorph(element8, 'style');
          var morph0 = dom.createMorphAt(element7,3,3);
          var morph1 = dom.createMorphAt(element9,0,0);
          var morph2 = dom.createMorphAt(element6,5,5);
          element(env, element7, context, "action", ["showConnectionDetails", get(env, context, "connection")], {});
          attribute(env, attrMorph0, element8, "style", concat(env, ["background-image: url(", get(env, context, "connection.picture"), ") "]));
          content(env, morph0, context, "connection.contactName");
          element(env, element9, context, "action", ["showConnectionDetails", get(env, context, "connection")], {});
          content(env, morph1, context, "connection.trustlevel");
          inline(env, morph2, context, "log", [get(env, context, "connection")], {});
          element(env, element10, context, "action", ["createPersonalContact", get(env, context, "connection.contactId")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("header");
          dom.setAttribute(el1,"class","picture");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h5");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Contactgegevens:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Adresgegevens:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Bekijk profiel");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("sluiten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          var element2 = dom.childAt(fragment, [7]);
          var element3 = dom.childAt(fragment, [9]);
          var element4 = dom.childAt(fragment, [11]);
          var element5 = dom.childAt(fragment, [13]);
          var attrMorph0 = dom.createAttrMorph(element0, 'style');
          var morph0 = dom.createMorphAt(element1,0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [2]),0,0);
          var morph2 = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
          var morph3 = dom.createMorphAt(element2,3,3);
          var morph4 = dom.createMorphAt(element2,6,6);
          var morph5 = dom.createMorphAt(element3,4,4);
          var morph6 = dom.createMorphAt(element3,8,8);
          var morph7 = dom.createMorphAt(element3,10,10);
          attribute(env, attrMorph0, element0, "style", concat(env, ["background-image: url(", get(env, context, "selectedPerson.profilePicture"), ") "]));
          content(env, morph0, context, "selectedPerson.fullName");
          content(env, morph1, context, "selectedPerson.birthDay");
          content(env, morph2, context, "selectedPerson.roles");
          content(env, morph3, context, "selectedPerson.phone");
          content(env, morph4, context, "selectedPerson.email");
          content(env, morph5, context, "selectedPerson.address");
          content(env, morph6, context, "selectedPerson.postalCode");
          content(env, morph7, context, "selectedPerson.town");
          element(env, element4, context, "action", ["getProfile", get(env, context, "selectedPerson.id")], {});
          element(env, element5, context, "action", ["hideConnectionDetails"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","preloader");
          dom.setAttribute(el1,"src","assets/images/preloader.gif");
          dom.setAttribute(el1,"width","64");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" connecties");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","options");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-sort-alpha-asc");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-info");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview list");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("table");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        dom.setAttribute(el5,"width","250");
        var el6 = dom.createTextNode("Naam");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("circle");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-right");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element11 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element11, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element11, [3, 1]),3,3);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        content(env, morph0, context, "model.connections.length");
        block(env, morph1, context, "each", [get(env, context, "model.connections")], {"keyword": "connection"}, child0, null);
        block(env, morph2, context, "if", [get(env, context, "selectedPerson")], {}, child1, child2);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me/courses', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Alle");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("MBO");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("MHBO");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("HBO");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Master");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Trainingen");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","demand tile");
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"src","http://mindbodyspiritualawareness.com/wp-content/uploads/2014/09/Is-Marilyn-a-Good-Artist-ftr.jpg");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","info");
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h4");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","owner");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","status");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","assets/images/status_orange.png");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" Uitgenodigd");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
          element(env, element0, context, "action", ["showDetails", get(env, context, "demand.uniqueItemId")], {});
          content(env, morph0, context, "demand.demandDescription");
          content(env, morph1, context, "demand.demandOwner.title");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","add-course-popup");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("header");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("Nieuw project");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn add-project-btn");
        var el5 = dom.createTextNode("Opleiding toevoegen");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn close");
        var el5 = dom.createTextNode("Annuleren");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","page-header");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Nieuwe opleiding");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-plus");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Opleidingen");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","submenu");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" opleidingen");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","options");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" <li><button><i class=\"fa fa-sort-alpha-asc\"></i></button></li> ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-info");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview tiles");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-right");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"class","picture");
        dom.setAttribute(el2,"style","background-image: url('http://mindbodyspiritualawareness.com/wp-content/uploads/2014/09/Is-Marilyn-a-Good-Artist-ftr.jpg') ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","owner");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","status");
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","assets/images/status_orange.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Uitgenodigd");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("hr");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","expertise");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-rocket");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createTextNode("Mijn expertise");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		Leergierig persoon");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("hr");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h5");
        var el3 = dom.createTextNode("verhaal");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Sluiten");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Bekijk project");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0, 1, 3]);
        var element3 = dom.childAt(element2, [9]);
        var element4 = dom.childAt(fragment, [2]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element4, [5, 1]);
        var element7 = dom.childAt(fragment, [4]);
        var element8 = dom.childAt(fragment, [6]);
        var element9 = dom.childAt(element8, [21]);
        var element10 = dom.childAt(element8, [25]);
        var morph0 = dom.createMorphAt(element2,1,1);
        var morph1 = dom.createMorphAt(element2,4,4);
        var morph2 = dom.createMorphAt(dom.childAt(element6, [1]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element6, [3]),0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element6, [5]),0,0);
        var morph5 = dom.createMorphAt(dom.childAt(element6, [7]),0,0);
        var morph6 = dom.createMorphAt(dom.childAt(element6, [9]),0,0);
        var morph7 = dom.createMorphAt(dom.childAt(element6, [11]),0,0);
        var morph8 = dom.createMorphAt(dom.childAt(element7, [1, 1]),0,0);
        var morph9 = dom.createMorphAt(dom.childAt(element7, [3]),1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element8, [3]),0,0);
        var morph11 = dom.createMorphAt(dom.childAt(element8, [5]),0,0);
        var morph12 = dom.createMorphAt(dom.childAt(element8, [11]),7,7);
        var morph13 = dom.createMorphAt(dom.childAt(element8, [15]),0,0);
        var morph14 = dom.createMorphAt(dom.childAt(element8, [19]),0,0);
        element(env, element2, context, "action", ["createProject"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"value": get(env, context, "title"), "type": "text", "placeholder": "Beschrijving", "class": "txt-field"});
        inline(env, morph1, context, "textarea", [], {"value": get(env, context, "summary"), "placeholder": "Samenvatting", "class": "txt-area"});
        element(env, element3, context, "action", ["closePopup", "new-project"], {});
        element(env, element5, context, "action", ["showPopup", "new-project"], {"id": "addProjectBtn"});
        block(env, morph2, context, "link-to", ["me.projects"], {"class": "active"}, child0, null);
        block(env, morph3, context, "link-to", ["me.connections"], {}, child1, null);
        block(env, morph4, context, "link-to", ["me.connections"], {}, child2, null);
        block(env, morph5, context, "link-to", ["me.connections"], {}, child3, null);
        block(env, morph6, context, "link-to", ["me.connections"], {}, child4, null);
        block(env, morph7, context, "link-to", ["me.connections"], {}, child5, null);
        content(env, morph8, context, "projectCount");
        block(env, morph9, context, "each", [get(env, context, "demands")], {"keyword": "demand"}, child6, null);
        content(env, morph10, context, "selectedDemand.demandDescription");
        content(env, morph11, context, "selectedDemand.demandOwner.title");
        inline(env, morph12, context, "view", [get(env, context, "Ember.Select")], {"contentBinding": "form.entities", "selectionBinding": "formdata.entity", "optionLabelPath": "content.label", "optionValuePath": "content.value"});
        content(env, morph13, context, "selectedDemand.demandSummary");
        content(env, morph14, context, "selectedDemand.demandStory");
        element(env, element9, context, "action", ["hideDetails"], {});
        element(env, element10, context, "action", ["getProject", get(env, context, "selectedDemand.uniqueItemId")], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-times");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "quality");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-left");
        dom.setAttribute(el1,"class","viewslider");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","slideContainer");
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","index");
        dom.setAttribute(el3,"class","slide-0");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"id","edit-btn");
        dom.setAttribute(el4,"class","fa fa-cog");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n                    Woonplaats: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    Opleiding: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    Opleidingsinstituut: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    Honoursprogramma:");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				 ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            Interesse in:\n\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("\n			<section id=\"age\">\n				<i class=\"fa fa-male\"></i> <h6>Geboortdedatum</h6>\n				<p>{{ model.birthday }}</p>\n			</section>\n			<hr>\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4,"id","availability");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-calendar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h6");
        var el6 = dom.createTextNode("Beschikbaarheid");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","edit");
        dom.setAttribute(el3,"class","slide-1");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"id","back-btn");
        dom.setAttribute(el4,"class","fa fa-chevron-circle-left");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Instellingen");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        dom.setAttribute(el4,"method","post");
        var el5 = dom.createTextNode("\n\n				Voornaam\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Tussenvoegsel\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Achternaam\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Geboortedatum\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Locatiegegevens");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Adres:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Postcode:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Plaats\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Beschikbaarheid");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Van:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				tot:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","submit");
        dom.setAttribute(el5,"class","btn add-project-btn");
        var el6 = dom.createTextNode("Wijzigen ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-pencil");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","passion");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"id","edit-btn");
        dom.setAttribute(el3,"class","fa fa-cog");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Verhaal");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","qualities");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Kwaliteiten");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		Kwaliteit toevoegen");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","add-quality-btn");
        var el4 = dom.createTextNode("Toevoegen");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element0, [3]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [5]);
        var element6 = dom.childAt(fragment, [2]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element7, [1]);
        var element9 = dom.childAt(element6, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        var morph1 = dom.createMorphAt(element5,1,1);
        var morph2 = dom.createMorphAt(element5,4,4);
        var morph3 = dom.createMorphAt(element5,7,7);
        var morph4 = dom.createMorphAt(element5,10,10);
        var morph5 = dom.createMorphAt(element5,15,15);
        var morph6 = dom.createMorphAt(element5,18,18);
        var morph7 = dom.createMorphAt(element5,21,21);
        var morph8 = dom.createMorphAt(element5,26,26);
        var morph9 = dom.createMorphAt(element5,29,29);
        var morph10 = dom.createMorphAt(dom.childAt(element7, [5]),0,0);
        var morph11 = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        var morph12 = dom.createMorphAt(element9,7,7);
        element(env, element2, context, "action", ["changeView", "page-left", 1], {});
        content(env, morph0, context, "model.town");
        element(env, element4, context, "action", ["changeView", "page-left", 0], {});
        element(env, element5, context, "action", ["updatePerson"], {"on": "submit"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "model.firstName"), "type": "text", "placeholder": "Voornaam", "class": "txt-field"});
        inline(env, morph2, context, "input", [], {"value": get(env, context, "model.middleName"), "type": "text", "placeholder": "Tussenvoegsel", "class": "txt-field"});
        inline(env, morph3, context, "input", [], {"value": get(env, context, "model.lastName"), "type": "text", "placeholder": "Achternaam", "class": "txt-field"});
        inline(env, morph4, context, "date-picker", [], {"value": get(env, context, "model.birthDay"), "valueFormat": "YYYY-MM-DD", "format": "YYYY-MM-DD"});
        inline(env, morph5, context, "input", [], {"value": get(env, context, "model.address"), "type": "text", "placeholder": "adres", "class": "txt-field"});
        inline(env, morph6, context, "input", [], {"value": get(env, context, "model.postalCode"), "type": "text", "placeholder": "postcode", "class": "txt-field"});
        inline(env, morph7, context, "input", [], {"value": get(env, context, "model.town"), "type": "text", "placeholder": "plaats", "class": "txt-field"});
        inline(env, morph8, context, "date-picker", [], {"value": get(env, context, "model.date"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "format": "DD-MM-YYYY", "yearRange": "-70,0"});
        inline(env, morph9, context, "date-picker", [], {"value": get(env, context, "model.date"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "format": "DD-MM-YYYY", "yearRange": "-70,0"});
        element(env, element8, context, "action", ["editSection", "user-info"], {});
        content(env, morph10, context, "model.passion");
        block(env, morph11, context, "each", [get(env, context, "qualities")], {"keyword": "quality"}, child0, null);
        inline(env, morph12, context, "input", [], {"value": get(env, context, "quality"), "type": "text", "placeholder": "Type hier een nieuwe kwaliteit"});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me/projects', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Alle projecten");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","demand tile");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","info");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","profilePicture owner");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h4");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","owner");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","status");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","assets/images/status_orange.png");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" Uitgenodigd");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(element6, [3]);
          var attrMorph0 = dom.createAttrMorph(element7, 'src');
          var morph0 = dom.createMorphAt(dom.childAt(element8, [3]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element8, [5]),0,0);
          element(env, element6, context, "action", ["showDetails", get(env, context, "demand.id")], {});
          attribute(env, attrMorph0, element7, "src", concat(env, [get(env, context, "demand.imageUrl")]));
          content(env, morph0, context, "demand.description");
          content(env, morph1, context, "demand.demandOwner.title");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element1 = dom.childAt(fragment, [1]);
              var attrMorph0 = dom.createAttrMorph(element1, 'style');
              attribute(env, attrMorph0, element1, "style", concat(env, [" background-image: url(", get(env, context, "profile.match.profilePicture"), ");"]));
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        var child2 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              var el2 = dom.createElement("strong");
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("br");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1]);
              var morph0 = dom.createMorphAt(dom.childAt(element0, [0]),0,0);
              var morph1 = dom.createMorphAt(element0,2,2);
              content(env, morph0, context, "profile.description");
              content(env, morph1, context, "profile.match.fullName");
              return fragment;
            }
          };
        }());
        var child3 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              var el2 = dom.createElement("strong");
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("br");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("Geen match");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
              content(env, morph0, context, "profile.description");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","matchingProfile");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element2 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element2,1,1);
            var morph1 = dom.createMorphAt(element2,3,3);
            element(env, element2, context, "action", ["selectMatchingProfile", get(env, context, "profile.id")], {});
            block(env, morph0, context, "if", [get(env, context, "profile.match.profilePicture")], {}, child0, child1);
            block(env, morph1, context, "if", [get(env, context, "profile.match")], {}, child2, child3);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("header");
          dom.setAttribute(el1,"class","picture");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","owner");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","status");
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"src","assets/images/status_orange.png");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Uitgenodigd");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("<span class=\"expertise\">\n        <i class=\"fa fa-rocket\"></i> <h5>Mijn expertise</h5>\n        Leergierig persoon<br>\n        {{\n        view Ember.Select\n        contentBinding=\"form.entities\"\n        selectionBinding=\"formdata.entity\"\n        optionLabelPath=\"content.label\"\n        optionValuePath=\"content.value\"\n        }}\n    </span>");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Specialismen");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h5");
          var el2 = dom.createTextNode("verhaal");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Sluiten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Bekijk project");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1]);
          var element4 = dom.childAt(fragment, [25]);
          var element5 = dom.childAt(fragment, [29]);
          var attrMorph0 = dom.createAttrMorph(element3, 'style');
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
          var morph2 = dom.createMorphAt(fragment,15,15,contextualElement);
          var morph3 = dom.createMorphAt(dom.childAt(fragment, [19]),0,0);
          var morph4 = dom.createMorphAt(dom.childAt(fragment, [23]),0,0);
          attribute(env, attrMorph0, element3, "style", concat(env, ["background-image: url('", get(env, context, "selectedDemand.imageUrl"), "') "]));
          content(env, morph0, context, "selectedDemand.description");
          content(env, morph1, context, "selectedDemand.demandOwner.title");
          block(env, morph2, context, "each", [get(env, context, "selectedDemand.profiles")], {"keyword": "profile"}, child0, null);
          content(env, morph3, context, "selectedDemand.demandSummary");
          content(env, morph4, context, "selectedDemand.demandStory");
          element(env, element4, context, "action", ["hideDetails"], {});
          element(env, element5, context, "action", ["getProject", get(env, context, "selectedDemand.id")], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","preloader");
          dom.setAttribute(el1,"src","assets/images/preloader.gif");
          dom.setAttribute(el1,"width","64");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","page-header");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"id","addProjectBtn");
        var el3 = dom.createTextNode("Nieuw project");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-plus");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Projecten");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","submenu");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" projecten");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","options");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-sort-alpha-asc");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-info");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview tiles");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-right");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","new-project");
        dom.setAttribute(el1,"class","popup");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","inner");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("header");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("Nieuw project");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn add-project-btn");
        var el5 = dom.createTextNode("Project toevoegen");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn close");
        var el5 = dom.createTextNode("Annuleren");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, block = hooks.block, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element9 = dom.childAt(fragment, [0]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(fragment, [2]);
        var element12 = dom.childAt(fragment, [6, 1, 3]);
        var element13 = dom.childAt(element12, [12]);
        var morph0 = dom.createMorphAt(dom.childAt(element9, [5, 1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element11, [1, 1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
        var morph4 = dom.createMorphAt(element12,1,1);
        var morph5 = dom.createMorphAt(element12,4,4);
        var morph6 = dom.createMorphAt(element12,7,7);
        element(env, element10, context, "action", ["showPopup", "new-project"], {});
        block(env, morph0, context, "link-to", ["me.projects"], {}, child0, null);
        content(env, morph1, context, "model.projectCount");
        block(env, morph2, context, "each", [get(env, context, "model.demands")], {"keyword": "demand"}, child1, null);
        block(env, morph3, context, "if", [get(env, context, "selectedDemand")], {}, child2, child3);
        element(env, element12, context, "action", ["createProject"], {"on": "submit"});
        inline(env, morph4, context, "input", [], {"value": get(env, context, "newProjectParams.title"), "type": "text", "placeholder": "Beschrijving", "class": "txt-field"});
        inline(env, morph5, context, "textarea", [], {"value": get(env, context, "newProjectParams.summary"), "placeholder": "Samenvatting", "class": "txt-area"});
        inline(env, morph6, context, "textarea", [], {"value": get(env, context, "newProjectParams.story"), "placeholder": "Verhaal", "class": "txt-area"});
        element(env, element13, context, "action", ["closePopup", "new-project"], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/me/references', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","reference");
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","configs");
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-pencil");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-trash");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"src","https://pbs.twimg.com/profile_images/477014477729042432/ncT2ukoh.jpeg");
          dom.setAttribute(el2,"width","100");
          dom.setAttribute(el2,"height","100");
          dom.setAttribute(el2,"class","referencePersonImage");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h2");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [7]),0,0);
          var morph2 = dom.createMorphAt(dom.childAt(element0, [9]),0,0);
          content(env, morph0, context, "reference.assessmentOwnerFullName");
          content(env, morph1, context, "reference.assessmentOwnerRoles");
          content(env, morph2, context, "reference.feedback");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" referenties");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","options");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-sort-alpha-asc");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-info");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(element1,3,3);
        content(env, morph0, context, "model.assessments.length");
        block(env, morph1, context, "each", [get(env, context, "model.assessments")], {"keyword": "reference"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/profile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Algemeen");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Referenties");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Netwerk");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","page-header");
        dom.setAttribute(el1,"class","has-image");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"id","addProjectBtn");
        var el3 = dom.createTextNode("connect ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-plus");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"class","profilePicture");
        dom.setAttribute(el2,"width","100");
        dom.setAttribute(el2,"height","100");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Profiel: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","submenu");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, element = hooks.element, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(element0, [7, 1]);
        var attrMorph0 = dom.createAttrMorph(element2, 'src');
        var morph0 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element3, [1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [5]),0,0);
        var morph4 = dom.createMorphAt(fragment,2,2,contextualElement);
        element(env, element1, context, "action", ["createPersonalContact", get(env, context, "model.id")], {});
        attribute(env, attrMorph0, element2, "src", concat(env, [get(env, context, "model.profilePicture")]));
        content(env, morph0, context, "model.fullName");
        block(env, morph1, context, "link-to", ["profile.index"], {}, child0, null);
        block(env, morph2, context, "link-to", ["profile.references"], {}, child1, null);
        block(env, morph3, context, "link-to", ["profile.connections"], {}, child2, null);
        content(env, morph4, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/profile/connections', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","profilePicture");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"id","addProjectBtn");
          var el4 = dom.createTextNode("connect ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-plus");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(element7, [1]);
          var element9 = dom.childAt(element6, [3]);
          var element10 = dom.childAt(element6, [7, 0]);
          var attrMorph0 = dom.createAttrMorph(element8, 'style');
          var morph0 = dom.createMorphAt(element7,3,3);
          var morph1 = dom.createMorphAt(element9,0,0);
          var morph2 = dom.createMorphAt(element6,5,5);
          element(env, element7, context, "action", ["showConnectionDetails", get(env, context, "connection")], {});
          attribute(env, attrMorph0, element8, "style", concat(env, ["background-image: url(", get(env, context, "connection.picture"), ") "]));
          content(env, morph0, context, "connection.contactName");
          element(env, element9, context, "action", ["showConnectionDetails", get(env, context, "connection")], {});
          content(env, morph1, context, "connection.trustlevel");
          inline(env, morph2, context, "log", [get(env, context, "connection")], {});
          element(env, element10, context, "action", ["createPersonalContact", get(env, context, "connection.contactId")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("header");
          dom.setAttribute(el1,"class","picture");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h5");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Contactgegevens:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Adresgegevens:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Bekijk profiel");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("sluiten");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          var element2 = dom.childAt(fragment, [7]);
          var element3 = dom.childAt(fragment, [9]);
          var element4 = dom.childAt(fragment, [11]);
          var element5 = dom.childAt(fragment, [13]);
          var attrMorph0 = dom.createAttrMorph(element0, 'style');
          var morph0 = dom.createMorphAt(element1,0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [2]),0,0);
          var morph2 = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
          var morph3 = dom.createMorphAt(element2,3,3);
          var morph4 = dom.createMorphAt(element2,6,6);
          var morph5 = dom.createMorphAt(element3,4,4);
          var morph6 = dom.createMorphAt(element3,8,8);
          var morph7 = dom.createMorphAt(element3,10,10);
          attribute(env, attrMorph0, element0, "style", concat(env, ["background-image: url(", get(env, context, "selectedPerson.profilePicture"), ") "]));
          content(env, morph0, context, "selectedPerson.fullName");
          content(env, morph1, context, "selectedPerson.birthDay");
          content(env, morph2, context, "selectedPerson.roles");
          content(env, morph3, context, "selectedPerson.phone");
          content(env, morph4, context, "selectedPerson.email");
          content(env, morph5, context, "selectedPerson.address");
          content(env, morph6, context, "selectedPerson.postalCode");
          content(env, morph7, context, "selectedPerson.town");
          element(env, element4, context, "action", ["getProfile", get(env, context, "selectedPerson.id")], {});
          element(env, element5, context, "action", ["hideConnectionDetails"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","preloader");
          dom.setAttribute(el1,"src","assets/images/preloader.gif");
          dom.setAttribute(el1,"width","64");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" connecties");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview list");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("table");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        dom.setAttribute(el5,"width","250");
        var el6 = dom.createTextNode("Naam");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("circle");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-right");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element11 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element11, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element11, [3, 1]),3,3);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        content(env, morph0, context, "model.connections.length");
        block(env, morph1, context, "each", [get(env, context, "model.connections")], {"keyword": "connection"}, child0, null);
        block(env, morph2, context, "if", [get(env, context, "selectedPerson")], {}, child1, child2);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/profile/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "quality");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-left");
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","index");
        dom.setAttribute(el2,"class","slide-0");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"id","edit-btn");
        dom.setAttribute(el3,"class","fa fa-cog");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("hr");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","location");
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-location-arrow");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("Locatiegegevens");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("hr");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","age");
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-male");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("Geboortdedatum");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("hr");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","availability");
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-calendar");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h6");
        var el5 = dom.createTextNode("Beschikbaarheid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("1 april t/m 30 maart");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    15 uur per week");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","passion");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Passie");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","qualities");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Kwaliteiten");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [9, 5]);
        var element3 = dom.childAt(fragment, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
        var morph2 = dom.createMorphAt(element2,1,1);
        var morph3 = dom.createMorphAt(element2,5,5);
        var morph4 = dom.createMorphAt(element2,7,7);
        var morph5 = dom.createMorphAt(dom.childAt(element0, [13, 5]),0,0);
        var morph6 = dom.createMorphAt(dom.childAt(element3, [1, 3]),0,0);
        var morph7 = dom.createMorphAt(dom.childAt(element3, [3, 3]),1,1);
        element(env, element1, context, "action", ["changeView", "page-left", 1], {});
        content(env, morph0, context, "model.fullName");
        content(env, morph1, context, "model.roles");
        content(env, morph2, context, "model.address");
        content(env, morph3, context, "model.postalCode");
        content(env, morph4, context, "model.town");
        content(env, morph5, context, "model.birthday");
        content(env, morph6, context, "passion");
        block(env, morph7, context, "each", [get(env, context, "qualities")], {"keyword": "quality"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/profile/projects', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","demand tile");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"src","http://mindbodyspiritualawareness.com/wp-content/uploads/2014/09/Is-Marilyn-a-Good-Artist-ftr.jpg");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","info");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h4");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","owner");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","status");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","assets/images/status_orange.png");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" Uitgenodigd");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
          element(env, element0, context, "action", ["showDetails", get(env, context, "demand.id")], {});
          content(env, morph0, context, "demand.description");
          content(env, morph1, context, "demand.demandOwner.title");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview absolute");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","count");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" projecten");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","options");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-sort-alpha-asc");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","active");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-info");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","");
        dom.setAttribute(el2,"class","overview tiles");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-right");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"class","picture");
        dom.setAttribute(el2,"style","background-image: url('http://mindbodyspiritualawareness.com/wp-content/uploads/2014/09/Is-Marilyn-a-Good-Artist-ftr.jpg') ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","owner");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","status");
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","assets/images/status_orange.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Uitgenodigd");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("hr");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","expertise");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-rocket");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createTextNode("Mijn expertise");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        Leergierig persoon");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("hr");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h5");
        var el3 = dom.createTextNode("verhaal");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Sluiten");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Bekijk project");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0]);
        var element3 = dom.childAt(fragment, [2]);
        var element4 = dom.childAt(element3, [21]);
        var element5 = dom.childAt(element3, [25]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [5]),0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element3, [11]),7,7);
        var morph5 = dom.createMorphAt(dom.childAt(element3, [15]),0,0);
        var morph6 = dom.createMorphAt(dom.childAt(element3, [19]),0,0);
        content(env, morph0, context, "model.demands.length");
        block(env, morph1, context, "each", [get(env, context, "model.demands")], {"keyword": "demand"}, child0, null);
        content(env, morph2, context, "selectedDemand.description");
        content(env, morph3, context, "selectedDemand.demandOwner.title");
        inline(env, morph4, context, "view", [get(env, context, "Ember.Select")], {"contentBinding": "form.entities", "selectionBinding": "formdata.entity", "optionLabelPath": "content.label", "optionValuePath": "content.value"});
        content(env, morph5, context, "selectedDemand.demandSummary");
        content(env, morph6, context, "selectedDemand.demandStory");
        element(env, element4, context, "action", ["hideDetails"], {});
        element(env, element5, context, "action", ["getProject", get(env, context, "selectedDemand.id")], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/project', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-chevron-left");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" Terug naar projecten");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Algemeen");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Matches");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","page-header");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h5");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","submenu");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
        var morph3 = dom.createMorphAt(fragment,2,2,contextualElement);
        block(env, morph0, context, "link-to", ["me.projects"], {}, child0, null);
        block(env, morph1, context, "link-to", ["project.index"], {}, child1, null);
        block(env, morph2, context, "link-to", ["project.matching"], {}, child2, null);
        content(env, morph3, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/project/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","profilePicture");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1]);
            var attrMorph0 = dom.createAttrMorph(element1, 'style');
            attribute(env, attrMorph0, element1, "style", concat(env, [" background-image: url(", get(env, context, "profile.match.profilePicture"), ");"]));
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","profilePicture");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createElement("strong");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("br");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(dom.childAt(element0, [0]),0,0);
            var morph1 = dom.createMorphAt(element0,2,2);
            content(env, morph0, context, "profilwe.description");
            content(env, morph1, context, "profile.match.fullName");
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("				");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createElement("strong");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("br");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("Geen match");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
            content(env, morph0, context, "profile.description");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","matchingProfile");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element2,1,1);
          var morph1 = dom.createMorphAt(element2,3,3);
          element(env, element2, context, "action", ["selectMatchingProfile", get(env, context, "profile.id")], {});
          block(env, morph0, context, "if", [get(env, context, "profile.match.profilePicture")], {}, child0, child1);
          block(env, morph1, context, "if", [get(env, context, "profile.match")], {}, child2, child3);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                Klik hier of sleep een afbeelding\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-left");
        dom.setAttribute(el1,"class","viewslider");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","slideContainer");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","index");
        dom.setAttribute(el3,"class","slide-0");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("header");
        dom.setAttribute(el4,"class","picture");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"id","edit-btn");
        dom.setAttribute(el4,"class","fa fa-cog");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        var el5 = dom.createTextNode("Project: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("Eigenaar: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createElement("strong");
        var el6 = dom.createTextNode("Specialismen");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Start- en einddatum");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" t/m ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        var el5 = dom.createTextNode("Verwijder project");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","edit");
        dom.setAttribute(el3,"class","slide-1");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"id","edit-btn");
        dom.setAttribute(el4,"class","fa fa-cog");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        dom.setAttribute(el4,"method","post");
        dom.setAttribute(el4,"enctype","multipart/form-data");
        var el5 = dom.createTextNode("\n				Afbeelding:\n\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Beschrijving:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Samenvatting\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Verhaal\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        var el6 = dom.createTextNode("Start en eind datum");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Van:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				tot:\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","submit");
        dom.setAttribute(el5,"class","btn add-project-btn");
        var el6 = dom.createTextNode("Wijzigen ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-pencil");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("i");
        dom.setAttribute(el2,"id","edit-btn");
        dom.setAttribute(el2,"class","fa fa-cog");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Project: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","qualities");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("verhaal");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, element = hooks.element, content = hooks.content, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element3 = dom.childAt(fragment, [0, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element4, [3]);
        var element7 = dom.childAt(element4, [15, 3]);
        var element8 = dom.childAt(element4, [17]);
        var element9 = dom.childAt(element3, [3]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element9, [3]);
        var element12 = dom.childAt(fragment, [2]);
        var element13 = dom.childAt(element12, [1]);
        var attrMorph0 = dom.createAttrMorph(element5, 'style');
        var morph0 = dom.createMorphAt(dom.childAt(element4, [5]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element4, [7]),1,1);
        var morph2 = dom.createMorphAt(element4,13,13);
        var morph3 = dom.createMorphAt(element7,0,0);
        var morph4 = dom.createMorphAt(element7,2,2);
        var morph5 = dom.createMorphAt(element11,1,1);
        var morph6 = dom.createMorphAt(element11,6,6);
        var morph7 = dom.createMorphAt(element11,9,9);
        var morph8 = dom.createMorphAt(element11,12,12);
        var morph9 = dom.createMorphAt(element11,17,17);
        var morph10 = dom.createMorphAt(element11,20,20);
        var morph11 = dom.createMorphAt(dom.childAt(element12, [3]),1,1);
        var morph12 = dom.createMorphAt(dom.childAt(element12, [5, 3]),0,0);
        var morph13 = dom.createMorphAt(fragment,4,4,contextualElement);
        attribute(env, attrMorph0, element5, "style", concat(env, ["background-image: url('", get(env, context, "model.imageUrl"), "') "]));
        element(env, element6, context, "action", ["changeView", "page-left", 1], {});
        content(env, morph0, context, "model.description");
        content(env, morph1, context, "model.owner.firstName");
        block(env, morph2, context, "each", [get(env, context, "model.profiles")], {"keyword": "profile"}, child0, null);
        content(env, morph3, context, "model.startDate");
        content(env, morph4, context, "model.endDate");
        element(env, element8, context, "action", ["delProject"], {});
        element(env, element10, context, "action", ["changeView", "page-left", 0], {});
        element(env, element11, context, "action", ["updateDemand"], {"on": "submit"});
        block(env, morph5, context, "file-picker", [], {"accept": ".jpg,.jpeg,.gif,.png", "fileLoaded": "fileLoaded", "readAs": "readAsDataURL"}, child1, null);
        inline(env, morph6, context, "textarea", [], {"value": get(env, context, "model.description"), "placeholder": "Beschrijving", "rows": "6", "class": "txt-field"});
        inline(env, morph7, context, "textarea", [], {"value": get(env, context, "model.summary"), "placeholder": "Samenvatting", "rows": "8", "class": "txt-field"});
        inline(env, morph8, context, "textarea", [], {"value": get(env, context, "model.story"), "placeholder": "Verhaal", "rows": "8", "class": "txt-field"});
        inline(env, morph9, context, "date-picker", [], {"value": get(env, context, "model.startDate"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "format": "DD-MM-YYYY", "yearRange": "-70,0"});
        inline(env, morph10, context, "date-picker", [], {"value": get(env, context, "model.endDate"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "format": "DD-MM-YYYY", "yearRange": "-70,0"});
        element(env, element13, context, "action", ["changeView", "page-left", 1], {});
        content(env, morph11, context, "model.description");
        content(env, morph12, context, "model.story");
        inline(env, morph13, context, "log", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/project/matching', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("h4");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("h5");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element15 = dom.childAt(fragment, [1]);
              var attrMorph0 = dom.createAttrMorph(element15, 'style');
              var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
              var morph1 = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
              attribute(env, attrMorph0, element15, "style", concat(env, ["background-image: url(", get(env, context, "selectedProfile.match.profilePicture"), ");"]));
              content(env, morph0, context, "selectedProfile.description");
              content(env, morph1, context, "selectedProfile.match.fullName");
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("h4");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("h5");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
              var morph1 = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
              content(env, morph0, context, "selectedProfile.description");
              content(env, morph1, context, "selectedProfile.match.fullName");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "if", [get(env, context, "selectedProfile.match.profilePicture")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","profilePicture");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h4");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h5");
            var el2 = dom.createTextNode("Geen match");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
            content(env, morph0, context, "selectedProfile.description");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "matching-widget", [], {"data": get(env, context, "this"), "isNew": false, "onupdate": "updateWidget", "onremove": "removeWidget"});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.setAttribute(el1,"class","");
            dom.setAttribute(el1,"src","assets/images/preloader.gif");
            dom.setAttribute(el1,"width","16");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","widgetContainer");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Element toevoegen ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Matches berekenen ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-calculator");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("hr");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Verwijder profiel ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-trash");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element16 = dom.childAt(fragment, [4]);
          var element17 = dom.childAt(fragment, [6]);
          var element18 = dom.childAt(fragment, [10]);
          var element19 = dom.childAt(fragment, [16]);
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          var morph1 = dom.createMorphAt(element16,1,1);
          var morph2 = dom.createMorphAt(element16,3,3);
          var morph3 = dom.createMorphAt(fragment,12,12,contextualElement);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "selectedProfile.match")], {}, child0, child1);
          inline(env, morph1, context, "log", [get(env, context, "selectedProfile.widgets")], {});
          block(env, morph2, context, "collection", ["ivy-sortable"], {"axis": "y", "content": get(env, context, "selectedProfile.widgets"), "moved": "updateWidgetWeights"}, child2, null);
          element(env, element17, context, "action", ["changeView", "page-left", 1], {});
          element(env, element18, context, "action", ["calculateMatches"], {});
          block(env, morph3, context, "unless", [get(env, context, "selectedProfile.orderedProfileComparisons")], {}, child3, null);
          element(env, element19, context, "action", ["deleteDemandProfile"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "matching-widget", [], {"data": get(env, context, "element"), "onsave": "saveWidget"});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"class","profilePicture");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2,"class","info");
              var el3 = dom.createElement("strong");
              var el4 = dom.createComment("");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("br");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n            ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element12 = dom.childAt(fragment, [1]);
              var element13 = dom.childAt(element12, [1]);
              var attrMorph0 = dom.createAttrMorph(element12, 'style');
              var morph0 = dom.createMorphAt(dom.childAt(element13, [0]),0,0);
              var morph1 = dom.createMorphAt(element13,2,2);
              attribute(env, attrMorph0, element12, "style", concat(env, ["background-image: url(", get(env, context, "profile.match.profilePicture"), ");"]));
              content(env, morph0, context, "profile.description");
              content(env, morph1, context, "profile.match.fullName");
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("            ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"class","profilePicture");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2,"class","info");
              var el3 = dom.createElement("strong");
              var el4 = dom.createComment("");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("br");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n            ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element11 = dom.childAt(fragment, [1, 1]);
              var morph0 = dom.createMorphAt(dom.childAt(element11, [0]),0,0);
              var morph1 = dom.createMorphAt(element11,2,2);
              content(env, morph0, context, "profile.description");
              content(env, morph1, context, "profile.match.fullName");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "if", [get(env, context, "profile.match.profilePicture")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1,"class","profilePicture");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2,"class","info");
            var el3 = dom.createElement("strong");
            var el4 = dom.createComment("");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("br");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("Geen match");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1, 0]),0,0);
            content(env, morph0, context, "profile.description");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","profile");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element14 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element14,1,1);
          element(env, element14, context, "action", ["selectMatchingProfile", get(env, context, "profile.id")], {});
          block(env, morph0, context, "if", [get(env, context, "profile.match")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element4 = dom.childAt(fragment, [1]);
              var attrMorph0 = dom.createAttrMorph(element4, 'style');
              attribute(env, attrMorph0, element4, "style", concat(env, ["background-image: url(", get(env, context, "candidate.profilePicture"), ") "]));
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("tr");
            var el2 = dom.createTextNode("\n\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("                    ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            var el3 = dom.createTextNode("\n                    ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("button");
            var el4 = dom.createTextNode("Kies persoon");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n                    ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("button");
            var el4 = dom.createTextNode("Verwijderen");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element5 = dom.childAt(fragment, [1]);
            var element6 = dom.childAt(element5, [1]);
            var element7 = dom.childAt(element5, [3]);
            var element8 = dom.childAt(element7, [1]);
            var element9 = dom.childAt(element7, [3]);
            var morph0 = dom.createMorphAt(element6,1,1);
            var morph1 = dom.createMorphAt(element6,3,3);
            block(env, morph0, context, "if", [get(env, context, "candidate.profilePicture")], {}, child0, child1);
            content(env, morph1, context, "candidate.contactName");
            element(env, element8, context, "action", ["selectMatch", get(env, context, "candidate")], {});
            element(env, element9, context, "action", ["removeCandidate", get(env, context, "candidate")], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"id","candidates");
          dom.setAttribute(el1,"class","overview list");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode("Kandidaten");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h5");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" kandidaten");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("table");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("tr");
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("th");
          var el5 = dom.createTextNode("Naam");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("th");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element10 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element10, [3]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element10, [5]),3,3);
          content(env, morph0, context, "selectedProfile.candidates.length");
          block(env, morph1, context, "each", [get(env, context, "selectedProfile.candidates")], {"keyword": "candidate"}, child0, null);
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1]);
              var attrMorph0 = dom.createAttrMorph(element0, 'style');
              attribute(env, attrMorph0, element0, "style", concat(env, ["background-image: url(", get(env, context, "proposedMatch.profilePicture"), ") "]));
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","profilePicture");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("tr");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("                    ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("td");
            var el3 = dom.createElement("button");
            var el4 = dom.createTextNode("Uitnodigen");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1]);
            var element2 = dom.childAt(element1, [3]);
            var element3 = dom.childAt(element1, [5, 0]);
            var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
            var morph1 = dom.createMorphAt(element2,1,1);
            var morph2 = dom.createMorphAt(element2,3,3);
            content(env, morph0, context, "proposedMatch.calculatedMatchingValue");
            block(env, morph1, context, "if", [get(env, context, "proposedMatch.profilePicture")], {}, child0, child1);
            content(env, morph2, context, "proposedMatch.proposedPersonName");
            element(env, element3, context, "action", ["saveCandidate", get(env, context, "proposedMatch")], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("table");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("tr");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.setAttribute(el3,"width","80");
          var el4 = dom.createTextNode("Matching score");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          var el4 = dom.createTextNode("Naam");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),3,3);
          block(env, morph0, context, "each", [get(env, context, "selectedProfile.orderedProfileComparisons")], {"keyword": "proposedMatch"}, child0, null);
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","");
          dom.setAttribute(el1,"src","assets/images/preloader.gif");
          dom.setAttribute(el1,"width","32");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("aside");
        dom.setAttribute(el1,"id","page-left");
        dom.setAttribute(el1,"class","viewslider");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","slideContainer");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","index");
        dom.setAttribute(el3,"class","slide-0");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"id","add");
        dom.setAttribute(el3,"class","slide-1");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"id","back-btn");
        dom.setAttribute(el4,"class","fa fa-chevron-circle-left");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Selecteer een filter");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4,"class","widgetContainer");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page-content");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","profile-select");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","add");
        var el4 = dom.createTextNode("+");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","info");
        var el5 = dom.createElement("strong");
        var el6 = dom.createTextNode("Zoekprofiel aanmaken");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("Klik hier om een nieuw zoekprofiel aan te maken.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("<h5>matches 0/{{ model.matchingProfiles.length }}</h5>");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","proposedMatches");
        dom.setAttribute(el2,"class","overview list");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Voorgestelde matches");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h5");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" personen");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","new-demand-profile");
        dom.setAttribute(el1,"class","popup");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","inner");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("header");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h2");
        var el5 = dom.createTextNode("Nieuw Zoekprofiel");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn_sumbit");
        var el5 = dom.createTextNode("Profiel toevoegen");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn close");
        var el5 = dom.createTextNode("Annuleren");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element20 = dom.childAt(fragment, [0, 1]);
        var element21 = dom.childAt(element20, [3]);
        var element22 = dom.childAt(element21, [1]);
        var element23 = dom.childAt(element21, [5]);
        var element24 = dom.childAt(fragment, [2]);
        var element25 = dom.childAt(element24, [1]);
        var element26 = dom.childAt(element25, [1]);
        var element27 = dom.childAt(element24, [5]);
        var element28 = dom.childAt(fragment, [4, 1, 3]);
        var element29 = dom.childAt(element28, [6]);
        var morph0 = dom.createMorphAt(dom.childAt(element20, [1]),1,1);
        var morph1 = dom.createMorphAt(element23,1,1);
        var morph2 = dom.createMorphAt(element23,3,3);
        var morph3 = dom.createMorphAt(element25,3,3);
        var morph4 = dom.createMorphAt(element24,3,3);
        var morph5 = dom.createMorphAt(dom.childAt(element27, [3]),0,0);
        var morph6 = dom.createMorphAt(element27,5,5);
        var morph7 = dom.createMorphAt(element28,1,1);
        block(env, morph0, context, "if", [get(env, context, "selectedProfile")], {}, child0, null);
        element(env, element22, context, "action", ["changeView", "page-left", 0], {});
        inline(env, morph1, context, "log", [get(env, context, "selectedProfile.availableWidgets.length")], {});
        block(env, morph2, context, "each", [get(env, context, "selectedProfile.availableWidgets")], {"keyword": "element"}, child1, null);
        element(env, element26, context, "action", ["showPopup", "new-demand-profile"], {});
        block(env, morph3, context, "each", [get(env, context, "model.profiles")], {"keyword": "profile"}, child2, null);
        block(env, morph4, context, "if", [get(env, context, "selectedProfile.candidates")], {}, child3, null);
        content(env, morph5, context, "selectedProfile.profileComparisons.length");
        block(env, morph6, context, "if", [get(env, context, "selectedProfile.orderedProfileComparisons")], {}, child4, child5);
        element(env, element28, context, "action", ["createDemandProfile"], {"on": "submit"});
        inline(env, morph7, context, "input", [], {"value": get(env, context, "newProfileParams.name"), "type": "text", "placeholder": "Profielnaam", "class": "txt-field"});
        element(env, element29, context, "action", ["closePopup", "new-demand-profile"], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/templates/registration', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Annuleren");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","page");
        dom.setAttribute(el1,"class","registration");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Xtalus");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Together the perfect 'match-maker' for finding and growing talent.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("Registreer jezelf");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"method","post");
        dom.setAttribute(el3,"class","columns");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" Left column ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        dom.setAttribute(el4,"class","message");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-user");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Voornaam ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-user");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Tussenvoegsel");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-user");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Achternaam ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-birthday-cake");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Geboortedatum ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-envelope");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Emailadres ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-phone");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Telefoonnummer ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-home");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Adres ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-home");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Postcode ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-home");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Woonplaats ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-persons");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Entiteit ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-user");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Gebruikersnaam ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-lock");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Wachtwoord ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-lock");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Wachtwoord herhalen ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","required");
        var el7 = dom.createTextNode("*");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("br");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","submit");
        dom.setAttribute(el4,"class","btn");
        var el5 = dom.createTextNode("Registreren ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-sign-in");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3, 3]);
        var element2 = dom.childAt(element1, [5]);
        var element3 = dom.childAt(element1, [7]);
        var element4 = dom.childAt(element1, [9]);
        var element5 = dom.childAt(element1, [11]);
        var element6 = dom.childAt(element1, [13]);
        var element7 = dom.childAt(element1, [15]);
        var element8 = dom.childAt(element1, [17]);
        var element9 = dom.childAt(element1, [19]);
        var element10 = dom.childAt(element1, [21]);
        var element11 = dom.childAt(element1, [23]);
        var element12 = dom.childAt(element1, [25]);
        var element13 = dom.childAt(element1, [27]);
        var element14 = dom.childAt(element1, [29]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),5,5);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [1]),4,4);
        var morph4 = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
        var morph5 = dom.createMorphAt(dom.childAt(element4, [1]),5,5);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [3]),0,0);
        var morph7 = dom.createMorphAt(dom.childAt(element5, [1]),5,5);
        var morph8 = dom.createMorphAt(dom.childAt(element5, [3]),0,0);
        var morph9 = dom.createMorphAt(dom.childAt(element6, [1]),5,5);
        var morph10 = dom.createMorphAt(dom.childAt(element6, [3]),0,0);
        var morph11 = dom.createMorphAt(dom.childAt(element7, [1]),5,5);
        var morph12 = dom.createMorphAt(dom.childAt(element7, [3]),0,0);
        var morph13 = dom.createMorphAt(dom.childAt(element8, [1]),5,5);
        var morph14 = dom.createMorphAt(dom.childAt(element8, [3]),0,0);
        var morph15 = dom.createMorphAt(dom.childAt(element9, [1]),5,5);
        var morph16 = dom.createMorphAt(dom.childAt(element9, [3]),0,0);
        var morph17 = dom.createMorphAt(dom.childAt(element10, [1]),5,5);
        var morph18 = dom.createMorphAt(dom.childAt(element10, [3]),0,0);
        var morph19 = dom.createMorphAt(dom.childAt(element11, [1]),5,5);
        var morph20 = dom.createMorphAt(dom.childAt(element11, [3]),0,0);
        var morph21 = dom.createMorphAt(dom.childAt(element12, [1]),5,5);
        var morph22 = dom.createMorphAt(dom.childAt(element12, [3]),0,0);
        var morph23 = dom.createMorphAt(dom.childAt(element13, [1]),5,5);
        var morph24 = dom.createMorphAt(dom.childAt(element13, [3]),0,0);
        var morph25 = dom.createMorphAt(dom.childAt(element14, [1]),5,5);
        var morph26 = dom.createMorphAt(dom.childAt(element14, [3]),0,0);
        var morph27 = dom.createMorphAt(element1,33,33);
        var morph28 = dom.createMorphAt(element0,5,5);
        element(env, element1, context, "action", ["submitRegistration"], {"on": "submit"});
        content(env, morph0, context, "message");
        element(env, element2, context, "bind-attr", [], {"class": "errors.firstname:error :cols-2"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "formdata.firstname"), "type": "text", "placeholder": "Uw voornaam"});
        content(env, morph2, context, "errors.firstname");
        element(env, element3, context, "bind-attr", [], {"class": "errors.middlename:error :cols-2"});
        inline(env, morph3, context, "input", [], {"value": get(env, context, "formdata.middlename"), "type": "text", "placeholder": "Tussenvoegsel"});
        content(env, morph4, context, "errors.middlename");
        element(env, element4, context, "bind-attr", [], {"class": "errors.lastname:error :cols-2"});
        inline(env, morph5, context, "input", [], {"value": get(env, context, "formdata.lastname"), "type": "text", "placeholder": "Uw achternaam"});
        content(env, morph6, context, "errors.lastname");
        element(env, element5, context, "bind-attr", [], {"class": "errors.birthday:error :cols-2"});
        inline(env, morph7, context, "date-picker", [], {"value": get(env, context, "formdata.birthday"), "date": get(env, context, "mydate"), "valueFormat": "YYYY-MM-DD", "yearRange": "-70,0"});
        content(env, morph8, context, "errors.birthday");
        element(env, element6, context, "bind-attr", [], {"class": "errors.email:error :cols-2"});
        inline(env, morph9, context, "input", [], {"value": get(env, context, "formdata.email"), "type": "text", "placeholder": "Uw e-mailadres"});
        content(env, morph10, context, "errors.email");
        element(env, element7, context, "bind-attr", [], {"class": "errors.phone:error :cols-2"});
        inline(env, morph11, context, "input", [], {"value": get(env, context, "formdata.phone"), "type": "text", "placeholder": "Uw telefoonnummer"});
        content(env, morph12, context, "errors.phone");
        element(env, element8, context, "bind-attr", [], {"class": "errors.address:error :cols-2"});
        inline(env, morph13, context, "input", [], {"value": get(env, context, "formdata.address"), "type": "text", "placeholder": "Uw adres"});
        content(env, morph14, context, "errors.address");
        element(env, element9, context, "bind-attr", [], {"class": "errors.postal:error :cols-2"});
        inline(env, morph15, context, "input", [], {"value": get(env, context, "formdata.postal"), "type": "text", "placeholder": "Uw postcode"});
        content(env, morph16, context, "errors.postal");
        element(env, element10, context, "bind-attr", [], {"class": "errors.city:error :cols-2"});
        inline(env, morph17, context, "input", [], {"value": get(env, context, "formdata.city"), "type": "text", "placeholder": "Uw woonplaats"});
        content(env, morph18, context, "errors.city");
        element(env, element11, context, "bind-attr", [], {"class": "errors.entity:error :cols-2"});
        inline(env, morph19, context, "view", [get(env, context, "Ember.Select")], {"contentBinding": "form.entities", "selectionBinding": "formdata.entity", "optionLabelPath": "content.label", "optionValuePath": "content.value"});
        content(env, morph20, context, "errors.entity");
        element(env, element12, context, "bind-attr", [], {"class": "errors.username:error :cols-2"});
        inline(env, morph21, context, "input", [], {"value": get(env, context, "formdata.username"), "type": "text", "placeholder": "Kies een gebruikersnaam"});
        content(env, morph22, context, "errors.username");
        element(env, element13, context, "bind-attr", [], {"class": "errors.password:error :cols-2"});
        inline(env, morph23, context, "input", [], {"value": get(env, context, "formdata.password"), "type": "password", "placeholder": "Kies een wachtwoord"});
        content(env, morph24, context, "errors.password");
        element(env, element14, context, "bind-attr", [], {"class": "errors.passwordConfirm:error :cols-2"});
        inline(env, morph25, context, "input", [], {"value": get(env, context, "formdata.passwordConfirm"), "type": "password", "placeholder": "Herhaal het wachtwoord"});
        content(env, morph26, context, "errors.passwordConfirm");
        block(env, morph27, context, "link-to", ["login"], {"tagName": "button", "class": "btn-left"}, child0, null);
        inline(env, morph28, context, "log", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('xtalus/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(false, 'adapters/application.js should pass jshint.\nadapters/application.js: line 4, col 5, \'adapterSettings\' is defined but never used.\n\n1 error'); 
  });

});
define('xtalus/tests/adapters/demand.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/demand.js should pass jshint', function() { 
    ok(false, 'adapters/demand.js should pass jshint.\nadapters/demand.js: line 11, col 27, \'$ISIS\' is not defined.\nadapters/demand.js: line 13, col 30, \'$ISIS\' is not defined.\nadapters/demand.js: line 3, col 5, \'adapterSettings\' is defined but never used.\nadapters/demand.js: line 11, col 13, \'user_cookie\' is defined but never used.\n\n4 errors'); 
  });

});
define('xtalus/tests/adapters/demandprofile.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/demandprofile.js should pass jshint', function() { 
    ok(false, 'adapters/demandprofile.js should pass jshint.\nadapters/demandprofile.js: line 11, col 27, \'$ISIS\' is not defined.\nadapters/demandprofile.js: line 13, col 30, \'$ISIS\' is not defined.\nadapters/demandprofile.js: line 3, col 5, \'adapterSettings\' is defined but never used.\nadapters/demandprofile.js: line 11, col 13, \'user_cookie\' is defined but never used.\n\n4 errors'); 
  });

});
define('xtalus/tests/adapters/email.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/email.js should pass jshint', function() { 
    ok(false, 'adapters/email.js should pass jshint.\nadapters/email.js: line 15, col 27, Missing semicolon.\nadapters/email.js: line 17, col 20, \'Ember\' is not defined.\nadapters/email.js: line 18, col 13, \'Ember\' is not defined.\nadapters/email.js: line 24, col 17, \'Ember\' is not defined.\nadapters/email.js: line 27, col 17, \'Ember\' is not defined.\nadapters/email.js: line 34, col 27, \'$ISIS\' is not defined.\nadapters/email.js: line 34, col 13, \'user_cookie\' is defined but never used.\n\n7 errors'); 
  });

});
define('xtalus/tests/adapters/isis.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/isis.js should pass jshint', function() { 
    ok(false, 'adapters/isis.js should pass jshint.\nadapters/isis.js: line 3, col 5, \'adapterSettings\' is defined but never used.\n\n1 error'); 
  });

});
define('xtalus/tests/adapters/person.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/person.js should pass jshint', function() { 
    ok(false, 'adapters/person.js should pass jshint.\nadapters/person.js: line 11, col 27, \'$ISIS\' is not defined.\nadapters/person.js: line 13, col 30, \'$ISIS\' is not defined.\nadapters/person.js: line 3, col 5, \'adapterSettings\' is defined but never used.\nadapters/person.js: line 11, col 13, \'user_cookie\' is defined but never used.\n\n4 errors'); 
  });

});
define('xtalus/tests/adapters/supplyprofile.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/supplyprofile.js should pass jshint', function() { 
    ok(false, 'adapters/supplyprofile.js should pass jshint.\nadapters/supplyprofile.js: line 11, col 27, \'$ISIS\' is not defined.\nadapters/supplyprofile.js: line 13, col 30, \'$ISIS\' is not defined.\nadapters/supplyprofile.js: line 3, col 5, \'adapterSettings\' is defined but never used.\nadapters/supplyprofile.js: line 11, col 13, \'user_cookie\' is defined but never used.\n\n4 errors'); 
  });

});
define('xtalus/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(false, 'app.js should pass jshint.\napp.js: line 10, col 31, Missing semicolon.\n\n1 error'); 
  });

});
define('xtalus/tests/components/matching-widget.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/matching-widget.js should pass jshint', function() { 
    ok(false, 'components/matching-widget.js should pass jshint.\ncomponents/matching-widget.js: line 19, col 58, Missing semicolon.\ncomponents/matching-widget.js: line 23, col 49, Missing semicolon.\ncomponents/matching-widget.js: line 27, col 45, Missing semicolon.\ncomponents/matching-widget.js: line 31, col 72, Missing semicolon.\ncomponents/matching-widget.js: line 34, col 31, Missing semicolon.\ncomponents/matching-widget.js: line 36, col 75, Missing semicolon.\ncomponents/matching-widget.js: line 37, col 71, Missing semicolon.\ncomponents/matching-widget.js: line 38, col 85, Missing semicolon.\ncomponents/matching-widget.js: line 56, col 25, Missing semicolon.\ncomponents/matching-widget.js: line 68, col 53, Missing semicolon.\ncomponents/matching-widget.js: line 69, col 73, Missing semicolon.\ncomponents/matching-widget.js: line 74, col 52, Missing semicolon.\ncomponents/matching-widget.js: line 75, col 61, Missing semicolon.\ncomponents/matching-widget.js: line 79, col 59, Missing semicolon.\ncomponents/matching-widget.js: line 80, col 68, Missing semicolon.\ncomponents/matching-widget.js: line 85, col 15, Missing semicolon.\ncomponents/matching-widget.js: line 115, col 128, Missing semicolon.\ncomponents/matching-widget.js: line 137, col 187, Missing semicolon.\ncomponents/matching-widget.js: line 151, col 110, Missing semicolon.\ncomponents/matching-widget.js: line 46, col 17, \'$\' is not defined.\ncomponents/matching-widget.js: line 2, col 8, \'DS\' is defined but never used.\ncomponents/matching-widget.js: line 18, col 32, \'e\' is defined but never used.\ncomponents/matching-widget.js: line 22, col 33, \'e\' is defined but never used.\ncomponents/matching-widget.js: line 26, col 29, \'e\' is defined but never used.\n\n24 errors'); 
  });

});
define('xtalus/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 9, col 43, Expected \'===\' and instead saw \'==\'.\ncontrollers/application.js: line 17, col 17, Expected \'{\' and instead saw \'result\'.\ncontrollers/application.js: line 19, col 53, Missing semicolon.\ncontrollers/application.js: line 26, col 50, Missing semicolon.\ncontrollers/application.js: line 35, col 102, Missing semicolon.\n\n5 errors'); 
  });

});
define('xtalus/tests/controllers/login.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/login.js should pass jshint', function() { 
    ok(true, 'controllers/login.js should pass jshint.'); 
  });

});
define('xtalus/tests/controllers/me.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/me.js should pass jshint', function() {
    ok(false, 'controllers/me.js should pass jshint.\ncontrollers/me.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });

});
define('xtalus/tests/controllers/me/connections.jshint', function () {

  'use strict';

  module('JSHint - controllers/me');
  test('controllers/me/connections.js should pass jshint', function() { 
    ok(true, 'controllers/me/connections.js should pass jshint.'); 
  });

});
define('xtalus/tests/controllers/me/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/me');
  test('controllers/me/index.js should pass jshint', function() { 
    ok(false, 'controllers/me/index.js should pass jshint.\ncontrollers/me/index.js: line 7, col 56, Missing semicolon.\ncontrollers/me/index.js: line 16, col 59, Missing semicolon.\ncontrollers/me/index.js: line 15, col 34, \'result\' is defined but never used.\n\n3 errors'); 
  });

});
define('xtalus/tests/controllers/me/projects.jshint', function () {

  'use strict';

  module('JSHint - controllers/me');
  test('controllers/me/projects.js should pass jshint', function() { 
    ok(false, 'controllers/me/projects.js should pass jshint.\ncontrollers/me/projects.js: line 37, col 15, Missing semicolon.\ncontrollers/me/projects.js: line 12, col 13, \'$\' is not defined.\ncontrollers/me/projects.js: line 17, col 13, \'$\' is not defined.\ncontrollers/me/projects.js: line 23, col 17, \'store\' is defined but never used.\ncontrollers/me/projects.js: line 2, col 1, \'$ISIS\' is defined but never used.\n\n5 errors'); 
  });

});
define('xtalus/tests/controllers/profile.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/profile.js should pass jshint', function() {
    ok(false, 'controllers/profile.js should pass jshint.\ncontrollers/profile.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });

});
define('xtalus/tests/controllers/profile/connections.jshint', function () {

  'use strict';

  module('JSHint - controllers/profile');
  test('controllers/profile/connections.js should pass jshint', function() { 
    ok(true, 'controllers/profile/connections.js should pass jshint.'); 
  });

});
define('xtalus/tests/controllers/profile/projects.jshint', function () {

  'use strict';

  module('JSHint - controllers/profile');
  test('controllers/profile/projects.js should pass jshint', function() { 
    ok(false, 'controllers/profile/projects.js should pass jshint.\ncontrollers/profile/projects.js: line 9, col 13, \'$\' is not defined.\ncontrollers/profile/projects.js: line 14, col 13, \'$\' is not defined.\ncontrollers/profile/projects.js: line 3, col 1, \'$ISIS\' is defined but never used.\n\n3 errors'); 
  });

});
define('xtalus/tests/controllers/project.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/project.js should pass jshint', function() {
    ok(false, 'controllers/project.js should pass jshint.\ncontrollers/project.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });

});
define('xtalus/tests/controllers/project/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/project');
  test('controllers/project/index.js should pass jshint', function() { 
    ok(false, 'controllers/project/index.js should pass jshint.\ncontrollers/project/index.js: line 17, col 38, Missing semicolon.\ncontrollers/project/index.js: line 18, col 78, Missing semicolon.\ncontrollers/project/index.js: line 23, col 56, Missing semicolon.\ncontrollers/project/index.js: line 27, col 49, Missing semicolon.\ncontrollers/project/index.js: line 39, col 23, Missing semicolon.\ncontrollers/project/index.js: line 41, col 19, Missing semicolon.\ncontrollers/project/index.js: line 23, col 17, \'app\' is defined but never used.\ncontrollers/project/index.js: line 2, col 1, \'$\' is defined but never used.\n\n8 errors'); 
  });

});
define('xtalus/tests/controllers/project/matching.jshint', function () {

  'use strict';

  module('JSHint - controllers/project');
  test('controllers/project/matching.js should pass jshint', function() { 
    ok(false, 'controllers/project/matching.js should pass jshint.\ncontrollers/project/matching.js: line 15, col 43, Missing semicolon.\ncontrollers/project/matching.js: line 36, col 41, Missing semicolon.\ncontrollers/project/matching.js: line 45, col 51, Missing semicolon.\ncontrollers/project/matching.js: line 46, col 19, Missing semicolon.\ncontrollers/project/matching.js: line 47, col 15, Missing semicolon.\ncontrollers/project/matching.js: line 51, col 42, Missing semicolon.\ncontrollers/project/matching.js: line 58, col 42, Missing semicolon.\ncontrollers/project/matching.js: line 59, col 79, Missing semicolon.\ncontrollers/project/matching.js: line 70, col 26, Missing semicolon.\ncontrollers/project/matching.js: line 74, col 25, \'profile\' is already defined.\ncontrollers/project/matching.js: line 93, col 35, Missing semicolon.\ncontrollers/project/matching.js: line 97, col 75, Missing semicolon.\ncontrollers/project/matching.js: line 137, col 50, Missing semicolon.\ncontrollers/project/matching.js: line 141, col 68, Missing semicolon.\ncontrollers/project/matching.js: line 144, col 15, Missing semicolon.\ncontrollers/project/matching.js: line 147, col 47, Missing semicolon.\ncontrollers/project/matching.js: line 155, col 28, Expected \'{\' and instead saw \'Ember\'.\ncontrollers/project/matching.js: line 18, col 94, \'result\' is defined but never used.\ncontrollers/project/matching.js: line 28, col 85, \'result\' is defined but never used.\ncontrollers/project/matching.js: line 42, col 74, \'result\' is defined but never used.\ncontrollers/project/matching.js: line 50, col 31, \'element\' is defined but never used.\ncontrollers/project/matching.js: line 57, col 31, \'element\' is defined but never used.\ncontrollers/project/matching.js: line 67, col 17, \'profile\' is defined but never used.\ncontrollers/project/matching.js: line 77, col 91, \'data\' is defined but never used.\ncontrollers/project/matching.js: line 80, col 29, \'a_promises\' is defined but never used.\ncontrollers/project/matching.js: line 112, col 17, \'profile\' is defined but never used.\ncontrollers/project/matching.js: line 114, col 17, \'demand\' is defined but never used.\ncontrollers/project/matching.js: line 146, col 61, \'widgets\' is defined but never used.\n\n28 errors'); 
  });

});
define('xtalus/tests/controllers/registration.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/registration.js should pass jshint', function() { 
    ok(false, 'controllers/registration.js should pass jshint.\ncontrollers/registration.js: line 37, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 41, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 45, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 49, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 53, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 57, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 61, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 65, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 69, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 73, col 29, Expected \'{\' and instead saw \'errors\'.\ncontrollers/registration.js: line 77, col 29, Expected \'{\' and instead saw \'errors\'.\n\n11 errors'); 
  });

});
define('xtalus/tests/helpers/resolver', ['exports', 'ember/resolver', 'xtalus/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('xtalus/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('xtalus/tests/helpers/start-app', ['exports', 'ember', 'xtalus/app', 'xtalus/router', 'xtalus/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('xtalus/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('xtalus/tests/mixins/validator.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/validator.js should pass jshint', function() { 
    ok(false, 'mixins/validator.js should pass jshint.\nmixins/validator.js: line 5, col 19, \'value\' is already defined.\nmixins/validator.js: line 8, col 36, Missing semicolon.\nmixins/validator.js: line 9, col 27, Expected \'{\' and instead saw \'error\'.\nmixins/validator.js: line 15, col 20, \'value1\' is already defined.\nmixins/validator.js: line 16, col 20, \'value2\' is already defined.\nmixins/validator.js: line 20, col 37, Missing semicolon.\nmixins/validator.js: line 21, col 32, Expected \'{\' and instead saw \'error\'.\nmixins/validator.js: line 27, col 19, \'value\' is already defined.\nmixins/validator.js: line 31, col 21, Expected \'===\' and instead saw \'==\'.\nmixins/validator.js: line 35, col 40, Expected \'===\' and instead saw \'==\'.\nmixins/validator.js: line 35, col 20, Confusing use of \'!\'.\nmixins/validator.js: line 43, col 19, \'value\' is already defined.\nmixins/validator.js: line 47, col 27, Unexpected escaped character \'<\' in regular expression.\nmixins/validator.js: line 49, col 21, Expected \'===\' and instead saw \'==\'.\nmixins/validator.js: line 61, col 19, \'value\' is already defined.\nmixins/validator.js: line 66, col 21, Expected \'===\' and instead saw \'==\'.\n\n16 errors'); 
  });

});
define('xtalus/tests/models/demand.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/demand.js should pass jshint', function() { 
    ok(false, 'models/demand.js should pass jshint.\nmodels/demand.js: line 21, col 10, Missing semicolon.\nmodels/demand.js: line 41, col 15, Missing semicolon.\nmodels/demand.js: line 42, col 11, Missing semicolon.\nmodels/demand.js: line 58, col 28, Expected \'{\' and instead saw \'Ember\'.\nmodels/demand.js: line 30, col 9, \'$\' is not defined.\nmodels/demand.js: line 31, col 13, \'$\' is not defined.\nmodels/demand.js: line 34, col 21, \'$ISIS\' is not defined.\nmodels/demand.js: line 37, col 25, \'Ember\' is not defined.\nmodels/demand.js: line 47, col 16, \'$ISIS\' is not defined.\nmodels/demand.js: line 49, col 25, \'$ISIS\' is not defined.\nmodels/demand.js: line 50, col 21, \'$ISIS\' is not defined.\nmodels/demand.js: line 56, col 9, \'$ISIS\' is not defined.\nmodels/demand.js: line 58, col 28, \'Ember\' is not defined.\nmodels/demand.js: line 59, col 13, \'Ember\' is not defined.\n\n14 errors'); 
  });

});
define('xtalus/tests/models/demandprofile.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/demandprofile.js should pass jshint', function() { 
    ok(false, 'models/demandprofile.js should pass jshint.\nmodels/demandprofile.js: line 36, col 50, Missing semicolon.\nmodels/demandprofile.js: line 43, col 28, Expected \'{\' and instead saw \'a_promises\'.\nmodels/demandprofile.js: line 43, col 114, Missing semicolon.\nmodels/demandprofile.js: line 44, col 19, Missing semicolon.\nmodels/demandprofile.js: line 50, col 19, Missing semicolon.\nmodels/demandprofile.js: line 52, col 74, Missing semicolon.\nmodels/demandprofile.js: line 55, col 71, Missing semicolon.\nmodels/demandprofile.js: line 58, col 63, Expected \'===\' and instead saw \'==\'.\nmodels/demandprofile.js: line 60, col 50, Missing semicolon.\nmodels/demandprofile.js: line 64, col 23, Missing semicolon.\nmodels/demandprofile.js: line 67, col 46, Missing semicolon.\nmodels/demandprofile.js: line 71, col 37, Missing semicolon.\nmodels/demandprofile.js: line 113, col 32, Expected \'{\' and instead saw \'Ember\'.\nmodels/demandprofile.js: line 16, col 16, \'Ember\' is not defined.\nmodels/demandprofile.js: line 27, col 13, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 42, col 9, \'$\' is not defined.\nmodels/demandprofile.js: line 43, col 44, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 47, col 13, \'Ember\' is not defined.\nmodels/demandprofile.js: line 54, col 17, \'$\' is not defined.\nmodels/demandprofile.js: line 56, col 21, \'$\' is not defined.\nmodels/demandprofile.js: line 83, col 31, \'Ember\' is not defined.\nmodels/demandprofile.js: line 89, col 9, \'$\' is not defined.\nmodels/demandprofile.js: line 90, col 13, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 102, col 16, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 104, col 21, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 111, col 13, \'$ISIS\' is not defined.\nmodels/demandprofile.js: line 113, col 32, \'Ember\' is not defined.\nmodels/demandprofile.js: line 114, col 17, \'Ember\' is not defined.\n\n28 errors'); 
  });

});
define('xtalus/tests/models/email.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/email.js should pass jshint', function() { 
    ok(true, 'models/email.js should pass jshint.'); 
  });

});
define('xtalus/tests/models/image.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/image.js should pass jshint', function() { 
    ok(true, 'models/image.js should pass jshint.'); 
  });

});
define('xtalus/tests/models/isis.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/isis.js should pass jshint', function() { 
    ok(true, 'models/isis.js should pass jshint.'); 
  });

});
define('xtalus/tests/models/person.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/person.js should pass jshint', function() { 
    ok(false, 'models/person.js should pass jshint.\nmodels/person.js: line 29, col 26, Missing semicolon.\nmodels/person.js: line 33, col 23, Expected \'{\' and instead saw \'fullname\'.\nmodels/person.js: line 34, col 24, Expected \'{\' and instead saw \'fullname\'.\nmodels/person.js: line 35, col 22, Expected \'{\' and instead saw \'fullname\'.\nmodels/person.js: line 35, col 48, Missing semicolon.\nmodels/person.js: line 36, col 24, Missing semicolon.\nmodels/person.js: line 41, col 23, Expected \'{\' and instead saw \'return\'.\nmodels/person.js: line 41, col 99, Missing semicolon.\nmodels/person.js: line 47, col 55, Missing semicolon.\nmodels/person.js: line 48, col 38, Missing semicolon.\nmodels/person.js: line 51, col 36, Missing semicolon.\nmodels/person.js: line 53, col 27, Expected \'{\' and instead saw \'picture\'.\nmodels/person.js: line 53, col 94, Missing semicolon.\nmodels/person.js: line 24, col 17, \'moment\' is not defined.\nmodels/person.js: line 41, col 66, \'md5\' is not defined.\nmodels/person.js: line 50, col 9, \'$\' is not defined.\nmodels/person.js: line 53, col 73, \'md5\' is not defined.\nmodels/person.js: line 67, col 16, \'$ISIS\' is not defined.\nmodels/person.js: line 69, col 21, \'$ISIS\' is not defined.\nmodels/person.js: line 23, col 24, \'e\' is defined but never used.\nmodels/person.js: line 28, col 24, \'e\' is defined but never used.\nmodels/person.js: line 48, col 13, \'email\' is defined but never used.\n\n22 errors'); 
  });

});
define('xtalus/tests/models/supplyprofile.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/supplyprofile.js should pass jshint', function() { 
    ok(true, 'models/supplyprofile.js should pass jshint.'); 
  });

});
define('xtalus/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(false, 'router.js should pass jshint.\nrouter.js: line 32, col 31, Missing semicolon.\nrouter.js: line 33, col 7, Missing semicolon.\n\n2 errors'); 
  });

});
define('xtalus/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 21, col 58, Missing semicolon.\nroutes/application.js: line 29, col 46, Missing semicolon.\nroutes/application.js: line 51, col 56, Missing semicolon.\nroutes/application.js: line 54, col 55, Missing semicolon.\nroutes/application.js: line 83, col 31, Missing semicolon.\nroutes/application.js: line 86, col 83, Missing semicolon.\nroutes/application.js: line 89, col 19, Missing semicolon.\nroutes/application.js: line 90, col 15, Missing semicolon.\nroutes/application.js: line 51, col 17, \'$\' is not defined.\nroutes/application.js: line 54, col 13, \'$\' is not defined.\nroutes/application.js: line 2, col 8, \'DS\' is defined but never used.\nroutes/application.js: line 48, col 46, \'type\' is defined but never used.\n\n12 errors'); 
  });

});
define('xtalus/tests/routes/auth.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/auth.js should pass jshint', function() { 
    ok(false, 'routes/auth.js should pass jshint.\nroutes/auth.js: line 13, col 89, Missing semicolon.\nroutes/auth.js: line 14, col 39, Missing semicolon.\n\n2 errors'); 
  });

});
define('xtalus/tests/routes/login.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/login.js should pass jshint', function() { 
    ok(true, 'routes/login.js should pass jshint.'); 
  });

});
define('xtalus/tests/routes/me.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/me.js should pass jshint', function() {
    ok(false, 'routes/me.js should pass jshint.\nroutes/me.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });

});
define('xtalus/tests/routes/me/connections.jshint', function () {

  'use strict';

  module('JSHint - routes/me');
  test('routes/me/connections.js should pass jshint', function() { 
    ok(false, 'routes/me/connections.js should pass jshint.\nroutes/me/connections.js: line 2, col 1, \'$\' is defined but never used.\nroutes/me/connections.js: line 3, col 1, \'$ISIS\' is defined but never used.\n\n2 errors'); 
  });

});
define('xtalus/tests/routes/me/index.jshint', function () {

  'use strict';

  module('JSHint - routes/me');
  test('routes/me/index.js should pass jshint', function() { 
    ok(false, 'routes/me/index.js should pass jshint.\nroutes/me/index.js: line 2, col 1, \'$\' is defined but never used.\n\n1 error'); 
  });

});
define('xtalus/tests/routes/me/projects.jshint', function () {

  'use strict';

  module('JSHint - routes/me');
  test('routes/me/projects.js should pass jshint', function() { 
    ok(true, 'routes/me/projects.js should pass jshint.'); 
  });

});
define('xtalus/tests/routes/profile.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/profile.js should pass jshint', function() {
    ok(false, 'routes/profile.js should pass jshint.\nroutes/profile.js: line 8, col 57, Missing semicolon.\nroutes/profile.js: line 1, col 8, \'Ember\' is defined but never used.\nroutes/profile.js: line 3, col 1, \'$ISIS\' is defined but never used.\n\n3 errors');
  });

});
define('xtalus/tests/routes/profile/connections.jshint', function () {

  'use strict';

  module('JSHint - routes/profile');
  test('routes/profile/connections.js should pass jshint', function() { 
    ok(false, 'routes/profile/connections.js should pass jshint.\nroutes/profile/connections.js: line 2, col 1, \'$ISIS\' is defined but never used.\nroutes/profile/connections.js: line 3, col 1, \'$\' is defined but never used.\n\n2 errors'); 
  });

});
define('xtalus/tests/routes/profile/index.jshint', function () {

  'use strict';

  module('JSHint - routes/profile');
  test('routes/profile/index.js should pass jshint', function() { 
    ok(false, 'routes/profile/index.js should pass jshint.\nroutes/profile/index.js: line 2, col 1, \'$\' is defined but never used.\n\n1 error'); 
  });

});
define('xtalus/tests/routes/profile/projects.jshint', function () {

  'use strict';

  module('JSHint - routes/profile');
  test('routes/profile/projects.js should pass jshint', function() { 
    ok(true, 'routes/profile/projects.js should pass jshint.'); 
  });

});
define('xtalus/tests/routes/project.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/project.js should pass jshint', function() {
    ok(false, 'routes/project.js should pass jshint.\nroutes/project.js: line 1, col 8, \'Ember\' is defined but never used.\nroutes/project.js: line 3, col 1, \'$ISIS\' is defined but never used.\n\n2 errors');
  });

});
define('xtalus/tests/routes/project/index.jshint', function () {

  'use strict';

  module('JSHint - routes/project');
  test('routes/project/index.js should pass jshint', function() { 
    ok(false, 'routes/project/index.js should pass jshint.\nroutes/project/index.js: line 25, col 19, Missing semicolon.\nroutes/project/index.js: line 12, col 17, \'store\' is defined but never used.\nroutes/project/index.js: line 2, col 1, \'$\' is defined but never used.\n\n3 errors'); 
  });

});
define('xtalus/tests/routes/project/matching.jshint', function () {

  'use strict';

  module('JSHint - routes/project');
  test('routes/project/matching.js should pass jshint', function() { 
    ok(false, 'routes/project/matching.js should pass jshint.\nroutes/project/matching.js: line 13, col 13, Expected \'{\' and instead saw \'controller\'.\nroutes/project/matching.js: line 2, col 1, \'$\' is defined but never used.\n\n2 errors'); 
  });

});
define('xtalus/tests/routes/registration.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/registration.js should pass jshint', function() { 
    ok(false, 'routes/registration.js should pass jshint.\nroutes/registration.js: line 34, col 14, Missing semicolon.\nroutes/registration.js: line 41, col 37, Expected \'===\' and instead saw \'==\'.\nroutes/registration.js: line 67, col 54, Missing semicolon.\nroutes/registration.js: line 74, col 30, Missing semicolon.\nroutes/registration.js: line 78, col 58, Missing semicolon.\nroutes/registration.js: line 83, col 39, Missing semicolon.\nroutes/registration.js: line 84, col 35, Missing semicolon.\nroutes/registration.js: line 93, col 39, Missing semicolon.\nroutes/registration.js: line 94, col 35, Missing semicolon.\nroutes/registration.js: line 103, col 39, Missing semicolon.\nroutes/registration.js: line 104, col 35, Missing semicolon.\nroutes/registration.js: line 37, col 13, \'$ISIS\' is not defined.\nroutes/registration.js: line 38, col 13, \'$ISIS\' is not defined.\nroutes/registration.js: line 63, col 21, \'$ISIS\' is not defined.\nroutes/registration.js: line 64, col 25, \'$ISIS\' is not defined.\nroutes/registration.js: line 5, col 29, \'transition\' is defined but never used.\nroutes/registration.js: line 5, col 21, \'params\' is defined but never used.\nroutes/registration.js: line 9, col 43, \'model\' is defined but never used.\nroutes/registration.js: line 9, col 31, \'controller\' is defined but never used.\nroutes/registration.js: line 16, col 38, \'e\' is defined but never used.\nroutes/registration.js: line 63, col 90, \'data\' is defined but never used.\nroutes/registration.js: line 80, col 45, \'isis\' is defined but never used.\nroutes/registration.js: line 90, col 45, \'isis\' is defined but never used.\nroutes/registration.js: line 100, col 45, \'isis\' is defined but never used.\n\n24 errors'); 
  });

});
define('xtalus/tests/test-helper', ['xtalus/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('xtalus/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/application.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/application.js should pass jshint', function() { 
    ok(true, 'views/application.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/login.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/login.js should pass jshint', function() { 
    ok(true, 'views/login.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/me.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/me.js should pass jshint', function() {
    ok(true, 'views/me.js should pass jshint.');
  });

});
define('xtalus/tests/views/me/connections.jshint', function () {

  'use strict';

  module('JSHint - views/me');
  test('views/me/connections.js should pass jshint', function() { 
    ok(true, 'views/me/connections.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/me/courses.jshint', function () {

  'use strict';

  module('JSHint - views/me');
  test('views/me/courses.js should pass jshint', function() { 
    ok(true, 'views/me/courses.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/me/index.jshint', function () {

  'use strict';

  module('JSHint - views/me');
  test('views/me/index.js should pass jshint', function() { 
    ok(true, 'views/me/index.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/me/projects.jshint', function () {

  'use strict';

  module('JSHint - views/me');
  test('views/me/projects.js should pass jshint', function() { 
    ok(true, 'views/me/projects.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/me/references.jshint', function () {

  'use strict';

  module('JSHint - views/me');
  test('views/me/references.js should pass jshint', function() { 
    ok(true, 'views/me/references.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/profile.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/profile.js should pass jshint', function() {
    ok(true, 'views/profile.js should pass jshint.');
  });

});
define('xtalus/tests/views/profile/connections.jshint', function () {

  'use strict';

  module('JSHint - views/profile');
  test('views/profile/connections.js should pass jshint', function() { 
    ok(true, 'views/profile/connections.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/profile/index.jshint', function () {

  'use strict';

  module('JSHint - views/profile');
  test('views/profile/index.js should pass jshint', function() { 
    ok(true, 'views/profile/index.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/profile/projects.jshint', function () {

  'use strict';

  module('JSHint - views/profile');
  test('views/profile/projects.js should pass jshint', function() { 
    ok(true, 'views/profile/projects.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/project.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/project.js should pass jshint', function() {
    ok(true, 'views/project.js should pass jshint.');
  });

});
define('xtalus/tests/views/project/index.jshint', function () {

  'use strict';

  module('JSHint - views/project');
  test('views/project/index.js should pass jshint', function() { 
    ok(true, 'views/project/index.js should pass jshint.'); 
  });

});
define('xtalus/tests/views/project/matching.jshint', function () {

  'use strict';

  module('JSHint - views/project');
  test('views/project/matching.js should pass jshint', function() { 
    ok(true, 'views/project/matching.js should pass jshint.'); 
  });

});
define('xtalus/views/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var UserView = Ember['default'].View.extend({
        tagName: 'section',
        elementId: ''

    });

    exports['default'] = UserView;

});
define('xtalus/views/ivy-sortable', ['exports', 'ivy-sortable/views/ivy-sortable'], function (exports, ivy_sortable) {

	'use strict';



	exports['default'] = ivy_sortable['default'];

});
define('xtalus/views/login', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var UserView = Ember['default'].View.extend({
        layoutName: 'login',
        tagName: 'section',
        elementId: ''

    });

    exports['default'] = UserView;

});
define('xtalus/views/me', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var UserView = Ember['default'].View.extend({
        layoutName: 'layout/main',
        templateName: 'me',
        tagName: 'section',
        elementId: ''

    });

    exports['default'] = UserView;

});
define('xtalus/views/me/connections', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['connections']
	});

	exports['default'] = UserView;

});
define('xtalus/views/me/courses', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['courses']
	});

	exports['default'] = UserView;

});
define('xtalus/views/me/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['profile', 'aside-left']
	});

	exports['default'] = UserView;

});
define('xtalus/views/me/projects', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['projects']
	});

	exports['default'] = UserView;

});
define('xtalus/views/me/references', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['references', 'page-left']
	});

	exports['default'] = UserView;

});
define('xtalus/views/profile', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileView = Ember['default'].View.extend({
        layoutName: 'layout/main',
        templateName: 'profile',
        tagName: 'section',
        elementId: ''
    });

    exports['default'] = ProfileView;

});
define('xtalus/views/profile/connections', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileConnectionsView = Ember['default'].View.extend({
        tagName: 'section',
        elementId: 'page',
        classNames: ['connections']
    });

    exports['default'] = ProfileConnectionsView;

});
define('xtalus/views/profile/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileIndexView = Ember['default'].View.extend({
        tagName: 'section',
        elementId: 'page',
        classNames: ['profile', 'aside-left']
    });

    exports['default'] = ProfileIndexView;

});
define('xtalus/views/profile/projects', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProfileProjectsView = Ember['default'].View.extend({
        tagName: 'section',
        elementId: 'page',
        classNames: ['projects']
    });

    exports['default'] = ProfileProjectsView;

});
define('xtalus/views/project', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ProjectView = Ember['default'].View.extend({
        layoutName: 'layout/main'
    });

    exports['default'] = ProjectView;

});
define('xtalus/views/project/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var UserView = Ember['default'].View.extend({
		tagName: 'section',
		elementId: 'page',
		classNames: ['project', 'aside-left']
	});

	exports['default'] = UserView;

});
define('xtalus/views/project/matching', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var UserView = Ember['default'].View.extend({
        tagName: 'section',
        elementId: 'page',
        classNames: ['project-matching', 'aside-left']
    });

    exports['default'] = UserView;

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('xtalus/config/environment', ['ember'], function(Ember) {
  var prefix = 'xtalus';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("xtalus/tests/test-helper");
} else {
  require("xtalus/app")["default"].create({"API_HOST":"http://localhost:8000/api","name":"xtalus","version":"0.0.0.ffcb841a"});
}

/* jshint ignore:end */
//# sourceMappingURL=xtalus.map

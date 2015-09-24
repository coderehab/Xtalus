import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
    tagName:'section',
    classNames: 'matching-widget sortable',
    currentValue: '',
    placeholder:'test',

    classNameBindings: ['collapsed'],
    collapsed: true,
    isNew:true,

    data: {},
    params: {},

    actions: {
        toggleStatus: function(e) {
            this.set('collapsed', !this.get('collapsed'))
        },

        previousValue: function(e) {
            this.set('currentValue', 'previous')
        },

        nextValue: function(e) {
            this.set('currentValue', 'next')
        },

        saveWidget:function() {
            var params = JSON.parse(JSON.stringify(this.get('params')))
            delete params._subControllers;

            params.weight = 10

            if(this.get('isPostal')){ params.postcode = this.data.postcode }
            if(this.get('isAge')){ params.age = this.data.numericValue }
            if(this.get('isHourlyRate')){ params.hourlyRate = this.data.numericValue }

            if(this.get('isTimePeriod')){
                params.startDate = this.data.startDate;
                params.endDate = this.data.endDate;
            }

            if(this.get('isRole')){
                $.each(this.get('role_chkbox.values'), function(i, obj){
                    params[obj.name] = obj.value;
                });
            }

            if(this.get('isEducation')){
                params.dropDownValue = this.data.studyValue.value;
            }

            this.sendAction('onsave', this.get('data'), params);
            return false
        },

        updateWidget:function() {
            var _this = this;
            var params = {};
            params.weight = this.data.weight;

            var promise;

            //not working!
            if(this.get('isPostal')){
                params.postcode = this.data.postcode
                promise = this.data.updateLocation.invoke(params, false)
            }

            //works
            if(this.get('isAge')){
                params.age = this.data.numericValue
                promise = this.data.updateAge.invoke(params)
            }

            if(this.get('isHourlyRate')){
                params.hourlyRate = this.data.numericValue
                promise = this.data.updateHourlyRate.invoke(params)
            }

            promise.then(function(){
                _this.sendAction('onupdate', _this.get('data'));
            })
        },

        removeWidget:function(){
            var _this = this;

            this.data.deleteProfileElement.invoke({confirmDelete:true}).then(function(){
                _this.sendAction('onremove', _this.get('data'));
            });
        },
    },

    isPostal: function() {
        return this.get('data.description') === 'LOCATION_ELEMENT';
    }.property('data.description'),

    isAge: function() {
        return this.get('data.description') === 'AGE_ELEMENT';
    }.property('data.description'),

    //doing
    isHourlyRate: function() {
        return this.get('data.description') === 'HOURLY_RATE_ELEMENT';
    }.property('data.description'),

    //TODO!!!!

    isRole: function() {
        if (this.get('data.description') === 'REQUIRED_ROLE_ELEMENT'){
            this.data.roleValues = [];
            this.data.roles = [{name:'student', value:true}, {name:'principal', value:true}, {name:'professional', value:true}]
            return true;
        }

        return false;
    }.property('data.description'),

    isPassion: function() {
        return this.get('data.description') === 'PASSION_TAGS_ELEMENT';
    }.property('data.description'),

    isBranch: function() {
        return this.get('data.description') === 'BRANCHE_TAGS_ELEMENT';
    }.property('data.description'),

    isQuality: function() {
        return this.get('data.description') === 'QUALITY_TAGS_ELEMENT';
    }.property('data.description'),

    isWeekdays: function() {
        if (this.get('data.description') === 'WEEKDAY_TAGS_ELEMENT'){
            this.data.weekdaysValues = [];
            this.data.weekdays = [{name:'maandag', value:true}, {name:'dinsdag', value:true}, {name:'woensdag', value:true}, {name:'donderdag', value:true}, {name:'vrijdag', value:true}]
            return true;
        }

        return false;
    }.property('data.description'),

    isTimePeriod: function() {
        return (this.get('data.description') === 'TIME_PERIOD_ELEMENT');
    }.property('data.description'),

    isEducation: function() {
        if (this.get('data.description') === 'EDUCATION_LEVEL'){
            this.role_chkbox = {values:[]};
            this.data.study = [{name:'MBO', value:"mbo"}, {name:'HBO', value:"hbo"}, {name:'WO', value:"wo"}]

            return true;
        }
        return false;
    }.property('data.description'),


});

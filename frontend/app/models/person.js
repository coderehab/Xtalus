import DS from 'ember-data';

export default DS.Model.extend({

    firstName: DS.attr(),
    middleName: DS.attr({defaultValue:''}),
    lastName: DS.attr(),
    imageUrl: DS.attr(), //mapping naar: profilePicture: DS.attr(),
    education: DS.attr({defaultValue: 'Kunst en techniek'}),
    institute: DS.attr({defaultValue: 'Saxion hogeschool'}),
    entity: DS.attr(), // ontbreekt nog
    roles: DS.attr(),
    honoursProgram: DS.attr({defaultValue: 'innovatie en media'}),
    interests: DS.attr({defaultValue:
    [{
        type : 'stage' ,
        dateFrom: '01-04-2015',
        dateTill: '30-05-2015',
        hoursWeekly: '15'
    },
    {
        type : 'relevante bijbaan' ,
        dateFrom: '20-10-2015',
        dateTill: '30-12-2015',
        hoursWeekly: '8',
    } ]
    }),
    city: DS.attr({defaultValue: 'Enschede'}), // mappen naar: city: DS.attr(),
    story: DS.attr(),
    qualities: DS.attr({defaultValue: [{
        name : 'Vingerverf' ,
    },
    {
        name : 'Action painting' ,
    },
    {
        name : 'Grafisch vormgeving' ,
    },

    {
        name : 'Out of the box thinking' ,
    }
    ]
    }),

    personalContacts: DS.hasMany("personalcontact"),
    profileMatches: DS.hasMany("profilematches"),
    // profileMatchesOwned: DS.hasMany("profilematches"),
    assessments: DS.hasMany("assessment"),
    communicationChannels: DS.hasMany("communicationchannel"),

    demands: DS.hasMany('demand'),
    supplies: DS.hasMany('supply'),

    companyName: DS.attr(),
    branche: DS.attr(),
    companyLocation: DS.attr(),
    companyDescription: DS.attr(),

	birthday: function(e){
		 return moment(this.get('birthDay')).format('DD-MM-YYYY');
	}.property('birthDay'),

    fullName: function(e) {
        var fullname = ''
        var firstname = this.get('firstName');
        var middlename = this.get('middleName');
        var lastname = this.get('lastName');
        if(firstname) fullname += firstname;
        if(middlename) fullname += ' ' + middlename;
        if(lastname) fullname += ' ' + lastname
        return fullname
    }.property('firstName', 'middleName', 'lastName'),

    profilePicture: function() {
        var picture = this.get('rawPicture') || false;
        if (!picture) return 'http://www.gravatar.com/avatar/' + md5(this.get('email')) + '?s=500'
        picture = picture.split(':');
        return 'data:image/png;base64,'+picture[2];
    }.property('rawPicture', 'email'),

    profileElements: function(){
        var elements;

        this.get('supplies').forEach(function(supply, i){
            supply.get('profiles').forEach(function(profile, i){
                elements = profile.get('elements');
            })
        })

        return elements;
    }.property('supplies'),


});

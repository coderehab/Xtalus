import DS from 'ember-data';

export default DS.Model.extend({

    firstName: DS.attr(),
    middleName: DS.attr({defaultValue:''}),
    lastName: DS.attr(),
    imageUrl: DS.attr(), //mapping naar: profilePicture: DS.attr(),
    education: DS.attr(), // ontbreekt nog
    institute: DS.attr(), // ontbreekt nog
    entity: DS.attr(), // ontbreekt nog
    roles: DS.attr(),
    honoursProgram: DS.attr(),
    interesses: DS.attr(),
    mainTown: DS.attr(), // mappen naar: city: DS.attr(),
    story: DS.attr(),
    qualities: DS.attr(),
    dateOfBirth: DS.attr(), // mappen naar: birthday: DS.attr(),

    personalContacts: DS.hasMany("personalcontact"),
    profileMatches: DS.hasMany("profilematches"),
    // profileMatchesOwned: DS.hasMany("profilematches"),
    assessments: DS.hasMany("assessment"),
    communicationChannels: DS.hasMany("communicationchannel"),

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


});

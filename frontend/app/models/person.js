import DS from 'ember-data';

export default DS.Model.extend({

    URI: DS.attr(),
    firstName: DS.attr(),
    middleName: DS.attr({defaultValue:''}),
    lastName: DS.attr(),
    birthDay: DS.attr(),
    email: DS.attr(),
	roles: DS.attr(),
	address: DS.attr(),
	postalCode: DS.attr(),
	town: DS.attr(),

    demands: DS.attr({defaultValue:[]}),
    supplies: DS.attr({defaultValue:[]}),
    personalContacts: DS.attr({defaultValue:[]}),
	assessments: DS.attr({defaultValue:[]}),

    newProjectParams: DS.attr(),

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

    connections:function(){
        var connections = this.get('personalContacts')
        var email = this.get('email')

        $.each(connections, function(i, connection){
            console.log(connection)
            var picture = connection.picture || false;
            if (!picture) picture = 'http://www.gravatar.com/avatar/' + md5(connection.email)
            else {
                picture = picture.split(':');
                picture = 'data:image/png;base64,'+picture[2];
            }

            connection.picture = picture;

        });

        return connections;
    }.property('personalContacts'),

    isisObj:function(){
        return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/'+this.get('URI')).then(function(isisObjData){

            return ($ISIS.extractMembers(isisObjData));

        });
    }.property('URI')
});

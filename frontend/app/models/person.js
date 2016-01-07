import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.Model.extend({
    company: DS.belongsTo('company'),
    firstName: DS.attr({defaultValue:'Voornaam'}),
    middleName: DS.attr({defaultValue:''}),
    lastName: DS.attr({defaultValue:'Achternaam'}),

    story: DS.attr({defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas rhoncus elit vitae suscipit sollicitudin. Aenean aliquam tincidunt ante in dapibus. Vivamus pretium nulla eget vulputate rhoncus. Praesent fringilla, eros et laoreet sodales, justo massa rhoncus elit, id dignissim libero dolor ut erat. Nam eget lacus eu ante vestibulum interdum non commodo turpis. Nullam ante quam, feugiat et orci molestie, iaculis euismod est. Nam a justo sodales, rhoncus lectus et, iaculis leo. Nam mollis, eros imperdiet pulvinar maximus, lorem turpis pretium risus, nec sodales leo elit at sapien. Nunc at fermentum turpis. Curabitur id erat commodo, rutrum dolor nec, hendrerit tellus. Quisque sodales lorem nec nisi consectetur, lobortis mollis eros convallis. Mauris urna lectus, ultrices in sem vel, rhoncus consectetur est. Praesent cursus, urna tincidunt aliquam lobortis, ipsum nisl ullamcorper massa, id semper odio justo nec ex. Donec ac lacinia massa. Donec dapibus, augue vitae egestas pellentesque, mauris quam auctor metus, et vulputate ligula est eget mi. Phasellus eu mi ultricies, placerat ex sit amet, laoreet mi.'}),

    picture: DS.attr({defaultValue:'http://www.deschaatssport.nl/uploads/content/387002_299835413370911_100000333633586_1036324_935047398_n.jpg'}),
    education: DS.attr({defaultValue: 'Kunst en techniek'}),
    institute: DS.attr({defaultValue: 'Saxion hogeschool'}),
    entity: DS.attr({defaultValue: "mkb'er" }),
    roles: DS.attr({defaultValue: 'opdrachtgever,opdrachtnemer'}),
    honoursProgram: DS.attr({defaultValue: 'innovatie en media'}),
    interests: DS.attr({defaultValue:
    [{
        name: 'stage' ,
        period:{
          from: '01-04-2015',
          to: '30-05-2015'
        },
        timeAvailable: '15'
    },
    {
        name : 'relevante bijbaan' ,
        period:{
          from: '20-10-2015',
          to: '30-12-2015'
        },
        timeAvailable: '8'
    }]
    }),
    city: DS.attr({defaultValue: 'Enschede'}), // mappen naar: city: DS.attr(),
    qualities: DS.attr({defaultValue: ['vingerverf','action painting','grafisch vormgeving','out of the box thinking']}),

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
		var picture = this.get('picture') || false;
		if (!picture)
			return 'http://www.gravatar.com/avatar/' + md5(this.get('email')) + '?s=500';

		return this.getImage(picture, 300 ,300);
	}.property('picture', 'email'),

	profileElements: function(){
		var elements;

		this.get('supplies').forEach(function(supply, i){
			supply.get('profiles').forEach(function(profile, i){
				elements = profile.get('elements');
			})
		})

		return elements;
	}.property('supplies'),

	getImage:function(imageName, width, height, cropStartX, cropStartY) {

		if(width && height && typeof(cropStartX) != "undefined" && typeof(cropStartY) != "undefined")
			return ENV.APP.API_PHP_HOST+'/images/cropped/' + cropStartX + "/"  + cropStartY + "/"   + height + "/"   + height + "/"  + imageName;

		if(width && height)
			return ENV.APP.API_PHP_HOST+'/images/' + width + "/"  + height + "/"  + imageName;

		return ENV.APP.API_PHP_HOST+'/images/' + imageName;
	},

});

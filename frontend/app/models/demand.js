import DS from 'ember-data';

export default DS.Model.extend({
	URI: DS.attr(),
	description: DS.attr(),
	story: DS.attr(),
	startDate: DS.attr(),
	endDate: DS.attr(),
	summary: DS.attr(),
	profiles: DS.attr(),
	owner:DS.belongsTo('person'),
    imageUrl:DS.attr(),


	updateParams: function(){

		return {
			demandDescription: this.get('description'),
			demandSummary: this.get('summary'),
			demandStory: this.get('story')
		}

	}.property('description','summary','story'),


	initChoosenProfileMatch: function(){
		var _this = this;
		var profiles = this.get('profiles');

		$.each(profiles, function(i, profile){
			$.each(profile.profileMatches, function(i, candidate){

				if(candidate.candidateStatus === "CHOSEN") {
					$ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + candidate.URI).then(function(person){
						person.fullName = person.supplyCandidate.title;
						_this.initMatchInfo(person);
						Ember.set(profile, 'match', person);
					});
					return;
				}
			})
		})

	}.observes('profiles'),

	isisObj:function(){
		return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/'+this.get('URI')).then(function(isisObjData){

			console.log($ISIS.extractMembers(isisObjData));
			return ($ISIS.extractMembers(isisObjData));

		});
	}.property('URI'),

	initMatchInfo: function(match){
		$ISIS.init(match.supplyCandidate.href).then(function(person){
			var picture = person.picture ? person.picture.split(':') : '';
			if(picture[2]) Ember.set(match, 'profilePicture', 'data:image/png;base64,'+picture[2]);
			Ember.set(match, 'roles', person.roles);
		});
	}
});

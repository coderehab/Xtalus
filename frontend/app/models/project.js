import DS from 'ember-data';

export default DS.Model.extend({
	description: DS.attr(),
	story: DS.attr(),
	startDate: DS.attr(),
	endDate: DS.attr(),
	summary: DS.attr(),
	profiles: DS.attr(),
	owner:DS.belongsTo('person'),
    imageUrl:DS.attr(),
});

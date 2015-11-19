import DS from 'ember-data';

export default DS.Model.extend({
	description: DS.attr(),
    startDate: DS.attr(),
	endDate: DS.attr(),
    imageUrl:DS.attr(),
	profiles: DS.attr(),
	owner:DS.belongsTo('person'),
});

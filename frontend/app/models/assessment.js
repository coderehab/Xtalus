import DS from 'ember-data';

export default DS.Model.extend({
	description: DS.attr(),
	feedback: DS.attr(),
	ownerFullName: DS.attr(),
	ownerImageUrl: DS.attr(),
    owner: DS.belongsTo("person")
});

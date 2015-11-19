import DS from 'ember-data';

export default DS.Model.extend({

    ownerFullName: DS.attr(),
    ownerImageUrl: DS.attr(),
    supplyCandidateFullName: DS.attr(),
    supplyCandidateImageUrl: DS.attr(),
    owner: DS.belongsTo("person")

});

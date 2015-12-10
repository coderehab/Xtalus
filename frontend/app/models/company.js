import DS from 'ember-data';

export default DS.Model.extend({

  person:       DS.belongsTo('person'),
  name:         DS.attr({defaultValue:'Code.rehab'}),
  branche:      DS.attr({defaultValue:'webdevelopment'}),
  description:  DS.attr({defaultValue:'We are a webdevelopment company...'}),
  location:     DS.attr({defaultValue:{
    city:   "Enschede",
    postal: "7521BE"
  }),

});

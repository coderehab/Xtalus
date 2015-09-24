import Ember from 'ember';
/* global $ */
/* global $ISIS */

var ProjectMatchingController = Ember.Controller.extend({
    newProfileParams: {},
    actions: {

        showCreateDemandProfileForm:function(){

        },

        createDemandProfile:function() {
            var _this = this;
            var demand = this.get('model')
            var name = this.get('newProfileParams.name');
            demand.get('isisObj').then(function(demandObj){
                demandObj.createPersonDemandProfile.invoke({profileName:name}).then(function(result){
                    _this.send('closePopup', 'new-demand-profile');
                    _this.get('model').reload();
                });
            });
        },

        deleteDemandProfile:function() {
            var _this = this;
            this.get('selectedProfile').get('isisObj').then(function(profileObj){
                profileObj.deleteProfile.invoke({confirmDelete:true}).then(function(result){
                    _this.set('selectedProfile', undefined);
                    _this.get('model').reload();
                });
            });
        },

        saveWidget:function(element, params){
            console.log(element, params)
            var profile = this.get('selectedProfile');
            var _this = this;

            profile.get('isisObj').then(function(isisProfile){
                //console.log(isisProfile, element.action);
                isisProfile[element.action].invoke(params).then(function(result){
                    profile.reload();

                    _this.send('calculateMatches')
                })
            })
        },

        updateWidget:function(element){
            console.log('widget updated')
            this.send('calculateMatches');
            //this.get('selectedProfile').reload();
            this.get('selectedProfile').reload();
        },

        removeWidget:function(element){
            console.log('widget removed')
            console.log(this.get('selectedProfile').get('hasDirtyAttributes'))
            //this.get('selectedProfile').get('profileElements').removeObject(element);
            this.get('selectedProfile').reload();

            this.send('calculateMatches');
        },

        selectMatchingProfile: function(id){
            var profile = this.store.find('demandprofile', id).then(function(profile){
                this.set('selectedProfile', profile);
                this.send('calculateMatches');
            }.bind(this))
        },

        calculateMatches: function(profile){
            var profile = profile || this.get('selectedProfile');
            var _this = this;
            profile.get('isisObj').then(function(profileObj){
                profileObj.updateSupplyProfileComparisons.invoke({}, false).then(function(data){

                    profileObj.collectSupplyProfileComparisons.getValues().then(function(matches) {
                        var a_promises = [];
                        var filteredMatches = Ember.ArrayController.create({
                            model: [],
                            sortProperties: ['calculatedMatchingValue'],
                            sortAscending: false
                        });

                        $.each(matches, function(i, match){
                            if(match) {
                                match.collect().then(function(match){
                                    match.proposedPersonName = match.proposedPerson.title;
                                    _this.initMatchInfo(match);
                                    filteredMatches.pushObject(match);
                                })
                            }
                        });

                        profile.set('profileComparisons', filteredMatches)
                    });
                });
            });
        },

        saveCandidate: function(candidate){
            var profile = this.get('selectedProfile');
            console.log(candidate);
            candidate.SaveMatch.invoke({}, false).then(function(){
                profile.reload();
            });
        },

        removeCandidate: function(candidate){
            var profile = this.get('selectedProfile');
            var candidates = this.get('selectedProfile.candidates');
            var demand = this.get('model');
            candidate.deleteMatch.invoke({confirmDelete:true}).then(function(){
                candidates.removeObject(candidate);
                //demand.reload();
            });
        },

        selectMatch: function(candidate){
            var profile = this.get('selectedProfile');
            var demand = this.get('model');
            candidate.updateCandidateStatus.invoke({candidateStatus:"Chosen"}).then(function(){
                demand.reload();
                profile.reload();
            });
        },

        updateWidgetWeights:function(){
            var _this = this;
            var profile = this.get('selectedProfile');
            var widgets = profile.get('widgets');
            var totalWeight = 100;
            var divider = 4;

            profile.set('profileComparisons', [])

            var a_promises = [];
            $.each(widgets, function(i, widget){
                widget.weight = totalWeight/divider + totalWeight/2
                totalWeight -= widget.weight - totalWeight/2;
                a_promises.push(widget.updateWeight.invoke({integer:widget.weight}));
            })

            return Ember.RSVP.all(a_promises).then(function(widgets){
                _this.send('calculateMatches')
            });
        },
    },

    initMatchInfo: function(match){
        $ISIS.init(match.proposedPerson.href).then(function(person){
            var picture = person.picture ? person.picture.split(':') : '';
            if(picture[2]) Ember.set(match, 'profilePicture', 'data:image/png;base64,'+picture[2]);
            Ember.set(match, 'roles', person.roles);
        });
    },
});

export default ProjectMatchingController;

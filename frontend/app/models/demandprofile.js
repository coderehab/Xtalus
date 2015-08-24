import DS from 'ember-data';

export default DS.Model.extend({
    URI: DS.attr(),
    description: DS.attr(),
    profileElements: DS.attr(),
    profileElementChoices: DS.attr(),
    availableWidgets: DS.attr(),
    profileMatches: DS.attr(),
    profileComparisons: DS.attr(),
    chosenProfileMatchId:DS.attr({defaultValue:""}),
    chosenProfileMatchURI:DS.attr({defaultValue:""}),

    orderedProfileComparisons:function(){
        var profileComparisons = this.get('profileComparisons');
        return Ember.ArrayController.create({
            model:profileComparisons,
            sortProperties: ['calculatedMatchingValue'],
            sortAscending: false
        });

    }.property('profileComparisons'),

    initMatch: function(){
        var _this = this;
        if(this.get('chosenProfileMatchURI')){
            $ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + this.get('chosenProfileMatchURI')).then(function(person){
                person.fullName = person.supplyCandidate.title;
                _this.initMatchInfo(person);
                _this.set('match', person);
            });
        }
    }.observes('chosenProfileMatchURI'),

    initWidgets:function() {
        var widgets = this.get('profileElements')
        var a_promises = [];
        var _this = this;

        console.log(widgets);

        $.each(widgets, function(i, widget){
            if(widget.URI) a_promises.push($ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/' + widget.URI))
                })

        if(a_promises.length > 0){
            Ember.RSVP.all(a_promises).then(function(widgets){
                widgets.sort(function(a, b){
                    return b.weight-a.weight;
                })

                var availableWidgets = _this.get('profileElementChoices')
                var itemsRemoved = 0;
                $.each(availableWidgets, function(i, availableWidget){
                    availableWidget = availableWidgets[i-itemsRemoved]
                    $.each(widgets, function(j, widget){
                        if(availableWidget && widget){
                            if (availableWidget.description == widget.description){
                                availableWidgets.splice(i-itemsRemoved, 1);
                                itemsRemoved += 1
                            }
                        }

                    })
                });

                _this.set('widgets', widgets)
                _this.set('availableWidgets', availableWidgets);
            });
        }else {
            _this.set('widgets', [])
            _this.set('availableWidgets', this.get('profileElementChoices'));
        }

        return [];

    }.observes('profileElements'),

    candidates: function(){
        var _this = this;
        var profileMatches = this.get('profileMatches');

        var filteredMatches = Ember.ArrayController.create({
            model: [],
            sortProperties: ['calculatedMatchingValue'],
            sortAscending: false
        });

        $.each(profileMatches, function(i, match){
            $ISIS.init('http://acc.xtalus.gedge.nl/simple/restful/'+match.URI).then(function(match){
                match.contactName = match.supplyCandidate.title;
                _this.initMatchInfo(match);
                filteredMatches.pushObject(match);
            });
        });

        return filteredMatches;

    }.property('profileMatches'),

    isisObj:function(){
        return $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/'+this.get('URI')).then(function(isisObjData){

            return ($ISIS.extractMembers(isisObjData));

        });
    }.property('URI'),

    initMatchInfo: function(match){
        if(match){
            $ISIS.init(match.supplyCandidate.href).then(function(person){
                var picture = person.picture ? person.picture.split(':') : '';
                if(picture[2]) Ember.set(match, 'profilePicture', 'data:image/png;base64,'+picture[2]);
                Ember.set(match, 'roles', person.roles);
            });
        }
    }


});

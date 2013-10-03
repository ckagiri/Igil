LigiAdmin.module('TeamsApp.Show', function (Show, LigiAdmin, Backbone, Marionette, $, _) {
    Show.MissingTeam = Marionette.ItemView.extend({
        template: "#missing-team-view"
    });
    
    Show.Team = Marionette.ItemView.extend({
        template: "#team-view",
        
        events: {
            "click a.js-edit": "editClicked"
        },
        
        editClicked: function(e) {
            e.preventDefault();
            this.trigger("team:edit", this.model);
        }
    });
});
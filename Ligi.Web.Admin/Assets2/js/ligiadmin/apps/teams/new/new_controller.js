LigiAdmin.module('TeamsApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var self = this;
            var team, newView, formView;
            team = App.request("new:team:entity");

            this.listenTo(team, "created", function() {
                App.vent.trigger("team:created", team);
            });
            
            newView = this.getNewView(team);
            formView = App.request("form:wrapper", newView);

            this.listenTo(newView, "form:cancel", function() {
                self.region.close();
            });

            this.show(formView);
        },
        
        getNewView: function (team) {
            return new New.Team({
                model: team
            });
        }
    });
});

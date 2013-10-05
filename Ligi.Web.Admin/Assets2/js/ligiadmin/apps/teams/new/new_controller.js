LigiAdmin.module('TeamsApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Controller = {
        newTeam: function () {
            var newView = this.getNewView();
            return newView;
        },
        getNewView: function () {
            return new New.Team();
        }
    };
});

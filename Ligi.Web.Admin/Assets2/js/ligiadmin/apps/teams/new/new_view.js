LigiAdmin.module('TeamsApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Team = App.Views.ItemView.extend({
        template: "#team-new",
        form: {
            buttons: {
                placement: "left"
            }
        }
    });
});
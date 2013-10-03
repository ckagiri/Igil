LigiAdmin.module('TeamsApp.New', function (New, LigiAdmin, Backbone, Marionette, $, _) {
    New.Team = LigiAdmin.TeamsApp.Common.Views.Form.extend({
        title: "New Team",
        
        onRender: function () {
            this.$el.find(".js-submit").text("Create Team");
        }
    });
});
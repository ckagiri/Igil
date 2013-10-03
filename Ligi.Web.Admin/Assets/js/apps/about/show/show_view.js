LigiAdmin.module('AboutApp.Show', function (Show, LigiAdmin, Backbone, Marionette, $, _) {
    Show.Message = Marionette.ItemView.extend({
        template: "#about-message"
    });
});

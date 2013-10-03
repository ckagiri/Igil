LigiAdmin.module('AboutApp.Show', function (Show, LigiAdmin, Backbone, Marionette, $, _) {
    Show.Controller = {
        showAbout: function() {
            var view = new Show.Message();
            LigiAdmin.mainRegion.show(view);
        }
    };
});
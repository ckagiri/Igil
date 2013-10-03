LigiAdmin.module('AboutApp', function (AboutApp, LigiAdmin, Backbone, Marionette, $, _) {
    AboutApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "about" : "showAbout"
        }
    });

    var API = {
        showAbout: function() {
            AboutApp.Show.Controller.showAbout();
            LigiAdmin.HeaderApp.List.Controller.setActiveHeader("about");
        }
    };

    LigiAdmin.on("about:show", function() {
        LigiAdmin.navigate("about");
        API.showAbout();
    });

    LigiAdmin.addInitializer(function() {
        return new AboutApp.Router({
            controller: API
        });
    });
});
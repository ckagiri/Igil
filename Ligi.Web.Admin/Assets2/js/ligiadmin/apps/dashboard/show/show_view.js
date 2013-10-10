LigiAdmin.module('DashboardApp.Show', function (Show, App, Backbone, Marionette, $, _) {
    Show.Layout = App.Views.Layout.extend({
        template: "#show-layout-tmpl",
        
        regions: {
            upcomingRegion: "#upcoming-region",
            theatreRegion: "#theatre-region"
        }
    });
});

LigiAdmin.module('DashboardApp.Show', function (Show, App, Backbone, Marionette, $, _) {
    Show.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var self = this;
            this.layout = this.getLayoutView();
            this.listenTo(this.layout, "show", function () {
                self.listUpcoming();
                self.listTheatre();
            });
            this.show(this.layout);
        },
        
        listUpcoming: function() {
            App.execute("list:dashboard:upcoming:movies", this.layout.upcomingRegion);
        },
        
        listTheatre: function () {
            App.execute("list:dashboard:theatre:movies", this.layout.theatreRegion);
        },
        
        getLayoutView: function() {
            return new Show.Layout;
        }
    });
});

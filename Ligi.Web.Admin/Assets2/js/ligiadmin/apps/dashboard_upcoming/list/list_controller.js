LigiAdmin.module('DashboardUpcomingApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var upcoming, upcomingView;
            upcoming = App.request("upcoming:movie:entities");
            window.upcoming = upcoming;
            upcomingView = this.getUpcomingView(upcoming);
            this.show(upcomingView, {
                loading: true
            });
        },
        
        getUpcomingView: function (upcoming) {
            return new List.UpcomingMovies({
                collection: upcoming
            });
        }
    });
});

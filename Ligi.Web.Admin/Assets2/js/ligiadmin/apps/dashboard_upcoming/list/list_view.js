LigiAdmin.module('DashboardUpcomingApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.UpcomingMovie = App.Views.ItemView.extend({
        template: "#upcoming-movie-tmpl",
        tagName: "tr"
    });

    List.UpcomingMovies = App.Views.CompositeView.extend({
        template: "#upcoming-movies-tmpl",
        itemView: List.UpcomingMovie,
        itemViewContainer: "tbody"
    });
});

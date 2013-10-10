LigiAdmin.module('RentalsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function() {
            var rentals, self = this;
            rentals = App.request("movie:rental:entities");
            App.execute("when:fetched", rentals, function () {
                rentals.reset(rentals.sortBy("runtime"));
            });
            console.log(rentals);
            window.rentals = rentals;
            this.layout = this.getLayoutView();
            this.listenTo(this.layout, "show", function() {
                self.resultsView(rentals);
                self.rentalsView(rentals);
                self.paginationView(rentals);
            });
            this.show(this.layout, {
                loading: {
                    entities: rentals,
                    debug: false
                }
            });
        },

        resultsView: function(rentals) {
            var resultsView;
            resultsView = this.getResultsView(rentals);
            this.layout.resultsRegion.show(resultsView);
        },

        rentalsView: function(rentals) {
            var rentalsView;
            rentalsView = this.getMoviesView(rentals);
            this.layout.rentalsRegion.show(rentalsView);
        },

        paginationView: function(rentals) {
            var paginationView;
            paginationView = this.getPaginationView(rentals);
            this.layout.paginationRegion.show(paginationView);
        },

        getResultsView: function(rentals) {
            return new List.Results({
                collection: rentals
            });
        },

        getPaginationView: function(rentals) {
            return new List.Pagination({
                collection: rentals
            });
        },

        getMoviesView: function(rentals) {
            return new List.Rentals({
                collection: rentals
            });
        },

        getLayoutView: function() {
            return new List.Layout();
        }
    });
});
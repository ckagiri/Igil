LigiAdmin.module('RentalsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Layout = App.Views.Layout.extend({
        template: "#rentals-layout-tmpl",
        
        regions: {
            resultsRegion: "#results-region",
            rentalsRegion: "#rentals-region",
            paginationRegion: "#pagination-region"
        }
    });

    List.Rental = App.Views.ItemView.extend({
        template: "#rental-tmpl",
        tagName: "tr"
    });
    
    List.Rentals = App.Views.CompositeView.extend({
        template: "#rentals-tmpl",
        itemView: List.Rental,
        itemViewContainer: "tbody"
    });
    
    List.Results = App.Views.ItemView.extend({
        template: "#results-tmpl"
    });
    
    List.Pagination = App.Views.ItemView.extend({
        template: "#pagination-tmpl"
    });
});
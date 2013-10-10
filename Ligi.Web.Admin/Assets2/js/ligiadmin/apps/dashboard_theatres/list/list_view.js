LigiAdmin.module('DashboardTheatresApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Theatre = App.Views.ItemView.extend({
        template: "#theatre-tmpl",
        tagName: "tr"
    });
    
    List.Theatres = App.Views.CompositeView.extend({
        template: "#theatres-tmpl",
        itemView: List.Theatre,
        itemViewContainer: "tbody"
    });
});

LigiAdmin.module('SearchApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Layout = App.Views.Layout.extend({
        template: "#movies-layout-tmpl",
        
        regions: {
            panelRegion: "#panel-region",
            moviesRegion: "#movies-region"
        }
    });

    List.Panel = App.Views.ItemView.extend({
        template: "#panel-tmpl",

        ui: {
            "input": "input"
        },

        events: {
            "submit form": "formSubmitted"
        },

        formSubmitted: function(e) {
            var val;
            e.preventDefault();
            val = $.trim(this.ui.input.val());
            this.trigger("search:submitted", val);
        }
    });
    
    List.Movie = App.Views.ItemView.extend({
        template: "#movie-tmpl",
        tagName: "tr"
    });
    
    List.Empty = App.Views.ItemView.extend({
        template: "#movie-empty-tmpl",
        tagName: "tr"
    });
    
    List.Movies = App.Views.CompositeView.extend({
        template: "#movies-tmpl",
        itemView: List.Movie,
        emptyView: List.Empty,
        itemViewContainer: "tbody"
    });
    
    List.Hero = App.Views.ItemView.extend({
        template: "#hero-tmpl"
    });
});
LigiAdmin.module('SearchApp.List', function(List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function() {
            var _this = this;
            this.layout = this.getLayoutView();
            this.listenTo(this.layout, "show", function() {
                _this.panelView();
                _this.moviesView();
            });
            this.show(this.layout);
        },

        panelView: function() {
            var panelView,
                _this = this;
            panelView = this.getPanelView();
            this.listenTo(panelView, "search:submitted", function(searchTerm) {
                console.log("search:submitted: ", searchTerm);
                _this.moviesView(searchTerm);
            });
            this.layout.panelRegion.show(panelView);
        },

        moviesView: function(searchTerm) {
            if (searchTerm == null) {
                searchTerm = null;
            }
            if (searchTerm) {
                this.searchView(searchTerm);
            } else {
                this.showHeroView();
            }
        },

        searchView: function(searchTerm) {
            var movies, moviesView, opts;
            movies = App.request("search:movie:entities", searchTerm);
            moviesView = this.getMoviesView(movies);
            opts = {
                region: this.layout.moviesRegion,
                loading: true
            };
            if (this.layout.moviesRegion.currentView !== this.heroView) {
                opts.loading = {
                    loadingType: "opacity"
                };
            }
            this.show(moviesView, opts);
           // this.layout.moviesRegion.show(moviesView);
        },

        showHeroView: function() {
            //var heroView;
            this.heroView = this.getHeroView();
            this.layout.moviesRegion.show(this.heroView);
        },

        getHeroView: function() {
            return new List.Hero();
        },

        getMoviesView: function(movies) {
            return new List.Movies({
                collection: movies
            });
        },

        getPanelView: function() {
            return new List.Panel();
        },

        getLayoutView: function() {
            return new List.Layout();
        }
    });
});
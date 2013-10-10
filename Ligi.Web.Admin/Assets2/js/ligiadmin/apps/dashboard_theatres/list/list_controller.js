LigiAdmin.module('DashboardTheatresApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var theatreView, theatres;
            theatres = App.request("theatre:movie:entities");
            theatreView = this.getTheatreView(theatres);
            this.show(theatreView, {
                loading: true
            });
        },
        
        getTheatreView: function(theatres) {
            return new List.Theatres({
                collection: theatres
            });
        }
    });
});

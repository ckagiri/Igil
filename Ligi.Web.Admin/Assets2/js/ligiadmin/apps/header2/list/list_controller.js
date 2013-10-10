LigiAdmin.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var layout = this.getLayoutView();
            this.show(layout);
        },
        getListView: function () {
            return new List.Headers();
        },
        getLayoutView: function () {
            return new List.Layout();
        }
    });
});
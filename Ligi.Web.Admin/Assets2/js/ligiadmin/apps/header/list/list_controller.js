LigiAdmin.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var listView = this.getListView();
            this.show(listView);
        },
        getListView: function () {
            return new List.Headers();
        }
    });
});
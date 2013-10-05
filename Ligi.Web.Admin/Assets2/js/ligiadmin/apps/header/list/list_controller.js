LigiAdmin.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = {
        list: function () {
            var listView = this.getListView();
            App.headerRegion.show(listView);
        },
        getListView: function () {
            return new List.Headers();
        }
    };
});
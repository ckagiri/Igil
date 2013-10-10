LigiAdmin.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Header = App.Views.ItemView.extend({
        template: "#header-link",
        tagName: "li",
    });

    List.Headers = App.Views.CompositeView.extend({
        template: "#header-template",
        className: "navbar navbar-inverse navbar-fixed-top",
        itemView: List.Header,
        itemViewContainer: "ul"
    });

    List.Layout = App.Views.Layout.extend({
        template: "#header-tmpl",
        regions: {
            fooRegion: "#foo-region"
        }
    });
});
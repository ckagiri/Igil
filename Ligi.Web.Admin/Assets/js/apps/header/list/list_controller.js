LigiAdmin.module('HeaderApp.List', function (List, LigiAdmin, Backbone, Marionette, $, _) {
    List.Controller = {
        listHeader: function () {
            var links = LigiAdmin.request("header:entities");
            var headers = new List.Headers({ collection: links });

            headers.on("brand:clicked", function() {
                LigiAdmin.trigger("teams:list");
            });
            headers.on("itemview:navigate", function (childView, model) {
                var url = model.get('url');
                switch (url) {
                    case "teams":
                        LigiAdmin.trigger("teams:list");
                        break;
                    case "about":
                        LigiAdmin.trigger("about:show");
                        break;
                    default:
                        throw "No such route: " + url;
                }
            });
            LigiAdmin.headerRegion.show(headers);
        },
        setActiveHeader: function(headerUrl) {
            var links = LigiAdmin.request("header:entities");
            var headerToSelect = links.find(function(header) {
                return header.get('url') === headerUrl;
            });
            headerToSelect.select();
            links.trigger("reset");
        }
    };
});
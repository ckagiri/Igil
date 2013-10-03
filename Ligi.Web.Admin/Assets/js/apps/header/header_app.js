LigiAdmin.module('HeaderApp', function (Header, LigiAdmin, Backbone, Marionette, $, _) {
    var API = {
        listHeader: function() {
            Header.List.Controller.listHeader();
        }
    };

    Header.on("start", function () {
        API.listHeader();
    });
});
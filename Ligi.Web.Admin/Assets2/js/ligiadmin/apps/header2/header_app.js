LigiAdmin.module('HeaderApp', function (Header, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    
    var API = {
        list: function () {
            return new Header.List.Controller({
                region: App.headerRegion
            });
        }
    };

    Header.on("start", function () {
        API.list();
    });
});
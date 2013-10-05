LigiAdmin.module('HeaderApp', function (Header, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    
    var API = {
        list: function () {
            Header.List.Controller.list();
        }
    };

    Header.on("start", function () {
        API.list();
    });
});
LigiAdmin.module('Controllers', function (Controllers, App, Backbone, Marionette, $, _) {
    Controllers.Base = Marionette.Controller.extend({
        constructor: function (options) {
            if (options == null) {
                options = {};
            }
            this.region = options.region || App.request("default:region");
            Marionette.Controller.prototype.constructor.call(this, options);
            this._instance_id = _.uniqueId("controller");
            App.execute("register:instance", this, this._instance_id);
        },
        
        close: function () {
            var args = Array.prototype.slice.apply(arguments);
            delete this.region;
            delete this.options;
            Backbone.Marionette.Controller.prototype.close.apply(this, args);
            App.execute("unregister:instance", this, this._instance_id);
        },
        
        show: function (view) {
            this.listenTo(view, "close", this.close);
            this.region.show(view);
        }
    });
});

LigiAdmin.module('Views', function (Views, App, Backbone, Marionette, $, _) {
    var _remove = Marionette.View.prototype.remove;
    
    _.extend(Marionette.View.prototype, {
        addOpacityWrapper: function (init) {
            if (init == null) {
                init = true;
            }
            return this.$el.toggleWrapper({
                className: "opacity"
            }, init);
        },
        
        setInstancePropertiesFor: function () {
            
        },
        
        remove: function () {
            var self = this;
            var model, args = Array.prototype.slice.call(arguments);
            console.log("removing", this);
            if ((model = this.model) && typeof model.isDestroyed === "function" && model.isDestroyed()) {
                var wrapper = this.$el;
                wrapper.toggleClass("success").fadeOut(400, function () {
                    wrapper.toggleClass("success");
                });
                this.$el.fadeOut(400, function () {
                    _remove.apply(self, args);
                });
            } else {
                _remove.apply(this, args);
            }
        },
        
        templateHelpers: function () {
            
        }
    });
});
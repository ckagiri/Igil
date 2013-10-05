(function (Backbone) {
    _.extend(Backbone.Marionette.Application.prototype, {
        navigate: function (route, options) {
            if (options == null) {
                options = {};
            }
            return Backbone.history.navigate(route, options);
        },
        getCurrentRoute: function () {
            var frag;
            frag = Backbone.history.fragment;
            if (_.isEmpty(frag)) {
                return null;
            } else {
                return frag;
            }
        },
        startHistory: function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        }
    });
})(Backbone)
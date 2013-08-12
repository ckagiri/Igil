define('pubsub', ['jquery', 'underscore', 'postal'],
    function ($, _, postal) {
        var channel = {},
            setupChannels = function () {
                channel = postal.channel("data");
            },
            setupListeners = function() {
                channel.subscribe("*", pub);
            },
            pub = function (data, env) {
                channel.publish(env.replyTo || "*", env.data);
            },
            init = function () {
                setupChannels();
                setupListeners();
            };
        return {
            initialize: init
        };
    });
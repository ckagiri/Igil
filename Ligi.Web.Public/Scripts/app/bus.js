define('bus', ['postal'],
    function (postal) {
        var channel = postal.channel("data");
        return {
            data: channel
        };
    });
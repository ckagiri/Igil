﻿(function () {
    var root = this;

    define3rdPartyModules();
    loadPluginsAndBoot();

    function define3rdPartyModules() {
        // These are already loaded via bundles. 
        // We define them and put them in the root object.
        define('jquery', [], function () { return root.jQuery; });
        define('ko', [], function () { return root.ko; });
        define('amplify', [], function () { return root.amplify; });
        define('infuser', [], function () { return root.infuser; });
        define('moment', [], function () { return root.moment; });
        define('sammy', [], function () { return root.Sammy; });
        define('toastr', [], function () { return root.toastr; });
        define('underscore', [], function () { return root._; });
        define('postal', [], function () { return root.postal; });
    }
    
    function loadPluginsAndBoot() {
        requirejs([
            'ko.bindingHandlers',
            'ko.debug.helpers'
        ], boot);
    }
    
    function boot() {
        require(['bootstrapper'], function (bs) { bs.run(); });
    }
})();
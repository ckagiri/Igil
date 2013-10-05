LigiAdmin = (function (Backbone, Marionette) {
    
    var App = new Marionette.Application();
    
    App.addRegions({
        headerRegion: "#header-region",
        mainRegion: "#main-region"
    });
    
    App.rootRoute = "teams";

    App.addInitializer(function () {
        App.module("HeaderApp").start();
        //App.module("FooterApp").start();
    });

    App.on("initialize:after", function () {
        this.startHistory();
        if (this.getCurrentRoute() === "") {
            this.navigate(this.rootRoute, {
                trigger: true
            });
        }
    });
    
    return App;
})(Backbone, Marionette);
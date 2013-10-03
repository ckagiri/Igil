var LigiAdmin = new Marionette.Application();
LigiAdmin.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-region",
    dialogRegion: Marionette.Region.Dialog.extend({
        el: "#dialog-region"
    })
});
LigiAdmin.on("initialize:after", function () {
    if(Backbone.history) {
        Backbone.history.start();
        
        if (this.getCurrentRoute() === "") {
            LigiAdmin.trigger("teams:list");
        }
    }
});


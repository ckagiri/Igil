LigiAdmin.module('TeamsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = {
        list: function () {
            var self = this;
            var teams = App.request("team:entities");
            this.layout = this.getLayoutView();
            this.layout.on("show", function () {
                self.panelRegion();
                self.teamsRegion(teams);
            });
            App.mainRegion.show(this.layout);
        },
        panelRegion: function () {
            var panelView = this.getPanelView();
            this.layout.panelRegion.show(panelView);
        },
        newRegion: function () {
            var newView = App.request("new:team:view");
            this.layout.newRegion.show(newView);
        },
        teamsRegion: function (teams) {
            var teamsView = this.getTeamsView(teams);
            this.layout.teamsRegion.show(teamsView);
        },
        getTeamsView: function (teams) {
            return new List.Teams({collection: teams});
        },
        
        getPanelView: function () {
            return new List.Panel();
        },
        getLayoutView: function () {
            return new List.Layout();
        }
    };
})
LigiAdmin.module('TeamsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function () {
            var self = this,
                teams = App.request("team:entities"),
                leagues = App.request("league:entities"),
                seasons = App.request("season:entities");
            App.execute("when:fetched", [teams, leagues, seasons], function () {
                var x = leagues, y = seasons;
                self.layout = self.getLayoutView();
                self.listenTo(self.layout, "show", function() {
                    self.panelRegion();
                    self.teamsRegion(teams);
                });
                
                self.show(self.layout);
            });
        },
        onClose: function () {
            console.info("closing controller");
        },
        panelRegion: function() {
            var self = this;
            var panelView = this.getPanelView();
            this.listenTo(panelView, "new:team:button:clicked", function() {
                self.newRegion();
            });
            this.layout.panelRegion.show(panelView);
        },
        newRegion: function() {
            //var self = this;
            //var layout = self.layout;
            //var newView = App.request("new:team:view");
            //this.listenTo(newView, "form:cancel", function() {
            //    layout.newRegion.close();
            //});
            //layout.newRegion.show(newView);
            App.execute("new:team", this.layout.newRegion);
        },
        teamsRegion: function(teams) {
            var teamsView = this.getTeamsView(teams);
            this.listenTo(teamsView, "childview:team:clicked", function(childview, args) {
                App.vent.trigger("team:clicked", args.model);
            });
            
            this.listenTo(teamsView, "childview:team:edit:clicked", function (childview, args) {
                App.vent.trigger("team:clicked", args.model);
            });
            
            this.listenTo(teamsView, "childview:team:delete:clicked", function(childview, args) {
                var model = args.model;
                if (confirm("Are you sure you want to delete " + model.get('name') + " ?")) {
                    return model.destroy();
                } else {
                    return false;
                }
            });
            this.layout.teamsRegion.show(teamsView);
        },
        getTeamsView: function(teams) {
            return new List.Teams({ collection: teams });
        },
        getPanelView: function() {
            return new List.Panel();
        },
        getLayoutView: function() {
            return new List.Layout();
        }
    });
})
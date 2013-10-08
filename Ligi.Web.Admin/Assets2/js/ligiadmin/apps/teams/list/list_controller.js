LigiAdmin.module('TeamsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = Marionette.Controller.extend({
        initialize: function() {
            var self = this;
            window.c = self;
            var teams = App.request("team:entities");
            App.execute("when:fetched", teams, function() {
                self.layout = self.getLayoutView();
                self.listenTo(self.layout, "show", function() {
                    self.panelRegion();
                    self.teamsRegion(teams);
                });
                App.mainRegion.show(self.layout);
            });
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
            var self = this;
            var layout = self.layout;
            var newView = App.request("new:team:view");
            this.listenTo(newView, "form:cancel", function() {
                layout.newRegion.close();
            });
            layout.newRegion.show(newView);
        },
        teamsRegion: function(teams) {
            var teamsView = this.getTeamsView(teams);
            this.listenTo(teamsView, "childview:team:clicked", function(childview, args) {
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
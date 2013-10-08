LigiAdmin.module('TeamsApp.Edit', function (Edit, App, Backbone, Marionette, $, _) {
    Edit.Controller = {
        edit: function (id, team) {
            var self = this;
            team || (team = App.request("team:entity", id));
            team.on("all", function (e) {
                console.log(e);
            });

            team.on("updated", function() {
                App.vent.trigger("team:updated", team);
            });

            App.execute("when:fetched", team, function () {
                self.layout = self.getLayoutView(team);
                self.layout.on("show", function () {
                    
                    self.titleRegion(team);
                    self.formRegion(team);
                });
                App.mainRegion.show(self.layout);
            });
        },
        
        titleRegion: function (team) {
            var titleView = this.getTitleView(team);
            this.layout.titleRegion.show(titleView);
        },

        formRegion: function (team) {
            var editView = this.getEditView(team);
            
            editView.on("form:cancel", function () {
                App.vent.trigger("team:cancelled", team);
            });
            
            var formView = App.request("form:wrapper", editView, { footer: true });
            
            this.layout.formRegion.show(formView);
        },
        
        getTitleView: function (team) {
            return new Edit.Title({ model: team });
        },
        
        getEditView: function (team) {
            return new Edit.Team({ model: team });
        },
        
        getLayoutView: function (team) {
            return new Edit.Layout({ model: team });
        }
    };
});
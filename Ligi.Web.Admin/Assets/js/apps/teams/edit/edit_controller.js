LigiAdmin.module('TeamsApp.Edit', function (Edit, LigiAdmin, Backbone, Marionette, $, _) {
    Edit.Controller = {
        editTeam: function(id) {
            var loadingView = new LigiAdmin.Common.Views.Loading();
            LigiAdmin.mainRegion.show(loadingView);
            var fetchingTeam = LigiAdmin.request("team:entity", id);
            $.when(fetchingTeam).done(function (team) {
                var view;
                if(team !== undefined) {
                    view = new Edit.Team({
                        model: team,
                        generateTitle: false
                    });
                    view.on("form:submit", function(data) {
                        if (team.save(data)) {
                            LigiAdmin.trigger("team:show", team.get('id'));
                        } else {
                            view.triggerMethod("form:data:invalid", team.validationError);
                        }
                    });
                } else {
                    view = LigiAdmin.TeamsApp.Show.MissingTeam();
                }
                
                LigiAdmin.mainRegion.show(view);
            });
        }
    };
});
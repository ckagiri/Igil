LigiAdmin.module('TeamsApp.Show', function (Show, LigiAdmin, Backbone, Marionette, $, _) {
    Show.Controller = {
        showTeam: function (id) {
            var loadingView = new LigiAdmin.Common.Views.Loading({
                title: "Fetching Team",
                message: "Just a second, please wait"
            });
            LigiAdmin.mainRegion.show(loadingView);
            
            var fetchingTeam = LigiAdmin.request("team:entity", id);
            $.when(fetchingTeam).done(function(team) {
                var teamView;
                if (team !== undefined) {
                    teamView = new Show.Team({
                        model: team
                    });
                    teamView.on("team:edit", function (model) {
                        LigiAdmin.trigger("team:edit", model.get('id'));
                    });

                } else {
                    teamView = new Show.MissingTeam();
                }
                LigiAdmin.mainRegion.show(teamView);
            });
        }
    };
})
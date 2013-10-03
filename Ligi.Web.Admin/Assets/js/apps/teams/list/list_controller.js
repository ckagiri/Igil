LigiAdmin.module('TeamsApp.List', function (List, LigiAdmin, Backbone, Marionette, $, _) {
    List.Controller = {
        listTeams: function (criterion) {
            var loadingView = new LigiAdmin.Common.Views.Loading();
            LigiAdmin.mainRegion.show(loadingView);

            var fetchingTeams = LigiAdmin.request("team:entities");

            var teamsListLayout = new List.Layout();
            var teamsListPanel = new List.Panel();

            $.when(fetchingTeams).done(function (teams) {
                var filteredTeams = LigiAdmin.Entities.FilteredCollection({
                    collection: teams,
                    filterFunction: function (filterCriterion) {
                        var criterion = filterCriterion.toLowerCase();
                        return function(team) {
                            if (team.get('name').toLowerCase().indexOf(criterion) !== -1
                                || team.get('code').toLowerCase().indexOf(criterion) !== -1
                                || team.get('stadium').toLowerCase().indexOf(criterion) !== -1) {
                                return team;
                            }
                            // return undefined;
                        };
                    }
                });
                
                if(criterion) {
                    filteredTeams.filter(criterion);
                    teamsListPanel.once("show", function() {
                        teamsListPanel.triggerMethod("set:filter:criterion", criterion);
                    });
                }

                var teamsListView = new LigiAdmin.TeamsApp.List.Teams({
                    collection: filteredTeams
                });

                teamsListLayout.on("show", function() {
                    teamsListLayout.panelRegion.show(teamsListPanel);
                    teamsListLayout.teamsRegion.show(teamsListView);
                });

                teamsListPanel.on("teams:filter", function(filterCriterion) {
                    filteredTeams.filter(filterCriterion);
                    LigiAdmin.trigger("teams:filter", filterCriterion);
                });
                
                teamsListPanel.on("team:new", function () {
                    var newTeam = new LigiAdmin.Entities.Team();
                    
                    var view = new LigiAdmin.TeamsApp.New.Team({
                        model: newTeam
                    });

                    view.on("form:submit", function (data) {
                        var highest = teams.max(function (x) { return x.id; });
                        var highestId = highest.get('id');
                        data.id = highestId + 1;
                        if(newTeam.save(data)) {
                            teams.add(newTeam);
                            view.trigger("dialog:close");
                            var newTeamView = teamsListView.children.findByModel(newTeam);
                            if (newTeamView) {
                                newTeamView.flash("success");
                            }
                        } else {
                            view.triggerMethod("form:data:invalid", newTeam.validationError);
                        }
                    });

                    LigiAdmin.dialogRegion.show(view);
                });
                
                teamsListView.on("itemview:team:show", function (childView, model) {
                    LigiAdmin.trigger("team:show", model.get('id'));
                });
                teamsListView.on("itemview:team:edit", function (childView, model) {
                    var view = new LigiAdmin.TeamsApp.Edit.Team({
                        model: model
                    });

                    view.on("form:submit", function(data) {
                        if (model.save(data)) {
                            childView.render();
                            view.trigger("dialog:close");
                            childView.flash("success");
                        } else {
                            view.triggerMethod("form:data:invalid", model.validationError);
                        }
                    });
                    
                    LigiAdmin.dialogRegion.show(view);
                });
                teamsListView.on("itemview:team:delete", function (childView, model) {
                    model.destroy();
                });

                LigiAdmin.mainRegion.show(teamsListLayout);
            });
        }
    };
})
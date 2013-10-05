LigiAdmin.module('TeamsApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Layout = App.Views.Layout.extend({
        template: "#team-list-layout",
        regions: {
            panelRegion: "#panel-region",
            newRegion: "#new-region",
            teamsRegion: "#teams-region"
        }
    });

    List.Panel = App.Views.ItemView.extend({
        template: "#team-list-panel"
    });
    
    List.Team = App.Views.ItemView.extend({
        tagName: "tr",
        template: "#team-list-item"
    });

    var NoTeamsView = App.Views.ItemView.extend({
        template: "#team-list-none",
        tagName: "tr",
        className: "alert"
    });

    List.Teams = App.Views.CompositeView.extend({
        tagName: "table",
        className: "table table-hover",
        template: "#team-list",
        emptyView: NoTeamsView,
        itemView: List.Team,
        itemViewContainer: "tbody"
    });
});
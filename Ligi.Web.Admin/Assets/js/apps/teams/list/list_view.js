LigiAdmin.module('TeamsApp.List', function (List, LigiAdmin, Backbone, Marionette, $, _) {
    List.Layout = Marionette.Layout.extend({
        template: "#team-list-layout",
        regions: {
            panelRegion: "#panel-region",
            teamsRegion: "#teams-region"
        }
    });
    
    List.Panel = Marionette.ItemView.extend({
        template: "#team-list-panel",
        triggers: {
            "click button.js-new": "team:new"
        },
        events: {
            "click button.js-filter": "filterClicked"
        },
        
        ui: {
           criterion: "input.js-filter-criterion" 
        },
        
        filterClicked: function () {
            var criterion = this.$el.find(".js-filter-criterion").val();
            this.trigger("teams:filter", criterion);
        },
        
        onSetFilterCriterion: function (criterion) {
            $(this.ui.criterion).val(criterion);
        }
    });
    
    List.Team = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#team-list-item",
        
        events: {
            "click": "highlightName",
            "click td a.js-show": "showClicked",
            "click td a.js-edit": "editClicked",
            "click button.js-delete": "deleteClicked"    
        },
        
        flash: function (cssClass) {
            var $view = this.$el;
            $view.hide().toggleClass(cssClass).fadeIn(800, function() {
                setTimeout(function () {
                    $view.toggleClass(cssClass);
                }, 500);
            });
        },
        
        showClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.trigger("team:show", this.model);
        },
        
        editClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.trigger("team:edit", this.model);
        },
        
        deleteClicked: function (e) {
            e.stopPropagation();
            this.trigger("team:delete", this.model);
        },

        highlightName: function (e) {
            this.$el.toggleClass('warning');
        },
        
        remove: function () {
            this.$el.fadeOut(function() {
                $(this).remove();
            });
        }
    });

    var NoTeamsView = Marionette.ItemView.extend({
        template: "#team-list-none",
        tagName: "tr",
        className: "alert"
    });
    
    List.Teams = Marionette.CompositeView.extend({
        tagName: "table",
        className: "table table-hover",
        template: "#team-list",
        emptyView: NoTeamsView,
        itemView: List.Team,
        itemViewContainer: "tbody",
        
        onItemviewTeamDelete: function () {
            //this.$el.fadeOut(1000, function() {
            //    $(this).fadeIn(1000);
            //});
        },
        
        onCompositeCollectionRendered: function () {
            this.appendHtml = function(collectionView, itemView, index) {
                collectionView.$el.prepend(itemView.el);
            };
        }
    });
});
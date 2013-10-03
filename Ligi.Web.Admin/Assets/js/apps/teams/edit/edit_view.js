LigiAdmin.module('TeamsApp.Edit', function (Edit, LigiAdmin, Backbone, Marionette, $, _) {
    Edit.Team = LigiAdmin.TeamsApp.Common.Views.Form.extend({
        initialize: function () {
            this.title = "Edit " + this.model.get('name');
        },
        onRender: function () {
            if(this.options.generateTitle) {
                var $title = $('<h1>', { text: this.title });
                this.$el.prepend($title);
            }
            
            this.$el.find(".js-submit").text("Update Team");
        }
    });
});
LigiAdmin.module('TeamsApp.Edit', function (Edit, App, Backbone, Marionette, $, _) {
    Edit.Layout = App.Views.Layout.extend({
        template: "#team-edit-layout",
        regions: {
            titleRegion: "#title-region",
            formRegion: "#form-region"
        }
    });

    Edit.Title = App.Views.ItemView.extend({
        template: "#edit-title",
        
        modelEvents: {
            "updated" : "render"
        }
    });
    
    Edit.Team = App.Views.ItemView.extend({
        template: "#team-form",
        
        form: {
            footer: false,
            focusFirstInput: true
            //buttons: {
            //    primary: "Update",
            //    cancel: "Cancel",
            //    placement: "left"
            //}
        },
        
        //onFormSubmit: function (data) {
        //    console.log("Edit.Crew onFormSubmit", data);
        //    return false;
        //}
    });
});
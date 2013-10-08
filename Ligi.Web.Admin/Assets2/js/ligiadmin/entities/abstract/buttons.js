LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.Button = Entities.Model.extend({
        defaults: {
            buttonType: "button"
        }
    });
    
    Entities.ButtonsCollection = Entities.Collection.extend({
        model: Entities.Button
    });
    
    var API = {
        getFormButtons: function (buttons, model) {
            var array, buttonCollection;
            buttons = this.getDefaultButtons(buttons, model);
            array = [];
            if (buttons.cancel !== false) {
                array.push({
                    type: "cancel",
                    className: "btn js-cancel",
                    text: buttons.cancel
                });
            }
            if (buttons.primary !== false) {
                array.push({
                    type: "primary",
                    className: "btn js-submit",
                    text: buttons.primary,
                    buttonType: "submit"
                });
            }
            if (buttons.placement === "left") {
                array.reverse();
            }
            buttonCollection = new Entities.ButtonsCollection(array);
            buttonCollection.placement = buttons.placement;
            return buttonCollection;
        },
        getDefaultButtons: function (buttons, model) {
            return _.defaults(buttons, {
                primary: model.isNew() ? "Create" : "Update",
                cancel: "Cancel",
                placement: "right"
            });
        }
    };
    
    App.reqres.setHandler("form:button:entities", function (buttons, model) {
        if (buttons == null) {
            buttons = {};
        }
        return API.getFormButtons(buttons, model);
    });
});
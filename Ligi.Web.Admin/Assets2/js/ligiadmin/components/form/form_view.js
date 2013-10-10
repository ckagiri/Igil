LigiAdmin.module('Components.Form', function (Form, App, Backbone, Marionette, $, _) {
    Form.FormWrapper = App.Views.Layout.extend({
        template: "#form-content",
        
        tagName: "form",
        attributes: function () {
            return {
                "data-type": this.getFormDataType()
            };
        },
        
        regions: {
            formContentRegion: "#form-content-region"
        },
        
        ui: {
            buttonContainer: ".button-container"
        },
        
        triggers: {
            "submit": "form:submit",
            "click button.js-cancel": "form:cancel"
        },
        
        modelEvents: {
            "change:_errors": "changeErrors",
            "sync:start": "syncStart",
            "sync:stop": "syncStop"
        },
        
        serializeData: function () {
            var self = this;
            return {
                footer: this.options.config.footer,
                buttons: (function () {
                    var buttons = self.options.buttons;
                    if (buttons) {
                        return buttons.toJSON();
                    } else return false;
                })()
            };
        },
        
        onShow: function () {
            var self = this;
            _.defer(function () {
                if (self.options.config.focusFirstInput) {
                    self.focusFirstInput();
                }
                if (self.options.buttons) {
                    self.buttonPlacement();
                }
            });
        },
        
        buttonPlacement: function () {
            this.ui.buttonContainer.addClass(this.options.buttons.placement);
        },
        
        focusFirstInput: function () {
            this.$(":input:visible:enabled:first").focus();
        },
        
        getFormDataType: function () {
            // this.model.isNew = function() { return true; };
            if (this.model.isNew()) {
                return "new";
            } else {
                return "edit";
            }
        },
        
        changeErrors: function(model, errors, options) {
            if (this.options.config.errors) {
                if (_.isEmpty(errors)) {
                    this.removeErrors();
                } else {
                    this.addErrors(errors);
                }
            }
        },
        
        removeErrors: function() {
            // this.$(".error").removeClass("error").find("small").remove();
        },
        
        addErrors: function(errors) {
            var array, name, results;
            if (errors == null) {
                errors = {};
            }
            results = [];
            for (name in errors) {
                array = errors[name];
                results.push(this.addError(name, array[0]));
            }
            return results;
        },
        
        addError: function(name, error) {
            //var el, sm;
            //el = this.$("[name='" + name + "']");
            //sm = $("<small>").text(error);
            //return el.after(sm).closest(".row").addClass("error");
        },
        
        syncStart: function (model) {
            if (this.options.config.syncing) {
                this.addOpacityWrapper();
            }
        },
        
        syncStop: function(model) {
            if (this.options.config.syncing) {
                this.addOpacityWrapper(false);
            }
        }
    });
});

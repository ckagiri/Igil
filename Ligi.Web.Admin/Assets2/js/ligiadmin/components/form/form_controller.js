LigiAdmin.module('Components.Form', function (Form, App, Backbone, Marionette, $, _) {
    Form.Controller = App.Controllers.Base.extend({
        initialize: function (options) {
            var self = this;
            if (options == null) {
                options = {};
            }
            
            this.contentView = options.view;
            this.formLayout = this.getFormLayout(options.config);

            this.listenTo(this.formLayout, "show", this.formContentRegion);
            this.listenTo(this.formLayout, "form:submit", this.formSubmit);
            this.listenTo(this.formLayout, "form:cancel", this.formCancel);
        },
        
        formCancel: function () {
            this.contentView.triggerMethod("form:cancel");
        },
        
        formSubmit: function () {
            var data, model, collection;
            data = Backbone.Syphon.serialize(this.formLayout);
            if (this.contentView.triggerMethod("form:submit", data) !== false) {
                model = this.contentView.model;
                collection = this.contentView.collection;
                this.processFormSubmit(data, model, collection);
            }
        },
        
        processFormSubmit: function (data, model, collection) {
            model.save(data, {
                collection: collection
            });
        },
        
        onClose: function () {
            console.log("onClose", this);
        },
        
        formContentRegion: function () {
            this.region = this.formLayout.formContentRegion;
            this.show(this.contentView);
        },
        
        getFormLayout: function (options) {
            var buttons, config;
            if (options == null) {
                options = {};
            }
            config = this.getDefaultConfig(_.result(this.contentView, "form"));
            _.extend(config, options);
            buttons = this.getButtons(config.buttons);
            return new Form.FormWrapper({
                config: config,
                model: this.contentView.model,
                buttons: buttons
            });
        },
        
        getDefaultConfig: function (config) {
            if (config == null) {
                config = { };
            }
            return _.defaults(config, {
                footer: true,
                focusFirstInput: true,
                errors: true,
                syncing: true
            });
        },
        
        getButtons: function (buttons) {
            if (buttons == null) {
                buttons = {};
            }
            if (buttons !== false) {
                return App.request("form:button:entities", buttons, this.contentView.model);
            }
            return buttons;
        },
    });
    
    App.reqres.setHandler("form:wrapper", function (contentView, options) {
        var formController;
        if (options == null) {
            options = {};
        }
        if (!contentView.model) {
            throw new Error("No model found inside of form's contentView");
        }
        formController = new Form.Controller({
            view: contentView,
            config: options
        });
        return formController.formLayout;
    });
});

define('ko.bindingHandlers',
['jquery', 'ko'],
function ($, ko) {
    var unwrap = ko.utils.unwrapObservable;

    ko.bindingHandlers.escape = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var command = valueAccessor();
            $(element).keyup(function (event) {
                if (event.keyCode === 27) { // <ESC>
                    command.call(viewModel, viewModel, event);
                }
            });
        }
    };

    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            var value = unwrap(valueAccessor());
            ko.bindingHandlers.visible.update(element, function () { return !value; });
        }
    };

    ko.bindingHandlers.datetimepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize datetimepicker with some optional options
            var options = allBindingsAccessor().datetimepickerOptions || {};
            $(element).datetimepicker(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, 'change', function () {
                var observable = valueAccessor();
                var dateTime = $(element).data('datetimepicker').getDate();
                observable(dateTime);
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).datetimepicker('destroy');
            });

        },
        //update the control when the view model changes
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).datetimepicker('setDate', value);
        }
    };
});
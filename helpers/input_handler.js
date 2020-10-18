'use strict';
var input_errors = function (form) {
    var errors = {},
        field;

    for (field in form.fields) {
        if (form.fields[field].error) {
            errors[field] = form.fields[field].error;
        }
    }

    return errors;
};

exports.validations = function (form) {
    return function (model) {
        return {
            is_valid: function (callback) {
                form.handle(model, {
                    error: function (resultForm) {
                        callback(input_errors(resultForm));
                    },
                    success: function (form) {
                        callback(null, form);
                    }
                });
            }
        };
    };
};


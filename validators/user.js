var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var handler = require('../helpers/input_handler');

var userForm = forms.create({
    email: fields.email({
        required: validators.required('email is required'),
        email: validators.email()
    }),
    password: fields.string({
        required: validators.required('Password is required')
    }),
});

module.exports.userForm = handler.validations(userForm);
const modelRegistrator = require('./utils/model-registrator');
const constants = require('../common/constants');
const validateModel = require('../utils/validator');

module.exports = modelRegistrator.register('User', {
    'name': {
        'type': String,
        'require': [true, 'Name is required!'],
        'validate': {
            'validator': (value) => validateModel.validateStringLength(value, constants.nameMinLength, constants.nameMaxLength),
            'message': `must be between ${constants.nameMinLength} and ${constants.nameMaxLength} symbols long!`
        }
    },
    'username': {
        'type': String,
        'require': [true, 'Username is required!'],
        'unique': true,
        'validate': {
            'validator': (value) => validateModel.validateStringLength(value, constants.nameMinLength, constants.nameMaxLength),
            'message': `must be between ${constants.nameMinLength} and ${constants.nameMaxLength} symbols long!`
        }
    },
    'email': {
        'type': String,
        'require': [true, 'Email is required!'],
        'unique': true,
        'validate': {
            'validator': (value) => validateModel.validateEmail(value),
            'message': 'Invalid email format!'
        }
    },
    'password': {
        'type': String,
        'require': [true, 'Password is required!']
    },
    'avatar': {
        'data': Buffer,
        'contentType': String
    }
});
const joi = require('joi');

function registerValidation(data) {
  console.log(data);
  const schema = joi.object({
    // first name validation
    first_name: joi.string().min(2).required(),
    // last name validation
    last_name: joi.string().min(2).max(30).required(),
    // email  validation
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .min(8)
      .max(30)
      .required()
      .label('Password')
      .messages({
        'string.empty': ` password field cannot be empty `,
        'object.regex': 'Must have at least 8 characters',
        'string.pattern.base':
          'Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character',
      }),
    phone: joi
      .string()

      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': `Phone number must have  at least 10 digits.`,
      })
      .min(2)
      .max(13)
      .required(),
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = joi.object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] },
      })
      .required(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .min(8)
      .max(30)
      .required()
      .label('Password')
      .messages({
        'string.empty': ` password field cannot be empty `,
        'object.regex': 'Must have at least 8 characters',
        'string.pattern.base':
          'Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character,',
      }),
  });
  return schema.validate(data);
}

function updateUserValidation(data) {
  const schema = joi.object({
    // first name validation
    first_name: joi.string().min(2).required(),
    // last name validation
    last_name: joi.string().min(2).max(30).required(),
    // email  validation
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),

    phone: joi
      .string()

      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': `Phone number must have  at least 10 digits.`,
      })
      .min(2)
      .max(13)
      .required(),
  });
  return schema.validate(data);
}
async function createDeptValidation(data) {
  const schema = joi.object({
    // first name validation
    dept_name: joi.string().min(2).required(),
    // last name validation
    head_agent: joi.string().min(2).max(30).required(),
    // email  validation
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
  });
  return schema.validate(data);
}
async function updateDeptValidation(data) {
  const schema = joi.object({
    // first name validation
    dept_name: joi.string().min(2),
    // last name validation
    head_agent: joi.string().min(2).max(30),
    // email  validation
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),
  });
  return schema.validate(data);
}
async function validatePassword(data) {
  console.log('validation data');
  console.log(data);
  const schema = joi.object({
    // password  validation
    password: joi
      .string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .min(8)
      .max(30)
      .required()
      .label('Password')
      .messages({
        'string.empty': ` password field cannot be empty `,
        'object.regex': 'Must have at least 8 characters',
        'string.pattern.base':
          'Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character,',
      }),
  });
  return schema.validate(data);
}

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  createDeptValidation,
  updateDeptValidation,
  validatePassword,
};

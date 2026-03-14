import Joi from 'joi';

const capitalStartPattern = /^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ \-]*$/;

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Введіть коректний email',
      'any.required': 'Email обов\'язковий',
    }),

  password: Joi.string()
    .pattern(/\S/)
    .required()
    .messages({
      'string.pattern.base': 'Пароль не може складатися лише з пробілів',
      'any.required': 'Пароль обов\'язковий',
    }),

  profile: Joi.object({
    name: Joi.string()
      .pattern(capitalStartPattern)
      .max(15)
      .required()
      .messages({
        'string.pattern.base': 'Ім\'я: має починатися з великої літери (літери, пробіли, дефіси)',
        'string.max': 'Максимум 15 символів',
        'any.required': 'Ім\'я обов\'язкове',
      }),

    surname: Joi.string()
      .pattern(capitalStartPattern)
      .max(20)
      .required()
      .messages({
        'string.pattern.base': 'Прізвище: має починатися з великої літери (літери, пробіли, дефіси)',
        'string.max': 'Максимум 20 символів',
        'any.required': 'Прізвище обов\'язкове',
      }),

    age: Joi.number()
      .integer()
      .min(18)
      .required()
      .messages({
        'number.base': 'Вік має бути числом',
        'number.min': 'Мінімум 18 років',
        'any.required': 'Вік обов\'язковий',
      }),

    gender: Joi.string()
      .valid('male', 'female', 'other')
      .required()
      .messages({
        'any.only': 'Оберіть коректну стать',
        'any.required': 'Стать обов\'язкова',
      }),

    street: Joi.string()
      .pattern(capitalStartPattern)
      .max(35)
      .required()
      .messages({
        'string.pattern.base': 'Вулиця: має починатися з великої літери',
        'string.max': 'Максимум 35 символів',
        'any.required': 'Вулиця обов\'язкова',
      }),

    city: Joi.string()
      .pattern(capitalStartPattern)
      .max(35)
      .required()
      .messages({
        'string.pattern.base': 'Місто: має починатися з великої літери',
        'string.max': 'Максимум 35 символів',
        'any.required': 'Місто обов\'язкове',
      }),

    region: Joi.string()
      .pattern(capitalStartPattern)
      .max(35)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'Регіон: має починатися з великої літери',
        'string.max': 'Максимум 35 символів',
      }),

    country: Joi.string()
      .pattern(capitalStartPattern)
      .max(35)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'Країна: має починатися з великої літери',
        'string.max': 'Максимум 35 символів',
      }),

    house: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Номер будинку має бути числом',
        'number.min': 'Номер будинку має бути > 0',
        'any.required': 'Номер будинку обов\'язковий',
      }),
  }).required(),
});
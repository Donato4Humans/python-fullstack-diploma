// Joi schema
import Joi from 'joi';

export const schema = Joi.object({
  title: Joi.string()
    .pattern(/^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ -]*$/i)
    .max(35)
    .required()
    .messages({
      'string.pattern.base': 'Назва: починається з великої літери (латинська або кирилиця), тільки літери, пробіли, дефіси',
      'string.max': 'Максимум 35 символів',
      'any.required': 'Назва обов\'язкова',
    }),
  description: Joi.string()
    .max(250)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Максимум 250 символів',
    }),
  schedule: Joi.string()
    .max(250)
    .allow('')
    .required()
    .messages({
      'string.max': 'Максимум 250 символів',
    }),
  average_check: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.positive': 'Середній чек має бути > 0',
      'number.integer': 'Ціле число',
      'any.required': 'Середній чек обов\'язковий',
    }),
  category: Joi.string()
    .valid('cafe', 'restaurant', 'bar', 'mixed')
    .required()
    .messages({
      'any.only': 'Невірна категорія',
      'any.required': 'Категорія обов\'язкова',
    }),
  street: Joi.string()
    .pattern(/^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ -]*$/i)
    .required()
    .messages({
      'string.pattern.base': 'Вулиця: починається з великої літери (латинська або кирилиця), тільки літери, пробіли, дефіси',
      'any.required': 'Вулиця обов\'язкова',
    }),
  city: Joi.string()
    .pattern(/^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ -]*$/i)
    .required()
    .messages({
      'string.pattern.base': 'Місто: починається з великої літери (латинська або кирилиця), тільки літери, пробіли, дефіси',
      'any.required': 'Місто обов\'язкове',
    }),
  region: Joi.string()
    .pattern(/^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ -]*$/i)
    .max(35)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Регіон: починається з великої літери (латинська або кирилиця), тільки літери, пробіли, дефіси',
      'string.max': 'Максимум 35 символів',
    }),
  country: Joi.string()
    .pattern(/^[A-ZА-ЯЁЇІЄҐ][a-zа-яёїієґA-ZА-ЯЁЇІЄҐ -]*$/i)
    .max(35)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Країна: починається з великої літери (латинська або кирилиця), тільки літери, пробіли, дефіси',
      'string.max': 'Максимум 35 символів',
    }),
  house: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.positive': 'Номер будинку > 0',
      'number.integer': 'Ціле число',
      'any.required': 'Номер будинку обов\'язковий',
    }),
  latitude: Joi.number()
  .min(-90)
  .max(90)
  .allow(null, '')
  .optional()
  .custom((value, helpers) => {
    if (value === '' || value == null) return null;
    const num = Number(value);
    if (isNaN(num)) return helpers.error('number.base');
    return num;
  })
  .messages({
    'number.min': 'Широта від -90 до 90',
    'number.max': 'Широта від -90 до 90',
    'number.base': 'Широта має бути числом або пустим',
  }),

longitude: Joi.number()
  .min(-180)
  .max(180)
  .allow(null, '')
  .optional()
  .custom((value, helpers) => {
    if (value === '' || value == null) return null;
    const num = Number(value);
    if (isNaN(num)) return helpers.error('number.base');
    return num;
  })
  .messages({
    'number.min': 'Довгота від -180 до 180',
    'number.max': 'Довгота від -180 до 180',
    'number.base': 'Довгота має бути числом або пустим',
  }),
});
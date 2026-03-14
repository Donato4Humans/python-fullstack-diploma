import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import type { ISignInRequest } from "../../models/IAuth";

interface LoginFormProps {
  onSignIn: any; // RTK mutation (useSignInMutation)
}

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disable strict email`s TLD list check
    .required()
    .messages({
      'string.email': 'Введіть коректний email',
      'any.required': 'Email обов\'язковий',
    }),

  password: Joi.string()
    .pattern(/\S/) // requires at least one non-space character anywhere
    .required()
    .messages({
      'string.pattern.base': 'Пароль не може складатися лише з пробілів',
      'any.required': 'Пароль обов\'язковий',
    }),
});

const ERROR_TRANSLATIONS: Record<string, string> = {
  "No active account found with the given credentials": "Не знайдено активного акаунту з вказаними даними!",
  // other specific backend messages here
};

const LoginForm = ({ onSignIn }: LoginFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ISignInRequest>({
    resolver: joiResolver(loginSchema),
    mode: 'onSubmit',
  });

  const handleFormSubmit = async (data: ISignInRequest) => {
  setErrorMessage('');

  try {
    await onSignIn(data).unwrap();
    navigate(from, { replace: true });
  } catch (error: any) {
    // Extract the raw message from the backend
    const rawMessage = error?.data?.detail ||
                       error?.data?.non_field_errors?.[0];

    // Translate if we recognize it, otherwise use a generic message
    const translatedMessage = (rawMessage && ERROR_TRANSLATIONS[rawMessage])
      || 'Невірний email або пароль';

    setErrorMessage(translatedMessage);
  }
};

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center font-medium">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Авторизація...' : 'Увійти'}
      </button>

      {/* Recovery link */}
      <div className="text-center">
        <Link
          to="/auth/recovery"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Забули пароль? Натисніть для відновлення паролю
        </Link>
      </div>

      {/* Sign Up link */}
      <div className="text-center">
        <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-500">
          Не маєте акаунту? Зареєструйтесь
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
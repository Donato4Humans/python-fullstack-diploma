import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { ISignInRequest } from "../../models/IAuth";

interface LoginFormProps {
  onSignIn: any; // RTK mutation (useSignInMutation)
}

const LoginForm = ({ onSignIn }: LoginFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  // Where user wanted to go before redirect to login
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ISignInRequest>();

  const handleFormSubmit = async (data: ISignInRequest) => {
    setErrorMessage(''); // Clear previous error

    try {
      await onSignIn(data).unwrap();

      // on success go to the page user tried to visit
      navigate(from, { replace: true });

    } catch (error: any) {
      const message = 'Невірний email або пароль';
      setErrorMessage(message);
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
          {...register('email', { required: 'Email обов\'язковий' })}
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
          {...register('password', { required: 'Пароль обов\'язковий' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Error message - stays on page */}
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

      <div className="text-center">
        <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-500">
          Не маєте акаунту? Зареєструйтесь
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
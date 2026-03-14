import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useRecoveryRequestMutation, useRecoveryPasswordMutation } from '../../redux/api/authApi';

interface RequestForm {
  email: string;
}

interface ResetForm {
  password: string;
  confirm_password: string;
}

const requestSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Введіть коректний email',
      'any.required': 'Email обов\'язковий',
    }),
});

const resetSchema = Joi.object({
  password: Joi.string()
    .pattern(/\S/)
    .required()
    .messages({
      'string.pattern.base': 'Пароль не може складатися лише з пробілів',
      'any.required': 'Пароль обов\'язковий',
    }),

  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Паролі не співпадають',
      'any.required': 'Підтвердження паролю обов\'язкове',
    }),
});

const ProfileSecurityPage = () => {
  const { token } = useParams<{ token: string }>();

  const [step, setStep] = useState<'request' | 'reset' | 'success'>(token ? 'reset' : 'request');
  const [recoveryRequest] = useRecoveryRequestMutation();
  const [recoveryPassword] = useRecoveryPasswordMutation();

  const requestForm = useForm<RequestForm>({
    resolver: joiResolver(requestSchema),
    mode: 'onSubmit',
  });

  const resetForm = useForm<ResetForm>({
    resolver: joiResolver(resetSchema),
    mode: 'onSubmit',
  });

  const onRequest = async (data: RequestForm) => {
    try {
      await recoveryRequest({ email: data.email }).unwrap();
      setStep('success');
    } catch (error) {
      alert('Error sending recovery email');
    }
  };

  const onReset = async (data: ResetForm) => {
    if (data.password !== data.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    if (!token) {
      alert('Invalid token');
      return;
    }
    try {
      await recoveryPassword({ token, password: data.password }).unwrap();
      alert('Password changed successfully! Please sign in.');
      window.location.href = '/auth/sign-in';
    } catch (error) {
      alert('Error changing password');
    }
  };

  if (step === 'request') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6">Змінити/відновити пароль</h1>
        <p className="text-gray-600 mb-6">Введіть свою електронну пошту для отримання посилання для відновлення або зміни паролю</p>
        <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...requestForm.register('email')}
              className="w-full p-3 border rounded-lg"
            />
            {requestForm.formState.errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {requestForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Відправити запит відновлення/зміни на пошту
          </button>
        </form>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Перевірте вашу електронну пошту</h1>
        <p className="text-gray-600">Ми надіслали вам посилання для відновлення.</p>
      </div>
    );
  }

  // step === 'reset'
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Встановити новий пароль</h1>
      <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Новий пароль</label>
          <input
            type="password"
            {...resetForm.register('password')}
            className="w-full p-3 border rounded-lg"
          />
          {resetForm.formState.errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {resetForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Підтвердити пароль</label>
          <input
            type="password"
            {...resetForm.register('confirm_password')}
            className="w-full p-3 border rounded-lg"
          />
          {resetForm.formState.errors.confirm_password && (
            <p className="text-red-600 text-sm mt-1">
              {resetForm.formState.errors.confirm_password.message}
            </p>
          )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Змінити пароль
        </button>
      </form>
    </div>
  );
};

export default ProfileSecurityPage;
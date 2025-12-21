import { useState } from 'react';
import { useSignUpMutation } from '../../redux/api/userApi';
import RegisterForm from '../../components/auth/RegisterForm';

const SignUpPage = () => {
  const [signUp] = useSignUpMutation();
  const [email, setEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: any) => {
    try {
      await signUp(data).unwrap();
      setEmail(data.email); // Save email for message
      setSuccess(true);
      setErrorMsg('');
    } catch (error: any) {
      setSuccess(false);
      setErrorMsg(error.data?.detail || 'Помилка реєстрації');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Реєстрація
          </h2>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Реєстрацію успішно завершено!</strong>
            <p className="mt-2">
              Посилання для активації надіслано на email: <strong>{email}</strong>
            </p>
            <p className="mt-2 text-sm">
              Перевірте вашу пошту (включаючи папку "Спам") і активуйте акаунт.
            </p>
          </div>
        ) : (
          <RegisterForm onSubmit={onSubmit} />
        )}

        {errorMsg && (
          <p className="text-red-600 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
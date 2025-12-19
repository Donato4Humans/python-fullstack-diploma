
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoveryRequestMutation, useRecoveryPasswordMutation } from '../../redux/api/authApi';
import { useSearchParams } from 'react-router-dom';

interface RequestForm {
  email: string;
}

interface ResetForm {
  password: string;
  confirm_password: string;
}

const ProfileSecurityPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // from recovery link

  const [step, setStep] = useState<'request' | 'reset' | 'success'>(token ? 'reset' : 'request');
  const [recoveryRequest] = useRecoveryRequestMutation();
  const [recoveryPassword] = useRecoveryPasswordMutation();

  const requestForm = useForm<RequestForm>();
  const resetForm = useForm<ResetForm>();

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
        <h1 className="text-3xl font-bold mb-6">Change Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>
        <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...requestForm.register('email', { required: true })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Send Recovery Email
          </button>
        </form>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Check Your Email</h1>
        <p className="text-gray-600">We sent a password reset link to your email.</p>
      </div>
    );
  }

  // step === 'reset'
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Set New Password</h1>
      <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            {...resetForm.register('password', { required: true, minLength: 6 })}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            {...resetForm.register('confirm_password', { required: true })}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfileSecurityPage;

import { useParams, useNavigate } from 'react-router-dom';
import { useActivateUserMutation } from '../../redux/api/authApi';
import { useEffect } from 'react';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [activateUser, { isLoading, isSuccess, error }] = useActivateUserMutation();

  useEffect(() => {
    if (token) {
      activateUser(token);
    }
  }, [token, activateUser]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate('/auth/sign-in'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          {isLoading ? 'Verifying email...' : isSuccess ? 'Email verified successfully!' : 'Verify Email'}
        </h2>
        <p className="text-gray-600">
          {isLoading && 'Please wait while we verify your email...'}
          {isSuccess && 'Redirecting to sign in...'}
          {error && 'Verification failed. Please try again.'}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
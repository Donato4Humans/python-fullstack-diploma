
import { useParams, useNavigate } from 'react-router-dom';
import { useActivateUserMutation } from '../../redux/api/authApi';
import { useEffect } from 'react';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [activateUser, { isLoading, isSuccess, isError }] = useActivateUserMutation();

  useEffect(() => {
    if (token) {
      activateUser(token);
    }
  }, [token, activateUser]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate('/auth/sign-in'), 3000);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          {isLoading ? 'Activating account...' : isSuccess ? 'Account activated!' : 'Activation failed'}
        </h2>
        {isSuccess && <p className="text-gray-600">Redirecting to sign in...</p>}
        {isError && <p className="text-red-600">Invalid or expired token</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
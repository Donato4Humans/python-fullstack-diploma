
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation } from '../../redux/api/authApi';
import { useAppSelector } from '../../hooks/rtk';
import { getUserRole } from '../../helpers/getRole';
import LoginForm from '../../components/auth/LoginForm';

const SignInPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [signIn] = useSignInMutation();

  // Auto-redirect after login
  useEffect(() => {
    if (user) {
      if (getUserRole(user) === 'superadmin') {
        navigate('/profile/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign In
          </h2>
        </div>
        <LoginForm onSubmit={signIn} />
      </div>
    </div>
  );
};

export default SignInPage;
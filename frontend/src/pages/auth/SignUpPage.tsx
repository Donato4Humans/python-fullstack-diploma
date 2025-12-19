
import { useSignUpMutation } from '../../redux/api/userApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();

  const onSubmit = async (data: any) => {
    try {
      await signUp(data).unwrap();
      navigate('/auth/activate');
    } catch (error) {
      alert('Error signing up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign Up
          </h2>
        </div>
        <RegisterForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default SignUpPage;
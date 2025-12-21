import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import type { ISignUpRequest } from "../../models/IAuth";

interface RegisterFormProps {
  onSubmit: (data: ISignUpRequest) => Promise<void>;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ISignUpRequest>();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
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

      {/* Password */}
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

      {/* Profile Fields - All Required */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Ім'я
        </label>
        <input
          id="name"
          {...register('profile.name', { required: 'Ім\'я обов\'язкове' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.name && <p className="mt-1 text-sm text-red-600">{errors.profile.name.message}</p>}
      </div>

      <div>
        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
          Прізвище
        </label>
        <input
          id="surname"
          {...register('profile.surname', { required: 'Прізвище обов\'язкове' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.surname && <p className="mt-1 text-sm text-red-600">{errors.profile.surname.message}</p>}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Вік
        </label>
        <input
          type="number"
          id="age"
          {...register('profile.age', { required: 'Вік обов\'язковий', min: { value: 18, message: 'Мінімум 18 років' } })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.age && <p className="mt-1 text-sm text-red-600">{errors.profile.age.message}</p>}
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Стать
        </label>
        <select
          id="gender"
          {...register('profile.gender', { required: 'Стать обов\'язкова' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Обрати</option>
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
          <option value="other">Інше</option>
        </select>
        {errors.profile?.gender && <p className="mt-1 text-sm text-red-600">{errors.profile.gender.message}</p>}
      </div>

      {/* Address Fields */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Вулиця
        </label>
        <input
          id="street"
          {...register('profile.street', { required: 'Вулиця обов\'язкова' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.street && <p className="mt-1 text-sm text-red-600">{errors.profile.street.message}</p>}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Місто
        </label>
        <input
          id="city"
          {...register('profile.city', { required: 'Місто обов\'язкове' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.city && <p className="mt-1 text-sm text-red-600">{errors.profile.city.message}</p>}
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          Регіон
        </label>
        <input
          id="region"
          {...register('profile.region', { required: 'Регіон обов\'язковий' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.region && <p className="mt-1 text-sm text-red-600">{errors.profile.region.message}</p>}
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Країна
        </label>
        <input
          id="country"
          {...register('profile.country', { required: 'Країна обов\'язкова' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.country && <p className="mt-1 text-sm text-red-600">{errors.profile.country.message}</p>}
      </div>

      <div>
        <label htmlFor="house" className="block text-sm font-medium text-gray-700">
          Номер будинку
        </label>
        <input
          type="number"
          id="house"
          {...register('profile.house', { required: 'Номер будинку обов\'язковий' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.profile?.house && <p className="mt-1 text-sm text-red-600">{errors.profile.house.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
      </button>

      <div className="text-center">
        <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-500">
          Вже маєте аккаунт? Увійти
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
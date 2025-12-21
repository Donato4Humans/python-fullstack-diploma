import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk';
import { useDeleteUserMutation, useUpdateUserMutation } from '../../redux/api/userApi';
import { setUser, logout } from '../../redux/slices/userSlice';
import type { IUser } from '../../models/IUser';
import DeleteAccountModal from './DeleteAccountModal';
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ProfileFormData {
  name: string;
  surname: string;
  age: number;
  gender: string;
  street: string;
  city: string;
  region: string;
  country: string;
  house: number;
}

const ProfileEditForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  // Early return if no user (prevents hook calls)
  if (!user) {
    return <div className="text-center py-12 text-gray-600">Завантаження профілю...</div>;
  }

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { handleSubmit, register, formState: { errors }, setValue } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.profile?.name || '',
      surname: user.profile?.surname || '',
      age: user.profile?.age || 0,
      gender: user.profile?.gender || '',
      street: user.profile?.street || '',
      city: user.profile?.city || '',
      region: user.profile?.region || '',
      country: user.profile?.country || '',
      house: user.profile?.house || 0,
    },
  });

  useEffect(() => {
    setValue('name', user.profile?.name || '');
    setValue('surname', user.profile?.surname || '');
    setValue('age', user.profile?.age || 0);
    setValue('gender', user.profile?.gender || '');
    setValue('street', user.profile?.street || '');
    setValue('city', user.profile?.city || '');
    setValue('region', user.profile?.region || '');
    setValue('country', user.profile?.country || '');
    setValue('house', user.profile?.house || 0);
  }, [user, setValue]);

  const isSuperuser = user.is_superuser || false;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData = {
        profile: {
          name: data.name.trim(),
          surname: data.surname.trim(),
          age: data.age,
          gender: data.gender,
          street: data.street.trim(),
          city: data.city.trim(),
          region: data.region.trim(),
          country: data.country.trim(),
          house: data.house,
        },
      };

      const updatedUser = await updateUser({ id: user.id, data: updateData as Partial<IUser> }).unwrap();
      dispatch(setUser(updatedUser));
      setSuccessMsg('Профіль оновлено успішно!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      alert('Оновлення не вдалось');
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      dispatch(logout());
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Вихід не вдався', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.id).unwrap();
      dispatch(logout());
      navigate('/', { replace: true });
    } catch (error) {
      alert('Видалення не вдалось');
    }
  };

  if (isSuperuser) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border text-center">
        <h3 className="text-xl font-semibold mb-4">Супер Адміністратор</h3>
        <p className="text-gray-600 mb-6">
          У супер адмінів немає профілю для редагування (ім'я, адреса тощо). <br />
          Використовуйте меню для управління контентом.
        </p>
        <div className="space-y-4">
          <Link
            to="/profile/admin"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Перейти в адмін-панель
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Вийти з акаунту
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Видалити акаунт
          </button>
        </div>
        <DeleteAccountModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          isLoading={false}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Швидкі дії</h3>
          <ul className="space-y-2">
            <li><Link to="/profile/favorites" className="text-blue-600 hover:underline">Обране</Link></li>
            <li><Link to="/profile/comments" className="text-blue-600 hover:underline">Мої коментарі</Link></li>
            <li><Link to="/profile/reviews" className="text-blue-600 hover:underline">Мої оцінки</Link></li>
            <li><Link to="/profile/matches" className="text-blue-600 hover:underline">Мої схвалені запити</Link></li>
            <li><Link to="/profile/my-venues" className="text-blue-600 hover:underline">Мої заклади</Link></li>
            <li><Link to="/profile/security" className="text-blue-600 hover:underline">Безпека</Link></li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Вийти з акаунту
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Видалити акаунт
        </button>
        <DeleteAccountModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          isLoading={false}
        />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4">Редагувати профіль</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ім'я</label>
            <input
              {...register('name', { required: 'Ім\'я обов\'язкове' })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Прізвище</label>
            <input
              {...register('surname', { required: 'Прізвище обов\'язкове' })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.surname && <p className="text-red-600 text-sm">{errors.surname.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Вік</label>
            <input
              type="number"
              {...register('age', { required: 'Вік обов\'язковий', min: { value: 18, message: 'Мінімум 18 років' } })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && <p className="text-red-600 text-sm">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Стать</label>
            <select {...register('gender', { required: 'Стать обов\'язкова' })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Обрати</option>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
              <option value="other">Інше</option>
            </select>
            {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Вулиця</label>
            <input
              {...register('street')}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Місто</label>
            <input
              {...register('city')}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Регіон</label>
            <input
              {...register('region')}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Країна</label>
            <input
              {...register('country')}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Номер будинку</label>
            <input
              type="number"
              {...register('house')}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Зберегти зміни
          </button>
          {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
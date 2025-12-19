
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk';
import { useDeleteUserMutation, useUpdateUserMutation } from '../../redux/api/userApi';
import { setUser, logout } from '../../redux/slices/userSlice';
import type {IUser} from '../../models/IUser';
import DeleteAccountModal from './DeleteAccountModal';

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
  const user = useAppSelector((state) => state.user.user);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { handleSubmit, register, formState: { errors }, setValue } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.profile?.name || '',
      surname: user?.profile?.surname || '',
      age: user?.profile?.age || 0,
      gender: user?.profile?.gender || '',
      street: user?.profile?.street || '',
      city: user?.profile?.city || '',
      region: user?.profile?.region || '',
      country: user?.profile?.country || '',
      house: user?.profile?.house || 0,
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.profile?.name || '');
      setValue('surname', user.profile?.surname || '');
      setValue('age', user.profile?.age || 0);
      setValue('gender', user.profile?.gender || '');
      setValue('street', user.profile?.street || '');
      setValue('city', user.profile?.city || '');
      setValue('region', user.profile?.region || '');
      setValue('country', user.profile?.country || '');
      setValue('house', user.profile?.house || 0);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Send only profile fields — no id
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

      // Type is Partial<IUser> — profile is Partial<IProfile>
      const updatedUser = await updateUser({ id: user!.id, data: updateData as Partial<IUser> }).unwrap();
      dispatch(setUser(updatedUser));
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user!.id).unwrap();
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      dispatch(logout());
      navigate('/');
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left — Quick links */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <ul className="space-y-2">
            <li><Link to="/profile/favorites" className="text-blue-600 hover:underline">Favorites</Link></li>
            <li><Link to="/profile/comments" className="text-blue-600 hover:underline">My Comments</Link></li>
            <li><Link to="/profile/reviews" className="text-blue-600 hover:underline">My Reviews</Link></li>
            <li><Link to="/profile/matches" className="text-blue-600 hover:underline">My Matches</Link></li>
            <li><Link to="/profile/my-venues" className="text-blue-600 hover:underline">My Venues</Link></li>
            <li><Link to="/profile/security" className="text-blue-600 hover:underline">Security</Link></li>
          </ul>
        </div>

        {/* Delete button */}
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Delete Account
        </button>
          <DeleteAccountModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          isLoading={false}
          />
      </div>



      {/* Right — Edit form */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              {...register('name', { required: 'Name required' })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Surname</label>
            <input
              {...register('surname', { required: 'Surname required' })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.surname && <p className="text-red-600 text-sm">{errors.surname.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              {...register('age', { required: 'Age required', min: 18 })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.age && <p className="text-red-600 text-sm">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select {...register('gender', { required: 'Gender required' })} className="w-full p-3 border rounded-lg">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Street</label>
            <input
              {...register('street')}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              {...register('city')}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <input
              {...register('region')}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              {...register('country')}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">House Number</label>
            <input
              type="number"
              {...register('house')}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
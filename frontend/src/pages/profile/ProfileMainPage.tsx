
import ProfileEditForm from '../../components/profile/ProfileEditForm';

const ProfileMainPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Профіль
      </h1>
      <ProfileEditForm />
    </div>
  );
};

export default ProfileMainPage;
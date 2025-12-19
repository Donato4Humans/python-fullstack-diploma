
import { useGetUsersQuery, useDeleteUserMutation, useBlockUnblockUserMutation, useMakeCriticMutation } from '../../redux/api/userApi';

const AdminAllUsers = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();
  const [makeCritic] = useMakeCriticMutation();

  const handleDelete = async (userId: number) => {
    if (confirm('Delete user?')) {
      await deleteUser(userId);
    }
  };

  const handleBlockUnblock = async (userId: number, isBlocked: boolean) => {
    let action : 'block' | 'unblock'
    if(isBlocked){
        action = 'unblock'
    }else{
        action = 'block'
    }

    await blockUnblockUser({ id: userId, data: { action: action } });
  };

  const handleMakeCritic = async (userId: number) => {
    await makeCritic(userId);
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Users ({users.length})</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow border flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-600">
                {user.profile?.name} {user.profile?.surname} |
                {user.is_superuser ? ' Superadmin' : user.is_critic ? ' Critic' : ' User'}
                {user.is_active && ' | Blocked'}
              </p>
            </div>
            <div className="space-x-2">
              {!user.is_superuser && (
                <>
                  <button
                    onClick={() => handleBlockUnblock(user.id, user.is_active)}
                    className={`px-4 py-2 rounded text-white ${user.is_active ? 'bg-green-600' : 'bg-orange-600'}`}
                  >
                    {user.is_active ? 'Unblock' : 'Block'}
                  </button>
                  {!user.is_critic && (
                    <button
                      onClick={() => handleMakeCritic(user.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                      Make Critic
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAllUsers;
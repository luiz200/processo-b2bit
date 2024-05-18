import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/ConfigAPI';

interface Avatar {
  id: number;
  image_high_url: string;
  image_medium_url: string;
  image_low_url: string;
}

interface Role {
  value: number;
  label: string;
}

interface User {
  id: string;
  avatar: Avatar;
  name: string;
  last_name: string;
  email: string;
  role: Role;
  last_login: string;
  staff_role: Role;
}

const Profile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true); // Estado de loading

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<User>('/auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json;version=v1_web',
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Define loading como false após a requisição
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <button
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="name">
            Your Name
          </label>
          <p id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker">
            {user?.name}
          </p>
        </div>
        <div className="mb-6">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
            Your E-mail
          </label>
          <p id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    about: '',
    bio_name: '',
    my_email: '',
    tech: '',
    avatar: 'https://via.placeholder.com/150',
  });

  const { backendUrl } = useContext(OmsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      if (!data.staff || !data.staff.id) {
        console.error('Staff object or id is missing in the profile data.');
        return;
      }

      const avatarUrl = data.avatar ? `${backendUrl}${data.avatar.url}` : 'https://via.placeholder.com/150';
      setProfile({
        id: data.id,
        bio: data.bio || '',
        location: data.location || '',
        about: data.about || '',
        bio_name: data.bio_name || '',
        my_email: data.my_email || '',
        tech: data.tech || '',
        avatar: { url: avatarUrl },
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleInputChange = (name, value) => {
    setProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      setProfile((prevData) => ({
        ...prevData,
        avatar: { url: URL.createObjectURL(file) },
        avatarFile: file,
      }));
    } else {
      setProfile((prevData) => ({
        ...prevData,
        avatar: { url: 'https://via.placeholder.com/150' },
        avatarFile: null,
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Profile ID:', profile.id);
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();

      if (profile.avatarFile) {
        formData.append('avatar', profile.avatarFile);
      }
      if (profile.bio !== undefined) {
        formData.append('bio', profile.bio);
      }
      if (profile.about !== undefined) {
        formData.append('about', profile.about);
      }
      if (profile.location !== undefined) {
        formData.append('location', profile.location);
      }
      if (profile.bio_name !== undefined) {
        formData.append('bio_name', profile.bio_name);
      }
      if (profile.my_email !== undefined) {
        formData.append('my_email', profile.my_email);
      }
      if (profile.tech !== undefined) {
        formData.append('tech', profile.tech);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (profile.id) {
        await axios.put(`${backendUrl}/profiles/${profile.id}`, formData, config);
        console.log('Profile data updated successfully!');
        setIsEditing(false);
      } else {
        const response = await axios.post(`${backendUrl}/profiles`, formData, config);
        console.log('New profile created successfully!', response.data);
        setProfile((prevData) => ({
          ...prevData,
          id: response.data.id,
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile data:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-indigo-700 to-indigo-900">
      <header className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-full border-4 border-white shadow-lg"
                  src={profile.avatar.url}
                  alt="Avatar"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label className="cursor-pointer text-indigo-200 hover:text-white transition duration-300">
                      Change Avatar
                      <input
                        type="file"
                        name="avatar"
                        onChange={handleAvatarChange}
                        accept=".jpg, .jpeg, .png"
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="ml-4">
                {isEditing ? (
                  <>
                    <input
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="bg-transparent w-48 border-b-2 border-indigo-300 focus:border-indigo-400 outline-none text-white text-lg placeholder-indigo-200"
                      placeholder="Edit Bio"
                    />
                    <input
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-transparent w-48 border-b-2 border-indigo-300 focus:border-indigo-400 outline-none text-white text-lg mt-2 placeholder-indigo-200"
                      placeholder="Edit Location"
                    />
                    <input
                      value={profile.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      className="bg-transparent w-48 border-b-2 border-indigo-300 focus:border-indigo-400 outline-none text-white text-lg mt-2 placeholder-indigo-200"
                      placeholder="Edit About"
                    />
                  </>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-200">{profile.bio}</h2>
                    <h3 className="text-lg text-indigo-300">{profile.location}</h3>
                    <p className="text-indigo-400 mt-1">{profile.about}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white text-lg font-semibold"
                    onClick={handleSubmit}
                  >
                    Save Profile
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md text-white text-lg font-semibold"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white text-lg font-semibold"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-md rounded-lg px-4 py-6">
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <input
                    value={profile.bio_name}
                    onChange={(e) => handleInputChange('bio_name', e.target.value)}
                    className="bg-indigo-50 rounded-lg w-full py-2 px-4 outline-none text-indigo-700 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300"
                    placeholder="Edit Bio Name"
                  />
                  <input
                    value={profile.my_email}
                    onChange={(e) => handleInputChange('my_email', e.target.value)}
                    className="bg-indigo-50 rounded-lg w-full py-2 px-4 outline-none text-indigo-700 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300"
                    placeholder="Edit Email"
                  />
                  <input
                    value={profile.tech}
                    onChange={(e) => handleInputChange('tech', e.target.value)}
                    className="bg-indigo-50 rounded-lg w-full py-2 px-4 outline-none text-indigo-700 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300"
                    placeholder="Edit Tech"
                  />
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-indigo-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.293 1.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L16.586 8 11.293 2.707a1 1 0 010-1.414zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-indigo-700">Bio Name:</h2>
                      <p className="text-indigo-700">{profile.bio_name}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-indigo-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a2 2 0 012-2h10a2 2 0 012 2v1h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V3zm6 5a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-indigo-700">Email:</h2>
                      <p className="text-indigo-700">{profile.my_email}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-indigo-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 2.293a1 1 0 011.414 0L16 9.586V8a2 2 0 00-2-2H6a2 2 0 00-2 2v1.586l7.293-7.293zM2 11a2 2 0 012-2h6a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5zm11 1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-indigo-700">Tech:</h2>
                      <p className="text-indigo-700">{profile.tech}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
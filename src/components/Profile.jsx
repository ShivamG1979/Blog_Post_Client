import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/App_context";

const Profile = () => {
  const { user, getCurrentUser, isAuthenticated } = useContext(AppContext);

  useEffect(() => {
    if (isAuthenticated && !user) {
      getCurrentUser();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Please login to view your profile.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;

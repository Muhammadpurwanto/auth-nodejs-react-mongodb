import React, { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setProfile(res.data);
      } catch (error) {
        logout();
      }
    };
    fetchProfile();
  }, [logout]);

  return (
    <div>
      <h2>Dashboard</h2>
      {profile && (
        <div>
          <p>Welcome, {profile.name}</p>
          <p>Email: {profile.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

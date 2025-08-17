import React, { useEffect, useState } from "react";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && token.split(".").length === 3) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setEmail(payload.email || "");
        setUsername(payload.username || payload.name || "");
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-900">Account / Profile</h2>
      <div className="text-gray-700">User: <span className="font-medium">{username || "-"}</span></div>
      <div className="text-gray-700">Email: <span className="font-medium">{email || "-"}</span></div>
    </div>
  );
};

export default Profile;



import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect } from "react";

const ProfileTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profile/claims");
  }, []) 

  return (
    <div className="flex space-x-4 border-b">
      <Link to="/profile/claims" className={location.pathname.startsWith("/profile/claims") ? "font-bold border-b-2" : ""} >Your Claims</Link>
      <Link to="/profile/related-claims" className={location.pathname.includes("/related-claims") ? "font-bold border-b-2" : ""}>Related claims</Link>
      <Link to="/profile/identity" className={location.pathname.includes("/identity") ? "font-bold border-b-2" : ""}>Your identity</Link>
      <Link to="/profile/followers" className={location.pathname.includes("/followers") ? "font-bold border-b-2" : ""}>Followers</Link>
      <Link to="/profile/following" className={location.pathname.includes("/following") ? "font-bold border-b-2" : ""}>Following</Link>
    </div>
  )
};

export default ProfileTabs;

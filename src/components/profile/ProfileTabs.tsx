import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect } from "react"

const ProfileTabs = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === "/profile") {
      navigate("/profile/claims/all")
    }
  }, [location.pathname])

  const isClaims = location.pathname.startsWith("/profile/claims")
  const isIdentities = location.pathname.startsWith("/profile/identities")

  return (
    <>
      <div className="flex gap-6 border-b pb-2">
        <Link
          to="/profile/claims/all"
          className={`text-sm font-semibold ${isClaims ? "border-b-2" : ""}`}
        >
          Claims
        </Link>
        <Link
          to="/profile/identities/all"
          className={`text-sm font-semibold ${isIdentities ? "border-b-2" : ""}`}
        >
          Identities
        </Link>
        <Link
          to="/profile/followers"
          className={`text-sm font-semibold ${location.pathname === "/profile/followers" ? "border-b-2" : ""}`}
        >
          Followers
        </Link>
        <Link
          to="/profile/following"
          className={`text-sm font-semibold ${location.pathname === "/profile/following" ? "border-b-2" : ""}`}
        >
          Followings
        </Link>
      </div>

      {(isClaims || isIdentities) && (
        <div className="flex gap-4 justify-center mt-1 mb-1">
          {isClaims && (
            <>
              <Link
                to="/profile/claims/all"
                className={`px-3 py-1 rounded-full border text-xs italic ${
                  location.pathname === "/profile/claims/all"
                    ? "bg-white text-black font-semibold"
                    : "border-gray-600 text-gray-400 hover:bg-gray-800"
                }`}
              >
                All claims
              </Link>
              <Link
                to="/profile/claims/created"
                className={`px-3 py-1 rounded-full border text-xs italic ${
                  location.pathname === "/profile/claims/created"
                    ? "bg-white text-black font-semibold"
                    : "border-gray-600 text-gray-400 hover:bg-gray-800"
                }`}
              >
                Created claims
              </Link>
            </>
          )}
          {isIdentities && (
            <>
              <Link
                to="/profile/identities/all"
                className={`px-3 py-1 rounded-full border text-[11px] italic ${
                  location.pathname === "/profile/identities/all"
                    ? "bg-white text-black font-semibold"
                    : "border-gray-600 text-gray-400 hover:bg-gray-800"
                }`}
              >
                All identities
              </Link>
              <Link
                to="/profile/identities/created"
                className={`px-3 py-1 rounded-full border text-[11px] italic ${
                  location.pathname === "/profile/identities/created"
                    ? "bg-white text-black font-semibold"
                    : "border-gray-600 text-gray-400 hover:bg-gray-800"
                }`}
              >
                Created identities
              </Link>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ProfileTabs

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
      {/* Onglets principaux */}
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
          Following
        </Link>
      </div>

      {/* Sous-onglets dynamiques */}
      {(isClaims || isIdentities) && (
        <div className="flex gap-4 mt-2 mb-4 ml-2 text-xs italic text-gray-400">
          {isClaims && (
            <>
              <Link
                to="/profile/claims/all"
                className={location.pathname === "/profile/claims/all" ? "font-semibold underline text-gray-200" : ""}
              >
                All claims
              </Link>
              <Link
                to="/profile/claims/created"
                className={location.pathname === "/profile/claims/created" ? "font-semibold underline text-gray-200" : ""}
              >
                Created claims
              </Link>
            </>
          )}
          {isIdentities && (
            <>
              <Link
                to="/profile/identities/all"
                className={location.pathname === "/profile/identities/all" ? "font-semibold underline text-gray-200" : ""}
              >
                All identities
              </Link>
              <Link
                to="/profile/identities/created"
                className={location.pathname === "/profile/identities/created" ? "font-semibold underline text-gray-200" : ""}
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

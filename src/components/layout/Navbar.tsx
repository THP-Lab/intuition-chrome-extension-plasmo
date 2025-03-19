import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <Link to="/" > Home </Link>
      <Link to="/profile" > Profil </Link>
      <Link to="/feed" > Feed </Link>

    </>
  )
}


export default Navbar;
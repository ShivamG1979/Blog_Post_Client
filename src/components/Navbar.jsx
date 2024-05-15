import React, { useContext } from "react";
import { AppContext } from "../context/App_context";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const data = useContext(AppContext);
  return (
    <>
      <div className="nav_bar " >
        <Link to ={'/'}className="left_brand">
          <h2>SHIVA</h2>
        
        </Link>
        <div className="right">
          {data.isAuthenticated && (
            <Link to={'/addpost'} className="btn btn-danger">AddPost</Link>
          )} 
          {data.isAuthenticated && (
            <button className="btn btn-info" onClick={data.logOut}>LogOut</button>
          )}
          {!data.isAuthenticated && (
            <Link to ={'/login'} className="btn btn-primary">Login</Link>
          )}
          {!data.isAuthenticated && (
            <Link to ={'/register'} className="btn btn-warning">Sign Up</Link>
          )}
          {data.isAuthenticated && <CgProfile style={{fontSize:'2.2rem'}}/> }


       </div>
      </div>
    </>
  );
};

export default Navbar;

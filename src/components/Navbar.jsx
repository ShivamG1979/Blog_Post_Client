import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_context";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes, FaBlog, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const data = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  // Close mobile menu when navigating
  const closeNavMenu = () => {
    if (isNavExpanded) setIsNavExpanded(false);
  };
  
  const handleLogout = () => {
    data.logOut();
    toast.info("You have been logged out", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    closeNavMenu();
    navigate("/");
  };
  
  // Handle Posts link click
  const handlePostsClick = (e) => {
    closeNavMenu();
    
    if (!data.isAuthenticated) {
      e.preventDefault();
      // Navigate to home with a query parameter to show random posts view
      navigate("/?view=random-posts");
      
      // Show a toast notification
      toast.info("Please log in to see all posts", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  
  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link to={'/'} className="navbar-brand d-flex align-items-center" onClick={closeNavMenu}>
          <FaBlog className="me-2" size={24} />
          <h2 className="m-0 d-none d-sm-block">BLOG POST</h2>
          <h2 className="m-0 d-block d-sm-none">BLOG</h2>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          {isNavExpanded ? 
            <FaTimes className="text-light" size={24} /> : 
            <FaBars className="text-light" size={24} />
          }
        </button>
        
        <div className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link 
                to={'/'} 
                className={`nav-link px-3 py-2 ${isActive('/')}`}
                onClick={closeNavMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
  <Link 
    to={'/about'} 
    className={`nav-link px-3 py-2 ${isActive('/about')}`}
    onClick={closeNavMenu}
  >
    About
  </Link>
</li>
            <li className="nav-item">
              {data.isAuthenticated ? (
                <Link 
                  to={'/posts'} 
                  className={`nav-link px-3 py-2 ${isActive('/posts')}`}
                  onClick={closeNavMenu}
                >
                  Posts
                </Link>
              ) : (
                <a 
                  href="#" 
                  className={`nav-link px-3 py-2 ${isActive('/posts')}`}
                  onClick={handlePostsClick}
                >
                  Posts
                </a>
              )}
            </li>

            {data.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link 
                    to={'/addpost'} 
                    className={`nav-link px-3 py-2 ${isActive('/addpost')}`}
                    onClick={closeNavMenu}
                  >
                    <FaPlus className="d-lg-none me-2" /> 
                    <span>Add Post</span>
                  </Link>
                </li>
               
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button 
                    className="btn btn-outline-light d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <Link 
                    to={'/profile'} 
                    className={`nav-link px-3 py-2 ${isActive('/profile')}`}
                    onClick={closeNavMenu}
                  >
                    <CgProfile className="me-lg-0 me-2" size={22} />
                    <span className="d-inline d-lg-none">Profile</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mt-2 mt-lg-0">
                  <Link 
                    to={'/login'} 
                    className={`nav-link px-3 py-2 ${isActive('/login')}`}
                    onClick={closeNavMenu}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link 
                    to={'/register'} 
                    className="btn btn-primary"
                    onClick={closeNavMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
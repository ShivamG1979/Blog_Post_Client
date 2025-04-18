import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Quick Links</h5>
            <ul className="list-unstyled mb-0">
            <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/posts" className="text-white text-decoration-none">Posts</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-white text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white text-decoration-none">Register</Link>
              </li>
             
              
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" />
                <span>123 Blog Street, Content City</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-2" />
                <span>contact@blogworld.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-2" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Newsletter</h5>
            <p className="mb-3">
              Subscribe to our newsletter to get the latest updates on new posts and features.
            </p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
                aria-label="Your email" 
              />
              <button 
                className="btn btn-primary" 
                type="button"
              >
                Subscribe
              </button>
            </div>
            <div className="d-flex mt-4">
              <a href="#!" className="text-white me-4">
                <FaFacebook size={20} />
              </a>
              <a href="#!" className="text-white me-4">
                <FaTwitter size={20} />
              </a>
              <a href="#!" className="text-white me-4">
                <FaInstagram size={20} />
              </a>
              <a href="#!" className="text-white">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 mt-4 border-top border-secondary">
          <p className="mb-0">
            © {currentYear} BlogWorld. All rights reserved. Made with <FaHeart className="text-danger mx-1" /> by Blog Developers
          </p>
          {/* Added privacy policy and terms links */}
          <div className="mt-2">
            <Link to="/privacy" className="text-white text-decoration-none mx-2">Privacy Policy</Link>
            <span className="text-white">|</span>
            <Link to="/terms" className="text-white text-decoration-none mx-2">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
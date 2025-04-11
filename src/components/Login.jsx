// LoginPage.jsx
import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const data = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const returndata = await data.login(email, password);

      if (returndata.token) {
        // Success case
        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        setTimeout(() => {
          navigate("/posts");
        }, 2000);
      } else {
        // Error case
        toast.error(
          returndata.message || "Login failed. Please check your credentials.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          }
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7 col-sm-9">
              <div className="auth-card card border-0 shadow-lg">
                {/* Header with wave decoration */}
                <div className="auth-header bg-primary text-white py-4 position-relative">
                  <div className="auth-header-content text-center">
                    <FaUserCircle size={50} className="mb-2" />
                    <h3 className="mb-1 fw-bold">Welcome Back</h3>
                    <p className="mb-0">Sign in to continue to your account</p>
                  </div>
                  <div className="wave-decoration">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1440 320"
                    >
                      <path
                        fill="white"
                        fillOpacity="1"
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="card-body p-4 pt-2">
                  <form onSubmit={handleSubmit} className="auth-form">
                    <div className="mb-4 input-group-custom">
                      <div className="input-group-icon">
                        <FaEnvelope className="text-muted" />
                      </div>
                      <div className="flex-grow-1">
                        <label
                          htmlFor="email"
                          className="form-label small text-muted mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className={`form-control form-control-lg border-0 bg-light ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          id="email"
                          placeholder="name@example.com"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 position-relative">
                      <div className="input-group-icon">
                        <FaLock className="text-muted" />
                      </div>

                      <label
                        htmlFor="password"
                        className="form-label small text-muted mb-1"
                      >
                        Password
                      </label>

                      <div className="position-relative">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          className={`form-control form-control-lg border-0 bg-light pe-5 ${
                            errors.password ? "is-invalid" : ""
                          }`} // pe-5 adds space for the icon
                          id="password"
                          placeholder="Enter your password"
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}

                        <div
                          className="position-absolute top-50 end-0 translate-middle-y me-3"
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                        />
                        <label
                          className="form-check-label small"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-primary small">
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" /> Log In
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="card-footer bg-white border-0 p-4 text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary fw-bold">
                      Register
                    </Link>
                  </p>
                </div>
              </div>

              {/* Social login options */}
              <div className="text-center mt-4">
                <p className="text-muted small">Or Register with</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-outline-secondary btn-social">
                    <i className="fab fa-google"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-social">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-social">
                    <i className="fab fa-twitter"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const data = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const returndata = await data.Register(name, email, password);

      if (returndata.message === "User Register Successfully!") {
        toast.success("Registration successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          onClose: () => navigate("/login"), // redirect after toast
        });
      } else {
        toast.error(
          returndata.message || "Registration failed. Please try again.",
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
                    <FaUserPlus size={50} className="mb-2" />
                    <h3 className="mb-1 fw-bold">Create Account</h3>
                    <p className="mb-0">Join our community of bloggers</p>
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
                    {/* Name Field */}
                    <div className="mb-3 input-group-custom">
                      <div className="input-group-icon">
                        <FaUser className="text-muted" />
                      </div>
                      <div className="flex-grow-1">
                        <label
                          htmlFor="name"
                          className="form-label small text-muted mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className={`form-control form-control-lg border-0 bg-light ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          id="name"
                          placeholder="Hello World"
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-3 input-group-custom">
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

                    {/* Password Field */}
                    <div className="mb-3 input-group-custom">
                      <div className="input-group-icon">
                        <FaLock className="text-muted" />
                      </div>
                      <div className="flex-grow-1">
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
                            }`}
                            id="password"
                            placeholder="Create a password"
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
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4 input-group-custom">
                      <div className="input-group-icon">
                        <FaCheckCircle className="text-muted" />
                      </div>
                      <div className="flex-grow-1">
                        <label
                          htmlFor="confirmPassword"
                          className="form-label small text-muted mb-1"
                        >
                          Confirm Password
                        </label>
                        <div className="position-relative">
                          <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={showConfirmPassword ? "text" : "password"}
                            className={`form-control form-control-lg border-0 bg-light pe-5 ${
                              errors.confirmPassword ? "is-invalid" : ""
                            }`}
                            id="confirmPassword"
                            placeholder="Re-enter your password"
                          />
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">
                              {errors.confirmPassword}
                            </div>
                          )}
                          <div
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeTerms"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="agreeTerms"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-primary">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="me-2" /> Register
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="card-footer bg-white border-0 p-4 text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
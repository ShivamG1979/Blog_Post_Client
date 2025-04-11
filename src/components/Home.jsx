import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/App_context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaArrowRight, FaLock, FaRegHeart, FaRegComments, FaSignInAlt } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const data = useContext(AppContext);
  const [randomPosts, setRandomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're showing the random posts view
  const searchParams = new URLSearchParams(location.search);
  const isRandomPostsView = searchParams.get('view') === 'random-posts';
  
  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };
  
  useEffect(() => {
    if (data.posts && data.posts.length > 0) {
      // Get 5 random posts from the available posts
      const getRandomPosts = () => {
        const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(4, shuffled.length));
      };
      
      setRandomPosts(getRandomPosts());
    }
    
    // Short loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [data.posts]);

  // Handler for when non-logged in users try to interact with posts
  const handleLoginPrompt = () => {
    if (!data.isAuthenticated) {
      toast.info("Please log in to interact with posts", toastConfig);
    }
  };
  
  // Handler for post click
  const handlePostClick = (e) => {
    if (!data.isAuthenticated) {
      e.preventDefault();
      toast.info("Please log in to see full posts", toastConfig);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      navigate('/posts');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show only the random posts section when in random posts view
  if (isRandomPostsView) {
    return (
      <>
        <ToastContainer />
        <div className="container my-5">
          {/* Featured Posts Section - Larger display for random posts view */}
          <section>
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">Featured Posts</h1>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <p className="lead text-muted">
                    Discover our most engaging content. <span className="badge bg-primary">Log in to see more!</span>
                  </p>
                </div>
              </div>
              <div className="w-25 mx-auto my-4 border-bottom border-3 border-primary"></div>
            </div>
            
            <div className="row g-4">
              {randomPosts.length > 0 ? (
                randomPosts.map((post) => (
                  <div key={post._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-lg border-0 overflow-hidden transition-card">
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                          <FaLock className="me-1" /> Login to view
                        </span>
                      </div>
                      <div className="card-img-wrapper position-relative" style={{ height: "220px" }}>
                        <img 
                          src={post.imgUrl} 
                          className="card-img-top h-80 w-80"
                          alt={post.title}
                          style={{ objectFit: "cover", filter: "brightness(0.95)", transition: "transform 0.3s ease" }}
                          onClick={handlePostClick}
                        />
                        <div className="card-img-overlay d-flex align-items-end" style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.7))" }}>
                          <h5 className="card-title text-white mb-0 fw-bold">{post.title}</h5>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text text-muted">
                          {post.description.length > 120 
                            ? `${post.description.substring(0, 120)}...` 
                            : post.description}
                        </p>
                      </div>
                      <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={handleLoginPrompt}
                          >
                            <FaRegHeart /> <span className="ms-1">{post.likes?.length || 0}</span>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleLoginPrompt}
                          >
                            <FaRegComments /> <span className="ms-1">{post.comments?.length || 0}</span>
                          </button>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary rounded-pill px-3"
                          onClick={handlePostClick}
                        >
                          Read More <FaArrowRight className="ms-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No posts available yet. Be the first to create one!</p>
                </div>
              )}
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="py-5 mt-5 rounded-4 text-center" style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}>
            <div className="py-4">
              <h2 className="display-6 mb-3 text-white">Want to see all posts?</h2>
              <p className="lead mb-4 text-white opacity-90">Log in to access our full collection of amazing content.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4 fw-bold text-primary">
                  <FaSignInAlt className="me-2" /> Login Now
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Register
                </Link>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  // Regular home page view
  return (
    <>
      <ToastContainer />
      
      {/* Hero Section with gradient background */}
      <div className="position-relative overflow-hidden" style={{ 
        background: "linear-gradient(135deg,rgb(16, 85, 205) 0%,rgb(140, 59, 228) 100%)",
        minHeight: "70vh",
        color: "white"
      }}>
        <div className="position-absolute w-100 h-100" style={{ 
          backgroundImage: "url('/BLOG.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.1"
        }}></div>
        
        <div className="container position-relative py-5 h-100">
          <div className="row align-items-center" style={{ minHeight: "60vh" }}>
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4 animate-character">Share Your Thoughts With The World</h1>
              <p className="lead mb-5 opacity-90" style={{ fontSize: "1.2rem" }}>
                Create, share, and discover amazing content from writers around the globe.
                Join our community today and start sharing your unique perspective.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {data.isAuthenticated ? (
                  <Link to="/addpost" className="btn btn-light btn-lg text-primary fw-bold">
                    <FaPlus className="me-2" /> Create Post
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-light btn-lg text-primary fw-bold">
                    <FaSignInAlt className="me-2" /> Login to Create Posts
                  </Link>
                )}
                <button 
                  onClick={handlePostClick} 
                  className="btn btn-outline-light btn-lg"
                >
                  Browse Posts <FaArrowRight className="ms-2" />
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <img 
                src="/Blog.jpg" 
                alt="Blog" 
                className="img-fluid rounded-4 shadow-lg transform-img" 
                style={{ maxHeight: "500px", transform: "perspective(1000px) rotateY(-10deg)" }}
              />
            </div>
          </div>
        </div>
        <div className="wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill" fill="#fff"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill" fill="#fff"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill" fill="#fff"></path>
          </svg>
        </div>
      </div>
      
      <div className="container my-5">
        {/* Featured Posts Section */}
        <section className="my-5 pt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="badge bg-primary mb-2">FEATURED</span>
              <h2 className="h2 fw-bold mb-0">Popular Posts</h2>
            </div>
            <button 
              onClick={handlePostClick}
              className="btn btn-link text-decoration-none p-0 text-primary"
            >
              View All <FaArrowRight className="ms-1" />
            </button>
          </div>
          
          <div className="row g-3 mt-2">
  {randomPosts.length > 0 ? (
    randomPosts.map((post) => (
      <div key={post._id} className="col-md-4 col-lg-3">
        <div className="card shadow-sm border-0 hover-card h-100" style={{ maxWidth: "280px", margin: "0 auto" }}>
          {!data.isAuthenticated && (
            <div className="position-absolute top-0 end-0 m-2 z-1">
              <span className="badge bg-dark bg-opacity-75 d-flex align-items-center" style={{ fontSize: "0.7rem" }}>
                <FaLock className="me-1" /> Login
              </span>
            </div>
          )}
          <div className="overflow-hidden">
            <img 
              src={post.imgUrl} 
              className="card-img-top"
              alt={post.title}
              style={{ 
                height: "200px", 
                objectFit: "cover", 
                filter: !data.isAuthenticated ? "brightness(0.9)" : "none",
                transition: "transform 0.5s ease"
              }}
              onClick={handlePostClick}
            />
          </div>
          <div className="card-body p-3">
            <h6 className="card-title fw-bold mb-1" style={{ lineHeight: "1.3" }}>{post.title}</h6>
            <p className="card-text text-muted small mb-2">
              {post.description.length > 60 
                ? `${post.description.substring(0, 60)}...` 
                : post.description}
            </p>
          </div>
          <div className="card-footer bg-white border-0 p-3 pt-0">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                <button 
                  className="btn btn-sm p-1 text-danger"
                  onClick={handleLoginPrompt}
                  style={{ fontSize: "0.75rem" }}
                >
                  <FaRegHeart /> {post.likes?.length || 0}
                </button>
                <button 
                  className="btn btn-sm p-1 text-primary"
                  onClick={handleLoginPrompt}
                  style={{ fontSize: "0.75rem" }}
                >
                  <FaRegComments /> {post.comments?.length || 0}
                </button>
              </div>
              <button 
                className="btn btn-sm btn-primary rounded-pill"
                onClick={handlePostClick}
                style={{ fontSize: "0.75rem" }}
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-12 text-center py-3">
      <p className="text-muted small">No posts available yet. Be the first to create one!</p>
    </div>
  )}
</div>
        </section>
        
        {/* Call to Action */}
        <section className="py-1 rounded-4 text-center mt-5 overflow-hidden position-relative" 
          style={{ 
            background: "linear-gradient(to right,rgb(3, 25, 42),rgb(22, 16, 45))",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
          }}>
          <div className="py-5 position-relative">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              backgroundImage: "url('giphy.webp')",
              opacity: 0.2
            }}></div>
            <h2 className="display-5 mb-3 text-white fw-bold">Ready to share your story?</h2>
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <p className="lead mb-4 text-white opacity-90">Join our community and start creating your own content today.</p>
              </div>
            </div>
            {data.isAuthenticated ? (
              <Link to="/addpost" className="btn btn-light btn-lg px-4 text-primary fw-bold">
                <FaPlus className="me-2" /> Create Your First Post
              </Link>
            ) : (
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4 text-primary fw-bold">
                  <FaSignInAlt className="me-2" /> Login Now
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Register
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <style >{`
        .hover-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
        
        .hover-card:hover img {
          transform: scale(1.05);
        }
        
        .transition-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .animate-character {
          background-image: linear-gradient(
            -225deg,
            #ffffff 0%,
            #e5e5e5 29%,
            #ffffff 67%,
            #ffffff 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textclip 3s linear infinite;
        }
        
        @keyframes textclip {
          to {
            background-position: 200% center;
          }
        }
        
        .transform-img {
          transition: transform 0.5s ease;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        
        .wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 50px;
        }
      `}</style>
    </>
  );
};

export default Home;
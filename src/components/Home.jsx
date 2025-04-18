import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/App_context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaArrowRight, FaLock, FaRegHeart, FaRegComments, FaSignInAlt, FaEye, FaClock, FaTags, FaSearch } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { posts, isAuthenticated } = useContext(AppContext);
  const [randomPosts, setRandomPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (posts && posts.length > 0) {
      // Get random posts from the available posts
      const shuffled = [...posts].sort(() => 0.5 - Math.random());
      setRandomPosts(shuffled.slice(0, Math.min(4, shuffled.length)));
      
      // Set a featured post (post with most likes or comments)
      const sortedByEngagement = [...posts].sort((a, b) => 
        ((b.likes?.length || 0) + (b.comments?.length || 0)) - 
        ((a.likes?.length || 0) + (a.comments?.length || 0))
      );
      setFeaturedPost(sortedByEngagement[0] || shuffled[0]);
    }
    
    // Simulated loading time
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [posts]);

  // Handler for when non-logged in users try to interact with posts
  const handleLoginPrompt = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to interact with posts", toastConfig);
    }
  };
  
  // Handler for post click
  const handlePostClick = (e, postId) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info("Please log in to see full posts", toastConfig);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      navigate(postId ? `/post/${postId}` : '/posts');
    }
  };

  // Format date (simulated as posts don't have dates in the provided code)
  const formatDate = (post) => {
    // This would use the post's actual date in a real app
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    return randomDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Loader component
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "70vh" }}>
        <div className="spinner-grow text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="text-muted">Loading amazing content...</p>
      </div>
    );
  }

  // Random posts view
  if (isRandomPostsView) {
    return (
      <>
        <ToastContainer />
        <div className="container py-5">
          {/* Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6">
              <div className="input-group shadow-sm">
                <input 
                  type="text" 
                  className="form-control form-control-lg border-0" 
                  placeholder="Search posts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" type="button">
                  <FaSearch /> Search
                </button>
              </div>
            </div>
          </div>
          
          {/* Featured Posts Section */}
          <section>
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold" style={{ background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Featured Posts
              </h1>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <p className="lead text-muted">
                    Discover our most engaging content. <span className="badge text-bg-primary">Log in to see more!</span>
                  </p>
                </div>
              </div>
              <div className="w-25 mx-auto my-4 border-bottom border-3" style={{ borderColor: "#8E54E9" }}></div>
            </div>
            
            <div className="row g-4">
              {randomPosts.length > 0 ? (
                randomPosts.map((post) => (
                  <div key={post._id} className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow border-0 overflow-hidden" style={{ borderRadius: "1rem", transition: "transform 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge text-bg-dark bg-opacity-75 d-flex align-items-center">
                          <FaLock className="me-1" /> Login to view
                        </span>
                      </div>
                      <div className="position-relative" style={{ height: "220px" }}>
                        <img 
                          src={post.imgUrl} 
                          className="card-img-top h-100 w-100"
                          alt={post.title}
                          style={{ objectFit: "cover", filter: "brightness(0.95)" }}
                          onClick={(e) => handlePostClick(e, post._id)}
                        />
                        <div className="card-img-overlay d-flex flex-column justify-content-between" style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.7))" }}>
                          <div className="d-flex justify-content-between">
                            <span className="badge text-bg-primary">{post.category || 'Blog'}</span>
                            <span className="badge text-bg-light text-dark d-flex align-items-center">
                              <FaClock className="me-1" /> {formatDate(post)}
                            </span>
                          </div>
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
                          onClick={(e) => handlePostClick(e, post._id)}
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
          <section className="py-5 mt-5 rounded-4 text-center" style={{ background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)" }}>
            <div className="py-4">
              <h2 className="display-6 mb-3 text-white">Want to see all posts?</h2>
              <p className="lead mb-4 text-white">Log in to access our full collection of amazing content.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4 fw-bold" style={{ color: "#8E54E9" }}>
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

  // Regular home page view with enhanced UI
  return (
    <>
      <ToastContainer />
      
      {/* Hero Section with gradient overlay */}
      <div className="position-relative text-white overflow-hidden" style={{ minHeight: "80vh" }}>
        <div className="position-absolute w-100 h-100" style={{ 
          backgroundImage: "url('/BLOG.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}></div>
        <div className="position-absolute w-100 h-100" style={{ 
          background: "linear-gradient(135deg, rgba(71, 118, 230, 0.8) 0%, rgba(142, 84, 233, 0.7) 100%)",
          mixBlendMode: "multiply"
        }}></div>
        
        <div className="container position-relative py-5 h-100">
          <div className="row align-items-center" style={{ minHeight: "70vh" }}>
            <div className="col-lg-6">
              <span className="badge bg-light text-primary fs-6 px-3 py-2 mb-4 animate__animated animate__fadeInUp">The Ultimate Blogging Platform</span>
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
                Share Your Thoughts With The World
              </h1>
              <p className="lead mb-5 animate__animated animate__fadeInUp" style={{ fontSize: "1.2rem", animationDelay: "0.4s" }}>
                Create, share, and discover amazing content from writers around the globe.
                Join our community today and start sharing your unique perspective.
              </p>
              <div className="d-flex gap-3 flex-wrap animate__animated animate__fadeInUp" style={{ animationDelay: "0.6s" }}>
                {isAuthenticated ? (
                  <Link to="/addpost" className="btn btn-light btn-lg text-primary fw-bold">
                    <FaPlus className="me-2" /> Create Post
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-light btn-lg fw-bold" style={{ color: "#8E54E9" }}>
                    <FaSignInAlt className="me-2" /> Login to Create Posts
                  </Link>
                )}
                <button 
                  onClick={(e) => handlePostClick(e)}
                  className="btn btn-outline-light btn-lg"
                >
                  Browse Posts <FaArrowRight className="ms-2" />
                </button>
              </div>
              
              {/* Stats display */}
              <div className="row mt-5 pt-4 animate__animated animate__fadeInUp" style={{ animationDelay: "0.8s" }}>
                <div className="col-4">
                  <h3 className="fw-bold">{posts.length || 0}+</h3>
                  <p className="text-white-50">Blog Posts</p>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold">100+</h3>
                  <p className="text-white-50">Daily Users</p>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold">24/7</h3>
                  <p className="text-white-50">Support</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 d-none d-lg-block text-center">
              <img 
                src="/Blog.jpg" 
                alt="Blog" 
                className="img-fluid rounded-4 shadow-lg animate__animated animate__fadeInRight"
                style={{
                  maxHeight: "500px",
                  transform: "perspective(1000px) rotateY(-10deg)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container my-5">
        {/* Featured Post */}
        {featuredPost && (
          <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-danger mb-2">FEATURED</span>
                <h2 className="h2 fw-bold mb-0">Editor's Pick</h2>
              </div>
            </div>
            
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6">
                  <div className="position-relative h-100">
                    <img 
                      src={featuredPost.imgUrl} 
                      className="w-100 h-100"
                      alt={featuredPost.title}
                      style={{ objectFit: "cover" }}
                    />
                    {!isAuthenticated && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                           style={{ background: "rgba(0,0,0,0.4)" }}>
                        <div className="text-center">
                          <FaLock className="text-white mb-2" style={{ fontSize: "2rem" }} />
                          <p className="text-white mb-0">Login to view full content</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-body d-flex flex-column h-100 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="badge text-bg-primary px-3 py-2">{featuredPost.category || 'Featured'}</div>
                      <div className="d-flex align-items-center text-muted">
                        <FaClock className="me-1" /> {formatDate(featuredPost)}
                      </div>
                    </div>
                    <h3 className="card-title fw-bold mb-3">{featuredPost.title}</h3>
                    <p className="card-text flex-grow-1">
                      {featuredPost.description.length > 200 
                        ? `${featuredPost.description.substring(0, 200)}...` 
                        : featuredPost.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="d-flex gap-3">
                        <div className="d-flex align-items-center">
                          <FaRegHeart className="text-danger me-1" /> 
                          <span>{featuredPost.likes?.length || 0}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaRegComments className="text-primary me-1" /> 
                          <span>{featuredPost.comments?.length || 0}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaEye className="text-success me-1" /> 
                          <span>{Math.floor(Math.random() * 1000) + 100}</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary px-4 rounded-pill"
                        onClick={(e) => handlePostClick(e, featuredPost._id)}
                      >
                        Read Post <FaArrowRight className="ms-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Popular Posts Section with card hover effect */}
        <section className="my-5 py-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="badge text-bg-primary mb-2">POPULAR</span>
              <h2 className="h2 fw-bold mb-0">Trending Posts</h2>
            </div>
            <button 
              onClick={(e) => handlePostClick(e)}
              className="btn btn-link text-decoration-none p-0 text-primary"
            >
              View All <FaArrowRight className="ms-1" />
            </button>
          </div>
          
          <div className="row g-4 mt-2">
            {randomPosts.length > 0 ? (
              randomPosts.map((post) => (
                <div key={post._id} className="col-md-4 col-lg-3">
                  <div className="card shadow border-0 h-100" style={{ 
                    borderRadius: "0.8rem", 
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}>
                    {!isAuthenticated && (
                      <div className="position-absolute top-0 end-0 m-2 z-1">
                        <span className="badge text-bg-dark bg-opacity-75 d-flex align-items-center" style={{ fontSize: "0.7rem" }}>
                          <FaLock className="me-1" /> Login
                        </span>
                      </div>
                    )}
                    <div className="overflow-hidden position-relative" style={{ borderRadius: "0.8rem 0.8rem 0 0" }}>
                      <img 
                        src={post.imgUrl} 
                        className="card-img-top"
                        alt={post.title}
                        style={{ 
                          height: "180px", 
                          objectFit: "cover", 
                          filter: !isAuthenticated ? "brightness(0.9)" : "none",
                          transition: "transform 0.5s ease"
                        }}
                        onClick={(e) => handlePostClick(e, post._id)}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                      <div className="position-absolute bottom-0 start-0 m-2">
                        <span className="badge text-bg-light text-dark" style={{ fontSize: "0.7rem" }}>
                          <FaClock className="me-1" /> {formatDate(post)}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge text-bg-primary">{post.category || 'Blog'}</span>
                        <span className="d-flex align-items-center text-muted" style={{ fontSize: "0.8rem" }}>
                          <FaEye className="me-1" /> {Math.floor(Math.random() * 500) + 50}
                        </span>
                      </div>
                      <h6 className="card-title fw-bold mb-1" style={{ lineHeight: "1.3" }}>{post.title}</h6>
                      <p className="card-text text-muted small mb-2">
                        {post.description.length > 60 
                          ? `${post.description.substring(0, 60)}...` 
                          : post.description}
                      </p>
                      <div className="d-flex align-items-center mt-2 mb-2" style={{ fontSize: "0.8rem" }}>
                        <FaTags className="text-muted me-2" />
                        <span className="badge bg-light text-dark me-1">design</span>
                        <span className="badge bg-light text-dark">tech</span>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0 p-3 pt-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center" style={{ gap: "8px" }}>
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
                          className="btn btn-sm btn-primary rounded-pill px-3"
                          onClick={(e) => handlePostClick(e, post._id)}
                          style={{ fontSize: "0.75rem" }}
                        >
                          Read More
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
        
        {/* Newsletter Section */}
        <section className="my-5 py-5 rounded-4" style={{ background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h3 className="mb-3 fw-bold">Subscribe to our newsletter</h3>
                <p className="text-muted mb-4">Get the latest posts delivered right to your inbox</p>
                <div className="input-group mb-3 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
                  <input type="email" className="form-control form-control-lg" placeholder="Your email address" />
                  <button className="btn btn-primary btn-lg px-4" type="button">Subscribe</button>
                </div>
                <p className="small text-muted mt-2">No spam, we promise!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
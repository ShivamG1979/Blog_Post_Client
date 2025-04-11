import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/App_context";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const data = useContext(AppContext);
  const [randomPosts, setRandomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (data.posts && data.posts.length > 0) {
      // Get up to 6 random posts from the available posts
      const getRandomPosts = () => {
        const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(6, shuffled.length));
      };
      
      setRandomPosts(getRandomPosts());
    }
    
    // Short loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [data.posts]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">Share Your Thoughts With The World</h1>
          <p className="lead text-muted mb-4">
            Create, share, and discover amazing content from writers around the globe.
            Join our community today and start sharing your unique perspective.
          </p>
          <div className="d-flex gap-3">
            {data.isAuthenticated ? (
              <Link to="/addpost" className="btn btn-primary btn-lg">
                <FaPlus className="me-2" /> Create Post
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">
                Login to Create Posts
              </Link>
            )}
            <Link to="/posts" className="btn btn-outline-secondary btn-lg">
              Browse Posts <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block">
          <img 
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643" 
            alt="Blog" 
            className="img-fluid rounded shadow-lg" 
          />
        </div>
      </div>
      
      {/* Featured Posts Section */}
      <section className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3">Featured Posts</h2>
          <Link to="/posts" className="text-decoration-none">
            View All <FaArrowRight className="ms-1" />
          </Link>
        </div>
        
        <div className="row">
          {randomPosts.length > 0 ? (
            randomPosts.map((post) => (
              <div key={post._id} className="col-md-4 col-lg-2 mb-4">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={post.imgUrl} 
                    className="card-img-top" 
                    alt={post.title}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text small text-muted">
                      {post.description.length > 60 
                        ? `${post.description.substring(0, 60)}...` 
                        : post.description}
                    </p>
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
      <section className="py-5 bg-light rounded-3 text-center mt-5">
        <div className="py-4">
          <h2 className="display-6 mb-3">Ready to share your story?</h2>
          <p className="lead mb-4">Join our community and start creating your own content today.</p>
          {data.isAuthenticated ? (
            <Link to="/addpost" className="btn btn-primary btn-lg px-4">
              Create Your First Post
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg px-4">
             Register Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
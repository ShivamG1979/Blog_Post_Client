import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaPen, FaGlobe, FaEnvelope, FaChartLine } from "react-icons/fa";

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">About Us</h1>
              <div className="w-25 mx-auto my-3 border-bottom border-3"></div>
              <p className="lead mb-0">
                Discover the story behind our blogging platform and our mission to empower writers around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Our Story Section */}
        <section className="mb-5">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="h1 fw-bold mb-4">Our Story</h2>
              <p className="lead mb-4">
                Founded in 2021, BlogWorld started with a simple mission: to create a platform where writers could freely share their thoughts with the world.
              </p>
              <p className="mb-4">
                What began as a small community of passionate bloggers has grown into a global platform for content creators of all backgrounds. We believe that everyone has a unique perspective worth sharing, and our goal is to provide the tools and audience to make that possible.
              </p>
              <p>
                Today, we host thousands of blogs across various categories, from technology and travel to personal development and creative writing. Our community continues to grow as more people discover the power of sharing their voice online.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-lg h-100">
                <img 
                  src="/about-team.jpg" 
                  alt="Our Team" 
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/BLOG.webp";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-5">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="h1 fw-bold">Our Mission & Values</h2>
              <div className="w-25 mx-auto my-3 border-bottom border-3 border-primary"></div>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "80px", height: "80px" }}>
                    <FaUsers size={32} />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Community First</h3>
                  <p className="text-muted">
                    We believe in the power of community. Our platform is designed to foster connections between writers and readers, creating a supportive environment for everyone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "80px", height: "80px" }}>
                    <FaPen size={32} />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Creative Freedom</h3>
                  <p className="text-muted">
                    We champion creative freedom and provide a platform where writers can express themselves authentically without unnecessary restrictions or limitations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "80px", height: "80px" }}>
                    <FaGlobe size={32} />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Global Reach</h3>
                  <p className="text-muted">
                    We're committed to connecting writers with readers across the globe, breaking down geographical barriers and fostering cross-cultural understanding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-5">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="h1 fw-bold">Meet Our Team</h2>
              <div className="w-25 mx-auto my-3 border-bottom border-3 border-primary"></div>
              <p className="lead col-lg-8 mx-auto">
                The passionate individuals behind BlogWorld who work tirelessly to create the best platform for writers and readers alike.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img 
                  src="/team-1.jpg" 
                  className="card-img-top" 
                  alt="Team Member"
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x250?text=Team+Member";
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-1">SHIVAM GUPTA</h5>
                  <p className="text-primary mb-3">Founder & CEO</p>
                  <p className="card-text text-muted small">
                    With over 15 years of experience in digital publishing, Sarah leads our team with vision and passion.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img 
                  src="/team-2.jpg" 
                  className="card-img-top" 
                  alt="Team Member"
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x250?text=Team+Member";
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-1">Michael Chen</h5>
                  <p className="text-primary mb-3">CTO</p>
                  <p className="card-text text-muted small">
                    Michael oversees our technical infrastructure, ensuring a seamless experience for all users.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img 
                  src="/team-3.jpg" 
                  className="card-img-top" 
                  alt="Team Member"
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x250?text=Team+Member";
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-1">Elena Rodriguez</h5>
                  <p className="text-primary mb-3">Community Manager</p>
                  <p className="card-text text-muted small">
                    Elena works directly with our writers and readers to build a thriving, supportive community.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img 
                  src="/team-4.jpg" 
                  className="card-img-top" 
                  alt="Team Member"
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x250?text=Team+Member";
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-1">James Wilson</h5>
                  <p className="text-primary mb-3">Content Strategist</p>
                  <p className="card-text text-muted small">
                    James helps writers optimize their content and reach their target audience effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

       

      </div>
    </>
  );
};

export default About;
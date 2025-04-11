import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/App_context'; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart, FaRegHeart, FaRegComments, FaEdit, FaTrash, FaUser, FaUserCircle, FaChevronDown, FaChevronUp, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Post = () => {
  const data = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewLikes, setViewLikes] = useState({});
  const [activePost, setActivePost] = useState(null);
 
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

  // Load liked posts from localStorage if available
  useEffect(() => {
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      setLikedPosts(JSON.parse(savedLikedPosts));
    }
    
    // Shorter loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Save liked posts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  // Handle post menu toggle
  const togglePostMenu = (postId) => {
    setActivePost(activePost === postId ? null : postId);
  };

  const handleEdit = (post) => {
    setEditedPost({ ...post }); 
    setEditing(true);
    setActivePost(null);
  };

  const handleSubmitEdit = async () => {
    try {
      if (!editedPost.title.trim() || !editedPost.description.trim()) {
        toast.error("Title and description cannot be empty");
        return;
      }

      const res = await data.editPost(editedPost._id, editedPost);
      
      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }

      toast.success(res.message, toastConfig);

      data.setReload(!data.reload);
      setEditing(false);
    } catch (error) {
      toast.error("Failed to edit post");
    }
  };

  const handleLike = async (postId) => {
    if (!data.isAuthenticated) {
      toast.warning("Please login to like posts", toastConfig);
      return;
    }
    
    try {
      let res;
      
      if (likedPosts.includes(postId)) {
        // Handle unlike functionality - using the DELETE endpoint
        res = await data.unlikePostById(postId);
        
        if (res.error) {
          toast.error(res.error, toastConfig);
          return;
        }
        
        toast.success(res.message || "Post unliked successfully", toastConfig);
        
        setLikedPosts((prevLikedPosts) => prevLikedPosts.filter(id => id !== postId));
      } else {
        // Handle like functionality
        res = await data.likePostById(postId);
        
        if (res.error) {
          toast.error(res.error, toastConfig);
          return;
        }

        toast.success(res.message, toastConfig);

        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
      }
      
      // Reload the posts to update the likes count and liked by list
      data.setReload(!data.reload);
    } catch (error) {
      toast.error("Failed to process like action");
    }
  };

  const handleComment = async (postId) => {
    if (!data.isAuthenticated) {
      toast.warning("Please login to comment", toastConfig);
      return;
    }
    
    const commentInput = commentInputs[postId] || "";
    
    if (!commentInput.trim()) {
      toast.warning("Comment cannot be empty", toastConfig);
      return;
    }

    try {
      const res = await data.handleComment(postId, commentInput);
      
      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }

      toast.success(res.message, toastConfig);

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      // We don't hide comment input after posting to encourage more engagement
      data.setReload(!data.reload);
      
      // Auto-expand comments after posting
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    } catch (error) {
      toast.error("Failed to comment post");

    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      
      if (!confirmDelete) {
        return;
      }
      
      const res = await data.deletePost(id);
      
      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }
      
      toast.success(res.message, toastConfig);
      
      data.setReload(!data.reload);
      setActivePost(null);
    } catch (error) {
      toast.error("Failed to delete post");

    }
  };

  const toggleExpandComments = (postId) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleLikesView = (postId) => {
    setViewLikes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Function to check if there are any likes to display
  const hasLikes = (post) => {
    return post.likes && post.likes.length > 0;
  };

  // Function to check if a post has likedBy data
  const hasLikedByData = (post) => {
    return post.likedBy && Array.isArray(post.likedBy) && post.likedBy.length > 0;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading posts...</span>
      </div>
    );
  }

  const isPostOwner = (post) => {
    return data.isAuthenticated && post.userId === data.user?.id;
  };
  
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        limit={3}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="container py-4">
        {data.posts && data.posts.length > 0 ? (
          <div className="row g-4">
            {data.posts.map((post) => (
              <div key={post._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 overflow-hidden">
                  {/* Post Header - Date and options */}
                  <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '38px', height: '38px' }}>
                        <FaUserCircle size={20} />
                      </div>
                      <div>
                        {/* Removed the user name here */}
                        <small className="text-muted d-flex align-items-center">
                          <FaCalendarAlt size={10} className="me-1" />
                          {formatDate(post.createdAt)}
                        </small>
                      </div>
                    </div>
                    
                    {isPostOwner(post) && (
                      <div className="position-relative">
                        <button 
                          className="btn btn-sm btn-light rounded-circle" 
                          onClick={() => togglePostMenu(post._id)}
                        >
                          <FaEllipsisV />
                        </button>
                        
                        {activePost === post._id && (
                          <div className="position-absolute end-0 bg-white shadow-sm rounded border mt-1 py-1" 
                               style={{ width: '120px', zIndex: 1 }}>
                            <button 
                              className="dropdown-item d-flex align-items-center" 
                              onClick={() => handleEdit(post)}
                            >
                              <FaEdit className="me-2 text-warning" /> Edit
                            </button>
                            <button 
                              className="dropdown-item d-flex align-items-center" 
                              onClick={() => handleDelete(post._id)}
                            >
                              <FaTrash className="me-2 text-danger" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Post Image */}
                  <div className="position-relative">
                    <img 
                      src={post.imgUrl} 
                      className="card-img-top" 
                      alt={post.title} 
                      style={{ height: '300px', objectFit: 'cover' }} 
                    />
                  </div>
                  
                  {/* Post Content */}
                  <div className="card-body">
                    {editing && editedPost._id === post._id ? (
                      <div className="edit-form">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editedPost.title}
                            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                            placeholder="Title"
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Description</label>
                          <textarea
                            className="form-control"
                            value={editedPost.description}
                            onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                            rows="3"
                            placeholder="Description"
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Image URL</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editedPost.imgUrl}
                            onChange={(e) => setEditedPost({ ...editedPost, imgUrl: e.target.value })}
                            placeholder="Image URL"
                          />
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-success" onClick={handleSubmitEdit}>
                            <i className="fas fa-save me-1"></i> Save Changes
                          </button>
                          <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h5 className="card-title fw-bold mb-3">{post.title}</h5>
                        <p className="card-text text-muted">{post.description}</p>
                      </>
                    )}
                  </div>
                  
                  {/* Post Interactions */}
                  <div className="card-footer bg-white">
                    {/* Likes and Comments Buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <button 
                          className={`btn ${likedPosts.includes(post._id) ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                          onClick={() => handleLike(post._id)}
                        >
                          {likedPosts.includes(post._id) ? <FaHeart /> : <FaRegHeart />}
                          <span className="ms-2">{post.likes?.length || 0}</span>
                        </button>
                        
                        <button
                          className={`btn ${showCommentInput[post._id] ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setShowCommentInput((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
                        >
                          <FaRegComments />
                          <span className="ms-2">{post.comments?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Likes Section */}
                    {hasLikes(post) && (
                      <div className="mb-3 border-top pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <button 
                            className="btn btn-sm btn-link text-decoration-none p-0 text-dark"
                            onClick={() => toggleLikesView(post._id)}
                          >
                            <span className="fw-bold">Likes</span>
                            <span className="ms-2 text-primary">
                              {post.likes.length} {post.likes.length === 1 ? 'person' : 'people'}
                            </span>
                            {viewLikes[post._id] ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
                          </button>
                        </div>
                        
                        {viewLikes[post._id] && (
                          <div className="mt-2 likes-list">
                            {hasLikedByData(post) ? (
                              <ul className="list-group list-group-flush">
                                {post.likedBy.map((user, idx) => (
                                  <li key={idx} className="list-group-item d-flex align-items-center px-0 py-2">
                                    <div className="avatar me-2 bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" 
                                         style={{ width: '32px', height: '32px' }}>
                                      <FaUser size={14} />
                                    </div>
                                    <span className="fw-medium">{user}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="alert alert-light mt-2">
                                <p className="text-muted mb-0">
                                  {post.likes.length} {post.likes.length === 1 ? 'person has' : 'people have'} liked this post
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Comment Input Area */}
                    {showCommentInput[post._id] && (
                      <div className="mb-3 border-top pt-3">
                        <div className="d-flex">
                          <div className="avatar me-2 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                            <FaUser size={14} />
                          </div>
                          <div className="flex-grow-1">
                            <input
                              type="text"
                              value={commentInputs[post._id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                              placeholder="Write a comment..."
                              className="form-control"
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                            />
                            <small className="text-muted">Press Enter to post or </small>
                            <button
                              className="btn btn-sm btn-link px-0 py-0"
                              onClick={() => handleComment(post._id)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Comments Section */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="comments-section border-top pt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 fw-bold">Comments ({post.comments.length})</h6>
                          {post.comments.length > 2 && (
                            <button 
                              className="btn btn-sm btn-link text-decoration-none p-0"
                              onClick={() => toggleExpandComments(post._id)}
                            >
                              {expandedComments[post._id] ? (
                                <span>Show less <FaChevronUp className="ms-1" /></span>
                              ) : (
                                <span>View all <FaChevronDown className="ms-1" /></span>
                              )}
                            </button>
                          )}
                        </div>
                        
                        <div className="comment-list mt-3">
                          {(expandedComments[post._id] ? post.comments : post.comments.slice(0, 2)).map((comment, idx) => (
                            <div key={idx} className="comment-item d-flex mb-2">
                              <div className="avatar me-2 bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" 
                                   style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                                <FaUser size={14} />
                              </div>
                              <div className="comment-content bg-light px-3 py-2 rounded flex-grow-1">
                                <div className="d-flex justify-content-between">
                                  <h6 className="mb-1 fw-bold">{comment.user || 'Anonymous'}</h6>
                                  <small className="text-muted">{formatDate(comment.createdAt) || 'Just now'}</small>
                                </div>
                                <p className="mb-0">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                          
                          {!expandedComments[post._id] && post.comments.length > 2 && (
                            <div className="text-center mt-2">
                              <button 
                                className="btn btn-sm btn-light"
                                onClick={() => toggleExpandComments(post._id)}
                              >
                                View all {post.comments.length} comments
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-info shadow-sm text-center py-5">
                <div className="mb-3">
                  <FaRegComments size={40} className="text-info" />
                </div>
                <h4>No posts available</h4>
                {data.isAuthenticated ? (
                  <p className="mb-4">Be the first to create a post! Click on "Add Post" to get started.</p>
                ) : (
                  <p className="mb-4">Login to create new posts and interact with existing ones.</p>
                )}
                <button className="btn btn-primary" onClick={() => navigate && navigate('/add-post')}>
                  {data.isAuthenticated ? 'Create First Post' : 'Login to Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post; 
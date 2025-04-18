import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/App_context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHeart,
  FaRegHeart,
  FaRegComments,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

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
    const savedLikedPosts = localStorage.getItem("likedPosts");
    if (savedLikedPosts) {
      setLikedPosts(JSON.parse(savedLikedPosts));
    }

    // Shorter loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Save liked posts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
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

  const handleSubmitEdit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    try {
      if (!editedPost.title.trim() || !editedPost.description.trim()) {
        toast.error("Title and description cannot be empty", toastConfig);
        return;
      }

      const res = await data.editPost(editedPost._id, editedPost);

      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }

      toast.success(res.message || "Post updated successfully", toastConfig);

      // Update the post in the UI directly instead of full reload
      data.setPosts(prev =>
        prev.map(post => post._id === editedPost._id ? { ...post, ...editedPost } : post)
      );
      
      setEditing(false);
    } catch (error) {
      toast.error("Failed to edit post", toastConfig);
    }
  };

  const handleLike = async (e, postId) => {
    if (e) e.preventDefault(); // Prevent any form submission
    
    if (!data.isAuthenticated) {
      toast.warning("Please login to like posts", toastConfig);
      return;
    }

    try {
      let res;
      const isCurrentlyLiked = likedPosts.includes(postId);

      if (isCurrentlyLiked) {
        // Handle unlike functionality
        res = await data.unlikePostById(postId);
        
        // Update local state first for immediate UI feedback
        setLikedPosts(prev => prev.filter(id => id !== postId));

        if (res.error) {
          toast.error(res.error, toastConfig);
          // Revert if there's an error
          setLikedPosts(prev => [...prev, postId]);
          return;
        }

        // Toast notification for unlike
        toast.success(res.message || "Post unliked successfully", toastConfig);
      } else {
        // Handle like functionality
        res = await data.likePostById(postId);
        
        // Update local state first for immediate UI feedback
        setLikedPosts(prev => [...prev, postId]);

        if (res.error) {
          toast.error(res.error, toastConfig);
          // Revert if there's an error
          setLikedPosts(prev => prev.filter(id => id !== postId));
          return;
        }

        // Toast notification for like
        toast.success(res.message || "Post liked successfully", toastConfig);
      }
    } catch (error) {
      toast.error("Failed to process like action", toastConfig);
    }
  };
  
  const handleComment = async (e, postId) => {
    if (e) e.preventDefault(); // Prevent form submission
    
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
      // Clear comment input immediately for better UX
      const commentText = commentInput;
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      
      const res = await data.handleComment(postId, commentText);

      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }

      toast.success(res.message || "Comment added successfully", toastConfig);

      // Create a new comment object with local data if API doesn't return complete comment
      const newComment = {
        text: commentText,
        user: data.user?.name || "You",
        createdAt: new Date().toISOString(),
      };

      // Optimistically update the UI with the new comment
      data.setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const updatedComments = res.comments || // Use API response if available
              (post.comments ? [...post.comments, newComment] : [newComment]);
            
            return { ...post, comments: updatedComments };
          }
          return post;
        })
      );

      // Auto-expand comments after posting
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
    } catch (error) {
      toast.error("Failed to comment post", toastConfig);
    }
  };

  // Add the proper toggleExpandComments function
  const toggleExpandComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Fetch comments for a specific post when expanding
  const fetchCommentsForPost = async (e, postId) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    // Toggle comments right away for better UX
    toggleExpandComments(postId);
    
    // Only fetch if we're expanding and don't have many comments already
    const post = data.posts.find(p => p._id === postId);
    const needsFetch = !expandedComments[postId] && 
                       (!post.comments || post.comments.length <= 2);
    
    if (needsFetch) {
      try {
        setIsLoading(true);
        await data.fetchCommentsForPost(postId);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to load comments", toastConfig);
      }
    }
  };

  const toggleLikesView = (e, postId) => {
    if (e) e.preventDefault(); // Prevent form submission
    setViewLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Function to check if there are any likes to display
  const hasLikes = (post) => {
    return post.likes && post.likes.length > 0;
  };

  // Function to check if a post has likedBy data
  const hasLikedByData = (post) => {
    return (
      post.likedBy && Array.isArray(post.likedBy) && post.likedBy.length > 0
    );
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const handleDelete = async (e, postId) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    if (!data.isAuthenticated) {
      toast.warning("Please login to delete posts", toastConfig);
      return;
    }

    try {
      const res = await data.deletePost(postId);

      if (res.error) {
        toast.error(res.error, toastConfig);
        return;
      }

      // Success toast
      toast.success(res.message || "Post deleted successfully", toastConfig);
      
      // Close post menu
      setActivePost(null);
      
      // Remove post from state
      data.setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      toast.error("Failed to delete post", toastConfig);
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
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
                      <div
                        className="avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "38px", height: "38px" }}
                      >
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
                          onClick={(e) => {
                            e.preventDefault();
                            togglePostMenu(post._id);
                          }}
                        >
                          <FaEllipsisV />
                        </button>

                        {activePost === post._id && (
                          <div
                            className="position-absolute end-0 bg-white shadow-sm rounded border mt-1 py-1"
                            style={{ width: "120px", zIndex: 1 }}
                          >
                            <button
                              className="dropdown-item d-flex align-items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEdit(post);
                              }}
                            >
                              <FaEdit className="me-2 text-warning" /> Edit
                            </button>
                            <button
                              className="dropdown-item d-flex align-items-center"
                              onClick={(e) => handleDelete(e, post._id)}
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
                      style={{ height: "300px", objectFit: "cover" }}
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
                            onChange={(e) =>
                              setEditedPost({
                                ...editedPost,
                                title: e.target.value,
                              })
                            }
                            placeholder="Title"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            value={editedPost.description}
                            onChange={(e) =>
                              setEditedPost({
                                ...editedPost,
                                description: e.target.value,
                              })
                            }
                            rows="3"
                            placeholder="Description"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Image URL
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editedPost.imgUrl}
                            onChange={(e) =>
                              setEditedPost({
                                ...editedPost,
                                imgUrl: e.target.value,
                              })
                            }
                            placeholder="Image URL"
                          />
                        </div>

                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-success"
                            onClick={handleSubmitEdit}
                          >
                            <i className="fas fa-save me-1"></i> Save Changes
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditing(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h5 className="card-title fw-bold mb-3">
                          {post.title}
                        </h5>
                        <p className="card-text text-muted">
                          {post.description}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Post Interactions */}
                  <div className="card-footer bg-white">
                    {/* Likes and Comments Buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <button
                          className={`btn ${
                            likedPosts.includes(post._id)
                              ? "btn-danger"
                              : "btn-outline-danger"
                          } me-2`}
                          onClick={(e) => handleLike(e, post._id)}
                        >
                          {likedPosts.includes(post._id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span className="ms-2">
                            {post.likes?.length || 0}
                          </span>
                        </button>

                        <button
                          className={`btn ${
                            showCommentInput[post._id]
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowCommentInput((prev) => ({
                              ...prev,
                              [post._id]: !prev[post._id],
                            }));
                          }}
                        >
                          <FaRegComments />
                          <span className="ms-2">
                            {post.comments?.length || 0}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Likes Section */}
                    {hasLikes(post) && (
                      <div className="mb-3 border-top pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            className="btn btn-sm btn-link text-decoration-none p-0 text-dark"
                            onClick={(e) => toggleLikesView(e, post._id)}
                          >
                            <span className="fw-bold">Likes</span>
                            <span className="ms-2 text-primary">
                              {post.likes.length}{" "}
                              {post.likes.length === 1 ? "person" : "people"}
                            </span>
                            {viewLikes[post._id] ? (
                              <FaChevronUp className="ms-2" />
                            ) : (
                              <FaChevronDown className="ms-2" />
                            )}
                          </button>
                        </div>

                        {viewLikes[post._id] && (
                          <div className="mt-2 likes-list">
                            {hasLikedByData(post) ? (
                              <ul className="list-group list-group-flush">
                                {post.likedBy.map((user, idx) => (
                                  <li
                                    key={idx}
                                    className="list-group-item d-flex align-items-center px-0 py-2"
                                  >
                                    <div
                                      className="avatar me-2 bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center"
                                      style={{ width: "32px", height: "32px" }}
                                    >
                                      <FaUser size={14} />
                                    </div>
                                    <span className="fw-medium">{user}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="alert alert-light mt-2">
                                <p className="text-muted mb-0">
                                  {post.likes.length}{" "}
                                  {post.likes.length === 1
                                    ? "person has"
                                    : "people have"}{" "}
                                  liked this post
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
                          <div
                            className="avatar me-2 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              flexShrink: 0,
                            }}
                          >
                            <FaUser size={14} />
                          </div>
                          <div className="flex-grow-1">
                            <input
                              type="text"
                              value={commentInputs[post._id] || ""}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [post._id]: e.target.value,
                                })
                              }
                              placeholder="Write a comment..."
                              className="form-control"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleComment(e, post._id);
                                }
                              }}
                            />
                            <small className="text-muted">
                              Press Enter to post or{" "}
                            </small>
                            <button
                              className="btn btn-sm btn-link px-0 py-0"
                              onClick={(e) => handleComment(e, post._id)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments Section */}
                    {post.comments && (
                      <div className="comments-section border-top pt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 fw-bold">
                            Comments ({post.comments.length || 0})
                          </h6>
                          {post.comments.length > 2 && (
                            <button
                              className="btn btn-sm btn-link text-decoration-none p-0"
                              onClick={(e) => fetchCommentsForPost(e, post._id)}
                            >
                              {expandedComments[post._id] ? (
                                <span>
                                  Show less <FaChevronUp className="ms-1" />
                                </span>
                              ) : (
                                <span>
                                  View all <FaChevronDown className="ms-1" />
                                </span>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="comment-list mt-3">
                          {post.comments && post.comments.length > 0 ? (
                            (expandedComments[post._id]
                              ? post.comments
                              : post.comments.slice(0, 2)
                            ).map((comment, idx) => (
                              <div
                                key={idx}
                                className="comment-item d-flex mb-2"
                              >
                                <div
                                  className="avatar me-2 bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <FaUser size={14} />
                                </div>
                                <div className="comment-content bg-light px-3 py-2 rounded flex-grow-1">
                                  <div className="d-flex justify-content-between">
                                    <h6 className="mb-1 fw-bold">
                                      {comment.user || "Anonymous"}
                                    </h6>
                                    <small className="text-muted">
                                      {formatDate(comment.createdAt) ||
                                        "Just now"}
                                    </small>
                                  </div>
                                  <p className="mb-0">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-3">
                              <p className="text-muted mb-0">
                                No comments yet. Be the first to comment!
                              </p>
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
                  <p className="mb-4">
                    Be the first to create a post! Click on "Add Post" to get
                    started.
                  </p>
                ) : (
                  <p className="mb-4">
                    Login to create new posts and interact with existing ones.
                  </p>
                )}
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    data.navigate && data.navigate("/add-post");
                  }}
                >
                  {data.isAuthenticated ? "Create First Post" : "Login to Post"}
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
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/App_context'; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart, FaRegComments, FaEdit } from 'react-icons/fa';

const Post = () => {
  const data = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false); 

  const handleEdit = (post) => {
    setEditedPost({ ...post }); 
    setEditing(true);
  };

  const handleSubmitEdit = async () => {
    try {
      const res = await data.editPost(editedPost._id, editedPost);
      console.log('edited', res);

      toast.success(res.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });

      data.setReload(!data.reload);
      setEditing(false);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts.includes(postId)) {
        toast.warning("You've already liked this post", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        });
        return;
      }

      const res = await data.likePostById(postId);
      console.log('liked', res);

      toast.success(res.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });

      setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const res = await data.handleComment(postId, commentInput);
      console.log('comment added', res);

      toast.success(res.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });

      setCommentInput("");
      data.setReload(!data.reload);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="row my-5">
          {data.posts?.map((d) => (
            <div key={d._id} className="col-md-4 my-3">
              <div className="container d-flex justify-content-center align-items-center">
                <div className="card text-center bg-primary" style={{ width: '18rem' }}>
                  <div className="img d-flex justify-content-center align-items-center">
                    <img src={d.imgUrl} className="card-img-top" alt="post" style={{ height: '200px', width: '250px' }} />
                  </div>
                  <div className="card-body text-center text-light">
                    {editing && editedPost._id === d._id ? (
                      <div>
                        <input
                          type="text"
                          value={editedPost.title}
                          onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                        />
                        <input
                          type="text"
                          value={editedPost.description}
                          onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                        />
                        <input
                          type="text"
                          value={editedPost.imgUrl}
                          onChange={(e) => setEditedPost({ ...editedPost, imgUrl: e.target.value })}
                        />
                        <button onClick={handleSubmitEdit}>Save</button>
                        <button onClick={() => setEditing(false)}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="card-title">{d.title}</h4>
                        <p className="card-text">{d.description}</p>
                        {data.isAuthenticated && (
                          <>
                            <button
                              onClick={async () => {
                                const res = await data.deletePost(d._id);
                                console.log('deleted', res);
                                toast.success(res.message, {
                                  position: 'top-right',
                                  autoClose: 3000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: 'dark',
                                  transition: Bounce,
                                });
                                data.setReload(!data.reload);
                              }}
                              className="btn btn-success mx-1"
                            >
                              Delete
                            </button>
                            <button className="btn btn-warning mx-1" onClick={() => handleEdit(d)}>
                              <FaEdit /> Edit
                            </button>
                            <button
                              className={`btn btn-danger mx-1 ${likedPosts.includes(d._id) ? 'liked' : ''}`}
                              onClick={() => handleLike(d._id)}
                            >
                              <FaHeart />
                              <span className="mx-1">{likedPosts.filter((id) => id === d._id).length}</span>
                            </button>
                            <button
                              className="btn btn-light mx-1"
                              onClick={() => setShowCommentInput(!showCommentInput)}
                            >
                              <FaRegComments /> Comment
                            </button>
                          </>
                        )}
                        {showCommentInput && (
                          <div>
                            <input
                              type="text"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              placeholder="Add a comment..."
                              className="form-control mt-2"
                            />
                            <button
                              className="btn btn-info mt-2"
                              onClick={() => {
                                handleComment(d._id);
                                setShowCommentInput(false);
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/App_context';
import { toast, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const data = useContext(AppContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImg, setPreviewImg] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!imgUrl.trim()) newErrors.imgUrl = "Image URL is required";
    else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(imgUrl)) {
      newErrors.imgUrl = "Please enter a valid image URL (http/https with image extension)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImgUrlChange = (e) => {
    const url = e.target.value;
    setImgUrl(url);
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      setPreviewImg(url);
    } else {
      setPreviewImg('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await data.addPost(title, description, imgUrl);
      console.log("Post Response:", res);

      if (res?.error) {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.success(res?.message || "Post created successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
          transition: Bounce,
        });

        data.setReload(!data.reload);
        setTimeout(() => {
          navigate('/posts');
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to create post. Please try again.", {
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
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-gradient-primary border-0 py-3">
                <h3 className="text-white mb-0 fw-bold">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Post
                </h3>
              </div>
              <div className="card-body p-4">
                <form onSubmit={submitHandler} className="needs-validation">
                  <div className="row g-4">
                    <div className="col-md-7 pe-md-4">
                      <div className="mb-4">
                        <label htmlFor="title" className="form-label fw-semibold">
                          Post Title <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="bi bi-type-h1"></i>
                          </span>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                            id="title"
                            placeholder="Enter an attention-grabbing title"
                          />
                          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="form-label fw-semibold">
                          Description <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="bi bi-text-paragraph"></i>
                          </span>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            id="description"
                            rows="6"
                            placeholder="Share your thoughts in detail..."
                            style={{ resize: "none" }}
                          ></textarea>
                          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>
                        <div className="form-text mt-1">
                          <i className="bi bi-info-circle-fill me-1 text-primary"></i>
                          Write a detailed description to engage your readers
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="imgUrl" className="form-label fw-semibold">
                          Image URL <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="bi bi-image"></i>
                          </span>
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={handleImgUrlChange}
                            className={`form-control ${errors.imgUrl ? 'is-invalid' : ''}`}
                            id="imgUrl"
                            placeholder="https://example.com/image.jpg"
                          />
                          {errors.imgUrl && <div className="invalid-feedback">{errors.imgUrl}</div>}
                        </div>
                        <div className="form-text mt-1">
                          <i className="bi bi-link-45deg me-1"></i>
                          Enter a direct link to an image (supported formats: jpg, png, gif, webp)
                        </div>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <div className="card h-100 bg-light border-0">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">
                            <i className="bi bi-eye me-2"></i>
                            Image Preview
                          </h5>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center p-4">
                          {previewImg ? (
                            <div className="position-relative w-100">
                              <img
                                src={previewImg}
                                alt="Preview"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "280px", objectFit: "contain", width: "100%" }}
                              />
                              <div className="position-absolute top-0 end-0">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light rounded-circle m-2"
                                  onClick={() => setPreviewImg('')}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted py-5">
                              <i className="bi bi-image-fill display-4 mb-3 text-secondary opacity-50"></i>
                              <p className="mb-0">Your image preview will appear here</p>
                              <small>Add an image URL to see the preview</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate('/posts')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Publish Post
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-4 text-muted">
              <small>
                <i className="bi bi-info-circle me-1"></i>
                All fields marked with <span className="text-danger">*</span> are required
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;

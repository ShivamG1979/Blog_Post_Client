import React, { useEffect, useState } from "react";
import { AppContext } from "./App_context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App_State = (props) => {
  const [data, setData] = useState(10);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);

  // const url = "http://localhost:3000/api";
  const url = "https://blog-post-api-c28n.onrender.com/api";

  // Function to fetch all posts
  const fetchAllPosts = async () => {
    setIsLoading(true);
    try {
      const api = await axios.get(`${url}/posts`, { 
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Fetched posts:", api.data.posts);
      
      if (api.data.posts) {
        // Update the posts state with fresh data
        setPosts(api.data.posts);
        
        // Update liked posts based on user info
        if (user && user.id) {
          const userLikedPostIds = [];
          api.data.posts.forEach(post => {
            if (post.likedBy && post.likedBy.includes(user.name)) {
              userLikedPostIds.push(post._id);
            }
          });
          setLikedPosts(userLikedPostIds);
          // Also save to localStorage
          localStorage.setItem("likedPosts", JSON.stringify(userLikedPostIds));
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load liked posts from localStorage if available
    const loadLikedPostsFromStorage = () => {
      const savedLikedPosts = localStorage.getItem("likedPosts");
      if (savedLikedPosts) {
        setLikedPosts(JSON.parse(savedLikedPosts));
      }
    };
    
    loadLikedPostsFromStorage();
    fetchAllPosts();
  
    const jwtToken = window.localStorage.getItem("token");
    setToken(jwtToken);
  
    if (jwtToken) {
      setIsAuthenticated(true);
      getCurrentUser();
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]); // Removed reload dependency

  // Save liked posts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  // Login
  const login = async (email, password) => {
    try {
      const api = await axios.post(
        `${url}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Only set token if login was successful
      if (api.data.token) {
        window.localStorage.setItem(`token`, api.data.token);
        setToken(api.data.token);
        setIsAuthenticated(true);
      }

      return api.data;
    } catch (error) {
      if (error.response) {
        console.log("Error response status:", error.response.status);
        console.log("Response data:", error.response.data);
        return error.response.data;
      } else if (error.request) {
        console.log("No response received");
        return { message: "No response from server. Please try again." };
      } else {
        console.error("Error message:", error.message);
        return { message: "An error occurred. Please try again." };
      }
    }
  };
  
  // Register
  const Register = async (name, email, password) => {
    try {
      const api = await axios.post(
        `${url}/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const res = api.data;

      if (
        (api.status === 201 || api.status === 200) &&
        res.message === "User Register Successfully!"
      ) {
        console.log("✅ Registration successful:", res);

        if (res.token) {
          window.localStorage.setItem("token", res.token);
          setToken(res.token);
          setIsAuthenticated(true);
        }

        return res;
      }

      console.warn("⚠️ Registration response was not as expected:", res);
      return res;
    } catch (error) {
      console.error("❌ Error during registration:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred during registration." };
    }
  };

  // Logout
  const logOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("likedPosts");
    setToken("");
    setIsAuthenticated(false);
    setUser(null);
    setLikedPosts([]);
  };

  const addPost = async (title, description, imgUrl) => {
    try {
      const api = await axios.post(
        `${url}/addpost`,
        {
          title,
          description,
          imgUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );

      // Update posts after adding without full reload
      const newPost = api.data.post;
      if (newPost) {
        setPosts(prevPosts => [newPost, ...prevPosts]);
      }
      
      return api.data;
    } catch (error) {
      console.error("Error adding post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while adding the post." };
    }
  };

  // Delete post with optimistic update
  const deletePost = async (id) => {
    try {
      // Optimistically update UI by removing the post
      setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
      
      const api = await axios.delete(`${url}/post/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      
      return api.data;
    } catch (error) {
      // Restore the post if deletion fails
      fetchAllPosts();
      
      console.error("Error deleting post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while deleting the post." };
    }
  };

  // Like post with optimistic update
  const likePostById = async (id) => {
    try {
      // Optimistically update UI immediately
      if (!likedPosts.includes(id)) {
        setLikedPosts(prev => [...prev, id]);
      }
      
      // Update the posts state optimistically
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === id) {
            const newLikes = post.likes ? [...post.likes, 1] : [1];
            const newLikedBy = post.likedBy ? 
              [...post.likedBy, user?.name || 'User'] : 
              [user?.name || 'User'];
            
            return { 
              ...post, 
              likes: newLikes,
              likedBy: newLikedBy
            };
          }
          return post;
        })
      );
      
      const api = await axios.post(
        `${url}/post/like/${id}`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      
      return api.data;
    } catch (error) {
      // Revert optimistic update on error
      setLikedPosts(prev => prev.filter(postId => postId !== id));
      fetchAllPosts();
      
      console.error("Error liking post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while liking the post." };
    }
  };

  // Unlike post with optimistic update
  const unlikePostById = async (id) => {
    try {
      // Optimistically update UI immediately
      setLikedPosts(prev => prev.filter(postId => postId !== id));
      
      // Update the posts state optimistically
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === id) {
            const newLikes = post.likes && post.likes.length > 0 ? 
              post.likes.slice(0, -1) : [];
            const newLikedBy = post.likedBy ? 
              post.likedBy.filter(name => name !== user?.name) : 
              [];
            
            return { 
              ...post, 
              likes: newLikes,
              likedBy: newLikedBy
            };
          }
          return post;
        })
      );
      
      const api = await axios.delete(`${url}/post/like/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      
      return api.data;
    } catch (error) {
      // Revert optimistic update on error
      if (!likedPosts.includes(id)) {
        setLikedPosts(prev => [...prev, id]);
      }
      fetchAllPosts();
      
      console.error("Error unliking post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while unliking the post." };
    }
  };
  
  // Edit post with optimistic update
  const editPost = async (id, updatedPostData) => {
    try {
      // Store original post data in case update fails
      const originalPost = posts.find(post => post._id === id);
      
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(post => 
          post._id === id ? { ...post, ...updatedPostData } : post
        )
      );
      
      const api = await axios.put(`${url}/post/${id}`, updatedPostData, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      
      return api.data;
    } catch (error) {
      // Restore original post data if update fails
      fetchAllPosts();
      
      console.error("Error editing post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while editing the post." };
    }
  };

  // Add comment with optimistic update
  const handleComment = async (postId, comment) => {
    try {
      // Create a new comment object for optimistic UI update
      const newComment = {
        text: comment,
        user: user?.name || "You",
        createdAt: new Date().toISOString(),
      };
      
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const updatedComments = post.comments ? 
              [...post.comments, newComment] : 
              [newComment];
            
            return { ...post, comments: updatedComments };
          }
          return post;
        })
      );
      
      const api = await axios.post(
        `${url}/post/comment/${postId}`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      
      // Only refresh comments for this post if the API returns a different result
      if (api.data && api.data.postComment) {
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                comments: api.data.postComment
              };
            }
            return post;
          })
        );
      }
      
      return api.data;
    } catch (error) {
      // Refresh only this post's comments on error
      fetchCommentsForPost(postId);
      
      console.error("Error adding comment:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while adding the comment." };
    }
  };

  // Fetch comments for a specific post
  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await axios.get(`${url}/post/comment/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token
        },
        withCredentials: true,
      });
      
      if (response.data && response.data.postComment) {
        // Update only this post's comments
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                comments: response.data.postComment
              };
            }
            return post;
          })
        );
        
        return response.data.postComment;
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  };

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const api = await axios.get(`${url}/me`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      console.log("User fetched:", api.data.user);
      setUser(api.data.user);
      
      // After fetching user, refresh posts
      fetchAllPosts();
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  // Function to refresh data (useful for manual refresh buttons or pull-to-refresh)
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await fetchAllPosts();
    } finally {
      setIsLoading(false);
    }
  };

  // The navigate function will be provided from the component through context
  // We no longer define navigate here with window.location

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        url,
        Register,
        login,
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        logOut,
        posts,
        setPosts,
        addPost,
        deletePost,
        likedPosts,
        setLikedPosts,
        likePostById,
        unlikePostById,
        editPost,
        comments,
        handleComment,
        isLoading,
        user,
        setUser,
        getCurrentUser,
        fetchCommentsForPost,
        refreshData,
        fetchAllPosts,
        // navigate is provided by components that use this context
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default App_State;
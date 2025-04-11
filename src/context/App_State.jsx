import React, { useEffect, useState } from "react";
import { AppContext } from "./App_context";
import axios from "axios";

const App_State = (props) => {
  const [data, setData] = useState(10);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  

  // const url = "http://localhost:3000/api";
  const url = "https://blog-post-api-c28n.onrender.com/api";
  
  useEffect(() => {
    setIsLoading(true);
    
    const fetchBlog = async () => {
      try {
        const api = await axios.get(`${url}/posts`, { 
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(api.data.posts);
        setPosts(api.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlog();

    const jwtToken = window.localStorage.getItem("token");
setToken(jwtToken);

if (jwtToken) {
  setIsAuthenticated(true);
  getCurrentUser(); // <-- ✅ fetch user
} else {
  setIsAuthenticated(false);
  setUser(null); // <-- reset user if token is gone
}

  }, [token, reload]);
  
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
            "Content-Type": "application/json"
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
  //Register
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
  
      // Check for status 201 or 200 and the success message
      if ((api.status === 201 || api.status === 200) && 
          res.message === "User Register Successfully!") {
        console.log("✅ Registration successful:", res);
  
        if (res.token) {
          window.localStorage.setItem("token", res.token);
          setToken(res.token);
          setIsAuthenticated(true);
        }
  
        return res; // success
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
  
  // Logout - Fixed the function
  const logOut = () => {
    window.localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false); // Fixed: was calling isAuthenticated as a function
  };

  const addPost = async (title, description, imgUrl) => {
    try {
      const api = await axios.post(`${url}/addpost`, {
        title,
        description,
        imgUrl
      }, {
        headers: {
          "Content-Type": "application/json",
          "Auth": token
        },
        withCredentials: true,
      });
      
      console.log(api);
      return api.data;
    } catch (error) {
      console.error("Error adding post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while adding the post." };
    }
  };
  
  // Delete - Improved error handling
  const deletePost = async (id) => {
    try {
      const api = await axios.delete(`${url}/post/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Auth": token
        },
        withCredentials: true,
      });
      
      console.log(api);
      return api.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while deleting the post." };
    }
  };
  
  //Like Post - Improved error handling
  const likePostById = async (id) => {
    try {
      const api = await axios.post(
        `${url}/post/like/${id}`,
        { id }, 
        {
          headers: {
            "Content-Type": "application/json",
            "Auth": token,
          },
          withCredentials: true,
        }
      );
    
      console.log(api.data);
      return api.data;
    } catch (error) {
      console.error("Error liking post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while liking the post." };
    }
  };
  
  const unlikePostById = async (id) => {
    try {
      const api = await axios.delete(
        `${url}/post/like/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth": token,
          },
          withCredentials: true,
        }
      );
    
      console.log(api.data);
      return api.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while unliking the post." };
    }
  };
  //Edit post - Improved error handling
  const editPost = async (id, updatedPostData) => {
    try {
      const api = await axios.put(`${url}/post/${id}`, updatedPostData, {
        headers: {
          "Content-Type": "application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      
      console.log(api);
      return api.data;
    } catch (error) {
      console.error("Error editing post:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while editing the post." };
    }
  };
  
  //Comments - Improved error handling
  const handleComment = async (postId, comment) => {
    try {
      const api = await axios.post(
        `${url}/post/comment/${postId}`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth": token,
          },
          withCredentials: true,
        }
      );
      
      console.log(api.data);
      // Update comments state
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), comment],
      }));
      
      return api.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response) {
        return error.response.data;
      }
      return { error: "An error occurred while adding the comment." };
    }
  };
 
  //get user
  const getCurrentUser = async () => {
    try {
      const api = await axios.get(`${url}/me`, {
        headers: {
          "Content-Type": "application/json",
          "Auth": token,
        },
        withCredentials: true,
      });
      console.log("User fetched:", api.data.user);
      setUser(api.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };
 




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
        reload,
        setReload,
        likedPosts: [],
        likePostById,
        editPost,
        comments,
        handleComment,
        isLoading,
        unlikePostById,
        user,
setUser,
getCurrentUser,


    
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default App_State;
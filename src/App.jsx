import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "./context/App_context";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Loader from "./components/Loader";


const App = () => {
  const { isAuthenticated } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set a shorter loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="app">
      {isLoading ? (
        <Loader />
      ) : (
        
        <Router>
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/posts" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/addpost" 
              element={
                <ProtectedRoute>
                  <AddPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      )}
    </div>
  );
};

export default App;
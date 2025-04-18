import React, { useContext, useState, useEffect, createContext } from "react";
import { AppContext } from "./context/App_context";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Loader from "./components/Loader";
import Footer from "./components/Footer"; 
import About from './components/About';

// Create a navigation context to pass navigate function to components
export const NavigationContext = createContext();

// Navigation provider component
const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set a shorter loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} />
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            } 
          />
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
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <Router>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </Router>
    </div>
  );
};

export default App;
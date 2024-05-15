import React, { useContext } from "react";
import { AppContext } from "./context/App_context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import Profile from "./components/Profile";
import Register from "./components/Register";

const App = () => {
  const data = useContext(AppContext);
  console.log(data);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={< Post/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </Router>
    </>
  );
};
export default App;

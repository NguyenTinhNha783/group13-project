import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./component/Menu.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import Profile from "./component/Profile.jsx";
import QuanLyUser from "./component/QuanLyUser.jsx"; 
import api from "./axiosConfig";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    await api.post("/logout");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Menu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login onLogin={setIsLoggedIn} />} />
        <Route path="/Quanly" element={<QuanLyUser />} /> 
      </Routes>
    </Router>
  );
}

export default App;

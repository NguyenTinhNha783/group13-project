import React from "react";
import UserList from "./component/UserList.jsx";
import AddUser from "./component/AddUser.jsx";
import './App.css';  // giữ CSS nếu muốn dùng

function App() {
  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Quản lý User</h1>
      <AddUser />   {/* Form thêm user */}
      <UserList />  {/* Danh sách user */}
    </div>
  );
}

export default App;

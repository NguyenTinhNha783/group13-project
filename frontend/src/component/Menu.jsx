import React from "react";
import { Link } from "react-router-dom";

function Menu({ isLoggedIn, onLogout }) {
  return (
    <div className="navbar">
      <div>
        <Link to="/">🏠 Trang chủ</Link>
      </div>
      <div>
        {!isLoggedIn ? (
          <>
            <Link to="/Login">Đăng nhập</Link>
            <Link to="/Signup">Đăng ký</Link>
          </>
        ) : (
          <>
            <Link to="/Profile">Hồ sơ</Link>
            <button
              onClick={onLogout}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;

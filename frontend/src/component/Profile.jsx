// 🟢 CHỈNH Ở ĐÂY — Import React và CSS
import React from "react";
import "./Profile.css";

function Profile({ user }) {
  return (
    <div className="profile-container">
      {/* 🟢 CHỈ HIỂN THỊ VIDEO KHI CHƯA ĐĂNG NHẬP */}
      {!user && (
        <video autoPlay loop muted className="video-bg">
          <source src="/Background.mp4" type="video/mp4" />
        </video>
      )}

      {/* 🟢 NỘI DUNG CHÍNH */}
      <div
        className={`profile-content ${
          user ? "logged-in" : "logged-out"
        }`}
      >
        {user ? (
          <>
            <h1>Xin chào, {user.name} 👋</h1>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <h2>Bạn chưa đăng nhập</h2>
        )}
      </div>
    </div>
  );
}

export default Profile;

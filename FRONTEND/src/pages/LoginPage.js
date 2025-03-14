import React, { useEffect, useState } from "react";
import "../styles/LoginPage.css"; // Import CSS for styling
import logo from "../assets/images/logo_hiu.png"; // Add a logo for branding

const LoginPage = () => {
    const [fadeIn, setFadeIn] = useState(false); // Track if fade-in animation has started

    useEffect(() => {
        // Trigger fade-in animation after a brief delay
        const timer = setTimeout(() => {
            setFadeIn(true);
        }, 500); // Delay of 500ms

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className="login-container">
            {/* Header Section */}
            <div className="login-header">
                <img src={logo} alt="Logo" className={`login-logo ${fadeIn ? "visible" : ""}`} />
                <h1 className={`fade-in-text ${fadeIn ? "visible" : ""}`}>Chào Mừng Trở Lại!</h1>
                <p className={`static-text ${fadeIn ? "visible" : ""}`}>Đăng nhập để khám phá thế giới truyện và đóng góp câu chuyện của bạn.</p>
            </div>

            {/* Login Form */}
            <form className="login-form">
                {/* Email Input */}
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    required
                    className="input-field"
                />

                {/* Password Input */}
                <label htmlFor="password">Mật khẩu</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu của bạn"
                    required
                    className="input-field"
                />

                {/* Login Button */}
                <button type="submit" className="login-button">
                    Đăng Nhập
                </button>

                {/* Google Login Option */}
                <button type="button" className="register-button">
                    <span className="desktop-text">Bạn chưa có tài khoản? Đăng ký ngay!</span>
                    <span className="mobile-text">Đăng ký</span>
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

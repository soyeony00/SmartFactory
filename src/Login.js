import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLoginSuccess, onRegisterClick, logo }) => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 특정 이메일과 비밀번호일 경우 무조건 로그인 성공
      if (email === "autory@naver.com" && password === "autory") {
        console.log("Test Login successful for:", email); // 디버깅
        localStorage.setItem("userEmail", email); // 이메일 저장
        onLoginSuccess(email); // 성공 시 email 전달
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        process.env.REACT_APP_LOGIN_API_URL ||
          "http://192.168.0.93:8000/accountapp/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setErrorMessage("서버 응답이 유효하지 않습니다.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (response.ok && data.status === "success") {
        console.log("Login successful for:", email); // 디버깅
        localStorage.setItem("userEmail", email); // 이메일 저장
        onLoginSuccess(email); // 성공 시 email 전달
      } else {
        setErrorMessage(data.message || "로그인 정보가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setErrorMessage("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="logo" className="loginlogo" />
        <h1>
          Welcome <p>Back!</p>
        </h1>
      </div>
      <div className="login-right">
        <h2>로그인</h2>
        <p className="welcome-message">
          환영합니다!
          <br />
          당신의 계정에 로그인해주세요.
        </p>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="email-label">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="password-label">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">비밀번호를 잊으셨나요?</div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
        <p className="register-link" onClick={onRegisterClick}>
          회원가입
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

const Signup = ({ onSignupSuccess, onLoginClick, logo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup button clicked");

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      console.log("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailValid) {
      alert("이메일 유효성을 확인해주세요.");
      console.log("이메일 유효성 확인이 안됐거나 유효하지 않습니다.");
      return;
    }

    const signupData = {
      email,
      password,
      name,
      phone,
      com_name: company,
    };

    console.log("가입 데이터를 전송 중:", signupData);

    try {
      const response = await axios.post(
        "http://192.168.0.93:8000/accountapp/manager/",
        signupData
      );

      console.log("가입 응답:", response);

      if (response.status === 201) {
        alert("회원가입 성공");
        onSignupSuccess();
      } else {
        alert("회원가입 실패");
        console.log("회원가입 실패, 상태 코드:", response.status);
      }
    } catch (error) {
      alert(`에러: ${error.message}`);
      console.log("회원가입 중 에러:", error);
    }
  };

  const checkEmail = async () => {
    console.log("이메일 확인 중:", email);
    setIsCheckingEmail(true);

    try {
      const response = await axios.post(
        "http://172.20.10.2:8000/accountapp/check_email/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("이메일 확인 응답:", response);

      if (response.data.valid) {
        setIsEmailValid(true);
        alert("사용 가능한 이메일입니다.");
        console.log("사용 가능한 이메일입니다.");
      } else {
        setIsEmailValid(false);
        alert("이미 사용 중인 이메일입니다.");
        console.log("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      alert(`에러: ${error.message}`);
      console.log("이메일 확인 중 에러:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const findCompany = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setCompany(data.address);
      },
    }).open();
  };

  const isPasswordMatching =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={logo} alt="logo" className="signup-logo" />
        <h1>
          Create <p>New Account</p>
        </h1>
      </div>
      <div className="signup-right">
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailValid(null);
                }}
                required
              />
              <button
                type="button"
                onClick={checkEmail}
                className="small-button"
                disabled={isCheckingEmail}
              >
                중복확인
              </button>
            </div>
            {isEmailValid === false && (
              <p className="error-message">이미 사용 중인 이메일입니다.</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
              <p
                className={`password-message ${
                  isPasswordMatching ? "match-message" : "error-message"
                }`}
              >
                {isPasswordMatching
                  ? "비밀번호가 일치합니다. :)"
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">회사명</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={findCompany}
                className="small-button"
              >
                찾기
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="signup-button"
            disabled={!isEmailValid}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

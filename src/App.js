import React, { useState, useEffect } from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Login from "./Login";
import Signup from "./Signup";
import MyPage from "./MyPage";
import Swal from "sweetalert2";
import axios from "axios";
import "./App.css";
import mainLogo from "./mainLogo.png";
import loginLogo from "./loginLogo.png";
import profilePic from "./profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import styled from "styled-components";

Modal.setAppElement("#root");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isMyPage, setIsMyPage] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    profileImage: profilePic,
  });
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const audio = new Audio("/warning-sound.mp3");

  const fetchUserInfo = async (email) => {
    if (!email) return null;

    try {
      const response = await fetch(
        "http://192.168.0.93:8000/accountapp/manager/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const user = data.find((user) => user.email.trim() === email.trim());
        if (user) {
          return {
            name: user.name || "Unknown User",
            email: user.email || "",
            phone: user.phone || "",
            companyName: user.com_name || "",
            profileImage: user.profile_image || profilePic,
          };
        }
      } else {
        console.error(
          "Failed to fetch user info. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
    return null;
  };

  const showAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "경고",
      text: message,
      confirmButtonText: "확인",
    }).then(() => {
      audio.pause();
      audio.currentTime = 0; // 오디오 재생 위치 초기화
      setAlarmTriggered(false); // 알람 초기화
    });

    audio.muted = true;
    try {
      audio.play().then(() => {
        setTimeout(() => {
          audio.muted = false; // 1초 뒤 음소거 해제
        }, 100);
      });
    } catch (error) {
      console.warn("오디오 재생 실패:", error.message);
    }
  };

  const fetchHandDetection = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.93:8000/accountapp/get_hand_detection/"
      );
      const fetchedData = response.data;

      if (fetchedData?.value === 1 && !alarmTriggered) {
        setAlarmTriggered(true);
        showAlert("손 감지가 발생했습니다. 위험이 있을 수 있습니다.");
      }
    } catch (error) {
      console.error("손 감지 데이터 가져오기 실패:", error.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!alarmTriggered) {
        fetchHandDetection();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmTriggered]);

  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true);
    localStorage.setItem("userEmail", email);

    fetchUserInfo(email).then((userData) => {
      if (userData) {
        setUserInfo(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      }
    });
  };

  const handleProfileUpdate = (updatedInfo) => {
    setUserInfo(updatedInfo);
    localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
  };

  const handleSignupClick = () => {
    setIsSigningUp(true);
  };

  const handleSignupSuccess = () => {
    setIsSigningUp(false);
  };

  const handleProfileClick = () => {
    setIsMyPage(true);
  };

  const handleBackToMain = () => {
    setIsMyPage(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMyPage(false);
    setIsSigningUp(false);
    setUserInfo({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      profileImage: profilePic,
    });
    localStorage.clear();
  };

  const handleNotificationClick = () => {
    if (hasNotifications) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const email = localStorage.getItem("userEmail");
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else if (email) {
        fetchUserInfo(email).then((userData) => {
          if (userData) {
            setUserInfo(userData);
            localStorage.setItem("userInfo", JSON.stringify(userData));
          }
        });
      }
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          {isMyPage ? (
            <MyPage
              onBackClick={handleBackToMain}
              onLogout={handleLogout}
              userInfo={userInfo}
              onProfileUpdate={handleProfileUpdate}
            />
          ) : (
            <>
              <header className="header">
                <img src={mainLogo} alt="main logo" className="logo" />
                <input
                  type="text"
                  placeholder="🔍 Search"
                  className="search-bar"
                />
                <div className="header-icons">
                  <div
                    className="notification-icon-container"
                    onClick={handleNotificationClick}
                  >
                    <FontAwesomeIcon
                      icon={faBell}
                      className="notification-icon"
                    />
                    {hasNotifications && <span className="notification-dot" />}
                  </div>
                  <div className="profile" onClick={handleProfileClick}>
                    <img
                      src={userInfo.profileImage || profilePic}
                      alt="profile"
                      className="profile-pic"
                    />
                    <span>{userInfo.name || "Loading..."}</span>
                  </div>
                </div>
              </header>
              <div className="main-content">
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
              </div>
              <StyledModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Notification Modal"
                className="Modal"
                overlayClassName="Overlay"
              >
                <ModalHeader>
                  <ErrorIcon>⚠️</ErrorIcon>
                  <h2>알림</h2>
                </ModalHeader>
                <ModalBody>
                  <p>공정에 이상이 생겼습니다. 조취를 취해주세요</p>
                </ModalBody>
                <ModalFooter>
                  <CloseButton onClick={closeModal}>확인</CloseButton>
                </ModalFooter>
              </StyledModal>
            </>
          )}
        </>
      ) : isSigningUp ? (
        <Signup onSignupSuccess={handleSignupSuccess} logo={loginLogo} />
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={handleSignupClick}
          logo={loginLogo}
        />
      )}
    </div>
  );
}

export default App;

// 스타일 정의
const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  z-index: 1000;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  color: red;
  margin-right: 10px;
`;

const ModalBody = styled.div`
  p {
    font-size: 1rem;
    color: #333;
    text-align: center;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #45a049;
  }
`;

import React, { useState, useEffect } from "react";
import "./MyPage.css";
import profilePic from "./profile.png"; // 기본 프로필 사진

const MyPage = ({ onBackClick, onLogout, onProfileUpdate, userInfo }) => {
  const [profileImage, setProfileImage] = useState(
    userInfo.profileImage || profilePic
  );
  const [companyName, setCompanyName] = useState(userInfo.companyName || "");
  const [name, setName] = useState(userInfo.name || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [email, setEmail] = useState(userInfo.email || "");

  const [originalData, setOriginalData] = useState(userInfo); // 원래 데이터 저장
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  useEffect(() => {
    // 부모에서 전달된 userInfo로 상태 동기화
    setProfileImage(userInfo.profileImage || profilePic);
    setCompanyName(userInfo.companyName || "");
    setName(userInfo.name || "");
    setPhone(userInfo.phone || "");
    setEmail(userInfo.email || "");
    setOriginalData(userInfo);
  }, [userInfo]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("com_name", companyName);
      formData.append("name", name);
      formData.append("phone", phone);

      const fileInput = document.getElementById("fileInput");
      if (fileInput && fileInput.files.length > 0) {
        formData.append("profile_image", fileInput.files[0]);
      }

      const response = await fetch(
        "http://192.168.0.93:8000/accountapp/profile_update/",
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.ok) {
        alert("프로필 수정이 완료되었습니다.");

        // 최신 정보를 다시 가져옴
        const updatedInfoResponse = await fetch(
          "http://192.168.0.93:8000/accountapp/manager/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (updatedInfoResponse.ok) {
          const data = await updatedInfoResponse.json();
          const user = data.find((u) => u.email === email);

          if (user) {
            // 부모 컴포넌트와 상태 동기화
            onProfileUpdate({
              companyName: user.com_name || companyName,
              name: user.name || name,
              phone: user.phone || phone,
              email: user.email || email,
              profileImage: user.profile_image || profileImage,
            });
          }
        } else {
          console.error("최신 정보 가져오기 실패");
        }

        setIsEditing(false);
      } else {
        console.error("프로필 수정 실패:", response.status);
        alert("프로필 수정에 실패했습니다.");
        restoreOriginalData();
      }
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
      alert("프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      restoreOriginalData();
    }
  };

  const handleCancelClick = () => {
    restoreOriginalData(); // 원래 데이터 복원
    setIsEditing(false);
  };

  const restoreOriginalData = () => {
    setProfileImage(originalData.profileImage || profilePic);
    setCompanyName(originalData.companyName);
    setName(originalData.name);
    setPhone(originalData.phone);
    setEmail(originalData.email);
  };

  return (
    <div className="mypage">
      <div className="left-container">
        <img
          src={profileImage}
          alt="profile"
          className="profile-pic-large"
          onClick={
            isEditing
              ? () => document.getElementById("fileInput").click()
              : undefined
          }
          style={{ cursor: isEditing ? "pointer" : "default" }}
        />
        <span className="profile-text" onClick={handleEditClick}>
          {isEditing ? "수정 중" : "프로필 수정"}
        </span>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="right-container">
        <div className="info-container">
          <button className="close-button" onClick={onBackClick}>
            ✖
          </button>
          <div className="info-field">
            <label>회사명</label>
            <input
              type="text"
              value={companyName}
              readOnly={!isEditing}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>이름</label>
            <input
              type="text"
              value={name}
              readOnly={!isEditing}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>연락처</label>
            <input
              type="text"
              value={phone}
              readOnly={!isEditing}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>이메일</label>
            <input type="text" value={email} readOnly />
          </div>
          {isEditing ? (
            <div>
              <button className="confirm-button" onClick={handleSaveClick}>
                저장
              </button>
              <button className="confirm-button" onClick={handleCancelClick}>
                취소
              </button>
            </div>
          ) : (
            <div className="links">
              <a href="#" className="logout-link" onClick={onLogout}>
                로그아웃
              </a>
              <a href="#" className="withdraw-link">
                탈퇴
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

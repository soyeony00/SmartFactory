import React, { useRef, useEffect, useState } from "react";
import styles from "./Section1.module.css";

const Section1 = () => {
  const iframeRef = useRef();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const checkFullScreenStatus = () => {
    const isNowFullScreen = document.fullscreenElement === iframeRef.current;
    setIsFullScreen(isNowFullScreen);
  };

  useEffect(() => {
    const handleResize = () => {
      checkFullScreenStatus();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current.requestFullscreen().catch((err) => {
        alert(`전체 화면 모드로 전환할 수 없습니다: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        alert(`전체 화면 모드를 종료할 수 없습니다: ${err.message}`);
      });
    }
  };

  const handleNextCamera = () => {
    // 여기에 다음 카메라로 전환하는 로직을 추가하세요
    console.log("Next camera");
  };

  const handlePreviousCamera = () => {
    // 여기에 이전 카메라로 전환하는 로직을 추가하세요
    console.log("Previous camera");
  };

  return (
    <div
      className={`${styles.section} ${
        isFullScreen ? styles["full-screen"] : ""
      }`}
    >
      <div className={styles.arrowLeft} onClick={handlePreviousCamera}>
        &lt;
      </div>
      <div className={styles.content}>
        <div className={styles.iframeContainer}>
          <iframe
            ref={iframeRef}
            src="http://192.168.0.140:8080/"
            className={styles.video}
            frameBorder="0"
            allowFullScreen
            title="Raspberry Pi Camera Stream"
          />
        </div>
      </div>
      <div className={styles.arrowRight} onClick={handleNextCamera}>
        &gt;
      </div>
    </div>
  );
};

export default Section1;

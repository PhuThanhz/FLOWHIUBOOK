import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import styles from "../styles/DualViewLayout.module.css";
import summaryPicture from "../assets/images/concao.jpeg";
import axios from "axios";
import { FaShareAlt, FaMoon, FaSun } from "react-icons/fa";

const DualViewLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("text");
  const [summaryMethod, setSummaryMethod] = useState("extract");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [storyData, setStoryData] = useState({
    text: "",
    summaryExtract: "",
    summaryParaphrase: ""
  });
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    setIsDarkTheme(localStorage.getItem("theme") === "dark");
    setNote(localStorage.getItem("note") || "");
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/story/1");
        setStoryData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
      setLoading(false);
    };
    fetchStory();
  }, []);

  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Truyện Cổ Tích: Cây Khế",
          text: "Đọc và khám phá tóm tắt truyện Cây Khế!",
          url: window.location.href
        })
        .catch((error) => console.log("Lỗi khi chia sẻ:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết để chia sẻ!");
    }
  };

  const handleReadAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    window.speechSynthesis.speak(utterance);
  };

  const renderTextWithVocab = (text) => {
    const vocab = { cáo: "Con vật thông minh", khế: "Loại cây có quả chua" };
    return text.split(" ").map((word, index) =>
      vocab[word] ? (
        <span
          key={index}
          className={styles.vocab}
          onClick={() => alert(vocab[word])}
        >
          {word}
        </span>
      ) : (
        word + " "
      )
    );
  };

  const handleImageClick = () => {
    alert("Đây là cây khế trong truyện!");
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setProgress(Math.min(100, percent));
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer === "Em trai" ? "Đúng" : "Sai");
  };

  return (
    <div
      className={`${styles.pageContainer} ${
        isDarkTheme ? styles.darkTheme : ""
      }`}
    >
      <Header />
      <div className={styles.mainContainer}>
        {isMobile && (
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeView === "text" ? styles.active : ""
              }`}
              onClick={() => setActiveView("text")}
            >
              Văn Bản
            </button>
            <button
              className={`${styles.tab} ${
                activeView === "summary" ? styles.active : ""
              }`}
              onClick={() => setActiveView("summary")}
            >
              Tóm Tắt
            </button>
          </div>
        )}

        <div className={styles.contentWrapper}>
          <div
            className={`${styles.panel} ${styles.textPanel} ${
              isMobile && activeView !== "text" ? styles.hidden : ""
            }`}
            onScroll={handleScroll}
          >
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
            <h2>Truyện Cổ Tích: Cây Khế</h2>
            <div className={styles.fontControl}>
              <button
                onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
              >
                A+
              </button>
            </div>
            <button
              className={styles.readAloudButton}
              onClick={() => handleReadAloud(storyData.text)}
            >
              🔊 Đọc to
            </button>
            <div
              className={styles.content}
              style={{ fontSize: `${fontSize}px` }}
            >
              {loading
                ? "Đang tải..."
                : renderTextWithVocab(
                    storyData.text ||
                      "Đây là một câu truyện cổ tích về loài vật..."
                  )}
            </div>
            <textarea
              className={styles.note}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bé ghi chú gì về truyện này nào!"
            />
          </div>

          <div
            className={`${styles.panel} ${styles.summaryPanel} ${
              isMobile && activeView !== "summary" ? styles.hidden : ""
            }`}
          >
            <div className={styles.summaryHeader}>
              <h2>Tóm Tắt</h2>
              <div className={styles.methodSelector}>
                <button
                  className={`${styles.methodButton} ${
                    summaryMethod === "extract" ? styles.active : ""
                  }`}
                  onClick={() => setSummaryMethod("extract")}
                >
                  Trích xuất
                </button>
                <button
                  className={`${styles.methodButton} ${
                    summaryMethod === "paraphrase" ? styles.active : ""
                  }`}
                  onClick={() => setSummaryMethod("paraphrase")}
                >
                  Diễn giải
                </button>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <img
                src={summaryPicture}
                alt="Summary"
                className={styles.summaryImage}
                onClick={handleImageClick}
              />
            </div>
            <button
              className={styles.readAloudButton}
              onClick={() =>
                handleReadAloud(
                  summaryMethod === "extract"
                    ? storyData.summaryExtract
                    : storyData.summaryParaphrase
                )
              }
            >
              🔊 Đọc to
            </button>
            <div className={styles.content}>
              {loading ? (
                "Đang tải..."
              ) : (
                <p>
                  <strong>Kết quả tóm tắt:</strong>
                  <br />
                  {summaryMethod === "extract"
                    ? storyData.summaryExtract
                    : storyData.summaryParaphrase}
                </p>
              )}
            </div>
            <div className={styles.quiz}>
              <p>Cây khế trong truyện thuộc về ai?</p>
              <button onClick={() => handleQuizAnswer("Anh trai")}>
                Anh trai
              </button>
              <button onClick={() => handleQuizAnswer("Em trai")}>
                Em trai
              </button>
              {quizAnswer && (
                <p>{quizAnswer === "Đúng" ? "Giỏi lắm!" : "Thử lại nhé!"}</p>
              )}
            </div>
          </div>
        </div>

        <button className={styles.themeButton} onClick={toggleTheme}>
          {isDarkTheme ? <FaSun /> : <FaMoon />}
        </button>
        <button className={styles.shareButton} onClick={handleShare}>
          <FaShareAlt />
        </button>
      </div>
    </div>
  );
};

export default DualViewLayout;

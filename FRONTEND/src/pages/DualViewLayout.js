import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { motion } from "framer-motion";
import Modal from "react-modal";
import {
  FaSun,
  FaMoon,
  FaShareAlt,
  FaVolumeUp,
  FaMinus,
  FaPlus,
  FaTimes,
  FaStar,
  FaPen
} from "react-icons/fa";
import styles from "../styles/DualViewLayout.module.css";
import summaryPicture from "../assets/images/concao.jpeg";

Modal.setAppElement("#root");

const pageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const DualViewLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("text");
  const [summaryMethod, setSummaryMethod] = useState("extract");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [storyData, setStoryData] = useState({
    title: "",
    text: "",
    summaryExtract: "",
    summaryParaphrase: ""
  });
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [voices, setVoices] = useState([]); // Danh sách giọng đọc
  const [selectedVoiceName, setSelectedVoiceName] = useState("Giọng Nữ"); // Tên giọng được chọn

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    setIsDarkTheme(localStorage.getItem("theme") === "dark");
    setProgress(localStorage.getItem(`progress_${id}`) || 0);

    // Lấy danh sách giọng đọc
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const vietnameseVoices = availableVoices.filter(
        (voice) => voice.lang === "vi-VN" || voice.lang === "vi"
      );

      // Tạo danh sách cố định "Giọng Nữ" và "Giọng Nam"
      const voiceOptions = [
        { name: "Giọng Nữ", voice: null },
        { name: "Giọng Nam", voice: null }
      ];

      // Gán giọng thực tế nếu có
      vietnameseVoices.forEach((voice) => {
        if (voice.name.includes("HoaiMy") && !voiceOptions[0].voice) {
          voiceOptions[0].voice = voice; // Gán giọng nữ
        } else if (
          (voice.name.includes("Nam") || voice.name.includes("Minh")) &&
          !voiceOptions[1].voice
        ) {
          voiceOptions[1].voice = voice; // Gán giọng nam
        }
      });

      setVoices(voiceOptions);
      if (voiceOptions[0].voice) {
        setSelectedVoiceName("Giọng Nữ"); // Mặc định chọn giọng nữ nếu có
      } else if (voiceOptions[1].voice) {
        setSelectedVoiceName("Giọng Nam"); // Nếu không có nữ, chọn nam
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [id]);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/story/${id}`
        );
        setStoryData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        if (parseInt(id) === 5)
          setStoryData({
            id: 5,
            title: "Bài Học Vui: Bạn Thân",
            text: "Ngày xưa, có hai bạn nhỏ là Tèo và Tí. Họ học cùng lớp và rất thân thiết. Một hôm, Tèo bị ốm, Tí đã mang sách vở đến giúp Tèo học. Họ cùng nhau làm bài tập và chơi đùa. Từ đó, họ hiểu rằng tình bạn thật quý giá và luôn cần trân trọng nhau.",
            summaryExtract:
              "Tèo và Tí là bạn thân, Tí giúp Tèo học khi ốm, nhấn mạnh tình bạn quý giá.",
            summaryParaphrase:
              "Tèo và Tí chơi thân. Khi Tèo ốm, Tí mang sách đến hỗ trợ và chơi cùng, giúp họ nhận ra giá trị của tình bạn."
          });
        else setError("Không thể tải truyện. Hãy thử lại nhé!");
      }
      setLoading(false);
    };
    fetchStory();
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`progress_${id}`, progress);
  }, [progress]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storyData.title || "Đọc truyện cùng bé",
        text: `Khám phá truyện ${storyData.title || ""} nhé!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép đường dẫn để chia sẻ!");
    }
  };

  const handleReadAloud = useCallback(
    (text) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.volume = 1;
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      const selectedVoice = voices.find(
        (v) => v.name === selectedVoiceName
      )?.voice;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoiceName, voices]
  );

  const renderTextWithVocab = useCallback((text) => {
    const vocab = { ốm: "Bị bệnh", quý: "Đáng giá" };
    const words = text.split(" ");
    return words.map((word, index) => (
      <span
        key={index}
        className={`${styles.word} ${vocab[word] ? styles.vocab : ""}`}
        onClick={() =>
          vocab[word] && alert(`"${word}" nghĩa là: ${vocab[word]}`)
        }
      >
        {word}{" "}
      </span>
    ));
  }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setProgress(Math.min(100, percent));
  }, []);

  return (
    <div
      className={`${styles.pageContainer} ${
        isDarkTheme ? styles.darkTheme : ""
      }`}
    >
      <Header />
      <motion.div className={styles.headerContainer}>
        {isMobile && (
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeView === "text" ? styles.active : ""
              }`}
              onClick={() => setActiveView("text")}
            >
              Truyện
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
      </motion.div>
      <div className={styles.contentWrapper}>
        <motion.div
          className={`${styles.panel} ${styles.textPanel} ${
            isMobile && activeView !== "text" ? styles.hidden : ""
          }`}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          onScroll={handleScroll}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
          <h2>{storyData.title || "Đang tải truyện..."}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.toolbar}>
            <motion.button
              onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
              whileHover={{ scale: 1.1 }}
              title="Thu nhỏ chữ"
            >
              <FaMinus />
            </motion.button>
            <motion.button
              onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
              whileHover={{ scale: 1.1 }}
              title="Phóng to chữ"
            >
              <FaPlus />
            </motion.button>
            <motion.button
              onClick={() => handleReadAloud(storyData.text)}
              whileHover={{ scale: 1.1 }}
              title="Nghe truyện"
            >
              <FaVolumeUp />
            </motion.button>
            {voices.length > 0 && (
              <select
                className={styles.voiceSelector}
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={styles.bookPage}>
            <div
              className={styles.bookContent}
              style={{ fontSize: `${fontSize}px` }}
            >
              {loading
                ? "Đang tải..."
                : storyData.text
                ? renderTextWithVocab(storyData.text)
                : "Chưa có nội dung"}
            </div>
            <div className={styles.imageContainer}>
              <motion.img
                src={summaryPicture}
                alt="Hình minh họa"
                className={styles.summaryImage}
                onClick={() => setIsImageModalOpen(true)}
                whileHover={{ scale: 1.05 }}
              />
              <p className={styles.imageCaption}>Hình minh họa câu chuyện</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.panel} ${styles.summaryPanel} ${
            isMobile && activeView !== "summary" ? styles.hidden : ""
          }`}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <h2>Tóm Tắt Vui</h2>
          <div className={styles.methodSelector}>
            <motion.button
              className={`${styles.methodButton} ${
                summaryMethod === "extract" ? styles.active : ""
              }`}
              onClick={() => setSummaryMethod("extract")}
              whileHover={{ scale: 1.05 }}
            >
              <FaStar /> Trích Xuất
            </motion.button>
            <motion.button
              className={`${styles.methodButton} ${
                summaryMethod === "paraphrase" ? styles.active : ""
              }`}
              onClick={() => setSummaryMethod("paraphrase")}
              whileHover={{ scale: 1.05 }}
            >
              <FaPen /> Diễn Giải
            </motion.button>
          </div>
          <div className={styles.summaryContent}>
            {summaryMethod === "extract" ? (
              <div className={styles.summaryExtractBox}>
                <p>{loading ? "Đang tải..." : storyData.summaryExtract}</p>
                <motion.button
                  onClick={() => handleReadAloud(storyData.summaryExtract)}
                  whileHover={{ scale: 1.1 }}
                  title="Nghe tóm tắt"
                >
                  <FaVolumeUp />
                </motion.button>
              </div>
            ) : (
              <div className={styles.summaryParaphraseBox}>
                <p>{loading ? "Đang tải..." : storyData.summaryParaphrase}</p>
                <motion.button
                  onClick={() => handleReadAloud(storyData.summaryParaphrase)}
                  whileHover={{ scale: 1.1 }}
                  title="Nghe tóm tắt"
                >
                  <FaVolumeUp />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <motion.button
        className={styles.themeButton}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        title={isDarkTheme ? "Chuyển sang sáng" : "Chuyển sang tối"}
      >
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </motion.button>
      <motion.button
        className={styles.shareButton}
        onClick={handleShare}
        whileHover={{ scale: 1.1 }}
        title="Chia sẻ truyện"
      >
        <FaShareAlt />
      </motion.button>
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={() => setIsImageModalOpen(false)}
        className={styles.imageModal}
        overlayClassName={styles.imageModalOverlay}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            className={styles.closeModalTop}
            onClick={() => setIsImageModalOpen(false)}
            title="Đóng"
          >
            <FaTimes />
          </button>
          <img
            src={summaryPicture}
            alt="Hình minh họa"
            className={styles.enlargedImage}
          />
          <p className={styles.imageCaption}>Hình minh họa câu chuyện</p>
        </motion.div>
      </Modal>
    </div>
  );
};

export default DualViewLayout;

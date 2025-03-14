import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import styles from "../styles/HomeScreen.module.css";
import SummaryCarousel from "../components/SummaryCarousel";
import SearchModal from "../components/SearchModal";
import Lottie from "lottie-react";
import ReactHowler from "react-howler";
import explore_button from "../assets/images/button.png";
import summary_button from "../assets/images/button2.png";
import pandaAnimation from "../assets/images/animation/Animation - 1741792766942.json";
import musicIcon from "../assets/images/pngtree-cute-little-girl-holding-a-megaphone-hand-drawn-cartoon-character-illustration-png-image_11324956-removebg-preview.png";

// Import ảnh cục bộ
import readingKids from "../assets/images/kids-playing.png";
import slideKids from "../assets/images/kids-playing.png";
import playBallKids from "../assets/images/kids-playing.png";
import paintKids from "../assets/images/kids-playing.png";
import scienceKids from "../assets/images/kids-playing.png";

// Component an toàn cho ReactHowler
class SafeReactHowler extends React.Component {
  howl = null;

  componentDidMount() {
    if (this.howl && this.props.playing) {
      this.howl.play();
    }
  }

  componentWillUnmount() {
    if (this.howl && this.howl.stop) {
      this.howl.stop();
    }
  }

  render() {
    return (
      <ReactHowler {...this.props} ref={(ref) => (this.howl = ref?.howl)} />
    );
  }
}

// Dữ liệu cho Mẹo đọc sách hay
const readingTips = [
  { id: 1, tip: "Đọc 15 phút mỗi ngày để siêu thông minh! 📚✨" },
  { id: 2, tip: "Ghi chú vui khi đọc truyện nhé! ✍️🌟" },
  { id: 3, tip: "Đọc to lên để nhớ lâu hơn nào! 🎙️🎉" }
];

const sampleSummaries = [
  {
    id: 1,
    image: "https://via.placeholder.com/150/3498db/ffffff?text=Truyện+Cổ+Tích",
    title: "Truyện Cổ Tích",
    classLevel: 1
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150/2ecc71/ffffff?text=Bài+Học+Vui",
    title: "Bài Học Vui",
    classLevel: 2
  },
  {
    id: 3,
    image:
      "https://via.placeholder.com/150/e74c3c/ffffff?text=Khoa+Học+Dễ+Hiểu",
    title: "Khoa Học Dễ Hiểu",
    classLevel: 3
  },
  {
    id: 4,
    image: "https://via.placeholder.com/150/f1c40f/ffffff?text=Lịch+Sử+Thú+Vị",
    title: "Lịch Sử Thú Vị",
    classLevel: 4
  },
  {
    id: 5,
    image: "https://via.placeholder.com/150/9b59b6/ffffff?text=Văn+Học+Bé",
    title: "Văn Học Bé",
    classLevel: 5
  }
];

const classLevels = [
  {
    id: 1,
    name: "Lớp 1",
    icon: "https://cdn.pixabay.com/photo/2016/04/15/04/19/child-1329499_1280.png",
    accessoryIcon:
      "https://cdn.pixabay.com/photo/2017/08/01/09/06/pencil-2562636_1280.png",
    mascotIcon: readingKids
  },
  {
    id: 2,
    name: "Lớp 2",
    icon: "https://cdn.pixabay.com/photo/2016/04/15/04/19/child-1329498_1280.png",
    accessoryIcon:
      "https://cdn.pixabay.com/photo/2017/08/01/09/06/book-2562635_1280.png",
    mascotIcon: slideKids
  },
  {
    id: 3,
    name: "Lớp 3",
    icon: "https://cdn.pixabay.com/photo/2016/04/15/04/19/child-1329497_1280.png",
    accessoryIcon:
      "https://cdn.pixabay.com/photo/2017/08/01/09/06/ruler-2562637_1280.png",
    mascotIcon: playBallKids
  },
  {
    id: 4,
    name: "Lớp 4",
    icon: "https://cdn.pixabay.com/photo/2016/04/15/04/19/child-1329496_1280.png",
    accessoryIcon:
      "https://cdn.pixabay.com/photo/2017/08/01/09/06/eraser-2562638_1280.png",
    mascotIcon: paintKids
  },
  {
    id: 5,
    name: "Lớp 5",
    icon: "https://cdn.pixabay.com/photo/2016/04/15/04/19/child-1329495_1280.png",
    accessoryIcon:
      "https://cdn.pixabay.com/photo/2017/08/01/09/06/notebook-2562639_1280.png",
    mascotIcon: scienceKids
  }
];

const guideMessages = [
  "Bé ơi, bay vào thế giới sách thần kỳ với chú panda nào! 🚀",
  "Bé giỏi lắm, chọn sách đi nào! 😄",
  "Vào đây chọn sách yêu thích với chú panda nhé! 🐼",
  "Bé ơi, đọc sách vui lắm, thử xem nào! 🌟",
  "Chú panda chờ bé tóm tắt sách nè! 🖋️"
];

function getRandomMessage() {
  return guideMessages[Math.floor(Math.random() * guideMessages.length)];
}

const HomeScreen = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showGuide, setShowGuide] = useState(true);
  const [guideMessage, setGuideMessage] = useState(getRandomMessage());
  const [penguinPosition, setPenguinPosition] = useState(20);
  const [playSound, setPlaySound] = useState(false);
  const [jump, setJump] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);

  useEffect(() => {
    const movePenguin = setInterval(() => {
      setPenguinPosition((prev) => (prev === 40 ? 80 : 40));
    }, 3000);
    return () => clearInterval(movePenguin);
  }, []);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    setGuideMessage(
      "Bé ơi, bay vào thế giới sách thần kỳ với chú panda nào! 🚀"
    );
    setShowGuide(true);
  };

  const handleSummarizeClick = () => {
    const randomItem =
      sampleSummaries[Math.floor(Math.random() * sampleSummaries.length)];
    setSummary(
      `Tóm tắt "${randomItem.title}": Một câu chuyện/bài học thú vị cho bé!`
    );
    setGuideMessage("Tuyệt vời! Chú panda vỗ tay cho bé nè! 👏");
    setShowGuide(true);
  };

  const handleClassClick = (classId) => {
    setSelectedClass(classId);
    setGuideMessage(
      `Bé chọn ${
        classLevels.find((level) => level.id === classId).name
      } rồi! Chú panda khen bé giỏi! 🐼`
    );
    setShowGuide(true);
  };

  const handleCloseModal = () => setIsSearchModalOpen(false);

  const handleGuideClick = () => {
    setGuideMessage(getRandomMessage());
    setShowGuide(true);
    setPlaySound(true);
    setJump(true);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
  };

  const toggleMusic = () => setPlayMusic(!playMusic);

  const filteredSummaries = selectedClass
    ? sampleSummaries.filter((item) => item.classLevel === selectedClass)
    : sampleSummaries;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h2 className={styles.sectionTitle}>
              Tóm tắt bài đọc siêu nhanh cho bé!
            </h2>
            <div className={styles.buttonContainer}>
              <img
                src={explore_button}
                alt="Khám phá ngay"
                className={styles.exploreButton}
                onClick={handleSearchClick}
              />
              <img
                src={summary_button}
                alt="Tóm tắt tức thì"
                className={styles.summaryButton}
                onClick={handleSummarizeClick}
              />
            </div>
            {summary && <p className={styles.summaryText}>{summary}</p>}
          </div>
        </section>

        {/* Nút bật/tắt nhạc nền với icon */}
        <button
          className={`${styles.musicButton} ${playMusic ? styles.playing : ""}`}
          onClick={toggleMusic}
        >
          <img src={musicIcon} alt="Music" className={styles.musicIcon} />
        </button>
        <SafeReactHowler
          src="/audio/nhacchillchotre.mp3" // Sử dụng file có sẵn
          playing={playMusic}
          loop={true}
          volume={0.5}
        />

        {/* Nhân vật hướng dẫn (Chú panda) */}
        {showGuide && (
          <div
            className={styles.guideContainer}
            style={{ right: `${penguinPosition}px` }}
            onClick={handleGuideClick}
          >
            <SafeReactHowler
              src="/audio/beoi.mp3" // Sử dụng file có sẵn làm âm thanh nhấp chuột
              playing={playSound}
              onEnd={() => setPlaySound(false)}
              volume={0.7}
            />
            <div className={styles.sparkleEffect}></div>
            <Lottie
              animationData={pandaAnimation}
              className={`${styles.guideCharacter} ${jump ? styles.jump : ""}`}
            />
            <div
              className={`${styles.speechBubble} ${
                isClicked ? styles.clicked : ""
              }`}
            >
              {guideMessage}
            </div>
            <button
              className={styles.closeGuide}
              onClick={() => setShowGuide(false)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Class Levels Section */}
        <h2 className={styles.sectionTitle}>Chọn lớp của bé</h2>
        <section className={styles.classSection}>
          <div className={styles.classList}>
            <div className={styles.classRow}>
              {classLevels.slice(0, 3).map((level) => (
                <div
                  key={level.id}
                  className={`${styles.classItem} ${
                    selectedClass === level.id ? styles.selected : ""
                  }`}
                  onClick={() => handleClassClick(level.id)}
                >
                  <div className={styles.classIconWrapper}>
                    <img
                      src={level.mascotIcon}
                      alt={`${level.name} mascot`}
                      className={styles.classIcon}
                    />
                  </div>
                  <span>{level.name}</span>
                </div>
              ))}
            </div>
            <div className={styles.classRow}>
              {classLevels.slice(3, 5).map((level) => (
                <div
                  key={level.id}
                  className={`${styles.classItem} ${
                    selectedClass === level.id ? styles.selected : ""
                  }`}
                  onClick={() => handleClassClick(level.id)}
                >
                  <div className={styles.classIconWrapper}>
                    <img
                      src={level.mascotIcon}
                      alt={`${level.name} mascot`}
                      className={styles.classIcon}
                    />
                  </div>
                  <span>{level.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <h2 className={styles.sectionTitle}>Bài đọc nổi bật</h2>
        <section className={styles.carouselSection}>
          <SummaryCarousel title="" items={filteredSummaries} />
        </section>

        {/* Section: Mẹo đọc sách hay */}
        <h2 className={styles.sectionTitle}>Mẹo đọc sách hay</h2>
        <section className={styles.learningSection}>
          <div className={styles.tipList}>
            {readingTips.map((tip) => (
              <div key={tip.id} className={styles.tipItem}>
                <p>{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Search Modal */}
        <SearchModal isOpen={isSearchModalOpen} onClose={handleCloseModal} />
      </main>
    </div>
  );
};

export default HomeScreen;

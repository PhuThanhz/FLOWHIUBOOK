import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/ReadingListPage.module.css";
import {
  FaBook,
  FaSearch,
  FaShareAlt,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaArrowLeft, // Đảm bảo import FaArrowLeft
  FaArrowRight,
  FaMagic
} from "react-icons/fa"; // Thêm lại FaArrowLeft để sử dụng trong pagination
import { motion, AnimatePresence } from "framer-motion";

// Placeholder image nếu hình ảnh không tải được
const placeholderImage =
  "https://via.placeholder.com/350x220.png?text=Hình+ảnh+không+tải+được";

// Dữ liệu bài đọc mẫu - mỗi lớp có 4 bài, lấy từ sách giáo khoa
const sampleSummaries = [
  // Lớp 1
  {
    id: 1,
    image:
      "https://www.vocw.edu.vn/wp-content/uploads/2021/01/Ve-tranh-minh-hoa-truyen-co-tich-lop-8.jpg",
    title: "Truyện Cổ Tích: Thỏ Và Rùa",
    description: "Câu chuyện về chú thỏ tự tin và chú rùa kiên trì.",
    classLevel: 1,
    genre: "Cổ tích",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 2,
    image:
      "https://www.vocw.edu.vn/wp-content/uploads/2021/01/Ve-tranh-minh-hoa-truyen-co-tich-lop-8.jpg",
    title: "Cậu Bé Và Cây Táo",
    description: "Câu chuyện cảm động về tình yêu gia đình.",
    classLevel: 1,
    genre: "Cổ tích",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 3,
    image:
      "https://www.vocw.edu.vn/wp-content/uploads/2021/01/Ve-tranh-minh-hoa-truyen-co-tich-lop-8.jpg",
    title: "Chiếc Bóng Bay Đỏ",
    description: "Bé Na tìm lại chiếc bóng bay bị gió thổi bay.",
    classLevel: 1,
    genre: "Phiêu lưu",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 4,
    image:
      "https://www.vocw.edu.vn/wp-content/uploads/2021/01/Ve-tranh-minh-hoa-truyen-co-tich-lop-8.jpg",
    title: "Mẹ Và Bé",
    description: "Bài đọc về tình cảm gia đình, bé giúp mẹ làm việc nhà.",
    classLevel: 1,
    genre: "Đời thường",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  // Lớp 2
  {
    id: 5,
    image:
      "https://cdnphoto.dantri.com.vn/J--UViBTDTpx6QfI4EBgU3A7yJ0=/zoom/1200_630/NxccccccccccccoFBts62NyN5Dzb54/Image/2015/02/sa1-8edd4.jpg",
    title: "Bài Học Vui: Bạn Thân",
    description: "Bài học về tình bạn giữa các bạn nhỏ trong lớp.",
    classLevel: 2,
    genre: "Đời thường",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 6,
    image: "https://via.placeholder.com/350x220.png?text=Chú+Mèo+Lười",
    title: "Chú Mèo Lười",
    description: "Chú mèo học cách giúp đỡ bạn bè.",
    classLevel: 2,
    genre: "Cổ tích",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 7,
    image: "https://via.placeholder.com/350x220.png?text=Mưa+Rào+Mùa+Hè",
    title: "Mưa Rào Mùa Hè",
    description: "Miêu tả một ngày mưa và niềm vui của các bạn nhỏ.",
    classLevel: 2,
    genre: "Đời thường",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  {
    id: 8,
    image: "https://via.placeholder.com/350x220.png?text=Chú+Thỏ+Thông+Minh",
    title: "Chú Thỏ Thông Minh",
    description: "Chú thỏ dùng trí khôn để thoát khỏi con cáo.",
    classLevel: 2,
    genre: "Cổ tích",
    difficulty: "Dễ",
    length: "Ngắn"
  },
  // Lớp 3
  {
    id: 9,
    image: "https://live.staticflickr.com/7874/40474155873_8d0ac5580d_z.jpg",
    title: "Khoa Học Dễ Hiểu: Nước Và Thời Tiết",
    description: "Khám phá cách nước ảnh hưởng đến thời tiết.",
    classLevel: 3,
    genre: "Khoa học",
    difficulty: "Trung bình",
    length: "Trung bình"
  },
  {
    id: 10,
    image: "https://via.placeholder.com/350x220.png?text=Hành+Tinh+Xanh",
    title: "Hành Tinh Xanh",
    description: "Khám phá hành tinh và bảo vệ môi trường.",
    classLevel: 3,
    genre: "Khoa học",
    difficulty: "Trung bình",
    length: "Trung bình"
  },
  {
    id: 11,
    image:
      "https://via.placeholder.com/350x220.png?text=Hành+Trình+Của+Giọt+Nước",
    title: "Hành Trình Của Giọt Nước",
    description: "Giọt nước kể về chuyến đi từ sông ra biển.",
    classLevel: 3,
    genre: "Khoa học",
    difficulty: "Trung bình",
    length: "Ngắn"
  },
  {
    id: 12,
    image: "https://via.placeholder.com/350x220.png?text=Bí+Mật+Trong+Rừng",
    title: "Bí Mật Trong Rừng",
    description: "Nhóm bạn khám phá khu rừng và tìm kho báu.",
    classLevel: 3,
    genre: "Phiêu lưu",
    difficulty: "Trung bình",
    length: "Trung bình"
  },
  // Lớp 4
  {
    id: 13,
    image:
      "https://timviec365.vn/pictures/images_03_2021/dinh-tien-hoang%20(1).jpg",
    title: "Lịch Sử Thú Vị: Vua Đinh Tiên Hoàng",
    description: "Câu chuyện về vị vua sáng lập nhà Đinh.",
    classLevel: 4,
    genre: "Lịch sử",
    difficulty: "Trung bình",
    length: "Dài"
  },
  {
    id: 14,
    image: "https://via.placeholder.com/350x220.png?text=Trận+Đánh+Rồng+Lửa",
    title: "Trận Đánh Rồng Lửa",
    description: "Huyền thoại về dũng sĩ và rồng.",
    classLevel: 4,
    genre: "Phiêu lưu",
    difficulty: "Trung bình",
    length: "Dài"
  },
  {
    id: 15,
    image:
      "https://via.placeholder.com/350x220.png?text=Lịch+Sử+Chiếc+Bánh+Chung",
    title: "Lịch Sử Chiếc Bánh Chưng",
    description: "Nguồn gốc của bánh chưng trong văn hóa Việt Nam.",
    classLevel: 4,
    genre: "Lịch sử",
    difficulty: "Trung bình",
    length: "Trung bình"
  },
  {
    id: 16,
    image:
      "https://via.placeholder.com/350x220.png?text=Cây+Xanh+Và+Môi+Trường",
    title: "Cây Xanh Và Môi Trường",
    description: "Bài đọc về tầm quan trọng của việc trồng cây.",
    classLevel: 4,
    genre: "Khoa học",
    difficulty: "Trung bình",
    length: "Ngắn"
  },
  // Lớp 5
  {
    id: 17,
    image:
      "https://baovannghe.vn/stores/news_dataimages/2024/122024/20/03/truyen-co-tich-tam-cam-1280x76820241220031136.jpg?rt=20241220031138",
    title: "Văn Học Bé: Tấm Cám",
    description: "Truyện cổ tích về lòng tốt và sự công bằng.",
    classLevel: 5,
    genre: "Cổ tích",
    difficulty: "Trung bình",
    length: "Dài"
  },
  {
    id: 18,
    image: "https://via.placeholder.com/350x220.png?text=Bí+Ẩn+Đại+Dương",
    title: "Bí Ẩn Đại Dương",
    description: "Cuộc phiêu lưu dưới lòng đại dương.",
    classLevel: 5,
    genre: "Phiêu lưu",
    difficulty: "Trung bình",
    length: "Dài"
  },
  {
    id: 19,
    image: "https://via.placeholder.com/350x220.png?text=Nhà+Khoa+Học+Nhí",
    title: "Nhà Khoa Học Nhí",
    description: "Một bạn nhỏ tự làm thí nghiệm khoa học.",
    classLevel: 5,
    genre: "Khoa học",
    difficulty: "Trung bình",
    length: "Trung bình"
  },
  {
    id: 20,
    image:
      "https://via.placeholder.com/350x220.png?text=Hành+Trình+Của+Marco+Polo",
    title: "Hành Trình Của Marco Polo",
    description: "Câu chuyện lịch sử về hành trình khám phá của Marco Polo.",
    classLevel: 5,
    genre: "Lịch sử",
    difficulty: "Khó",
    length: "Dài"
  }
];

const ReadingListPage = () => {
  const { classLevel } = useParams();
  const level = parseInt(classLevel, 10);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("Tất cả");
  const [difficultyFilter, setDifficultyFilter] = useState("Tất cả");
  const [lengthFilter, setLengthFilter] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Thêm trạng thái cho bài đọc ngẫu nhiên
  const [randomStory, setRandomStory] = useState(null);

  // Lọc bài đọc theo classLevel, tìm kiếm, thể loại, độ khó, và độ dài
  const filteredSummaries = sampleSummaries
    .filter((item) => item.classLevel === level)
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      genreFilter === "Tất cả" ? true : item.genre === genreFilter
    )
    .filter((item) =>
      difficultyFilter === "Tất cả"
        ? true
        : item.difficulty === difficultyFilter
    )
    .filter((item) =>
      lengthFilter === "Tất cả" ? true : item.length === lengthFilter
    );

  // Sắp xếp bài đọc theo tiêu đề
  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (sortOrder === "A-Z") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  // Phân trang
  const totalPages = Math.ceil(sortedSummaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSummaries = sortedSummaries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setRandomStory(null); // Reset bài ngẫu nhiên khi tìm kiếm
  };

  const handleGenreFilter = (event) => {
    setGenreFilter(event.target.value);
    setCurrentPage(1);
    setRandomStory(null); // Reset bài ngẫu nhiên khi lọc
  };

  const handleDifficultyFilter = (event) => {
    setDifficultyFilter(event.target.value);
    setCurrentPage(1);
    setRandomStory(null); // Reset bài ngẫu nhiên khi lọc
  };

  const handleLengthFilter = (event) => {
    setLengthFilter(event.target.value);
    setCurrentPage(1);
    setRandomStory(null); // Reset bài ngẫu nhiên khi lọc
  };

  const handleSortOrder = () => {
    setSortOrder(sortOrder === "A-Z" ? "Z-A" : "A-Z");
    setCurrentPage(1);
    setRandomStory(null); // Reset bài ngẫu nhiên khi sắp xếp
  };

  const handleShare = (story) => {
    if (navigator.share) {
      navigator
        .share({
          title: story.title,
          text: story.description,
          url: window.location.href
        })
        .catch((error) => console.log("Lỗi khi chia sẻ:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Liên kết đã được sao chép!");
    }
  };

  const handleReadNow = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Hàm chọn bài đọc ngẫu nhiên từ danh sách đã lọc
  const handleRandomStory = () => {
    const availableStories = filteredSummaries.filter(
      (item) => !randomStory || item.id !== randomStory.id
    );
    if (availableStories.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableStories.length);
      setRandomStory(availableStories[randomIndex]);
      setTimeout(() => setRandomStory(null), 5000); // Tự động ẩn sau 5 giây
    }
  };

  return (
    <div className={styles.container}>
      <Header /> {/* Thêm Header ở đây */}
      {/* Thanh điều hướng cố định */}
      <div className={styles.navBar}>
        <h2 className={styles.navTitle}>
          Danh sách bài đọc cho Lớp {classLevel}
        </h2>
        <button onClick={handleRandomStory} className={styles.randomButton}>
          <FaMagic className={styles.randomIcon} /> Khám phá ngẫu nhiên
        </button>
      </div>
      <div className={styles.filterSearchContainer}>
        <div className={styles.filterContainer}>
          <select
            value={genreFilter}
            onChange={handleGenreFilter}
            className={styles.genreFilter}
          >
            <option value="Tất cả">Tất cả thể loại</option>
            <option value="Cổ tích">Cổ tích</option>
            <option value="Phiêu lưu">Phiêu lưu</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Lịch sử">Lịch sử</option>
            <option value="Đời thường">Đời thường</option>
          </select>
        </div>
        <div className={styles.filterContainer}>
          <select
            value={difficultyFilter}
            onChange={handleDifficultyFilter}
            className={styles.genreFilter}
          >
            <option value="Tất cả">Tất cả độ khó</option>
            <option value="Dễ">Dễ</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khó">Khó</option>
          </select>
        </div>
        <div className={styles.filterContainer}>
          <select
            value={lengthFilter}
            onChange={handleLengthFilter}
            className={styles.genreFilter}
          >
            <option value="Tất cả">Tất cả độ dài</option>
            <option value="Ngắn">Ngắn</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Dài">Dài</option>
          </select>
        </div>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm bài đọc..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
        <button onClick={handleSortOrder} className={styles.sortButton}>
          {sortOrder === "A-Z" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
          Sắp xếp
        </button>
      </div>
      <main className={styles.mainContent}>
        <section className={styles.readingListSection}>
          <div className={styles.readingList}>
            <AnimatePresence>
              {randomStory && (
                <motion.div
                  className={styles.randomStory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className={styles.randomTitle}>
                    Gợi ý ngẫu nhiên: {randomStory.title}
                  </h3>
                  <p className={styles.randomDescription}>
                    {randomStory.description}
                  </p>
                  <button
                    onClick={() => handleReadNow(randomStory.id)}
                    className={styles.readButton}
                  >
                    Đọc ngay
                  </button>
                </motion.div>
              )}
              {paginatedSummaries.length > 0 ? (
                paginatedSummaries.map((item) => (
                  <motion.div
                    key={item.id}
                    className={styles.readingItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 20px rgba(66, 165, 245, 0.4)"
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.readingImage}
                      onError={(e) => (e.target.src = placeholderImage)}
                    />
                    <div className={styles.readingDetails}>
                      <div className={styles.titleActions}>
                        <h3 className={styles.readingTitle}>{item.title}</h3>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleShare(item)}
                            className={styles.actionButton}
                            title="Chia sẻ bài đọc"
                          >
                            <FaShareAlt />
                          </button>
                        </div>
                      </div>
                      <p className={styles.readingDescription}>
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleReadNow(item.id)}
                        className={styles.readButton}
                      >
                        Đọc ngay
                      </button>
                    </div>
                    <div className={styles.tooltip}>{item.description}</div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className={styles.noItems}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Không có bài đọc nào phù hợp.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Trước {/* Loại bỏ FaArrowLeft */}
              </button>
              <span className={styles.paginationText}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Tiếp <FaArrowRight />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ReadingListPage;

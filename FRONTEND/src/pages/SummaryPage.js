import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import styles from "../styles/SummaryPage.module.css";
import * as pdfjsLib from "pdfjs-dist";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SummaryPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("extract");
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [textInput, setTextInput] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [wordCountChart, setWordCountChart] = useState(null);
  const [keywordChart, setKeywordChart] = useState(null);
  const [sentenceLengthChart, setSentenceLengthChart] = useState(null);
  const [rougeChart, setRougeChart] = useState(null);
  const [bleuChart, setBleuChart] = useState(null);
  const [meteorChart, setMeteorChart] = useState(null);
  const [metricsChart, setMetricsChart] = useState(null);
  const [expandedChart, setExpandedChart] = useState(null); // Trạng thái để theo dõi sơ đồ được phóng to

  const wordCountRef = useRef(null);
  const keywordRef = useRef(null);
  const sentenceLengthRef = useRef(null);
  const rougeRef = useRef(null);
  const bleuRef = useRef(null);
  const meteorRef = useRef(null);
  const metricsRef = useRef(null);

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

  const summarizeText = (text) => {
    const words = text.split(" ");
    const summaryLength = Math.floor(words.length * 0.3);
    return words.slice(0, summaryLength).join(" ") + "...";
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const typedArray = new Uint8Array(fileReader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText +=
              textContent.items.map((item) => item.str).join(" ") + " ";
          }
          const summary = summarizeText(fullText);
          setSummaryResult(summary);
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        setSummaryResult("Ôi! Có lỗi khi đọc file PDF nha! 😅");
        console.error(error);
      }
    } else {
      setSummaryResult("Ôi! Hãy chọn file PDF nha! 😅");
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const summary = summarizeText(textInput);
      setSummaryResult(summary);
    } else {
      setSummaryResult("Nhập gì đó để tóm tắt nha! 😄");
    }
  };

  const handleReset = () => {
    setTextInput("");
    setSummaryResult("");
  };

  const generateImage = () => {
    if (summaryResult) {
      if (
        window.confirm(
          "Bạn muốn tạo hình ảnh dựa trên nội dung tóm tắt và công khai nó?"
        )
      ) {
        alert(
          "Hình ảnh đã được tạo và công khai! (Tính năng này cần tích hợp API thực tế)"
        );
      }
    } else {
      alert("Vui lòng tóm tắt trước khi tạo hình ảnh!");
    }
  };

  const handleChartClick = (chartId) => {
    setExpandedChart(expandedChart === chartId ? null : chartId); // Toggle trạng thái phóng to
  };

  // Hàm tạo các biểu đồ khi có kết quả
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (summaryResult) {
      // Destroy existing charts
      if (wordCountChart) wordCountChart.destroy();
      if (keywordChart) keywordChart.destroy();
      if (sentenceLengthChart) sentenceLengthChart.destroy();
      if (rougeChart) rougeChart.destroy();
      if (bleuChart) bleuChart.destroy();
      if (meteorChart) meteorChart.destroy();
      if (metricsChart) metricsChart.destroy();

      // Biểu đồ số từ
      if (wordCountRef && wordCountRef.current) {
        const newWordCountChart = new Chart(wordCountRef.current, {
          type: "bar",
          data: {
            labels: ["Văn bản gốc", "Tóm tắt"],
            datasets: [
              {
                label: "Số từ",
                data: [100, 30],
                backgroundColor: ["#1e90ff", "#32cd32"],
                borderColor: ["#1e90ff", "#32cd32"],
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 120,
                title: {
                  display: true,
                  text: "Số từ",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Loại văn bản",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5 /* Điều chỉnh khoảng cách giữa nhãn và biểu đồ */
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20 /* Tăng khoảng cách dưới để nhãn không bị lệch */
              }
            }
          }
        });
        setWordCountChart(newWordCountChart);
      }

      // Biểu đồ từ khóa
      if (keywordRef && keywordRef.current) {
        const newKeywordChart = new Chart(keywordRef.current, {
          type: "bar",
          data: {
            labels: ["Truyện", "Học", "Vui"],
            datasets: [
              {
                label: "Tần suất từ khóa",
                data: [5, 4, 3],
                backgroundColor: "#ffa500",
                borderColor: "#ff8c00",
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: "Tần suất",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Từ khóa",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setKeywordChart(newKeywordChart);
      }

      // Biểu đồ độ dài câu
      if (sentenceLengthRef && sentenceLengthRef.current) {
        const newSentenceLengthChart = new Chart(sentenceLengthRef.current, {
          type: "bar",
          data: {
            labels: ["Độ dài trung bình"],
            datasets: [
              {
                label: "Số từ",
                data: [5],
                backgroundColor: "#32cd32",
                borderColor: "#32cd32",
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: "Số từ",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Thông số",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setSentenceLengthChart(newSentenceLengthChart);
      }

      // Biểu đồ ROUGE
      if (rougeRef && rougeRef.current) {
        const newRougeChart = new Chart(rougeRef.current, {
          type: "bar",
          data: {
            labels: ["ROUGE-1", "ROUGE-2", "ROUGE-L"],
            datasets: [
              {
                label: "Điểm ROUGE",
                data: [0.75, 0.55, 0.7],
                backgroundColor: "#1e90ff",
                borderColor: "#1e90ff",
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                title: {
                  display: true,
                  text: "Điểm số",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Chỉ số ROUGE",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setRougeChart(newRougeChart);
      }

      // Biểu đồ BLEU
      if (bleuRef && bleuRef.current) {
        const newBleuChart = new Chart(bleuRef.current, {
          type: "bar",
          data: {
            labels: ["Chỉ số BLEU"],
            datasets: [
              {
                label: "Điểm BLEU",
                data: [0.65],
                backgroundColor: "#ff69b4",
                borderColor: "#ff69b4",
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                title: {
                  display: true,
                  text: "Điểm số",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Chỉ số BLEU",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setBleuChart(newBleuChart);
      }

      // Biểu đồ METEOR
      if (meteorRef && meteorRef.current) {
        const newMeteorChart = new Chart(meteorRef.current, {
          type: "bar",
          data: {
            labels: ["METEOR"],
            datasets: [
              {
                label: "Điểm METEOR",
                data: [0.7],
                backgroundColor: "#1e90ff",
                borderColor: "#1e90ff",
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                title: {
                  display: true,
                  text: "Điểm số",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Chỉ số METEOR",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setMeteorChart(newMeteorChart);
      }

      // Biểu đồ chỉ số bổ sung
      if (metricsRef && metricsRef.current) {
        const newMetricsChart = new Chart(metricsRef.current, {
          type: "bar",
          data: {
            labels: ["Dễ đọc", "Chính xác"],
            datasets: [
              {
                label: "Phần trăm",
                data: [80, 90],
                backgroundColor: ["#40e0d0", "#dda0dd"],
                borderColor: ["#40e0d0", "#dda0dd"],
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Phần trăm (%)",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Chỉ số",
                  font: {
                    size: 16,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 10
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  },
                  padding: 5
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: "'Comic Sans MS', sans-serif"
                  }
                }
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                },
                bodyFont: {
                  size: 14,
                  family: "'Comic Sans MS', sans-serif"
                }
              }
            },
            layout: {
              padding: {
                bottom: 20
              }
            }
          }
        });
        setMetricsChart(newMetricsChart);
      }
    }
  }, [summaryResult]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.headerContainer}>
          {/* Sidebar for Options */}
          <div className={styles.optionColumn}>
            <div className={styles.optionSection}>
              <h3 className={styles.optionTitle}>Chọn kiểu tóm tắt 🌟</h3>
              <div className={styles.optionGroup}>
                <button
                  className={`${styles.optionButton} ${styles.methodExtract} ${
                    selectedMethod === "extract" ? styles.active : ""
                  }`}
                  onClick={() => setSelectedMethod("extract")}
                  data-tooltip="Nhấn để Trích xuất văn bản! 🌊"
                >
                  <span className={styles.buttonIcon}>🌊</span> Trích xuất
                </button>
                <button
                  className={`${styles.optionButton} ${
                    styles.methodParaphrase
                  } ${selectedMethod === "paraphrase" ? styles.active : ""}`}
                  onClick={() => setSelectedMethod("paraphrase")}
                  data-tooltip="Nhấn để Diễn giải văn bản! 🌴"
                >
                  <span className={styles.buttonIcon}>🌴</span> Diễn giải
                </button>
              </div>
            </div>
            <div className={styles.optionSection}>
              <h3 className={styles.optionTitle}>Chọn lớp học 🐾</h3>
              <div className={styles.optionGroup}>
                <button
                  className={`${styles.optionButton} ${styles.grade1} ${
                    selectedGrade === 1 ? styles.active : ""
                  }`}
                  onClick={() => setSelectedGrade(1)}
                  data-tooltip="Chọn Lớp 1 nhé! 🐱"
                >
                  <span className={styles.buttonIcon}>🐱</span> Lớp 1
                </button>
                <button
                  className={`${styles.optionButton} ${styles.grade2} ${
                    selectedGrade === 2 ? styles.active : ""
                  }`}
                  onClick={() => setSelectedGrade(2)}
                  data-tooltip="Chọn Lớp 2 nhé! 🐶"
                >
                  <span className={styles.buttonIcon}>🐶</span> Lớp 2
                </button>
                <button
                  className={`${styles.optionButton} ${styles.grade3} ${
                    selectedGrade === 3 ? styles.active : ""
                  }`}
                  onClick={() => setSelectedGrade(3)}
                  data-tooltip="Chọn Lớp 3 nhé! 🐰"
                >
                  <span className={styles.buttonIcon}>🐰</span> Lớp 3
                </button>
                <button
                  className={`${styles.optionButton} ${styles.grade4} ${
                    selectedGrade === 4 ? styles.active : ""
                  }`}
                  onClick={() => setSelectedGrade(4)}
                  data-tooltip="Chọn Lớp 4 nhé! 🐹"
                >
                  <span className={styles.buttonIcon}>🐹</span> Lớp 4
                </button>
                <button
                  className={`${styles.optionButton} ${styles.grade5} ${
                    selectedGrade === 5 ? styles.active : ""
                  }`}
                  onClick={() => setSelectedGrade(5)}
                  data-tooltip="Chọn Lớp 5 nhé! 🐸"
                >
                  <span className={styles.buttonIcon}>🐸</span> Lớp 5
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.inputResultSection}>
          <div className={styles.inputResultContainer}>
            <div className={styles.textInputContainer}>
              <div className={styles.inputWrapper}>
                <div className={styles.textInputArea}>
                  <h3 className={styles.sectionTitle}>
                    Nhập văn bản muốn tóm tắt nha! 😄
                  </h3>
                  <textarea
                    className={styles.textArea}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Nhập văn bản muốn tóm tắt nha! 😄"
                  />
                </div>
              </div>
              <div className={styles.buttonRow}>
                <button
                  className={styles.submitButton}
                  onClick={() => {
                    handleTextSubmit();
                    generateImage();
                  }}
                  disabled={!textInput.trim()}
                >
                  <span className={styles.buttonIcon}>🌈</span> Tóm tắt nào!
                </button>
                <label htmlFor="file-upload" className={styles.uploadButton}>
                  <span className={styles.buttonIcon}>📄</span> Tải PDF
                  <input
                    type="file"
                    id="file-upload"
                    className={styles.fileInput}
                    onChange={(e) => {
                      handleFileUpload(e);
                      generateImage();
                    }}
                    accept=".pdf"
                  />
                </label>
                <button className={styles.resetButton} onClick={handleReset}>
                  <span className={styles.buttonIcon}>🧹</span> Xóa hết
                </button>
              </div>
              {summaryResult && (
                <button
                  className={styles.generateImageButton}
                  onClick={generateImage}
                >
                  Tạo và công khai hình ảnh
                </button>
              )}
            </div>

            <div className={styles.resultContainer}>
              <h3 className={styles.sectionTitle}>
                Kết quả tóm tắt đây nha! 🎉
              </h3>
              <div className={styles.resultBox}>
                <p className={styles.resultText}>
                  {summaryResult || "Chưa có kết quả! Tóm tắt để xem nha! 😊"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Section */}
        <section className={styles.evaluationSection}>
          <h2 className={styles.evaluationTitle}>
            Biểu đồ chỉ số đánh giá chất lượng tóm tắt 🎯
          </h2>
          <div className={styles.evaluationContainer}>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "wordCount" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("wordCount")}
            >
              <p>Số từ (giả lập: Văn bản gốc: 100 từ, Tóm tắt: 30 từ) 📊</p>
              <canvas ref={wordCountRef} id="wordCountChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "keyword" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("keyword")}
            >
              <p>Từ khóa nổi bật (giả lập: Truyện, Học, Vui) 🔑</p>
              <canvas ref={keywordRef} id="keywordChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "sentenceLength" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("sentenceLength")}
            >
              <p>Độ dài câu trung bình (giả lập: 5 từ) 📈</p>
              <canvas ref={sentenceLengthRef} id="sentenceLengthChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "rouge" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("rouge")}
            >
              <p>
                Đồ thị ROUGE (giả lập: ROUGE-1: 0.75, ROUGE-2: 0.55, ROUGE-L:
                0.7) 📊
              </p>
              <canvas ref={rougeRef} id="rougeChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "bleu" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("bleu")}
            >
              <p>Đồ thị BLEU (giả lập: BLEU: 0.65) 📉</p>
              <canvas ref={bleuRef} id="bleuChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "meteor" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("meteor")}
            >
              <p>Đồ thị METEOR (giả lập: METEOR: 0.70) 📉</p>
              <canvas ref={meteorRef} id="meteorChart"></canvas>
            </div>
            <div
              className={`${styles.evaluationItem} ${
                expandedChart === "metrics" ? styles.expanded : ""
              }`}
              onClick={() => handleChartClick("metrics")}
            >
              <p>Chỉ số bổ sung (giả lập: Dễ đọc: 80%, Chính xác: 90%) 📋</p>
              <canvas ref={metricsRef} id="metricsChart"></canvas>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SummaryPage;

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import styles from '../styles/DualViewLayout.module.css';
import summaryPicture from '../assets/images/concao.jpeg';

const DualViewLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [activeView, setActiveView] = useState('text');
    const [summaryMethod, setSummaryMethod] = useState('extract'); // 'extract' or 'paraphrase'

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', checkMobile);
        checkMobile();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.mainContainer}>
                {/* Mobile Tabs */}
                {isMobile && (
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tab} ${activeView === 'text' ? styles.active : ''}`}
                            onClick={() => setActiveView('text')}
                        >
                            Văn Bản
                        </button>
                        <button
                            className={`${styles.tab} ${activeView === 'summary' ? styles.active : ''}`}
                            onClick={() => setActiveView('summary')}
                        >
                            Tóm Tắt
                        </button>
                    </div>
                )}

                <div className={styles.contentWrapper}>
                    {/* Full Text Panel */}
                    <div className={`${styles.panel} ${styles.textPanel} ${isMobile && activeView !== 'text' ? styles.hidden : ''}`}>
                        <h2>Truyện Cổ Tích: Cây Khế</h2>
                        <div className={styles.content}>
                            <p>Đây là một câu truyện cổ tích về loài vật kể về một con cáo... (your full text here)</p>
                        </div>
                    </div>

                    {/* AI Summary Panel */}
                    <div className={`${styles.panel} ${styles.summaryPanel} ${isMobile && activeView !== 'summary' ? styles.hidden : ''}`}>
                        <div className={styles.summaryHeader}>
                            <h2>Tóm Tắt</h2>
                            <div className={styles.methodSelector}>
                                <button
                                    className={`${styles.methodButton} ${summaryMethod === 'extract' ? styles.active : ''}`}
                                    onClick={() => setSummaryMethod('extract')}
                                >
                                    Trích xuất
                                </button>
                                <button
                                    className={`${styles.methodButton} ${summaryMethod === 'paraphrase' ? styles.active : ''}`}
                                    onClick={() => setSummaryMethod('paraphrase')}
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
                            />
                        </div>

                        <div className={styles.content}>
                            {summaryMethod === 'extract' ? (
                                <p>Ý nghĩa câu truyện: nhắc nhở chúng ta nên biết được thực lực bản thân...</p>
                            ) : (
                                <p>Bài học rút ra: Đừng tự biện minh cho hạn chế của bản thân, hãy thành thật...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DualViewLayout;

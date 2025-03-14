import React, { useState } from 'react';
import styles from '../styles/SearchModal.module.css';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Search query:', searchQuery);
        // Implement search logic here
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={styles.modalContent}>
                <h2>Tìm kiếm tóm tắt</h2>
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập từ khóa..."
                    className={styles.searchInput}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                    Tìm kiếm
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default SearchModal;

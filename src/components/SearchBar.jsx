import React from 'react';
import css from './SearchBar.module.css'; 
import Input from './Input';

const SearchBar = ({
    value,
    onChange,
    onSearch,      // 엔터 또는 아이콘 클릭 시 호출될 함수
    mode,
    placeholder,
    onOpenModal    // mode === 'modal'일 때만 사용
}) => {

    // 현재의 인풋값을 그대로 전달 
    const handleInputChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (mode === 'search' && onSearch) {
            onSearch(value); 
        }
    };

    // 돋보기 아이콘 SVG를 직접 클릭했을 때 호출
    const handleIconClick = (e) => {
        if (mode === 'search' && onSearch) {
            onSearch(value); 
        }
    };

    // mode가 모달일때 위해서 남겨놓음 
    const handleWrapperClick = () => {
        if (mode === 'modal' && onOpenModal) {
            onOpenModal();
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className={css.searchBarFormWrapper ?? 'search-bar-form-wrapper'}>
            <div className={css.searchBar} onClick={handleWrapperClick}>
                <Input
                    value={value}
                    onChange={handleInputChange}
                    readOnly={mode === 'modal'}
                    placeholder={placeholder}
                />
                <svg
                    onClick={handleIconClick} // SVG 아이콘에 직접 클릭 핸들러 연결
                    width="20"
                    height="20"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={css.searchIcon} 
                >
                    <path
                        d="M19.748 19.88L23.8 23.8M22.4933 13.3467C22.4933 18.3982 18.3982 22.4933 13.3466 22.4933C8.29505 22.4933 4.19995 18.3982 4.19995 13.3467C4.19995 8.29511 8.29505 4.20001 13.3466 4.20001C18.3982 4.20001 22.4933 8.29511 22.4933 13.3467Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ stroke: 'var(--neutral-colors-sand-brown)' }}
                    />
                </svg>
            </div>
            <button type="submit" style={{ display: 'none' }} aria-hidden="true">검색</button>
        </form>
    );
};

export default SearchBar;
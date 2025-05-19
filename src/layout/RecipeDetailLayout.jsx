// RecipeDetailLayout.jsx
import React from 'react'
import PropTypes from 'prop-types'
import css from './RecipeDetailLayout.module.css'

const RecipeDetailLayout = ({
    title,
    headerContent,
    mainImage,
    tabs,
    activeTab,
    onTabChange,
    tabContent,
    footerContent,
    floatingButton,
    isLoading,
    error,
    loadingComponent,
    errorComponent,
}) => {
    // 로딩 중 표시
    if (isLoading) {
        return (
            loadingComponent || (
                <div className={css.loadingWrapper}>
                    레시피 <span className={css.loadingDots}>불러오는 중</span>
                </div>
            )
        )
    }

    // 에러 표시
    if (error) {
        return errorComponent || <div className={css.errorMessage}>오류 발생: {error}</div>
    }

    return (
        <div className={css.recipeDetailContainer}>
            {/* 헤더 섹션 - 제목 및 메타 정보 */}
            <header className={css.recipeHeader}>
                {title && (
                    <div className={css.recipeTitle}>
                        <span>{title}</span>
                    </div>
                )}
                {headerContent}
            </header>

            {/* 메인 이미지 섹션 */}
            {mainImage && (
                <div className={css.imgContainer}>
                    <img src={mainImage} alt={title || '레시피 이미지'} />
                </div>
            )}

            {/* 탭 네비게이션 */}
            {tabs && tabs.length > 0 && (
                <div className={css.tabBtn}>
                    {tabs.map((tabTitle, index) => (
                        <button
                            key={index}
                            className={activeTab === index ? css.active : ''}
                            onClick={() => onTabChange(index)}
                        >
                            {tabTitle}
                        </button>
                    ))}
                </div>
            )}

            {/* 탭 컨텐츠 */}
            <div className={css.tabContent}>{tabContent}</div>

            {/* 푸터 섹션 - 댓글 등 */}
            <footer className={css.recipeFooter}>{footerContent}</footer>

            {/* 플로팅 버튼 */}
            {floatingButton}
        </div>
    )
}

RecipeDetailLayout.propTypes = {
    title: PropTypes.string,
    headerContent: PropTypes.node,
    mainImage: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.string),
    activeTab: PropTypes.number,
    onTabChange: PropTypes.func,
    tabContent: PropTypes.node,
    footerContent: PropTypes.node,
    floatingButton: PropTypes.node,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    loadingComponent: PropTypes.node,
    errorComponent: PropTypes.node,
}

RecipeDetailLayout.defaultProps = {
    isLoading: false,
    activeTab: 0,
    tabs: [],
}

export default RecipeDetailLayout

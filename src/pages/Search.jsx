import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import Button from '../components/Button'
import Modal from '../components/Modal'
import RecipeCard from '../components/RecipeCard'
import RecipeCardSkeleton from '../components/RecipeCardSkeleton'
import Pagination from 'react-bootstrap/Pagination'

import styles from './Search.module.css'
import { postRequest } from '../apis/api.js'

const petOptions = [
    { id: '강아지', name: '강아지' },
    { id: '고양이', name: '고양이' },
]

const foodFilterOptions = [
    { id: 'meat', name: '육류' },
    { id: 'fish', name: '생선' },
    { id: 'grain', name: '곡물' },
    { id: 'snack', name: '간식' },
    { id: 'others', name: '기타' },
]

const ITEMS_PER_PAGE = 4
const SKELETON_COUNT = 4

const Search = () => {
    const navigate = useNavigate()
    const outletContext = useOutletContext() //디폴트페이지에서 로그인컨텍스트 가져옴

    const actualIsLoggedIn = outletContext?.isLoggedIn || false
    const actualUserId = outletContext?.userId || null

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPet, setSelectedPet] = useState('')
    const [selectedFoodCategories, setSelectedFoodCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isLoadingSearch, setIsLoadingSearch] = useState(false)
    const [searchError, setSearchError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const openModal = useCallback(() => setIsModalOpen(true), [])
    const closeModal = useCallback(() => setIsModalOpen(false), [])

    const handleSearchInputChange = useCallback((newTerm) => {
        setSearchTerm(newTerm)
    }, [])

    const executeSearch = useCallback(async (termToSearch, pet, foodCategories) => {
        setIsLoadingSearch(true)
        setSearchError(null)
        setCurrentPage(1)

        const requestBody = {}
        if (pet) requestBody.pet = pet
        if (foodCategories && foodCategories.length > 0) requestBody.food = foodCategories
        if (termToSearch && termToSearch.trim() !== '') requestBody.title = termToSearch.trim()

        if (Object.keys(requestBody).length === 0) {
            setSearchResults([])
            setIsLoadingSearch(false)
            return
        }
        try {
            const data = await postRequest('/searchRecipe', requestBody)
            setSearchResults(data.recipe || [])
        } catch (error) {
            setSearchError(error.message)
            setSearchResults([])
        } finally {
            setIsLoadingSearch(false)
        }
    }, [])

    const triggerSearchFromBar = useCallback(() => {
        executeSearch(searchTerm, selectedPet, selectedFoodCategories)
    }, [executeSearch, searchTerm, selectedPet, selectedFoodCategories])

    const applyFiltersFromModal = useCallback(() => {
        closeModal()
        executeSearch(searchTerm, selectedPet, selectedFoodCategories)
    }, [closeModal, executeSearch, searchTerm, selectedPet, selectedFoodCategories])

    const handleSingleSelectFilter = (setter, value, currentValue) => {
        setter(currentValue === value ? '' : value)
    }

    const handleFoodCategoryToggle = (categoryId) => {
        setSelectedFoodCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        )
    }

    const resetFiltersInModal = useCallback(() => {
        setSelectedPet('')
        setSelectedFoodCategories([])
        setCurrentPage(1)
    }, [])

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }, [])

    const totalItems = searchResults.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
    const currentItemsOnPage = searchResults.slice(indexOfFirstItem, indexOfLastItem)

    const renderPetFilterSection = () => (
        <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>반려동물</h3>
            <div className={styles.filterOptionsContainer}>
                {petOptions.map((option) => (
                    <Button
                        key={option.id}
                        text={option.name}
                        onClick={() =>
                            handleSingleSelectFilter(setSelectedPet, option.id, selectedPet)
                        }
                        size="sm"
                        color={selectedPet === option.id ? 'accent' : 'default'}
                    />
                ))}
            </div>
        </div>
    )

    const renderFoodFilterSection = () => (
        <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>음식 분류</h3>
            <div className={styles.filterOptionsContainer}>
                {foodFilterOptions.map((option) => (
                    <Button
                        key={option.id}
                        text={option.name}
                        onClick={() => handleFoodCategoryToggle(option.id)}
                        size="sm"
                        color={selectedFoodCategories.includes(option.id) ? 'accent' : 'default'}
                    />
                ))}
            </div>
        </div>
    )

    const renderPaginationItems = () => {
        if (totalPages <= 1) return null
        let items = []
        const MAX_VISIBLE_PAGES = 5
        let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2))
        let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1)

        if (endPage - startPage + 1 < MAX_VISIBLE_PAGES && totalPages >= MAX_VISIBLE_PAGES) {
            startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1)
        }

        if (startPage > 1) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />)
        }
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            )
        }
        if (endPage < totalPages) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />)
        }

        return (
            <Pagination className={styles.paginationContainer}>
                <Pagination.Prev
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                />
                {items}
                <Pagination.Next
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        )
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.filterButtonWrapper}>
                <Button text="필터" onClick={openModal} size="sm" />
            </div>
            <SearchBar
                value={searchTerm}
                onChange={handleSearchInputChange}
                onSearch={triggerSearchFromBar}
                mode="search"
                placeholder="레시피 재료로 검색 (예: 닭가슴살)" // 플레이스홀더 수정
            />

            <h2 style={{ fontFamily: 'Goyang', marginTop: '15px' }}>검색 결과</h2>

            <div className={styles.resultsDisplayArea}>
                {isLoadingSearch && (
                    <div className={styles.resultsList}>
                        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                            <RecipeCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </div>
                )}
                {!isLoadingSearch && searchError && (
                    <p className={styles.searchStatusError}>오류: {searchError}</p>
                )}
                {!isLoadingSearch && !searchError && searchResults.length === 0 && (
                    <p className={styles.searchStatus}>
                        검색된 레시피가 없습니다. 다른 검색어나 필터를 사용해 보세요.
                    </p>
                )}
                {!isLoadingSearch && !searchError && searchResults.length > 0 && (
                    <>
                        <div className={styles.resultsList}>
                            {currentItemsOnPage.map((recipe) => (
                                <RecipeCard
                                    key={recipe.ID} // 백엔드 응답 필드명 확인 (ID가 맞음)
                                    imageSrc={recipe.MAIN_IMAGE_URL}
                                    title={recipe.TITLE}
                                    recipeId={recipe.ID} // recipeId로 ID 전달
                                    altText={recipe.TITLE || '레시피 이미지'}
                                    // 실제 로그인 상태와 사용자 ID를 전달
                                    isLoggedIn={actualIsLoggedIn}
                                    userId={actualUserId}
                                    onClick={() => navigate(`/recipe/${recipe.ID}`)}
                                />
                            ))}
                        </div>
                        {renderPaginationItems()}
                    </>
                )}
            </div>

            {isModalOpen && (
                <Modal>
                    {renderPetFilterSection()}
                    {renderFoodFilterSection()}
                    <div className={styles.modalActions}>
                        <Button
                            text="초기화"
                            onClick={resetFiltersInModal}
                            color="default"
                            size="sm"
                        />
                        <div className={styles.modalMainActions}>
                            <Button text="취소" onClick={closeModal} color="secondary" size="sm" />
                            <Button
                                text="적용"
                                onClick={applyFiltersFromModal}
                                disabled={isLoadingSearch}
                                size="sm"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Search

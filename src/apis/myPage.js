import { getRequest, postRequest } from './api'

export const fetchMyPageData = async (userId) => {
    const results = await Promise.allSettled([
        getRequest(`/getUserNickname/${userId}`),
        getRequest(`/getPetInfo/${userId}`),
        getRequest(`/getFavorites/${userId}`),
        getRequest(`/getMyRecipe/${userId}`),
        getRequest(`/getMyReview/${userId}`),
    ])

    const [nickname, petInfo, favoriteRecipes, myRecipes, myReviews] = results.map((result) =>
        result.status === 'fulfilled' ? result.value : []
    )
    return { nickname, petInfo, favoriteRecipes, myRecipes, myReviews }
}

export const updateMyInfo = async (userData, petData) => {
    const results = await Promise.all([
        postRequest('/changeUserInfo', userData),
        postRequest('/UpdatePetInfo', petData),
    ])

    return results
}

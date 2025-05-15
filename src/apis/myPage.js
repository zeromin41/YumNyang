import { getRequest } from './api'

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

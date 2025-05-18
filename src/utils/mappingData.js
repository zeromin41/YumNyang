export const mapRecipeData = (data, isReview) => {
    if (!Array.isArray(data)) return []
    if (isReview) return data
    return data.map((item) => ({
        id: item.ID,
        imageSrc: item.MAIN_IMAGE_URL,
        title: item.TITLE,
    }))
}

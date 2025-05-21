export const invalidNumberKeys = ['-', '+', 'e', 'E', '.']

export const handleNumberKeyDown = (e) => {
    if (invalidNumberKeys.includes(e.key)) {
        e.preventDefault()
    }
}

export const handleNumberInput = (e) => {
    let cleanedValue = e.target.value.replace(/^0+(?=\d)/, '')

    if (cleanedValue === '') {
        e.target.value = ''
        return
    }

    const numberValue = Number(cleanedValue)
    if (numberValue < 0 || isNaN(numberValue)) {
        e.target.value = ''
    } else {
        e.target.value = numberValue.toString()
    }
}

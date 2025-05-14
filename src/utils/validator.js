export const isValidId = (id) => /^(?=.*[a-z])(?=.*\d)[a-z\d]{5,20}$/.test(id)
export const isValidNickname = (nickname) => /^[가-힣a-zA-Z0-9]{2,10}$/.test(nickname)
export const isValidPassword = (pw) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(pw)
export const isValidPasswordConfirm = (pw, pwConfirm) => pw === pwConfirm

export const isEmpty = (value) => !value || value.trim() === ''

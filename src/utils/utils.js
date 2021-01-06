let id = 0
// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export function generateID () {
    return id++
}

export function cloneDeep (target) {
    if (typeof target == 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            result[key] = (typeof target[key] == 'object') ? cloneDeep(target[key]) : target[key]
        }
        return result
    }
    return target
}

export function swap (arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]]
}
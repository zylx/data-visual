/**
 * 生成组件ID
 * @param components Array
 * @return componentID Number
 */
export function generateID (components) {
    // 组件ID 等于 components 数组中最大的 组件ID 加上1
    return components.length && (components.reduce((prve, cur) => cur.id > prve ? cur.id : prve, 1) + 1) || 1
}

/**
 * 设置缓存
 * @param key String
 * @param value Any
 */
export function setLocalStorage (key, value) {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}

/**
 * 获取缓存
 * @param key String
 */
export function getLocalStorage (key) {
    return JSON.parse(localStorage.getItem(key))
}

/**
 * 深拷贝
 * @param target Any
 */
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

/**
 * 数组中，根据索引互换两个元素的值
 * @param arr Array
 * @param i Array index
 * @param j Array index
 */
export function swap (arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]]
}
/**
 * 判断是否是外部资源
 * @param {String} path 路径
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

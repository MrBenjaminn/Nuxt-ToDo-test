export function safeClone<T>(val: T): T {
  if (!val) return val
  return JSON.parse(JSON.stringify(val))
}

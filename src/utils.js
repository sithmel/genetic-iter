export function times (func, n) {
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = func()
  }
  return out
}

export function fittest (comparator, array) {
  return array.reduce((acc, current) => comparator(acc, current) > 0 ? current : acc)
}

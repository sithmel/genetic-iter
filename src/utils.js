function times(func, n) {
  let out = new Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = func()
  }
  return out
}

function fittest(comparator, array) {
  return array.reduce((acc, current) => comparator(acc, current) > 0 ? current : acc)
}

module.exports = {
  times,
  fittest
}
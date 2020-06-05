const { times, fittest } = require('./utils')

const randInt = (max) => Math.floor(Math.random() * max)

const randElement = (arr) => arr[randInt(arr.length)]

const randElements = (n, arr) => times(() => randElement(arr), n)

const bestOf = (n) => (pop, c) => fittest(c.optimize, randElements(n, pop))

module.exports = {
  random: (arr, c) => randElement(arr),
  bestOf2: bestOf(2),
  bestOf3: bestOf(3),
  bestOfN: bestOf,
  fittest: (arr, c) => arr[0]
}

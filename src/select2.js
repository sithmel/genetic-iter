import S1 from './select1.js'

const bestOf2 = S1.bestOfN(2)
const bestOf3 = S1.bestOfN(3)

export default {
  random: (arr, c) => [S1.random(arr, c), S1.random(arr, c)],
  bestOf2: (arr, c) => [bestOf2(arr, c), bestOf2(arr, c)],
  bestOf3: (arr, c) => [bestOf3(arr, c), bestOf3(arr, c)],
  bestOfN: (n) => {
    const bestOf = S1.bestOfN(n)
    return (arr, c) => [bestOf(arr, c), bestOf(arr, c)]
  },
  fittestAndRandom: (arr, c) => [arr[0], S1.random(arr, c)]
}

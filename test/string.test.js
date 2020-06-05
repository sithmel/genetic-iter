import assert from 'assert'
import GeneticAlg from '../src/index.js'

const SOLUTION = 'thisisthesolution'

const stringAlg = new GeneticAlg({
  populationSize: 20,
  crossoverChance: 0.4,
  optimize: GeneticAlg.Optimize.Maximize,
  seed () {
    var text = ''
    var charset = 'abcdefghijklmnopqrstuvwxyz'
    for (var i = 0; i < SOLUTION.length; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return text
  },
  mutate (entity) {
    const replaceAt = (str, index, character) =>
      str.substr(0, index) + character + str.substr(index + character.length)

    // chromosomal drift
    const i = Math.floor(Math.random() * entity.length)
    return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)))
  },
  crossover (mother, father) {
    // two-point crossover
    const len = mother.length
    let ca = Math.floor(Math.random() * len)
    let cb = Math.floor(Math.random() * len)
    if (ca > cb) {
      const tmp = cb
      cb = ca
      ca = tmp
    }

    const son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb)
    const daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb)

    return [son, daughter]
  },
  fitness (entity) {
    let fitness = 0

    for (let i = 0; i < entity.length; ++i) {
      // increase fitness for each character that matches
      if (entity[i] === SOLUTION[i]) {
        fitness += 1
      }

      // award fractions of a point as we get warmer
      fitness += (127 - Math.abs(entity.charCodeAt(i) - SOLUTION.charCodeAt(i))) / 50
    }

    return fitness
  }
})

describe('Genetic String Solver', () => {
  it('works', () => {
    const done = (pop) => pop[0].individual === SOLUTION
    let counter = 0
    for (const pop of stringAlg) {
      if (counter++ === 2000 || done(pop)) break
    }
    assert(counter < 2000)
  })
})

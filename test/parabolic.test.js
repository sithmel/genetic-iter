const GeneticAlg = require('../src')
const assert = require('assert')

const TERMS = 3
const RESOLUTION = 3

const parabolicAlg = new GeneticAlg({
  populationSize: 20,
  crossoverChance: 0.3,
  mutateChance: 1.0,
  optimize: Math.min,
  seed() {
    let a = []
    // create coefficients for polynomial with values between (-0.5, 0.5)
    for (let i = 0; i < TERMS; ++i) {
      a.push(Math.random() - 0.5)
    }    
    return a
  },
  mutate(entity) {
    // allow chromosomal drift with this range (-0.05, 0.05)
    const drift = ((Math.random() - 0.5) * 2) * 0.05
    const i = Math.floor(Math.random() * entity.length)
    entity[i] += drift
    return entity
  },
  crossover(mother, father) {
    // crossover via interpolation
    function lerp (a, b, p) {
      return a + (b - a) * p
    }

    const len = mother.length
    const i = Math.floor(Math.random() * len)
    const r = Math.random()
    const son = [].concat(father)
    const daughter = [].concat(mother)

    son[i] = lerp(father[i], mother[i], r)
    daughter[i] = lerp(mother[i], father[i], r)

    return [son, daughter]
  },
  fitness(entity) {
    function evaluatePoly (x) {
      let s = 0
      let p = 1
      for (let i = 0; i < entity.length; ++i) {
        s += p * entity[i]
        p *= x
      }

      return s
    }

    let sumSqErr = 0
    const m = 1
    const step = m / RESOLUTION
    for (let x = 0; x < m; x += step) {
      const err = evaluatePoly(x) - (x * x)
      sumSqErr += err * err
    }

    return Math.sqrt(sumSqErr)
  }
})

describe('Genetic Parabolic Solver', () => {
  it('works', () => {
    const done = (pop) => pop[0].fitness < 0.04
    let counter = 0
    for (const pop of parabolicAlg) {
      if (counter++ === 1000 || done(pop)) break
    }
    assert(counter < 1000)
  })
})

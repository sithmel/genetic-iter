
const assert = require('assert')
const select1 = require('../src/select1')
const select2 = require('../src/select2')

let originalRandom = Math.random
let counter = 0
seq = []

function mockRandom(newSeq) {
  seq = newSeq
  Math.random = () => seq[counter++]
}

function restoreRandom() {
  counter = 0
  seq = []
  Math.random = originalRandom
}

const cfg = {
  optimize: (a, b) => b.fitness - a.fitness
}

const pop = [
  { fitness: 4 },
  { fitness: 2 },
  { fitness: 1 },
  { fitness: 0 }
]

describe('select1', () => {
  afterEach(restoreRandom)

  it('random', () => {
    mockRandom([0.1])
    assert.equal(select1.random(pop, cfg), pop[0])
  })

  it('best of 2', () => {
    mockRandom([0, 0.9])
    assert.equal(select1.bestOf2(pop, cfg), pop[0])
  })

  it('best of 3', () => {
    mockRandom([0, 0.3, 0.9])
    assert.equal(select1.bestOf3(pop, cfg), pop[0])
  })

  it('best of n', () => {
    mockRandom([0, 0.9])
    assert.equal(select1.bestOfN(2)(pop, cfg), pop[0])
  })

  it('fittest', () => {
    mockRandom([0, 0.9])
    assert.equal(select1.fittest(pop, cfg), pop[0])
  })
})

describe('select2', () => {
  afterEach(restoreRandom)

  it('random', () => {
    mockRandom([0, 0.9])
    const [i1, i2] = select2.random(pop, cfg)
    assert.equal(i1, pop[0])
    assert.equal(i2, pop[3])
  })

  it('bestOf2', () => {
    mockRandom([0, 0.9, 0.9, 0.3])
    const [i1, i2] = select2.bestOf2(pop, cfg)
    assert.equal(i1, pop[0])
    assert.equal(i2, pop[1])
  })

  it('bestOf3', () => {
    mockRandom([0, 0.9, 0.1, 0.9, 0.3, 0.3])
    const [i1, i2] = select2.bestOf3(pop, cfg)
    assert.equal(i1, pop[0])
    assert.equal(i2, pop[1])
  })

  it('bestOfN', () => {
    mockRandom([0, 0.9, 0.9, 0.3])
    const [i1, i2] = select2.bestOfN(2)(pop, cfg)
    assert.equal(i1, pop[0])
    assert.equal(i2, pop[1])
  })

  it('fittestAndRandom', () => {
    mockRandom([0.9])
    const [i1, i2] = select2.fittestAndRandom(pop, cfg)
    assert.equal(i1, pop[0])
    assert.equal(i2, pop[3])
  })
})

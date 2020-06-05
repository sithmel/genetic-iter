import assert from 'assert'
import { times, fittest } from '../src/utils.js'

describe('times', () => {
  it('works', () => {
    let counter = 0
    const a = times(() => counter++, 3)
    assert.equal(a.length, 3)
    assert.equal(a[0], 0)
    assert.equal(a[1], 1)
    assert.equal(a[2], 2)
  })
})

describe('fittest', () => {
  it('works', () => {
    const arr = [3, 7, 3, 8, 2, 1, 9, 2]
    const f0 = fittest((a, b) => b - a, arr)
    assert.equal(f0, 9)
    const f1 = fittest((a, b) => a - b, arr)
    assert.equal(f1, 1)
  })
})

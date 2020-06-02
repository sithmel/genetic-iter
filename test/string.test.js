const GeneticAlg = require('../src')
const assert = require('assert')

const SOLUTION = 'thisisthesolution'

const stringAlg = new GeneticAlg({
  populationSize: 20,
  crossoverChance: 0.4,
  mutateChance: 0.3,
  optimize: Math.max,
  seed() {
    var text = ''
    var charset = 'abcdefghijklmnopqrstuvwxyz'
    for (var i = 0; i < SOLUTION.length; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return text
  },
  mutate(entity) {
    const replaceAt = (str, index, character) =>
      str.substr(0, index) + character + str.substr(index + character.length)

    // chromosomal drift
    const i = Math.floor(Math.random() * entity.length)
    return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)))

  },
  crossover(mother, father) {
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
  fitness(entity) {
    let fitness = 0

    var i
    for (let i = 0; i < entity.length; ++i) {
      // increase fitness for each character that matches
      if (entity[i] == SOLUTION[i]) {
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


// var Genetic = require('../lib/genetic')
// var assert = require('assert')

// var genetic

// beforeEach(function () {
//   genetic = Genetic.create()
//   genetic.optimize = Genetic.Optimize.Maximize
//   genetic.seed = function () {
//     function randomString (len) {
//       var text = ''
//       var charset = 'abcdefghijklmnopqrstuvwxyz'
//       for (var i = 0; i < len; i++) { text += charset.charAt(Math.floor(Math.random() * charset.length)) }

//       return text
//     }

//     // create random strings that are equal in length to solution
//     return randomString(this.userData.solution.length)
//   }
//   genetic.mutate = function (entity) {
//     function replaceAt (str, index, character) {
//       return str.substr(0, index) + character + str.substr(index + character.length)
//     }

//     // chromosomal drift
//     var i = Math.floor(Math.random() * entity.length)
//     return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)))
//   }
//   genetic.crossover = function (mother, father) {
//     // two-point crossover
//     var len = mother.length
//     var ca = Math.floor(Math.random() * len)
//     var cb = Math.floor(Math.random() * len)
//     if (ca > cb) {
//       var tmp = cb
//       cb = ca
//       ca = tmp
//     }

//     var son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb)
//     var daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb)

//     return [son, daughter]
//   }
//   genetic.fitness = function (entity) {
//     var fitness = 0

//     var i
//     for (i = 0; i < entity.length; ++i) {
//       // increase fitness for each character that matches
//       if (entity[i] == this.userData.solution[i]) { fitness += 1 }

//       // award fractions of a point as we get warmer
//       fitness += (127 - Math.abs(entity.charCodeAt(i) - this.userData.solution.charCodeAt(i))) / 50
//     }

//     return fitness
//   }
//   genetic.generation = function (pop, generation, stats) {
//     // stop running once we've reached the solution
//     return pop[0].entity != this.userData.solution
//   }
// })

// function solveTest (sel1, sel2, config) {
//   it(sel1 + ', ' + sel2, function (done) {
//     genetic.select1 = eval(sel1)
//     genetic.select2 = eval(sel2)
//     genetic.notification = function (pop, generation, stats, isFinished) {
//       if (isFinished) {
//         assert.equal(pop[0].entity, this.userData.solution)
//         done()
//       }
//     }

//     var userData = {
//       solution: 'thisisthesolution'
//     }

//     genetic.evolve(config, userData)
//   })
// }

// describe('Genetic String Solver', function () {
//   var config = {
//     iterations: 2000,
// 		 size: 20,
// 		 crossover: 0.4,
// 		 mutation: 0.3
//   }

//   var k
//   for (k in Genetic.Select1) {
//     for (j in Genetic.Select2) {
//       solveTest('Genetic.Select1.' + k, 'Genetic.Select2.' + j, config)
//     }
//   };
// })

const { times } = require('./utils')

const Select1 = require('./select1')
const Select2 = require('./select2')

const defaultConfig = {
  optimize: (a, b) => a.fitness - b.fitness,
  select1: Select1.bestOf2,
  select2: Select2.bestOf2,
  mutate: x => x,
  populationSize: 250,
  crossoverChance: 0.9,
  fittestAlwaysSurvives: true
}

const chance = (fraction) => Math.random() <= fraction

class GeneticAlg {
  constructor (config) {
    this.config = { ...defaultConfig, ...config }

    const {
      fitness,
      seed,
      mutate,
      crossover
    } = this.config

    if (typeof fitness !== 'function') throw new Error('The fitness function is mandatory')
    if (typeof seed !== 'function') throw new Error('The seed function is mandatory')

    this._calcFitness = (individual) => ({ individual, fitness: fitness(individual) })
    this._mutate = (i) => this._calcFitness(mutate(i.individual))
    this._crossover = ([i1, i2]) =>
      crossover(i1.individual, i2.individual).map(this._calcFitness)
  }

  sortByFitness(pop) {
    const { optimize } = this.config
    return pop.sort(optimize)
  }

  initPop() {
    const { seed, populationSize } = this.config
    return this.sortByFitness(
      times(() => this._calcFitness(seed()), populationSize))
  }

  calculateStats(pop) {
    const mean = pop.reduce((a, b) => a + b.fitness, 0) / pop.length;
    const stdev = Math.sqrt(pop
      .map((a) => (a.fitness - mean) * (a.fitness - mean))
      .reduce((a, b) => a + b, 0) / pop.length)

    return {
      max: pop[0].fitness,
      min: pop[pop.length-1].fitness,
      mean: mean,
      stdev: stdev
    }
  }

  evolve (pop) {
    const {
      fittestAlwaysSurvives,
      crossoverChance,
      crossover,
      populationSize,
      select1,
      select2
    } = this.config

    if (!pop){
      pop = this.initPop()
    }

    let newPopIndex = 0
    const newPop = new Array(populationSize)

    if (fittestAlwaysSurvives) {
      newPop.push(pop[0])
    }

    while (newPopIndex <= populationSize) {
      if (chance(crossoverChance) && crossover && newPopIndex + 2 < populationSize) {
        const [i1, i2] = this._crossover(select2(this.config, pop))
        newPop[newPopIndex++] = i1
        newPop[newPopIndex++] = i2
      } else {
        newPop[newPopIndex++] = this._mutate(select1(this.config, pop))
      }
    }
    return this.sortByFitness(newPop)
  }

  * [Symbol.iterator] () {
    let pop = this.evolve()
    yield pop
    while (true) {
      pop = this.evolve(pop)
      yield pop
    }
  }
}

module.exports = GeneticAlg

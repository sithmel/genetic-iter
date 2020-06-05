const { times } = require('./utils')

const Select1 = require('./select1')
const Select2 = require('./select2')

const Optimize = {
  Maximize: (a, b) => b.fitness - a.fitness,
  Minimize: (a, b) => a.fitness - b.fitness
}

const defaultConfig = {
  optimize: Optimize.Minimize,
  select1: Select1.bestOf2,
  select2: Select2.bestOf2,
  populationSize: 250,
  crossoverChance: 0,
  fittestAlwaysSurvives: true
}

const chance = (fraction) => Math.random() <= fraction

class GeneticAlg {
  constructor (config) {
    this.config = { ...defaultConfig, ...config }

    const {
      fitness,
      seed,
      initialPopulation,
      mutate,
      crossover
    } = this.config

    if (typeof fitness !== 'function')
      throw new Error('The fitness function is mandatory')
    if (typeof seed !== 'function' && !Array.isArray(initialPopulation))
      throw new Error('Either the initialPopulation array or the seed function are mandatory')
    if (typeof crossoverChance > 0 && typeof crossover !== 'function')
      throw new Error('You should add a crossover function if the crossoverChance is greater than 0')
    if (typeof crossoverChance < 1 && typeof mutate !== 'function')
      throw new Error('You should add a mutate function if the crossoverChance is less than 1')

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
    const { seed, populationSize, initialPopulation } = this.config
    const initial = initialPopulation || times(seed, populationSize)
    return this.sortByFitness(initial.map((item) => this._calcFitness(item)))
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

  extractIndividuals(pop) {
    return pop.map((item) => item.individual)
  }

  evolve (pop) {
    const {
      fittestAlwaysSurvives,
      crossoverChance,
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
      newPop[newPopIndex++] = pop[0]
    }

    while (newPopIndex <= populationSize) {
      if (crossoverChance > 0 && chance(crossoverChance) && newPopIndex + 2 < populationSize) {
        const [i1, i2] = this._crossover(select2(pop, this.config))
        newPop[newPopIndex++] = i1
        newPop[newPopIndex++] = i2
      } else {
        newPop[newPopIndex++] = this._mutate(select1(pop, this.config))
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

GeneticAlg.Optimize = Optimize

GeneticAlg.Select1 = Select1
GeneticAlg.Select2 = Select2

module.exports = GeneticAlg

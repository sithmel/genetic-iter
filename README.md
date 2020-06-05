# genetic-iter
An advanced genetic algorithm library that aims to be performant, tested and easy to use.

## Installing
`npm install genetic-iter`

## Usage
```js
const GeneticIter = require('genetic-iter')

// Initialize it the way you want
const geneticIter = new GeneticIter({
  optimize: GeneticIter.Optimize.Maximize,
  select1: GeneticIter.Select1.bestOf2,
  select2: GeneticIter.Select2.bestOf2,
  mutate: x => x,
  crossover: (a, b) => [a, b],
  seed: Math.random,
  fitness: (a) => a * 2
  populationSize: 250,
  crossoverChance: 0.9,
  fittestAlwaysSurvives: true
})
```
and you start iterating over a population of solutions:
```js
let counter = 0
for (const pop of geneticIter) {
  // pop[0] is the current best solution
  // every solution has a fitness score
  // It is a good idea terminating the iteration when the fitness score is good enough
  if (pop[0].fitness > 1.9999) {
    return pop[0].individual // individual is the solution itself
  }
  // it is a good idea to terminate the search after a certain number of attempts
  if (counter++ === 1000) return 'No solution'
}
```
The use of the iterator protocol makes easy to implement asynchronous iteration (without blocking the event loop) or even store the current population and resume the computation in a later time.


## Options
The only required option is `seed/initialPopulation` and `fitness`. But this probably isn't going to be useful if you don't define at least `mutate` and/or `crossover`.

### `seed`

A function that returns a random individual when called. This is not used if you use initialPopulation

### `initialPopulation`

This is the initial population. It is an alternative to use seed.

### `fitness`

A function that accepts an individual and returns that individual's fitness score.

### `optimize`

A [comparator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) that that gets 2 individuals with their fitness score. For example:
```js
(a, b) => b.fitness - a.fitness
```
You can use the constants: `GeneticIter.optimize.Maximize or GeneticIter.optimize.Minimize` (default)

### `mutate`

A function that accepts an individual, and returns a mutated version of that individual. This is mandatory if crossoverChance is less than 1.

### `crossover`

A function that accepts two parent individuals, and returns an array containing two children individuals created from those parents. It is mandatory if crossoverChance is greater than 0.

### `select1`

A function that selects a single individual out of a population. See the Selection section below. Defaults to `GeneticIter.Select1.bestOf2`.

### `select2`

A function that selects a two individuals out of a population. See the Selection section below. Defaults to `GeneticIter.Select2.bestOf2`.

### `populationSize`

How many individuals there should be in the population. Defaults to `250`.

### `crossoverChance`

The chance for a crossover to happen. Defaults to `0`.

### `fittestAlwaysSurvives`

Whether or not the fittest individual should always move on to the next generation. Defaults to `true`.


## Selection

There are a number of selection behaviors pre-written if the default isn't what you want. The select function takes as argument the current population (an array) and the GeneticIter configuration.

### `GeneticIter.Select1.random`

Selects a random individual from the population.

### `GeneticIter.Select1.bestOf2`

Picks two random individuals from the population, and selects the fitter one.

### `GeneticIter.Select1.bestOf3`

Picks three random individuals from the population, and selects the fittest one.

### `GeneticIter.Select1.bestOfN(n)`

Picks `n` random individuals from the population, and selects the fittest one.

### `GeneticIter.Select1.fittest`

Selects the fittest individual from the population.

### `GeneticIter.Select2.random`

Selects two random individuals from the population.

### `GeneticIter.Select2.bestOf2`

Selects two individuals using the `GeneticIter.Select1.bestOf2` selection behavior.

### `GeneticIter.Select2.bestOf3`

Selects two individuals using the `GeneticIter.Select1.bestOf3` selection behavior.

### `GeneticIter.Select2.bestOfN(n)`

Selects two individuals using the `Select1.bestOfN(n)` selection behavior.

### `GeneticIter.Select2.fittestAndRandom`

Selects the fittest individual and a random individual from the population.

## Generator
The geneticIter is iterable using the for..of loop. Every iteration returns an array of objects. Every object contains a solution (individual) and the respective fitness score (fitness).

### Asynchronous iteration
```js
const delay = require('delay');
 
(async () => {
  let counter = 0
  for (const pop of geneticIter) {
    // ...
    if (counter++ % 100 === 0) {
      await delay(10) // takes 10 ms of pause every 100 attempts
    }
  }
})();
```

### Save/resume
```js
let savePoint
let counter = 0
for (const pop of geneticIter) {
  // ...
  if (counter++ === 10000) {
    savePoint = geneticIter.extractIndividuals() // extract the individuals
  }
}

// ...
const geneticIter2 = new GeneticIter({
  initialPopulation: savePoint,
  // ...
})

for (const pop of geneticIter2) {
  // ...
```
### Stats
You can get some stats about the population like this:
```js
for (const pop of geneticIter) {
  // ...
  console.log(this.calculateStats(pop))
  // returns information about the fitness:
  // max: maximum
  // min: minimum
  // mean: mean
  // stdev: standard deviation
```
Note: it impacts performance, so it should not be done on every iteration.

### Acknowledgements
[genetic-js](https://github.com/subprotocol/genetic-js) was the main source of inspiration, for the algorithm and the testing (but it was unwieldy to use because of the integration with webworkers). [Evolutionary](https://github.com/rahatarmanahmed/evolutionary) showed a better api using iteration (but I needed a tested and optimised alternative).
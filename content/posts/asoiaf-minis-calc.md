---
title: "ASOIAF Miniatures Calculator"
description: "A calculator for the A Song of Ice and Fire Miniatures Game"
tags: [ "programming", "board games", ]
date: 2021-01-09T00:00:00
draft: false
math: true
---

## Description
This is a calculator used to graph probabilities for various attack combinations for the [A Song Of Ice and Fire Miniatures Game](https://asoiaf.cmon.com/). This is a tabletop wargame based in G.R.R. Martin's fantasy world where 2-4 (usually just 2) players build armies from different factions then compete to win a certain number of victory points. There are different game modes that determine how to achieve VPs, but generally killing your opponent's troops will help.

The calculations used in determining how much damage to do to your opponent are simple to perform in-game, as it is simply a matter of rolling X dice, comparing to Y value, and repeat. However, there are combinations of modifiers and conditions that can skew these numbers, and I found it difficult to get a good intuitive sense of how these various effects compared to each other. Using this calculator you can explore the mathematical outcomes for different permutations and see the results for yourself.


## Goals
- Minimalist code, no importing a universal statistics library
- Lightweight, stateless application
- Learning exercise to freshen up on statistics


## Statistics - Formulas
Binomial distribution  
$$ P(X=r) = {n \choose r} \cdot p ^ r \cdot (1 - p) ^ {n - r} $$  

N choose R  
$$ {n \choose r} = \frac {n!} {r! (n - r)!} $$

Multinomial distribution  
$$ f(x) = \frac {n!} {x_1! x_2! ... x_n!} {\pi_1 ^ {x_1}} {\pi_2 ^ {x_2}} ... {\pi_n ^ {x_n}} $$

Re-rolling (for both attack and defense rolls)  
$$ p \prime = (1 - p)p $$


## Statistics - Implementation
The statistics formulas used above are all implemented in JavaScript. There is a Statistics class that contains all the needed functions, including some pre-calculated factorials to avoid expensive computations:  
```javascript
class Statistics {
    constructor() {  
        this.factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
            39916800, 479001600, 6227020800, 87178291200,
            1307674368000, 20922789888000, 355687428096000];
    }

    factorial(x) {
        if (this.factorials[x] > 0) {
            return this.factorials[x];
        }
        let newFactorial = this.factorial(x - 1) * x;
        this.factorials[x] = newFactorial;
        return newFactorial;
    }

    nCr(n, r) {
        return this.factorial(n) / (this.factorial(r) * this.factorial((n - r)));
    }

    binomial(p, n, r) {
        return this.nCr(n, r) * (p ** r) * (1 - p) ** (n - r);
    }

    multinomial(n, xVector, piVector) {
        if (xVector.length === 0 || xVector.length !== piVector.length) {
            throw "Vectors must be the same non-zero length";
        }
        if (xVector.reduce((a, b) => a + b, 0) !== n) {
            throw "x vector must sum to n";
        }
        let denominator = 1;
        let rhs = 1;
        xVector.forEach((x, i) => {
            denominator *= this.factorial(x);
            rhs *= piVector[i] ** x;
        });
        return (this.factorial(n) / denominator) * rhs;
    }
}
```  
These functions are then used within the rest of the app where needed in various `calculate*` functions such as this:  
```javascript
function calculateHits(options, hitChance) {
    let hitProbabilities = [];
    for (let numberOfHits = options.dice; numberOfHits >= 0; numberOfHits--) { 
        if (options.criticalBlow) {
            let singleHitChance = hitChance;
            let criticalBlowHitChance = 1 / 6;
            singleHitChance -= criticalBlowHitChance;
            let missChance = 1 - singleHitChance - criticalBlowHitChance;
            let maxPossibleSixes = options.dice - numberOfHits;
            for (let numberOfSixes = maxPossibleSixes; numberOfSixes >= 0; numberOfSixes--) {
                let numberOfMisses = options.dice - numberOfHits - numberOfSixes;
                let n = numberOfMisses + numberOfHits + numberOfSixes;
                let x = [numberOfMisses, numberOfHits, numberOfSixes];
                let pi = [missChance, singleHitChance, criticalBlowHitChance];
                let probability = STATISTICS.multinomial(n, x, pi);
                let totalHits = numberOfHits + 2 * numberOfSixes;
                let existingHitTotal = hitProbabilities.find(p => p.numberOfHits === totalHits);
                if (existingHitTotal) {
                    existingHitTotal.probability += probability;
                } else {
                    hitProbabilities.push({ numberOfHits: totalHits, probability: probability });
                }
            }
        } else {
            let probability = STATISTICS.binomial(hitChance, options.dice, numberOfHits);
            hitProbabilities.push({ numberOfHits: numberOfHits, probability: probability });
        }
    }

    hitProbabilities.sort((a, b) => a.numberOfHits - b.numberOfHits);
    return hitProbabilities;
}
```


## Calculator
Any time you make a change to any of the inputs, the chart at the bottom will recalculate automatically. You can compare 2 units by selecting different values on the left (Unit A) and right (Unit B) sets of inputs.

{{< asoiaf-minis-calc >}}

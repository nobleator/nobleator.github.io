function setDefaults() {
    document.getElementById("attack-dice").value = 4;
    document.getElementById("attack-hit").value = 4;
    document.getElementById("defense-block").value = 4;
    document.getElementById("defense-morale").value = 6;
}

function initializeEventListeners() {
    document.getElementById("attack-dice").addEventListener("change", draw);
    document.getElementById("attack-hit").addEventListener("change", draw);
    document.getElementById("include-blocks").addEventListener("change", draw);
    document.getElementById("defense-block").addEventListener("change", draw);
    document.getElementById("defense-morale").addEventListener("change", draw);
    document.getElementById("modifiers-critical-blow").addEventListener("change", draw);
    document.getElementById("modifiers-vicious").addEventListener("change", draw);
    document.getElementById("modifiers-charge").addEventListener("change", draw);
    document.getElementById("modifiers-sundering").addEventListener("change", draw);
    document.getElementById("modifiers-front").addEventListener("change", draw);
    document.getElementById("modifiers-flank").addEventListener("change", draw);
    document.getElementById("modifiers-rear").addEventListener("change", draw);
    document.getElementById("modifiers-weakened").addEventListener("change", draw);
    document.getElementById("modifiers-panicked").addEventListener("change", draw);
    document.getElementById("modifiers-vulnerable").addEventListener("change", draw);
}

var STATISTICS;
function initializeGlobalObjects() {
    // Note: Using this design in lieu of static functions due to lack of support in iOS and Safari
    STATISTICS = new Statistics();
}

class Options {
    constructor(dice, hitOn, includeBlocks, blockOn, morale, criticalBlow, vicious, charge,
        sundering, attackDirection, weakened, panicked, vulnerable) {
        this.dice = dice;
        this.hitOn = hitOn;
        this.includeBlocks = includeBlocks;
        this.blockOn = blockOn;
        this.morale = morale;
        this.criticalBlow = criticalBlow;
        this.vicious = vicious;
        this.charge = charge;
        this.sundering = sundering;
        this.attackDirection = attackDirection;
        this.weakened = weakened;
        this.panicked = panicked;
        this.vulnerable = vulnerable;
    }
}

function getOptions() {
    let dice = parseInt(document.getElementById("attack-dice").value);
    let hitOn = parseInt(document.getElementById("attack-hit").value);
    let includeBlocks = document.getElementById("include-blocks").checked;
    let blockOn = parseInt(document.getElementById("defense-block").value);
    let morale = parseInt(document.getElementById("defense-morale").value);
    let criticalBlow = document.getElementById("modifiers-critical-blow").checked;
    let vicious = document.getElementById("modifiers-vicious").checked;
    let charge = document.getElementById("modifiers-charge").checked;
    let sundering = document.getElementById("modifiers-sundering").checked;
    let attackDirection = "";
    let attackDirectionInputs = document.getElementsByName("modifiers-direction");
    for (var i = 0, length = attackDirectionInputs.length; i < length; i++) {
        if (attackDirectionInputs[i].checked) {
            attackDirection = attackDirectionInputs[i].value;
            break;
        }
    }
    let weakened = document.getElementById("modifiers-weakened").checked;
    let panicked = document.getElementById("modifiers-panicked").checked;
    let vulnerable = document.getElementById("modifiers-vulnerable").checked;
    return new Options(dice, hitOn, includeBlocks, blockOn, morale, criticalBlow, vicious, charge,
        sundering, attackDirection, weakened, panicked, vulnerable);
}

function examples() {
    // TODO: Load example calculation e.g. Knights of Casterly Rock charging Stark Sworn Swords
}

class Statistics {
    constructor() {  
        // Putting pre-computed factorials in an object to avoid expensive calculations (only including values up to 20)
        // this.factorials = [1, 1, 2, 6, 24, 120, 720, 5_040, 40_320, 362_880, 3_628_800, 39_916_800, 479_001_600, 6_227_020_800, 87_178_291_200, 1_307_674_368_000, 20_922_789_888_000, 355_687_428_096_000, 6_402_373_705_728_000n, 121_645_100_408_832_000n, 2_432_902_008_176_640_000n];
        this.factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000];
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
        // N choose R: C(n,r) = n!/(r!(n-r)!)
        return this.factorial(n) / (this.factorial(r) * this.factorial((n - r)));
    }

    binomial(p, n, r) {
        // Courtesy of https://www.omnicalculator.com/statistics/dice#how-to-calculate-dice-roll-probability
        // Binomial probability: P(X=r) = nCr * pʳ * (1-p)ⁿ⁻ʳ
        return this.nCr(n, r) * (p ** r) * (1 - p) ** (n - r);
    }

    multinomial(n, xVector, piVector) {
        // Courtesy of https://online.stat.psu.edu/stat504/node/42/
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

function probabilityOfRollingExactly(r, n, s) {
    let limit = Math.floor((r - n) / s);
    let totalProbability = 0;
    for (let k = 0; k <= limit; k++) {
        let nCk = STATISTICS.nCr(n, k);
        let var1 = r - (s * k) - 1;
        let var2 = (n - 1);
        let rhs = STATISTICS.nCr(var1, var2);
        totalProbability += ((-1) ** k) * nCk * rhs;
    }
    return (1 / s ** n) * totalProbability;
}

function calculateHitChance(options) {
    // Adding +1 because it"s greater or equal to the target value. A strictly greater than check would remove this +1.
    let individualHitChance = (6 + 1 - options.hitOn) / 6;
    // Charge re-rolls any misses.
    // Using p for an individual chance: newP = p + ((1 - p) * p)
    if (options.charge) {
        individualHitChance = individualHitChance + ((1 - individualHitChance) * individualHitChance);
    }

    // Weakened reduces the chance of a hit.
    // If hitOn = 1, then p = 1/6 for an individual chance. With a re-roll you need both rolls to hit, so you multiply them.
    // (1/6) * (1/6) = (1/6)²
    if (options.weakened) {
        individualHitChance = individualHitChance ** 2;
    }
    return individualHitChance;
}

function calculateBlockChance(options) {
    let baseDefense = options.blockOn;
    // TODO: -1 to roll vs +1 to block value?
    if (options.sundering) {
        baseDefense += 1;
    }
    if (options.attackDirection === "modifiers-direction-flank") {
        baseDefense += 1;
    } else if (options.attackDirection === "modifiers-direction-rear") {
        baseDefense += 2;
    }
    // Max out at 6
    if (baseDefense > 6) {
        baseDefense = 6;
    }
    let individualBlockChance = (6 + 1 - baseDefense) / 6;
    // Vulnerable reduces the chance of a hit.
    // If hitOn = 1, then p = 1/6 for an individual chance. With a re-roll you need both rolls to hit, so you multiply them.
    // (1/6) * (1/6) = (1/6)²
    if (options.vulnerable) {
        individualBlockChance = individualBlockChance ** 2;
    }
    return individualBlockChance;
}

function calculateHits(options, hitChance) {
    let hitProbabilities = [];
    for (let numberOfHits = options.dice; numberOfHits >= 0; numberOfHits--) { 
        if (options.criticalBlow) {
            // Adding critical blow makes this a multinomial distribution
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

function calculateBlocks(options, hitProbabilities, blockChance) {
    let exactHitTotals = [];
    // Arrays need to accomodate the max number of hits with critical blow
    for (var j = 0; j <= options.dice * 2; j++) {
        exactHitTotals.push({ numberOfHits: j, probability: 0.0 });
    }
    
    if (options.includeBlocks) {
        hitProbabilities.forEach(hitProbability => {
            let hitsToBlock = hitProbability.numberOfHits;
            for (let blocks = hitsToBlock; blocks >= 0; blocks--) {
                let blockProbability = STATISTICS.binomial(blockChance, hitsToBlock, blocks);
                let unblockedHits = hitsToBlock - blocks;
                let combinedProbability = hitProbability.probability * blockProbability;
                exactHitTotals[unblockedHits].probability += combinedProbability;
            }
        });    
    } else {
        hitProbabilities.forEach(hitProbability => {
            exactHitTotals[hitProbability.numberOfHits].probability = hitProbability.probability;
        });
    }
    return exactHitTotals;
}

function calculatePanic(options) {
    let targetMorale = options.morale;
    if (options.vicious) {
        targetMorale += 2;
    }
    if (options.attackDirection === "modifiers-direction-flank") {
        targetMorale += 1;
    } else if (options.attackDirection === "modifiers-direction-rear") {
        targetMorale += 2;
    }
    let panicSaveProbability = 0;
    for (let roll = targetMorale; roll <= 12; roll++) {
        let rollProbability = probabilityOfRollingExactly(roll, 2, 6);
        panicSaveProbability += rollProbability;
    }
    if (options.panicked) {
        panicSaveProbability /= 2;
    }
    return 1 - panicSaveProbability;
}

function calculate() {
    // TODO: Pie chart with average expected hits, blocks, and panic?
    let options = getOptions();
    let individualHitChance = calculateHitChance(options);
    let hitProbabilities = calculateHits(options, individualHitChance);
    let individualBlockChance = calculateBlockChance(options);
    let exactHitTotals = calculateBlocks(options, hitProbabilities, individualBlockChance);

    let cumulativeHitTotals = [];
    for (var k = 0; k <= options.dice * 2; k++) {
        cumulativeHitTotals.push({ numberOfHits: k, probability: 0.0 });
    }
    let averageWounds = 0;
    exactHitTotals.forEach(exactHit => {
        for (let hits = exactHit.numberOfHits; hits >= 0; hits--) {
            cumulativeHitTotals[hits].probability += exactHit.probability;
        }
        averageWounds += exactHit.numberOfHits * exactHit.probability;
    });

    document.getElementById("averageWounds").innerHTML = averageWounds.toPrecision(4);
    let panicProbability = calculatePanic(options);
    document.getElementById("panicProbability").innerHTML = panicProbability.toPrecision(4);
    let avgPanicWounds = ((2 + 1) * panicProbability); // D3+1 average damage
    document.getElementById("avgPanicWounds").innerHTML = avgPanicWounds.toPrecision(4);

    let labels = Array.from(Array((options.dice * 2) + 1).keys());

    return {
        labels: labels,
        exactHits: exactHitTotals,
        cumulativeHits: cumulativeHitTotals
    }
}

var probabilityChart;
function draw() {
    var ctx = document.getElementById("probability-chart").getContext("2d");
    let data = calculate();
    if (probabilityChart) {
        probabilityChart.destroy();
    }

    probabilityChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.labels,
            datasets: [{
                label: "Probability of at least # Wounds",
                data: data.cumulativeHits.map(x => x.probability),
                backgroundColor: "#46b5d1",
                borderWidth: 1
            },
            {
                label: "Probability of exactly # Wounds",
                data: data.exactHits.map(x => x.probability),
                backgroundColor: "#e43f5a",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 1
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return `${tooltipItem.yLabel.toPrecision(4)}`;
                    }
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeGlobalObjects();
    initializeEventListeners();
    setDefaults();
    draw();
}, false);

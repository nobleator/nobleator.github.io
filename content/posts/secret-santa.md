---
title: "Secret Santa Assigner"
description: "A tool to randomly assign partners for Secret Santa"
tags: [ "programming", ]
date: 2022-04-16T00:00:00
draft: false
---

## Description
This is a tool I wrote to help plan our Secret Santa assignments each year for Christmas. There are a couple of requirements:
*  You should not be paired with your significant other
*  You should not be paired with the same person you had last year
*  You should not be paired with the same person who is paired with you this year


## Design
I considered using a more elaborate solution with select boxes for the significant other and last year participant columns, but those are not supported in vanilla HTML tables. I briefly considered using a more full-featured data table tool like Ag Grid or DevExtreme, but that seemed like overkill for such a simple project.

For the matching algorithm there are certainly more refined solutions involving graph theory. But for this iteration, I used a naïve brute force solution. The algorithm will iterate over each person assigning them a random selection from the eligible participants and if it encounters and error where a match is impossible then it will restart.

This tool stores selections in the browser's local storage with a year-specific key.


## Tool

{{< secret-santa >}}


## Future Work  
References for possible future refinement:
* https://binary-machinery.github.io/2021/02/03/secret-santa-graph.html  
* https://math.nist.gov/~JBernal/p_t_f.pdf  

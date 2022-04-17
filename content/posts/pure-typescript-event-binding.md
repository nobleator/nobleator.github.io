---
title: "Pure Typescript Event Binding"
description: "How to handle event binding in pure Typescript, no framework needed"
tags: [ "programming", ]
date: 2022-03-01T00:00:00+04:00
draft: true
---

## The Problem
Stringifying an object into JSON and then parsing it back does not create an instance of the original class. This means that any methods on the class will not be accessible on the parsed object.
```
class Foo {
    name: string;

    constructor() {
        this.name = "Foo";
    }

    getName(): string {
        return this.name;
    }
}

let foo = new Foo();
console.log(foo.getName());
let json = JSON.stringify(foo);
console.log(json);
let foo2 = JSON.parse(json);
console.log(foo2.getName()); // [ERR]: foo2.getName is not a function
```

## The Solution
The "correct" way to create an instance of an object in JS is to use Object.assign(). 
```
class Foo {
    name: string;

    constructor() {
        this.name = "Foo";
    }

    getName(): string {
        return this.name;
    }
}

let foo = new Foo();
console.log(foo.getName());
let json = JSON.stringify(foo);
console.log(json);
let foo2 = Object.assign(new Foo(), JSON.parse(json));
console.log(foo2.getName());
```
This is fine if you know ahead of time exactly what class you want to create, but this can be annoying if you want to be more generic.

## The Problem part 2
The solution presented above has another problem though. While you can create an instance of the class, if you have nested objects the children will not be created.
```
class Foo {
    name: string;
    child: Bar = new Bar();

    constructor() {
        this.name = "Foo";
    }

    getName(): string {
        return this.name;
    }
}

class Bar {
    name: string;

    constructor() {
        this.name = "Bar";
    }

    getName(): string {
        return this.name;
    }
}

let foo = new Foo();
console.log(foo.getName());
console.log(foo.child.getName());

let json = JSON.stringify(foo);
console.log(json);
let foo2 = JSON.parse(json);
console.log(foo2.getName()); // [ERR]: foo2.getName is not a function
console.log(foo2.child.getName());
```

## Invalid EML
```
abstract class DomInputBinder {
    constructor() {  }

    bind(domElement: HTMLInputElement | HTMLSelectElement) {
        // using arrow function to avoid binding `this` to the input element and allow the object's `this` to be referenced
        domElement.addEventListener("change", (event: Event) => this.listener(domElement, event), false);
    }

    abstract listener(element: HTMLInputElement | HTMLSelectElement, event: Event): void;
}
```

```
class BoundElement extends DomInputBinder {
    private nodeElementValue: any;
    
    listener(element: HTMLInputElement | HTMLSelectElement, event: Event) {
        if (element.style.backgroundColor === "red") {
            element.style.backgroundColor = "blue";
        } else {
            element.style.backgroundColor = "red";
        }
        console.log(`DOM value: ${element.value}`);
        this.nodeElementValue = element.value;
        console.log(`Node value: ${this.nodeElementValue}`);
    }
}
```

To use this
```
let test = new Test().bind(document.getElementById("test"));
```

TODO link to working typescript playground example

import * as fs from "fs";

let rawInput = fs.readFileSync('2-input.txt');
const input = rawInput.toString().split("\n"); //.map(value => parseInt(value));


// stage 1
let horizontal = 0
let depth = 0

const followInstruction = (instruction: string) => {
    const [direction, stepsRaw] = instruction.split(" ")
    const steps = parseInt(stepsRaw);
    if(direction == "forward") {
        horizontal += steps;
    }
    if (direction == "down") {
        depth += steps;
    }
    if (direction == "up") {
        depth -= steps;
    }
    if (depth < 0) {
        depth = 0;
    }
}

input.forEach(followInstruction);
console.log(horizontal* depth)

// stage 2

const followInstruction2 = (instruction: string) => {
    const [direction, stepsRaw] = instruction.split(" ")
    const steps = parseInt(stepsRaw);
    if(direction == "forward") {
        horizontal += steps;
        depth += aim*steps;
    }
    if (direction == "down") {
        aim += steps;
    }
    if (direction == "up") {
        aim -= steps;
    }
    if (depth < 0) {
        depth = 0;
    }
}

let aim = 0;
horizontal = 0;
depth = 0;

input.forEach(followInstruction2);
console.log(horizontal* depth);

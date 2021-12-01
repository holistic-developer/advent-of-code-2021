import * as fs from "fs";

let rawInput = fs.readFileSync('1-input.txt');
const input = rawInput.toString().split("\n").map(value => parseInt(value));

// stage 1
let last = input[0];
let increasedCount = 0;
for (let i = 1; i < input.length; i++) {
    if ((input[i]) > last) {
        increasedCount++;
    }
    last = input[i];
}

console.log(increasedCount)

// stage 2
let last2 = input[0] + input[1] + input[2];
let increasedCount2 = 0;
for (let i = 1; i+2 < input.length; i++) {
    if ((input[i] + input[i+1] + input[i+2]) > last2) {
        increasedCount2++;
    }
    last2 = input[i] + input[i+1] + input[i+2]
}

console.log(increasedCount2)
import * as fs from "fs";

let rawInput = fs.readFileSync('6-input.txt');
const input = rawInput.toString().split(",");

// stage 1
const rawCounts = input.map((value) => parseInt(value));

let c0 = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;

rawCounts.forEach((value) => {
    switch (value) {
        case 0 :
            c0++;
            break;
        case 1 :
            c1++;
            break;
        case 2 :
            c2++;
            break;
        case 3:
            c3++;
            break;
        case 4:
            c4++;
            break;
        case 5:
            c5++;
            break;
        default:;
    }
})

let counts = [c0, c1, c2, c3, c4, c5, 0 ,0 ,0];

const nextIteration = (currentIteration: number[]): number[] => {
    return [
        currentIteration[1],
        currentIteration[2],
        currentIteration[3],
        currentIteration[4],
        currentIteration[5],
        currentIteration[6],
        currentIteration[7] + currentIteration[0],
        currentIteration[8],
        currentIteration[0]
    ]
}

for (let i = 0; i < 80; i++) {
    counts = nextIteration(counts);
}

console.log(counts.reduce((a, b) => a + b));

// stage 2
for (let i = 80; i < 256; i++) { // don't do previous iterations twice
    counts = nextIteration(counts);
}
console.log(counts.reduce((a, b) => a + b));

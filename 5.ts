import * as fs from "fs";

let rawInput = fs.readFileSync('5-input.txt');
const input = rawInput.toString().split("\n");

// stage 1
const ventLines = input.map(line => {
    const pair = line.split(" -> ");
    const [start, end] = pair.map(p => p.split(",").map(value => parseInt(value)));
    return start.concat(end);
});

const isHorizontal = ([x1, y1, x2, y2]: number[]) => {
    return y1 === y2;
}

const isVertical = ([x1, y1, x2, y2]: number[]) => {
    return x1 === x2;
}
let maxX = 0
let maxY = 0

ventLines.forEach(([x1, y1, x2, y2]: number[]) => {
    maxX = Math.max(maxX, x1, x2);
    maxY = Math.max(maxY, y1, y2);
});

// initialize field
const floor: number[][] = new Array<Array<number>>(maxY);

for (let y = 0; y <= maxY; y++) {
    floor[y] = new Array<number>(maxX);
    for (let x = 0; x <= maxX; x++) {
        floor[y][x] = 0;
    }
}

// draw lines
ventLines.forEach(line => {
    let [x1, y1, x2, y2] = line;
    if(isHorizontal(line)) {
        if (x1 > x2) {
            [x1, y1, x2, y2] = [x2, y1, x1, y2];
        }
        for (let x = x1; x <= x2; x++) {
            floor[y1][x] += 1;
        }
    }
    if(isVertical(line)) {
        if (y1 > y2) {
            [x1, y1, x2, y2] = [x1, y2, x2, y1];
        }
        for (let y = y1; y <= y2; y++) {
            floor[y][x1] += 1;
        }
    }
});

// count fileds with overlapping lines
const count = floor.map(line => line.filter(value => value > 1).length).reduce((a, b) => a + b);
console.log(count);

// stage 2
// addd diagonal lines
ventLines.forEach(line => {
    if (isHorizontal(line) || isVertical(line)) return;
    const [x1, y1, x2, y2] = line;
    if(x1 < x2 && y1 < y2) {
        // →↓
        for (let x = x1, y = y1; x <= x2 && y <= y2; x++, y++) {
            floor[y][x] += 1;
        }
    }
    if (x1 < x2 && y1 > y2) {
        // →↑
        for (let x = x1, y = y1; x <= x2 && y >= y2; x++, y--) {
            floor[y][x] += 1;
        }
    }

    if (x1 > x2 && y1 < y2) {
        // ←↓
        for (let x = x1, y = y1; x >= x2 && y <= y2; x--, y++) {
            floor[y][x] += 1;
        }
    }

    if (x1 > x2 && y1 > y2) {
        // ←↑
        for (let x = x1, y = y1; x >= x2 && y >= y2; x--, y--) {
            floor[y][x] += 1;
        }
    }
});

// count fileds with overlapping lines
const count2 = floor.map(line => line.filter(value => value > 1).length).reduce((a, b) => a + b);
console.log(count2);

import * as fs from "fs";

let rawInput = fs.readFileSync('4-input.txt');
const input = rawInput.toString().split("\n");

// stage 1
const numbersToDraw = input[0].split(",").map(digit => parseInt(digit))

const parseBoards = (intput: string[]): number[][][] => {
    let boards: number[][][] = [[]];
    let board = 0
    let rowOfBoard = 0;
    for (let i = 2; i < input.length; i++) {
        if (input[i].length == 0) {
            board++;
            rowOfBoard = 0;
            boards[board] = [];
            continue;
        }
        boards[board][rowOfBoard] = [];
        input[i].split(" ")
            .map(v => v.trim())
            .filter(v => v.length > 0)
            .map(digit => parseInt(digit))
            .forEach((value, index) =>
                boards[board][rowOfBoard][index] = value
            );
        rowOfBoard++;
    }
    return boards;
}

const bingoBoards = parseBoards(input);

const rotateMatrix = <T>(matrix: T[][]): T[][] => {
    if (matrix.length == 0) {
        return [];
    }
    const rotatedMatrix: T[][] = [];
    for (let i = 0; i < matrix[0].length; i++) {
        rotatedMatrix.push([]);
        for (let j = 0; j < matrix.length; j++) {
            rotatedMatrix[i][j] = matrix[j][i];
        }
    }
    return rotatedMatrix;
}

const checkRows = (board: number[][], alreadDrawnNumbers: number[]):boolean => {
    return !!board.find(row => row.every(item => alreadDrawnNumbers.indexOf(item) != -1));
}

const checkColumns = (board: number[][], alreadDrawnNumbers: number[]): boolean => {
    const rotatedBoard = rotateMatrix(board);
    return checkRows(rotatedBoard, alreadDrawnNumbers);
}

const isWinningBoard = (board: number[][], alreadDrawnNumbers: number[]) => {
    return checkRows(board, alreadDrawnNumbers) || checkColumns(board, alreadDrawnNumbers);
}

let winningBoard: number | undefined = undefined;
let drawnNumbers: number[] = [];

for (let nextNumber of numbersToDraw) {
    drawnNumbers.push(nextNumber);
    let winners = bingoBoards.filter(board =>isWinningBoard(board, drawnNumbers));
    if (winners.length === 1) {
        winningBoard = bingoBoards.indexOf(winners[0]);
        break;
    }
}

const boardScore = (board: number[][], lastNumber: number) => {
    return board.reduce((sum, line) => {
        return sum + line.filter(number => drawnNumbers.indexOf(number) === -1).reduce((a, b) => a + b, 0);
    }, 0) * lastNumber
}

console.log(boardScore(bingoBoards[winningBoard!], drawnNumbers[drawnNumbers.length -1]));

// stage 2
let loosingBoard: number[][] | undefined = undefined;
drawnNumbers = [];
for (let nextNumber of numbersToDraw) {
    drawnNumbers.push(nextNumber);
    let winners = bingoBoards.filter(board =>isWinningBoard(board, drawnNumbers));
    if (winners.length === bingoBoards.length - 1) {
        loosingBoard = bingoBoards.filter(board => winners.indexOf(board) == -1)[0];
        break;
    }
}

for (let nextNumber of numbersToDraw.splice(drawnNumbers.length)) {
    drawnNumbers.push(nextNumber);
    if(isWinningBoard(loosingBoard!, drawnNumbers)) {
        break;
    }
}

console.log(boardScore(loosingBoard!, drawnNumbers[drawnNumbers.length -1]));

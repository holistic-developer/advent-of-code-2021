import * as fs from 'fs'

let rawInput = fs.readFileSync('13-input.txt')
let input = rawInput.toString().split('\n')

const endOfDotsInput = input.indexOf('')
const folds = []

for (let i = endOfDotsInput + 1; i < input.length; i++) {
	folds.push(input[i])
}

// stage 1
const coordinates: number[][] = []
let maxX = 0
let maxY = 0

for (let i = 0; i < endOfDotsInput; i++) {
	coordinates[i] = input[i].split(',').map((v) => parseInt(v))
	if (coordinates[i][0] > maxX) {
		maxX = coordinates[i][0]
	}
	if (coordinates[i][1] > maxY) {
		maxY = coordinates[i][1]
	}
}

const yLength = maxY + 1
const xLength = maxX + 1

let dots: boolean[][] = []

for (let i = 0; i < yLength; i++) {
	dots[i] = []
	for (let j = 0; j < xLength + 1; j++) {
		dots[i].push(false)
	}
}

coordinates.forEach(([x, y]) => {
	dots[y][x] = true
})

function foldLeft(dots: boolean[][], foldLineX: number) {
	for (let y = 0; y < dots.length; y++) {
		dots[y][foldLineX] = false
		for (let x = foldLineX + 1; x < dots[0].length; x++) {
			if (dots[y][x]) {
				dots[y][x] = false
				dots[y][foldLineX - (x - foldLineX)] = true
			}
		}
	}
}

function foldUp(dots: boolean[][], foldLineY: number) {
	for (let x = 0; x < dots[0].length; x++) {
		dots[foldLineY][x] = false
		for (let y = foldLineY + 1; y < dots.length; y++) {
			if (dots[y][x]) {
				dots[y][x] = false
				dots[foldLineY - (y - foldLineY)][x] = true
			}
		}
	}
}

let newMaxX = maxX
let newMaxY = maxY

function fold(dots: boolean[][], fold: string) {
	const [directionString, coordinate] = fold.split('=')
	if (directionString[directionString.length - 1] == 'x') {
		foldLeft(dots, parseInt(coordinate))
		newMaxX = parseInt(coordinate)
	} else {
		foldUp(dots, parseInt(coordinate))
		newMaxY = parseInt(coordinate)
	}
}

fold(dots, folds[0])

console.log(dots.map((line) => line.filter((v) => v).length).reduce((a, b) => a + b))

// stage 2

for (let i = 1; i < folds.length; i++) {
	fold(dots, folds[i])
}

dots.splice(newMaxY, dots.length - newMaxY)
const output = dots
	.map((line) => {
		line.splice(newMaxX, line.length - newMaxX)
		return line.map((e) => (e ? 'XX' : '  ')).join('')
	})
	.join('\n')

console.log(output)

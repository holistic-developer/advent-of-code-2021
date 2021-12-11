import * as fs from 'fs'

let rawInput = fs.readFileSync('11-input.txt')
let input = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split('').map((value) => parseInt(value)))

const maxX = input[0].length
const maxY = input.length

let totalFlashes = 0
function countFlashes(flashes: number[][]): number {
	return flashes.map((line) => line.reduce((a, b) => a + b)).reduce((a, b) => a + b)
}

for (let i = 0; i < 100000; i++) {
	input = input.map((line) => line.map((value) => value + 1))
	const flashes = input.map((line) => line.map((value) => 0))
	let prevFlashCount = -1
	do {
		prevFlashCount = countFlashes(flashes)
		for (let y = 0; y < input.length; y++) {
			for (let x = 0; x < input.length; x++) {
				if (input[y][x] > 9 && flashes[y][x] === 0) {
					flashes[y][x] = 1
					totalFlashes++
					;[
						[-1, -1],
						[-1, 0],
						[-1, 1],
						[0, -1],
						[0, 1],
						[1, -1],
						[1, 0],
						[1, 1],
					].forEach(([xO, yO]) => {
						const xN = x + xO
						const yN = y + yO
						if (xN >= 0 && xN < maxX && yN >= 0 && yN < maxY) {
							input[yN][xN]++
						}
					})
				}
			}
		}
	} while (countFlashes(flashes) > prevFlashCount)
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input.length; x++) {
			if (flashes[y][x] === 1) {
				input[y][x] = 0
			}
		}
	}
	if (i === 100) {
		// stage 1
		console.log(totalFlashes)
	}

	if (countFlashes(flashes) === 100) {
		// stage 2
		console.log(i + 1)
		break
	}
}

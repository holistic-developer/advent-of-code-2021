import * as fs from 'fs'

let rawInput = fs.readFileSync('9-input.txt')
const input = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split('').map((value) => parseInt(value)))

// stage 1
const maxX = input[0].length
const maxY = input.length

let lowpoints: { x: number; y: number }[] = []

for (let y = 0; y < maxY; y++) {
	for (let x = 0; x < maxX; x++) {
		const current = input[y][x]
		const above = y > 0 ? input[y - 1][x] : 10
		const below = y < maxY - 1 ? input[y + 1][x] : 10
		const left = x > 0 ? input[y][x - 1] : 10
		const rigth = x < maxX - 1 ? input[y][x + 1] : 10
		if (current < above && current < below && current < left && current < rigth) {
			lowpoints.push({ x, y })
		}
	}
}

console.log(lowpoints.map((lp) => input[lp.y][lp.x] + 1).reduce((a, b) => a + b))

// stage 2
let basins: Set<string>[] = []

// find basins
lowpoints.forEach((lowpoint) => {
	let newBasin = new Set<string>()
	newBasin.add(`${lowpoint.x}:${lowpoint.y}`) // using strings because javascript sets can only compare primitives
	newBasin.forEach((e) => {
		const [x, y] = e.split(':').map((v) => parseInt(v))
		const currentHeight = input[y][x]
		const above = y > 0 ? input[y - 1][x] : 10
		const below = y < maxY - 1 ? input[y + 1][x] : 10
		const left = x > 0 ? input[y][x - 1] : 10
		const rigth = x < maxX - 1 ? input[y][x + 1] : 10
		if (above < 9 && above > currentHeight) {
			newBasin.add(`${x}:${y - 1}`)
		}
		if (below < 9 && below > currentHeight) {
			newBasin.add(`${x}:${y + 1}`)
		}
		if (left < 9 && left > currentHeight) {
			newBasin.add(`${x - 1}:${y}`)
		}
		if (rigth < 9 && rigth > currentHeight) {
			newBasin.add(`${x + 1}:${y}`)
		}
	})
	basins.push(newBasin)
})

basins.sort((a, b) => b.size - a.size)

console.log(basins[0].size * basins[1].size * basins[2].size)

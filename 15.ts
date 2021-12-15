import * as fs from 'fs'

let rawInput = fs.readFileSync('15-input.txt')
let input = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split('').map((value) => parseInt(value)))

// stage 1
function getLowestRiskPathRisk(input: number[][]) {
	function calculateCityBlockToGoal(x: number, y: number) {
		return goalY - y + (goalX - x)
	}

	function getNeigbor(current: { x: number; y: number }) {
		return [
			{ x: current.x, y: current.y - 1 },
			{ x: current.x, y: current.y + 1 },
			{ x: current.x + 1, y: current.y },
			{ x: current.x - 1, y: current.y },
		].filter((value) => value.x >= 0 && value.x <= goalX && value.y >= 0 && value.y <= goalY)
	}

	const meta: { f: number; g: number; h: number; parent: { x: number; y: number } | undefined }[][] = []

	const goalY = input.length - 1
	const goalX = input[0].length - 1

	for (let y = 0; y < input.length; y++) {
		meta.push([])
		for (let x = 0; x < input[0].length; x++) {
			meta[y].push({
				f: Number.MAX_VALUE,
				g: Number.MAX_VALUE,
				h: calculateCityBlockToGoal(x, y),
				parent: undefined,
			})
		}
	}

	meta[0][0].g = 0
	meta[0][0].f = meta[0][0].h

	const nodesToVisit: { x: number; y: number }[] = []

	nodesToVisit.push({ x: 0, y: 0 })

	while (nodesToVisit.length > 0) {
		nodesToVisit.sort((a, b) => meta[a.y][a.x].f - meta[b.y][b.x].f)
		const current = nodesToVisit.shift()!
		if (current.x === goalX && current.y === goalY) {
			console.log(meta[current.y][current.x].f)
		}
		getNeigbor(current).forEach(({ x, y }) => {
			const temp = meta[current.y][current.x].g + input[y][x]
			if (temp < meta[y][x].g) {
				meta[y][x].g = temp
				meta[y][x].parent = { x: current.x, y: current.y }
				meta[y][x].f = temp + meta[y][x].h

				if (!nodesToVisit.find((v) => v.x === x && v.y === y)) {
					nodesToVisit.push({ x, y })
				}
			}
		})
	}
}

getLowestRiskPathRisk(input)

function printPath(
	meta: { f: number; g: number; h: number; parent: { x: number; y: number } | undefined }[][],
	goalX: number,
	goalY: number
) {
	let totalPath: { x: number; y: number }[] = [{ x: goalX, y: goalY }]
	let currentSuc = meta[goalY][goalX].parent
	while (!!currentSuc) {
		totalPath.unshift(currentSuc)
		currentSuc = meta[currentSuc.y][currentSuc.x].parent
	}
	console.log(totalPath.map(({ x, y }) => x + ':' + y).join(' '))
}

// stage 2

const newInput: number[][] = []
for (let y = 0; y < input.length * 5; y++) {
	newInput.push([])
	for (let x = 0; x < input[0].length * 5; x++) {
		const offset = Math.floor(x / input[0].length) + Math.floor(y / input.length)
		let newValue = input[y % input.length][x % input[0].length] + offset
		while (newValue > 9) {
			newValue -= 9
		}
		newInput[y].push(newValue)
	}
}

getLowestRiskPathRisk(newInput)

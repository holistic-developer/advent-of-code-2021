import * as fs from 'fs'

// const rawInput = fs.readFileSync('test-input.txt')
const rawInput = fs.readFileSync('17-input.txt')

const input = rawInput
	.toString()
	.substring(13, rawInput.length)
	.split(', ')
	.map((part) =>
		part
			.substring(2, part.length)
			.split('..')
			.map((v) => parseInt(v))
	)

const targetLeft = input[0][0]
const targetRigth = input[0][1]
const targetBottom = input[1][0]
const targetTop = input[1][1]

// stage 1
function calculateHit(xV: number, yV: number): number | null {
	let x = 0
	let y = 0
	let maxY = -Number.MAX_VALUE
	while (x < targetRigth && y > targetBottom) {
		x += xV
		y += yV
		if (y > maxY) maxY = y
		if (x >= targetLeft && x <= targetRigth && y >= targetBottom && y <= targetTop) return maxY

		if (xV > 0) xV -= 1
		if (xV < 0) xV += 1
		yV -= 1
	}
	return null
}

let hightestVX = 0
let hightestVY = 0
let hightestY = -Number.MAX_VALUE
for (let y = 0; y < 1000; y++) {
	let foundAny: boolean = false
	for (let x = targetRigth; x > 0; x--) {
		const found = calculateHit(x, y)
		if (found != null) {
			foundAny = true
			if (found > hightestY) {
				hightestY = found
				hightestVY = y
				hightestVX = x
			}
		}
	}
}

console.log([hightestVX, hightestVY, hightestY])

// stage 2
const allInitials = []
for (let y = targetBottom; y < 1000; y++) {
	let foundAny: boolean = false
	for (let x = targetRigth; x > 0; x--) {
		const found = calculateHit(x, y)
		if (found != null) {
			allInitials.push([x, y])
		}
	}
}
console.log(allInitials.length)

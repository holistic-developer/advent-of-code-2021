import * as fs from 'fs'

const rawInput = fs.readFileSync('19-input.txt')
// const rawInput = fs.readFileSync('test-input.txt')

const input = rawInput.toString().split('\n\n')

// stage 1
const beacons: number[][][] = input.map((value) => {
	const lines = value.split('\n')
	lines.shift()
	return lines.map((line) => line.split(',').map((v) => parseInt(v)))
})

/* Matrix multiply a 1x3 and 3x3 matrix
                a b c
	[x, y, z] x d e f
	            g h i
 */
function transform([x, y, z]: number[], [[a, b, c], [d, e, f], [g, h, i]]: number[][]): number[] {
	return [x * a + y * d + z * g, x * b + y * e + z * h, x * c + y * f + z * i]
}

// generate 24 rotations around [0, 0, 0]
// see http://www.euclideanspace.com/maths/algebra/matrix/transforms/examples/index.htm
function generateAllRotations([x, y, z]: number[]): number[][] {
	return [
		transform(
			[x, y, z],
			[
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, 1],
				[0, 1, 0],
				[-1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[-1, 0, 0],
				[0, 1, 0],
				[0, 0, -1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, -1],
				[0, 1, 0],
				[1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, -1, 0],
				[1, 0, 0],
				[0, 0, 1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, 1],
				[1, 0, 0],
				[0, 1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 1, 0],
				[1, 0, 0],
				[0, 0, -1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, -1],
				[1, 0, 0],
				[0, -1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 1, 0],
				[-1, 0, 0],
				[0, 0, 1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, 1],
				[-1, 0, 0],
				[0, -1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, -1, 0],
				[-1, 0, 0],
				[0, 0, -1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, -1],
				[-1, 0, 0],
				[0, 1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[1, 0, 0],
				[0, 0, -1],
				[0, 1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 1, 0],
				[0, 0, -1],
				[-1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[-1, 0, 0],
				[0, 0, -1],
				[0, -1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, -1, 0],
				[0, 0, -1],
				[1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[1, 0, 0],
				[0, -1, 0],
				[0, 0, -1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, -1],
				[0, -1, 0],
				[-1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[-1, 0, 0],
				[0, -1, 0],
				[0, 0, 1],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 0, 1],
				[0, -1, 0],
				[1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[1, 0, 0],
				[0, 0, 1],
				[0, -1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, -1, 0],
				[0, 0, 1],
				[-1, 0, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[-1, 0, 0],
				[0, 0, 1],
				[0, 1, 0],
			]
		),
		transform(
			[x, y, z],
			[
				[0, 1, 0],
				[0, 0, 1],
				[1, 0, 0],
			]
		),
	]
}

function translate([x, y, z]: number[], dx: number, dy: number, dz: number): number[] {
	return [x + dx, y + dy, z + dz]
}

function countMatchingBeacons(newSensor: number[][], initialSensor: number[][]): number {
	return newSensor
		.map((nb) => !!initialSensor.find((b) => b[0] === nb[0] && b[1] === nb[1] && b[2] === nb[2]))
		.filter(Boolean).length
}

function matchesIn1d(existing: number[], newV: number[], offset: number) {
	return newV.map((v) => v + offset).filter((v) => existing.indexOf(v) != -1).length >= 12
}

function numberSort(a: number, b: number) {
	return a - b
}

function getPossibleOffsets(existing: number[], newBeacons: number[]) {
	let offsets: number[] = []
	for (const e of existing) {
		for (let i = 0; i < newBeacons.length - 11; i++) {
			offsets.push(e - newBeacons[i])
		}
	}
	return [...new Set(offsets)]
}

const sensorCoordinates: number[][] = []

function findMatch(existing: number[][], newBeacons: number[][]): number[][] | undefined {
	let foundTransformation = undefined
	let foundX, foundY, foundZ: number | undefined

	const existingX = existing.map((b) => b[0]).sort(numberSort)
	const existingY = existing.map((b) => b[1]).sort(numberSort)
	const existingZ = existing.map((b) => b[2]).sort(numberSort)
	const allRotations = newBeacons.map(generateAllRotations)

	for (let r = 0; r < 24; r++) {
		const newX = allRotations.map((pos) => pos[r][0]).sort(numberSort)
		const xOffsets = getPossibleOffsets(existingX, newX).filter((offset) => matchesIn1d(existingX, newX, offset))
		foundX = xOffsets.find((x) => {
			const newY = allRotations.map((pos) => pos[r][1]).sort(numberSort)
			const yOffsets = getPossibleOffsets(existingY, newY).filter((offset) => matchesIn1d(existingY, newY, offset))
			foundY = yOffsets.find((y) => {
				const newZ = allRotations.map((pos) => pos[r][2]).sort(numberSort)
				const zOffsets = getPossibleOffsets(existingZ, newZ).filter((offset) => matchesIn1d(existingZ, newZ, offset))
				foundZ = zOffsets.find((z) => {
					const transformed = allRotations.map((pos) => pos[r]).map((b) => translate(b, x, y, z))
					const matchingPositions = countMatchingBeacons(transformed, existing)
					if (matchingPositions >= 12) {
						foundTransformation = transformed
						return true
					}
					return false
				})
				return !!foundZ
			})
			return !!foundY
		})
		if (foundX) {
			console.log([foundX, foundY, foundZ].join(','))
			sensorCoordinates.push([foundX, foundY, foundZ])
			break
		}
	}
	return foundTransformation
}

const allBeacons: number[][] = beacons.shift()!
for (let i = 0; i < beacons.length; i++) {
	const matchingBeacons = findMatch(allBeacons, beacons[i])
	if (matchingBeacons != undefined) {
		beacons.splice(i, 1)
		matchingBeacons
			.filter((nb) => !allBeacons.find((b) => b[0] === nb[0] && b[1] === nb[1] && b[2] === nb[2]))
			.forEach((b) => allBeacons.push(b))
		i = -1
	}
}
if (beacons.length > 0) {
	console.log(beacons.length + ' sensor[s] could not be matched')
}

console.log(allBeacons.length)

// stage 2
function manhattanDistance([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)
}

console.log(
	sensorCoordinates
		.map((c, _, array) => array.map((o) => manhattanDistance(o, c)).reduce((a, b) => Math.max(a, b)))
		.reduce((a, b) => Math.max(a, b))
)

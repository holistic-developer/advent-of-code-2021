import * as fs from 'fs'

const rawInput = fs.readFileSync('22-input.txt')
// const rawInput = fs.readFileSync('test-input.txt')

type Cube = {
	id: number
	xMin: number
	xMax: number
	yMin: number
	yMax: number
	zMin: number
	zMax: number
}

type OnOffCube = {
	on: boolean
	cube: Cube
}

// stage 1
let cubeId = 0
const inputCubes = rawInput
	.toString()
	.split('\n')
	.map((line) => {
		const [onOff, coordinates] = line.split(' ')
		const [xR, yR, zR] = coordinates.split(',').map((c) =>
			c
				.substring(2)
				.split('..')
				.map((n) => parseInt(n))
		)
		return {
			on: onOff === 'on',
			cube: {
				id: cubeId++,
				xMin: xR[0],
				xMax: xR[1],
				yMin: yR[0],
				yMax: yR[1],
				zMin: zR[0],
				zMax: zR[1],
			},
		} as OnOffCube
	})

// filter cubes out of bounds for first stage
const stage1InputCubes = inputCubes.filter(
	({ cube }) =>
		cube.xMin >= -50 && cube.xMax <= 50 && cube.yMin >= -50 && cube.yMax <= 50 && cube.zMin >= -50 && cube.zMax <= 50
)

function getCubesIntersectingWithNewCube(allCubes: Cube[], newCube: Cube) {
	return allCubes.filter(
		(cube) =>
			newCube.xMin <= cube.xMax &&
			newCube.yMin <= cube.yMax &&
			newCube.zMin <= cube.zMax &&
			newCube.yMax >= cube.yMin &&
			newCube.xMax >= cube.xMin &&
			newCube.zMax >= cube.zMin
	)
}

function getAllOnCubesCount(inputCubes: OnOffCube[]): number {
	// nothing is lit up at first
	const onCubes: Map<number, Cube> = new Map<number, Cube>()

	// combine all input cubes
	inputCubes.forEach(({ on, cube: newCube }) => {
		// check if new cube overlaps with any other cube
		const intersectingCubes = getCubesIntersectingWithNewCube([...onCubes.values()], newCube)

		// if no intersects && is on just add
		if (intersectingCubes.length === 0 && on) {
			onCubes.set(newCube.id, newCube)
		} else {
			// subtract from exsiting cubes
			intersectingCubes.forEach((cube) => {
				// check if cube is fully contained
				if (
					newCube.xMin <= cube.xMin &&
					newCube.yMin <= cube.yMin &&
					newCube.zMin <= cube.zMin &&
					newCube.yMax >= cube.yMax &&
					newCube.xMax >= cube.xMax &&
					newCube.zMax >= cube.zMax
				) {
					onCubes.delete(cube.id)
				} else {
					let cubeOfConcern = cube // volume we have to look further into
					// minX split
					if (cubeOfConcern.xMin <= newCube.xMin && newCube.xMin <= cubeOfConcern.xMax) {
						onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (newCube.xMin - cubeOfConcern.xMin > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: cubeOfConcern.xMin,
								xMax: newCube.xMin - 1,
								yMin: cubeOfConcern.yMin,
								yMax: cubeOfConcern.yMax,
								zMin: cubeOfConcern.zMin,
								zMax: cubeOfConcern.zMax,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						cubeOfConcern = {
							id: cubeId++,
							xMin: newCube.xMin,
							xMax: cubeOfConcern.xMax,
							yMin: cubeOfConcern.yMin,
							yMax: cubeOfConcern.yMax,
							zMin: cubeOfConcern.zMin,
							zMax: cubeOfConcern.zMax,
						} as Cube
					}
					// minY split
					if (cubeOfConcern.yMin <= newCube.yMin && newCube.yMin <= cubeOfConcern.yMax) {
						if (cubeOfConcern.id == cube.id) onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (newCube.yMin - cubeOfConcern.yMin > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: cubeOfConcern.xMin,
								xMax: cubeOfConcern.xMax,
								yMin: cubeOfConcern.yMin,
								yMax: newCube.yMin - 1,
								zMin: cubeOfConcern.zMin,
								zMax: cubeOfConcern.zMax,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						cubeOfConcern = {
							id: cubeId++,
							xMin: cubeOfConcern.xMin,
							xMax: cubeOfConcern.xMax,
							yMin: newCube.yMin,
							yMax: cubeOfConcern.yMax,
							zMin: cubeOfConcern.zMin,
							zMax: cubeOfConcern.zMax,
						} as Cube
					}
					// minZ split
					if (cubeOfConcern.zMin <= newCube.zMin && newCube.zMin <= cubeOfConcern.zMax) {
						if (cubeOfConcern.id == cube.id) onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (newCube.zMin - cubeOfConcern.zMin > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: cubeOfConcern.xMin,
								xMax: cubeOfConcern.xMax,
								yMin: cubeOfConcern.yMin,
								yMax: cubeOfConcern.yMax,
								zMin: cubeOfConcern.zMin,
								zMax: newCube.zMin - 1,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						cubeOfConcern = {
							id: cubeId++,
							xMin: cubeOfConcern.xMin,
							xMax: cubeOfConcern.xMax,
							yMin: cubeOfConcern.yMin,
							yMax: cubeOfConcern.yMax,
							zMin: newCube.zMin,
							zMax: cubeOfConcern.zMax,
						} as Cube
					}

					// maxX split
					if (cubeOfConcern.xMin <= newCube.xMax && newCube.xMax <= cubeOfConcern.xMax) {
						if (cubeOfConcern.id == cube.id) onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (cubeOfConcern.xMax - newCube.xMax > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: newCube.xMax + 1,
								xMax: cubeOfConcern.xMax,
								yMin: cubeOfConcern.yMin,
								yMax: cubeOfConcern.yMax,
								zMin: cubeOfConcern.zMin,
								zMax: cubeOfConcern.zMax,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						cubeOfConcern = {
							id: cubeId++,
							xMin: cubeOfConcern.xMin,
							xMax: newCube.xMax,
							yMin: cubeOfConcern.yMin,
							yMax: cubeOfConcern.yMax,
							zMin: cubeOfConcern.zMin,
							zMax: cubeOfConcern.zMax,
						} as Cube
					}
					// maxY split
					if (cubeOfConcern.yMin <= newCube.yMax && newCube.yMax <= cubeOfConcern.yMax) {
						if (cubeOfConcern.id == cube.id) onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (cubeOfConcern.yMax - newCube.yMax > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: cubeOfConcern.xMin,
								xMax: cubeOfConcern.xMax,
								yMin: newCube.yMax + 1,
								yMax: cubeOfConcern.yMax,
								zMin: cubeOfConcern.zMin,
								zMax: cubeOfConcern.zMax,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						cubeOfConcern = {
							id: cubeId++,
							xMin: cubeOfConcern.xMin,
							xMax: cubeOfConcern.xMax,
							yMin: cubeOfConcern.yMin,
							yMax: newCube.yMax,
							zMin: cubeOfConcern.zMin,
							zMax: cubeOfConcern.zMax,
						} as Cube
					}
					// maxZ split
					if (cubeOfConcern.zMin <= newCube.zMax && newCube.zMax <= cubeOfConcern.zMax) {
						if (cubeOfConcern.id == cube.id) onCubes.delete(cubeOfConcern.id)
						// add what is left, if there is something left
						if (cubeOfConcern.zMax - newCube.zMax > 0) {
							const keepCube = {
								id: cubeId++,
								xMin: cubeOfConcern.xMin,
								xMax: cubeOfConcern.xMax,
								yMin: cubeOfConcern.yMin,
								yMax: cubeOfConcern.yMax,
								zMin: newCube.zMax + 1,
								zMax: cubeOfConcern.zMax,
							} as Cube
							onCubes.set(keepCube.id, keepCube)
						}
						// omit what is left
					}
				}
				if (on) {
					onCubes.set(newCube.id, newCube)
				}
			})
		}
	})

	// iterate to all remaining on cubes and add their volumes
	return [...onCubes.values()]
		.map((c) => (Math.abs(c.xMax - c.xMin) + 1) * (Math.abs(c.yMax - c.yMin) + 1) * (Math.abs(c.zMax - c.zMin) + 1))
		.reduce((a, b) => a + b, 0)
}

console.log(getAllOnCubesCount(stage1InputCubes))

// stage 2
console.log(getAllOnCubesCount(inputCubes))

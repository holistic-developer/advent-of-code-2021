import * as fs from 'fs'

// const rawInput = fs.readFileSync('25-input.txt')
const rawInput = fs.readFileSync('test-input.txt')

// stage 1
const field = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split(''))

const ySize = field.length
const xSize = field[0].length

function getNextStep(previousField: string[][]): string[][] {
	return previousField.map((line, y) =>
		line.map((c, x) => {
			if (c === '.') {
				if (previousField[y][(x - 1 + xSize) % xSize] === '>') {
					return '>'
				} else if (previousField[(y - 1 + ySize) % ySize][x] === 'v') {
					return 'v'
				} else {
					return '.'
				}
			} else if (c === '>') {
				if (previousField[y][(x + 1 + xSize) % xSize] === '.') {
					if (previousField[(y - 1 + ySize) % ySize][x] === 'v') {
						return 'v'
					} else {
						return '.'
					}
				} else {
					return '>'
				}
			} else if (c === 'v') {
				if (
					previousField[(y + 1 + ySize) % ySize][x] === '.' &&
					previousField[(y + 1 + ySize) % ySize][(x - 1 + xSize) % xSize] !== '>'
				) {
					return '.'
				} else if (
					previousField[(y + 1 + ySize) % ySize][x] === '>' &&
					previousField[(y + 1 + ySize) % ySize][(x + 1 + xSize) % xSize] === '.'
				) {
					return '.'
				} else {
					return 'v'
				}
			}
			console.log('UNEXPECTED CASE')
			return '?'
		})
	)
}

let currentRep = ''
let currentField = field
for (let i = 1; i < 10000; i++) {
	const nextStep = getNextStep(currentField)
	const stringRepresentation = nextStep.map((l) => l.join('')).join('\n')
	if (stringRepresentation == currentRep) {
		console.log(i)
		break
	}
	currentRep = stringRepresentation
	currentField = nextStep
}

// stage 2

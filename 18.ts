import * as fs from 'fs'

// const rawInput = fs.readFileSync('test-input.txt')
const rawInput = fs.readFileSync('18-input.txt')

const input = rawInput.toString().split('\n')

// stage 1
type SnailNumber = {
	left?: SnailNumber
	right?: SnailNumber
	value?: number
}

function parseSnailNumberCharacters(characters: string[]): SnailNumber {
	const next = characters.shift()
	if (next === '[') {
		const left = parseSnailNumberCharacters(characters)
		characters.shift() // consume ,
		const right = parseSnailNumberCharacters(characters)
		characters.shift() // consume ]
		return { left, right }
	} else {
		return {
			value: parseInt(next!),
		}
	}
}

function parseSnailNumber(i: string): SnailNumber {
	const characters = i.split('')
	return parseSnailNumberCharacters(characters)
}

function shouldExplode(sn: SnailNumber, depth: number): boolean {
	if (!!sn.left) {
		if (depth >= 4) return true
		return shouldExplode(sn.left, depth + 1) || shouldExplode(sn.right!, depth + 1)
	} else {
		return false
	}
}

type ExplodingSnailNumber = {
	carryoverLeft?: number
	carryoverRight?: number
	sn: SnailNumber
	exploded: boolean
}

function pushDownLeft(sn: SnailNumber, explodedValue: number): SnailNumber {
	if (!sn.left)
		return {
			value: sn.value! + explodedValue,
		}
	return {
		left: pushDownLeft(sn.left, explodedValue),
		right: sn.right,
	}
}

function pushDownRight(sn: SnailNumber, explodedValue: number): SnailNumber {
	if (!sn.right)
		return {
			value: sn.value! + explodedValue,
		}
	return {
		left: sn.left,
		right: pushDownRight(sn.right, explodedValue),
	}
}

function explodeFirstOccurance(sn: SnailNumber, depth: number = 0): ExplodingSnailNumber {
	if (!sn.left || !sn.right) {
		// is a leaf / number
		return {
			sn,
		} as ExplodingSnailNumber
	}
	// exploded itself
	if (depth >= 4) {
		return {
			sn: { value: 0 } as SnailNumber,
			carryoverLeft: sn.left.value,
			carryoverRight: sn.right.value!,
			exploded: true,
		}
	}

	const left = explodeFirstOccurance(sn.left, depth + 1)
	// left child exploded
	if (left.carryoverLeft && left.carryoverRight) {
		return {
			sn: {
				left: left.sn,
				right: pushDownLeft(sn.right, left.carryoverRight),
			},
			carryoverRight: 0,
			carryoverLeft: left.carryoverLeft,
			exploded: left.exploded,
		}
	}
	// left child bubbled up an exploded value
	if (left.carryoverLeft || left.carryoverRight) {
		return {
			sn: {
				left: left.sn,
				right: left.carryoverRight ? pushDownLeft(sn.right, left.carryoverRight) : sn.right,
			},
			carryoverLeft: left.carryoverLeft,
			carryoverRight: 0,
			exploded: left.exploded,
		}
	}

	const right: ExplodingSnailNumber = !left.exploded
		? explodeFirstOccurance(sn.right, depth + 1)
		: {
				sn: sn.right,
				carryoverLeft: 0,
				carryoverRight: 0,
				exploded: left.exploded,
		  }
	// right child exploded
	if (right.carryoverLeft && right.carryoverRight) {
		return {
			sn: {
				left: pushDownRight(sn.left, right.carryoverLeft),
				right: right.sn,
			},
			carryoverLeft: 0,
			carryoverRight: right.carryoverRight,
			exploded: true,
		}
	}
	// right child bubbled up an exploded value
	if (right.carryoverLeft || right.carryoverRight) {
		return {
			sn: {
				left: right.carryoverLeft ? pushDownRight(left.sn, right.carryoverLeft) : left.sn,
				right: right.sn,
			},
			carryoverLeft: 0,
			carryoverRight: right.carryoverRight,
			exploded: true,
		}
	}

	return {
		sn: {
			left: left.sn,
			right: right.sn,
		},
		exploded: left.exploded || right.exploded,
	}
}

function explode(sn: SnailNumber): SnailNumber {
	return explodeFirstOccurance(sn, 0).sn
}

function split(sn: SnailNumber): SnailNumber {
	if (!!sn.left) {
		return {
			left: shouldSplit(sn.left) ? split(sn.left) : sn.left,
			right: !shouldSplit(sn.left) && shouldSplit(sn.right!) ? split(sn.right!) : sn.right,
		}
	}
	if (sn.value! < 9) {
		return sn
	}
	return {
		left: { value: Math.floor(sn.value! / 2) },
		right: { value: Math.ceil(sn.value! / 2) },
	}
}

function shouldSplit(sn: SnailNumber): boolean {
	if (!!sn.left) {
		return shouldSplit(sn.left) || shouldSplit(sn.right!)
	}
	return sn.value! > 9
}

function explodeAndSplit(sn: SnailNumber): SnailNumber {
	if (shouldExplode(sn, 0)) {
		return explodeAndSplit(explode(sn))
	}
	if (shouldSplit(sn)) {
		return explodeAndSplit(split(sn))
	}
	return sn
}

function addSnailNumber(a: SnailNumber, b: SnailNumber): SnailNumber {
	const additionResult: SnailNumber = {
		left: a,
		right: b,
	}
	return explodeAndSplit(additionResult)
}

function snailNumberToString(sn: SnailNumber): string {
	if (!!sn.left) {
		return '[' + snailNumberToString(sn.left!) + ',' + snailNumberToString(sn.right!) + ']'
	} else {
		return sn.value!.toString()
	}
}

function magnitude(sn: SnailNumber): number {
	if (!!sn.left) {
		return magnitude(sn.left) * 3 + magnitude(sn.right!) * 2
	}
	return sn.value!
}

let snailNumbers = input.map(parseSnailNumber)
let total = snailNumbers.reduce(addSnailNumber)

console.log(snailNumberToString(total))
console.log(magnitude(total))

// stage 2
let magnitudes = []
for (let i = 0; i < input.length; i++) {
	for (let j = 0; j < input.length; j++) {
		magnitudes.push(magnitude(addSnailNumber(snailNumbers[i], snailNumbers[j])))
		magnitudes.push(magnitude(addSnailNumber(snailNumbers[j], snailNumbers[i])))
	}
}
console.log(Math.max(...magnitudes))

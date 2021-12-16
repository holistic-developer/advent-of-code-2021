import * as fs from 'fs'

let rawInput = fs.readFileSync('16-input.txt')
// let rawInput = fs.readFileSync('test-input.txt')

const hexToBin = new Map([
	['0', '0000'],
	['1', '0001'],
	['2', '0010'],
	['3', '0011'],
	['4', '0100'],
	['5', '0101'],
	['6', '0110'],
	['7', '0111'],
	['8', '1000'],
	['9', '1001'],
	['A', '1010'],
	['B', '1011'],
	['C', '1100'],
	['D', '1101'],
	['E', '1110'],
	['F', '1111'],
])

const inputBits = rawInput
	.toString()
	.split('')
	.flatMap((value) => hexToBin.get(value)!.split(''))

const inputBits2 = [...inputBits]

interface Package {
	version: number
	typeId: number
	children: Package[]
	value?: number
}

function parseNumberValue(bits: string[]): number {
	let currentStart = '1'
	let numberBits = ''
	while (currentStart === '1') {
		const currentBits = bits.splice(0, 5)
		currentStart = currentBits.shift()!
		numberBits += currentBits.join('')
	}
	return parseInt(numberBits, 2)
}

function parseSubPackages(bits: string[]): Package[] {
	const subPackages = []
	const lengthId = bits.shift()
	if (lengthId === '0') {
		const bitLength = parseInt(bits.splice(0, 15).join(''), 2)
		let subPackageBits = bits.splice(0, bitLength)
		while (subPackageBits.length >= 7) {
			subPackages.push(parsePackage(subPackageBits))
		}
	} else {
		const subPackageCount = parseInt(bits.splice(0, 11).join(''), 2)
		for (let i = 0; i < subPackageCount; i++) {
			subPackages.push(parsePackage(bits))
		}
	}
	return subPackages
}

// stage 1
function parsePackage(bits: string[]): Package {
	const version = parseInt(bits.splice(0, 3).join(''), 2)
	const typeId = parseInt(bits.splice(0, 3).join(''), 2)

	if (typeId === 4) {
		return {
			version,
			typeId,
			value: parseNumberValue(bits),
			children: [],
		}
	} else {
		return {
			version,
			typeId,
			children: parseSubPackages(bits),
		}
	}
}

function versionSum(pack: Package): number {
	return pack.version + pack.children.map(versionSum).reduce((a, b) => a + b, 0)
}

console.log(versionSum(parsePackage(inputBits)))

// stage 2
function evaluate(p: Package): number {
	switch (p.typeId) {
		case 0:
			return p.children.map(evaluate).reduce((a, b) => a + b, 0)
		case 1:
			return p.children.map(evaluate).reduce((a, b) => a * b, 1)
		case 2:
			return Math.min(...p.children.map(evaluate))
		case 3:
			return Math.max(...p.children.map(evaluate))
		case 4:
			return p.value!
		case 5: {
			const first = evaluate(p.children[0])
			const second = evaluate(p.children[1])
			return first > second ? 1 : 0
		}
		case 6: {
			const first = evaluate(p.children[0])
			const second = evaluate(p.children[1])
			return first < second ? 1 : 0
		}
		case 7: {
			const first = evaluate(p.children[0])
			const second = evaluate(p.children[1])
			return first === second ? 1 : 0
		}
	}
	return 0
}

console.log(evaluate(parsePackage(inputBits2)))

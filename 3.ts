import * as fs from 'fs'

let rawInput = fs.readFileSync('3-input.txt')
const input = rawInput
	.toString()
	.split('\n')
	.map((s) => s.split('').map((digit) => parseInt(digit)))

const convertFromBinary = (digits: number[]): number => {
	return digits.reduce((sum, bit, index) => sum + bit * Math.pow(2, digits.length - 1 - index), 0)
}

// stage 1
let bitSums: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let ɣBits: number[] = []
const totalLines = input.length

input.forEach((line) => {
	line.forEach((digit, position) => {
		bitSums[position] += digit
	})
})

bitSums.forEach((digit, position) => {
	ɣBits[position] = digit >= totalLines / 2 ? 1 : 0
})

const ɣ = convertFromBinary(ɣBits)
const ε = convertFromBinary(ɣBits.map((bit) => (!bit ? 1 : 0)))

console.log(ɣ * ε)

// stage 2
const findMostCommonBitAt = (bits: number[][], index: number, oxygen: boolean): number => {
	const bitSum = bits.map((b) => b[index]).filter((v) => v != 0).length
	if (oxygen) {
		return bitSum >= bits.length / 2 ? 1 : 0
	} else {
		return bitSum >= bits.length / 2 ? 0 : 1
	}
}

const filterValues = (remainingValues: number[][], oxygenCondition: boolean) => {
	for (let i = 0; remainingValues.length > 1; i++) {
		let filterBit = findMostCommonBitAt(remainingValues, i, oxygenCondition)
		remainingValues = remainingValues.filter((value) => value[i] === filterBit)
	}
	return remainingValues[0]
}

const oxygenGeneratorRating = convertFromBinary(filterValues(input, true))
const co2scrubberRating = convertFromBinary(filterValues(input, false))

console.log(oxygenGeneratorRating * co2scrubberRating)

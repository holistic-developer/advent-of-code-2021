import * as fs from 'fs'

let rawInput = fs.readFileSync('8-input.txt')
const input = rawInput.toString().split('\n')

// stage 1
const wiringsAndOutputs = input.map((line) => line.split(' | ').map((part) => part.split(' ')))

console.log(
	wiringsAndOutputs
		.flatMap((line) => line[1])
		.map((segments) => segments.length)
		.filter((length) => length == 2 || length == 3 || length == 4 || length == 7).length
)

// stage 2
const decodeWiring = (numbers: string[][]): Map<number, string[]> => {
	let wiring = new Map<number, string[]>()
	wiring.set(1, numbers.find((seg) => seg.length == 2)!)
	wiring.set(7, numbers.find((seg) => seg.length == 3)!)
	wiring.set(4, numbers.find((seg) => seg.length == 4)!)
	wiring.set(8, numbers.find((seg) => seg.length == 7)!)

	// 3 has 5 segments
	// 5 has 5 segments
	// 2 has 5 segments
	wiring.set(
		3,
		numbers.find(
			(s) =>
				s.length === 5 &&
				intersect(s, wiring.get(4)!).length === 3 &&
				intersect(intersect(s, wiring.get(4)!), wiring.get(1)!).length === 2
		)!
	)
	wiring.set(
		5,
		numbers.find(
			(s) =>
				s.length === 5 &&
				intersect(s, wiring.get(4)!).length === 3 &&
				intersect(intersect(s, wiring.get(4)!), wiring.get(1)!).length === 1
		)!
	)
	wiring.set(2, numbers.find((s) => s.length === 5 && intersect(s, wiring.get(4)!).length === 2)!)

	// 0 has 6 segments
	// 6 has 6 segments
	// 9 has 6 segments
	wiring.set(6, numbers.find((s) => s.length === 6 && minus(s, wiring.get(1)!).length === 5)!)
	wiring.set(
		9,
		numbers.find(
			(s) => s.length === 6 && minus(s, wiring.get(1)!).length === 4 && minus(s, wiring.get(4)!).length === 2
		)!
	)
	wiring.set(
		0,
		numbers.find(
			(s) => s.length === 6 && minus(s, wiring.get(1)!).length === 4 && minus(s, wiring.get(4)!).length === 3
		)!
	)
	return wiring
}

const intersect = (a: string[], b: string[]): string[] => {
	return a.filter((v) => b.indexOf(v) !== -1)
}

const minus = (a: string[], b: string[]): string[] => {
	return a.filter((v) => b.indexOf(v) === -1)
}

const getDigit = (segments: string[], wiring: Map<number, string[]>): number => {
	let digit = undefined
	wiring.forEach((value, key) => {
		if (
			value.length === segments.length &&
			minus(segments, value).length === 0 &&
			intersect(segments, value).length === segments.length
		) {
			digit = key
		}
	})
	return digit ?? Number.NaN
}

const decodeLine = (line: string[][]): number => {
	const wiring = decodeWiring(line[0].map((value) => value.split('')))
	const decoded = line[1].map((value) => getDigit(value.split(''), wiring))

	return decoded[0] * 1000 + decoded[1] * 100 + decoded[2] * 10 + decoded[3]
}

console.log(wiringsAndOutputs.map(decodeLine).reduce((a, b) => a + b))

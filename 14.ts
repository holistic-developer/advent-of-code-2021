import * as fs from 'fs'

let rawInput = fs.readFileSync('14-input.txt')
let input = rawInput.toString().split('\n')

// stage 1
const insertions: Map<string, string> = new Map()
const initial = input.shift()
input.shift()
input.map((line) => line.split(' -> ')).forEach(([inuput, newElement]) => insertions.set(inuput, newElement))

function addOrInsert(map: Map<string, number>, key: string, value: number) {
	const existing = map.get(key)
	if (!existing) {
		map.set(key, value)
	} else {
		map.set(key, value + existing)
	}
}

const pairs: Map<string, number> = new Map()
for (let i = 0; i < initial!.length - 1; i++) {
	addOrInsert(pairs, initial!.substring(i, i + 2), 1)
}

function nextIteration(pairs: Map<string, number>, insertions: Map<string, string>) {
	const oldPairs: Map<string, number> = new Map(pairs)
	oldPairs.forEach((count, pair) => {
		const newElement = insertions.get(pair)
		if (!newElement) return
		const oldCount = pairs.get(pair) ?? 0
		pairs.set(pair, oldCount - count)
		addOrInsert(pairs, pair[0] + newElement, count)
		addOrInsert(pairs, newElement + pair[1], count)
	})
	pairs.forEach((value, key) => {
		if (value === 0) {
			pairs.delete(key)
		}
	})
	return pairs
}

for (let i = 0; i < 10; i++) {
	nextIteration(pairs, insertions)
}

function differenceOfMostAndLeastCommonElement(pairs: Map<string, number>) {
	const elementCounts: Map<string, number> = new Map<string, number>()
	pairs.forEach((value, key) => {
		addOrInsert(elementCounts, key[0], value)
		addOrInsert(elementCounts, key[1], value)
	})

	let leastCount = Number.MAX_VALUE
	let leastValue = ''
	let mostCount = 0
	let mostValue = ''
	elementCounts.forEach((count, element) => {
		if (count < leastCount) {
			leastCount = count
			leastValue = element
		}
		if (count > mostCount) {
			mostCount = count
			mostValue = element
		}
	})

	mostCount = Math.ceil(mostCount / 2)
	leastCount = Math.ceil(leastCount / 2)

	return mostCount - leastCount
}

console.log(differenceOfMostAndLeastCommonElement(pairs))

// stage 2
for (let i = 10; i < 40; i++) {
	// +30 cycles
	nextIteration(pairs, insertions)
}

console.log(differenceOfMostAndLeastCommonElement(pairs))

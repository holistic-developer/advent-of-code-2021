import * as fs from 'fs'

let rawInput = fs.readFileSync('12-input.txt')
let input = rawInput.toString().split('\n')

//stage 1

const graph: Map<string, string[]> = new Map()

input.forEach((edge) => {
	const [node1, node2] = edge.split('-')
	if (!graph.has(node1)) {
		graph.set(node1, [])
	}
	if (!graph.has(node2)) {
		graph.set(node2, [])
	}
	graph.get(node1)!.push(node2)
	graph.get(node2)!.push(node1)
})

function isSmallCave(node: string): boolean {
	return node[0].toLowerCase() === node[0]
}

const isNextStepAllowed1 = (next: string, path: string): boolean =>
	next === 'end' || !isSmallCave(next) || (isSmallCave(next) && !path.includes(next))

function getPaths(
	path: string,
	graph: Map<string, string[]>,
	isNextStepAllowed: (next: string, path: string) => boolean
): string[] {
	const currentNode = path.split(',').pop()
	if (currentNode === 'end') {
		return [path]
	}
	return graph
		.get(currentNode!)!
		.filter((next) => isNextStepAllowed(next, path))
		.flatMap((newStep) => getPaths(path + ',' + newStep, graph, isNextStepAllowed))
}

console.log(getPaths('start', graph, isNextStepAllowed1).length)

// stage 2

function noDoubleVisitsYet(path: string): boolean {
	const parts = path.split(',').filter(isSmallCave)
	return new Set(parts).size === parts.length
}

const isNextStepAllowed2 = (next: string, path: string): boolean =>
	next === 'end' ||
	!isSmallCave(next) ||
	(isSmallCave(next) && next !== 'start' && (!path.includes(next) || noDoubleVisitsYet(path)))

console.log(getPaths('start', graph, isNextStepAllowed2).length)

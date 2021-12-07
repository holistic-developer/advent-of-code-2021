import * as fs from 'fs'

let rawInput = fs.readFileSync('7-input.txt')
const input = rawInput
	.toString()
	.split(',')
	.map((value) => parseInt(value))

// stage 1
const minHorizontal = Math.min(...input)
const maxHorizontal = Math.max(...input)

let possibleGoals = []
for (let goal = minHorizontal; goal <= maxHorizontal; goal++) {
	possibleGoals.push(goal)
}

const calculateFuelForPostition = (input: number[], goal: number) => {
	return input.map((position) => Math.abs(position - goal)).reduce((a, b) => a + b)
}

console.log(possibleGoals.map((goal) => calculateFuelForPostition(input, goal)).reduce((a, b) => Math.min(a, b)))

// stage 2

function cost2(number: number): number {
	return (number * (number + 1)) / 2
}

const calculateFuelForPostition2 = (input2: number[], goal: number) => {
	return input2.map((position) => cost2(Math.abs(position - goal))).reduce((a, b) => a + b)
}

console.log(possibleGoals.map((goal) => calculateFuelForPostition2(input, goal)).reduce((a, b) => Math.min(a, b)))

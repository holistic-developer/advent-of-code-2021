import * as fs from 'fs'

let rawInput = fs.readFileSync('10-input.txt')
const input = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split(''))

// stage 1
function getCurruptionScore(line: string[]): number {
	let stack: string[] = []
	let error = 0
	line.forEach((character) => {
		switch (character) {
			case '(':
				stack.push(character)
				break
			case '[':
				stack.push(character)
				break
			case '{':
				stack.push(character)
				break
			case '<':
				stack.push(character)
				break
			case ')':
				if (stack.pop() !== '(') {
					error = 3
				}
				break
			case ']':
				if (stack.pop() !== '[') {
					error = 57
				}
				break
			case '}':
				if (stack.pop() !== '{') {
					error = 1197
				}
				break
			case '>':
				if (stack.pop() !== '<') {
					error = 25137
				}
				break
			default:
				console.log('error: ' + character)
		}
		if (error != 0) return
	})
	return error
}

console.log(input.map((line) => getCurruptionScore(line)).reduce((a, b) => a + b))

// stage 2
const notCurrupted = input.filter((line) => getCurruptionScore(line) == 0)

function completedScore(line: string[]): number {
	let stack: string[] = []
	line.forEach((character) => {
		switch (character) {
			case '(':
				stack.push(character)
				break
			case '[':
				stack.push(character)
				break
			case '{':
				stack.push(character)
				break
			case '<':
				stack.push(character)
				break
			case ')':
				stack.pop()
				break
			case ']':
				stack.pop()
				break
			case '}':
				stack.pop()
				break
			case '>':
				stack.pop()
				break
			default:
				console.log('error: ' + character)
		}
	})
	let errorScore = 0
	while (stack.length > 0) {
		const character = stack.pop()
		errorScore *= 5
		switch (character) {
			case '(':
				errorScore += 1
				break
			case '[':
				errorScore += 2
				break
			case '{':
				errorScore += 3
				break
			case '<':
				errorScore += 4
				break
			default:
				console.log('error: ' + character)
		}
	}
	return errorScore
}

console.log(notCurrupted.map((line) => completedScore(line)).sort((a, b) => a - b)[Math.floor(notCurrupted.length / 2)])

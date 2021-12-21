import * as fs from 'fs'

// const player1StartingPostition = 4
// const player2StartingPostition = 8
const player1StartingPostition = 5
const player2StartingPostition = 6

// stage 1

const points: number[] = [0, 0]
const currentFields: number[] = [player1StartingPostition - 1, player2StartingPostition - 1]

let rolls = 0
function getDeterministicDiceRoll() {
	const roll = (rolls % 100) + 1
	rolls++
	return roll
}

let player = 0

function movePlayer(player: number) {
	const rolls = getDeterministicDiceRoll() + getDeterministicDiceRoll() + getDeterministicDiceRoll()
	currentFields[player] = (currentFields[player] + rolls) % 10
	points[player] += currentFields[player] + 1
}

while (points.every((p) => p < 1000)) {
	movePlayer(player)
	player = (player + 1) % 2
}

console.log(Math.min(...points) * rolls)

/*     sum
1 1 1   3
1 1 2   4
1 1 3   5
1 2 1   4
1 2 2   5
1 2 3   6
1 3 1   5
1 3 2   6
1 3 3   7
2 1 1   4
2 1 2   5
2 1 3   6
2 2 1   5
2 2 2   6
2 2 3   7
2 3 1   6
2 3 2   7
2 3 3   8
3 1 1   5
3 1 2   6
3 1 3   7
3 2 1   6
3 2 2   7
3 2 3   8
3 3 1   7
3 3 2   8
3 3 3   9
 */
const rollOccurrances = new Map([
	[3, 1],
	[4, 3],
	[5, 6],
	[6, 7],
	[7, 6],
	[8, 3],
	[9, 1],
])

function getWins(
	p1F: number = player1StartingPostition - 1,
	p2F: number = player2StartingPostition - 1,
	p1P: number = 0,
	p2P: number = 0,
	playersTurn: number = 0
): number[] {
	if (p1P >= 21) {
		return [1, 0]
	}
	if (p2P >= 21) {
		return [0, 1]
	}
	const wins = [0, 0]
	const nextPlayersTurn: number = (playersTurn + 1) % 2
	rollOccurrances.forEach((multiverses, roll) => {
		if (playersTurn == 0) {
			const newP1F = (p1F + roll) % 10
			const [p1W, p2W] = getWins(newP1F, p2F, p1P + newP1F + 1, p2P, nextPlayersTurn).map((m) => m * multiverses)
			wins[0] += p1W
			wins[1] += p2W
		} else {
			const newP2F = (p2F + roll) % 10
			const [p1W, p2W] = getWins(p1F, newP2F, p1P, p2P + newP2F + 1, nextPlayersTurn).map((m) => m * multiverses)
			wins[0] += p1W
			wins[1] += p2W
		}
	})
	return wins
}

// stage 2
console.log(Math.max(...getWins()))

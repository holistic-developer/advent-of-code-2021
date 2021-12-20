import * as fs from 'fs'

const rawInput = fs.readFileSync('20-input.txt')
// const rawInput = fs.readFileSync('test-input.txt')

// stage 1
const [rawEnhanceLookup, rawImage] = rawInput.toString().split('\n\n')
const enhanceLookup = rawEnhanceLookup.split('').map((c) => (c === '#' ? 1 : 0))
let image = rawImage.split('\n').map((r) => r.split('').map((c) => (c === '#' ? 1 : 0)))

function enhancePixel(x: number, y: number, originalImage: number[][], border: number): number {
	let neighbors = []
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			neighbors.push(originalImage[y + i]?.[x + j] ?? border)
		}
	}
	return enhanceLookup[parseInt(neighbors.join(''), 2)]
}

function enhanceImage(originalImage: number[][], border: number): number[][] {
	const newImage: number[][] = []
	for (let y = -1; y < originalImage.length + 1; y++) {
		newImage.push([])
		for (let x = -1; x < originalImage[0].length + 1; x++) {
			newImage[y + 1].push(enhancePixel(x, y, originalImage, border))
		}
	}
	return newImage
}

console.log(
	enhanceImage(enhanceImage(image, 0), enhanceLookup[0])
		.flat()
		.filter((v) => v === 1).length
)
// stage 2
let img: number[][] = image
for (let i = 0; i < 50; i++) {
	const border = i % 2 != 0 ? enhanceLookup[0] : 0
	img = enhanceImage(img, border)
}
console.log(img.flat().filter((v) => v === 1).length)

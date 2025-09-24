/**
 * perlin2d.ts
 *
 * A small, seedable 2D Perlin noise implementation in TypeScript.
 * - Provides a Perlin class with a seedable permutation table
 * - `noise2D(x, y)` returns noise in range [-1, 1]
 * - `noise(x, y)` returns noise in range [0, 1]
 * - `fractalNoise(x, y, options)` builds multi-octave fractional Brownian motion (fBM)
 *
 * Usage:
 *   import Perlin from './perlin2d';
 *   const p = new Perlin(12345); // optional numeric seed
 *   const n = p.noise(12.34, 56.78); // 0..1
 *   const fbm = p.fractalNoise(12.34, 56.78, {octaves:4, lacunarity:2, gain:0.5});
 */

type FractalOptions = {
	octaves?: number; // number of layers
	lacunarity?: number; // frequency multiplier per octave
	gain?: number; // amplitude multiplier per octave
	normalize?: boolean; // whether to normalize final value to [0,1]
};

export default class Perlin {
	private p: number[]; // permutation table (512 entries)

	/**
	 * Create a Perlin noise generator. If seed is omitted, a random one is used.
	 * The seed is a 32-bit integer. Any numeric seed will be converted to uint32.
	 */
	constructor(seed?: number) {
		const s =
			typeof seed === "number"
				? seed >>> 0
				: Math.floor(Math.random() * 2 ** 32) >>> 0;
		this.p = Perlin.buildPermutationTable(s);
	}

	// ----------------------------- static helpers -----------------------------
	private static buildPermutationTable(seed: number): number[] {
		// simple seedable PRNG (mulberry32)
		function mulberry32(a: number) {
			return function () {
				a |= 0;
				a = (a + 0x6d2b79f5) | 0;
				let t = Math.imul(a ^ (a >>> 15), 1 | a);
				t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		const rand = mulberry32(seed >>> 0);
		const perm = new Array<number>(256);
		for (let i = 0; i < 256; i++) perm[i] = i;
		// Fisher-Yates shuffle with our PRNG
		for (let i = 255; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			const tmp = perm[i];
			perm[i] = perm[j];
			perm[j] = tmp;
		}
		// duplicate to avoid overflow in lookup
		return perm.concat(perm);
	}

	// Fade function as defined by Ken Perlin. 6t^5 - 15t^4 + 10t^3
	private static fade(t: number): number {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	private static lerp(a: number, b: number, t: number): number {
		return a + t * (b - a);
	}

	// Gradient function - convert low 4 bits of hash code into 12 gradient directions.
	private static grad(hash: number, x: number, y: number): number {
		const h = hash & 7; // 8 directions
		const u = h < 4 ? x : y;
		const v = h < 4 ? y : x;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	}

	// ----------------------------- core noise -----------------------------
	/**
	 * Raw Perlin noise in range [-1, 1].
	 * x and y can be any real numbers.
	 */
	noise2D(x: number, y: number): number {
		// Find unit grid cell containing point
		const X = Math.floor(x) & 255;
		const Y = Math.floor(y) & 255;

		// Relative x, y in cell
		const xf = x - Math.floor(x);
		const yf = y - Math.floor(y);

		// Compute fade curves for xf, yf
		const u = Perlin.fade(xf);
		const v = Perlin.fade(yf);

		const p = this.p;

		// Hash coordinates of the square's corners
		const aa = p[p[X] + Y];
		const ab = p[p[X] + Y + 1];
		const ba = p[p[X + 1] + Y];
		const bb = p[p[X + 1] + Y + 1];

		// Add blended results from corners
		const x1 = Perlin.lerp(
			Perlin.grad(aa, xf, yf),
			Perlin.grad(ba, xf - 1, yf),
			u
		);
		const x2 = Perlin.lerp(
			Perlin.grad(ab, xf, yf - 1),
			Perlin.grad(bb, xf - 1, yf - 1),
			u
		);

		const result = Perlin.lerp(x1, x2, v);

		// result is in roughly [-1,1]
		return result;
	}

	/**
	 * Normalized Perlin noise in range [0, 1]. Convenience wrapper around noise2D.
	 */
	noise(x: number, y: number): number {
		return this.noise2D(x, y) * 0.5 + 0.5;
	}

	/**
	 * Fractal (fBm) Perlin noise using multiple octaves.
	 * Options: octaves (default 4), lacunarity (default 2), gain (default 0.5), normalize (default true)
	 * Returns value in [-1,1] if normalize=false, otherwise [0,1].
	 */
	fractalNoise(x: number, y: number, options: FractalOptions = {}): number {
		const octaves = options.octaves ?? 4;
		const lacunarity = options.lacunarity ?? 2;
		const gain = options.gain ?? 0.5;
		const normalize = options.normalize ?? true;

		let amplitude = 1;
		let frequency = 1;
		let sum = 0;
		let maxAmp = 0;

		for (let i = 0; i < octaves; i++) {
			const n = this.noise2D(x * frequency, y * frequency);
			sum += n * amplitude;
			maxAmp += amplitude;
			amplitude *= gain;
			frequency *= lacunarity;
		}

		// sum is roughly in [-maxAmp, maxAmp]
		if (normalize) {
			return sum / (2 * maxAmp) + 0.5; // map to [0,1]
		}
		return sum;
	}

	/**
	 * Return a new Perlin instance with the given seed.
	 */
	static fromSeed(seed: number) {
		return new Perlin(seed);
	}
}

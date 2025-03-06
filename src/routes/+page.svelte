<script>
	import { page } from '$app/state';
	import { mapRange, randomFrom } from '$lib/js/utils';

	const images = Object.entries(
		import.meta.glob('$lib/img/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}', {
			eager: true,
			query: {
				enhanced: true
			}
		})
	).map(([id, module]) => [id, module.default]);

	function warble(node, { delay = 0, duration = 150 } = {}) {
		return {
			delay,
			duration,
			easing: (x) => x,
			css: (t) =>
				`transform:  scale(${mapRange(t, 0, 1, 0.99, 1)}) rotate(${mapRange(t, 0, 1, -3, 0)}deg);`
		};
	}

	/**
	 *
	 * @param {string} path
	 */
	function prep(path) {
		return path.split('/').at(-1) ?? '';
	}

	/** @type {Record<string, {type: 'text', content: string, trigger?: string[], dontScale?: boolean} | {type: 'image', content: import('@sveltejs/enhanced-img').EnhancedImgAttributes['src'], trigger?: string[], dontScale?: boolean}>} */
	const parts = {
		majo: {
			type: 'text',
			content: 'MAJO',
			trigger: ['ma', 'jo', 'f', 'p']
		},

		ma: {
			type: 'text',
			content: 'Ma',
			trigger: ['soy', 'maria']
		},

		soy: {
			type: 'text',
			content: 'Soy'
		},

		maria: {
			type: 'text',
			content: 'Maria'
		},

		jo: {
			type: 'text',
			content: 'Jo',
			trigger: ['jose']
		},

		jose: {
			type: 'text',
			content: 'Jose'
		},

		f: {
			type: 'text',
			content: 'F.',
			trigger: ['fernandez']
		},

		p: {
			type: 'text',
			content: 'P.',
			trigger: ['plenge', 'pe']
		},

		fernandez: {
			type: 'text',
			content: 'Fernandez'
		},

		plenge: {
			type: 'text',
			content: 'Plenge'
		},

		pe: {
			type: 'text',
			content: 'PE',
			trigger: ['li', 'peru', 'plus']
		},

		li: {
			type: 'text',
			content: 'Li,',
			trigger: ['lima']
		},

		lima: {
			type: 'text',
			content: 'Lima'
		},

		plus: {
			type: 'text',
			content: '+',
			trigger: ['and', 'mad', 'es']
		},

		and: {
			type: 'text',
			content: 'and'
		},

		mad: {
			type: 'text',
			content: 'Ma,',

			trigger: ['madrid']
		},

		madrid: {
			type: 'text',
			content: 'Madrid'
		},

		es: {
			type: 'text',
			content: 'Es',
			trigger: ['spain', 'artist']
		},

		spain: {
			type: 'text',
			content: 'Spain'
		},

		peru: {
			type: 'text',
			content: 'Peru'
		},

		artist: {
			type: 'text',
			content: 'Artist',
			trigger: ['researcher'],
			dontScale: true
		},

		researcher: {
			type: 'text',
			content: 'Researcher',
			trigger: ['photographer'],
			dontScale: true
		},

		photographer: {
			type: 'text',
			content: 'Photographer',
			trigger: ['artist'],
			dontScale: true
		},

		...images.reduce(
			(dict, [id, image]) => ({
				...dict,
				[prep(id)]: {
					type: 'image',
					content: image
				}
			}),
			{}
		)
	};

	const imageTypes = Object.entries(parts)
		.filter(([id, item]) => item.type === 'image')
		.map(([id, item]) => ({
			id,
			...item
		}));

	let level = $state(1);
	let size = $derived(new Array(level).fill(0).reduce((prev, curr) => prev * 0.9, 1));

	/** @type {(keyof typeof parts)[]} */
	let words = $state(['majo']);
	let hasImages = $derived(imageTypes.some(({ id }) => !words.includes(id)));

	let converted = $derived(
		words.map((word, idx, arr) => {
			return {
				...parts[word],
				id: word,
				active: !!parts[word].trigger || (parts[arr?.[idx + 1]]?.type !== 'image' && hasImages)
			};
		})
	);

	/**
	 *
	 * @param {keyof typeof parts} id
	 */
	function onTrigger(id) {
		const { trigger, dontScale } = parts[id];

		if (trigger) {
			words.splice(words.indexOf(id), 1, ...trigger);

			if (!dontScale) {
				level++;
			}
		} else {
			const image = randomFrom(imageTypes.filter((item) => !words.includes(item.id)));

			if (image) {
				words.splice(words.indexOf(id) + 1, 0, image.id);
			}
		}
	}

	/** @type {keyof typeof parts | null} */
	// let highlightedId = $state(null);
	let highlightedId = $state('bleu1.jpg');
	let highlightedImage = $derived(highlightedId ? parts[highlightedId] : null);

	/**
	 *
	 * @param {keyof typeof parts | null} id
	 */
	function highlight(id) {
		highlightedId = id;
	}
</script>

{#if highlightedImage}
	<div class="highlight">
		<enhanced:img src={highlightedImage.content} />
	</div>
{/if}

<div class="pool" style={`--parts-percentage: ${size}`}>
	{#each converted as part, idx (part.id)}
		<span in:warble class="part">
			{#if part.type === 'text'}
				<button
					class="word btn-reset"
					class:active={part.active}
					onclick={part.active ? () => onTrigger(part.id) : undefined}>{part.content}</button
				>
			{:else if part.type === 'image'}
				<span
					class="image"
					onmouseenter={() => highlight(part.id)}
					onmouseleave={() => highlight(null)}><enhanced:img src={part.content} /></span
				>
			{/if}
		</span>
	{/each}
</div>

<style lang="scss">
	.pool {
		display: flex;

		flex-wrap: wrap;

		column-gap: 0.15em;
		row-gap: 0.35em;

		font-size: calc(var(--parts-percentage) * 35vw);
		line-height: 0;

		@include tablet {
			row-gap: 0.15em;
			font-size: calc(var(--parts-percentage) * 20vw);
		}
	}

	.word {
		font-size: var(--parts-size);

		transition: {
			duration: 0.05s;
			property: font-size;
		}

		opacity: 0.65;
		line-height: 0.8;

		text-align: left;

		&.active {
			opacity: 1;

			cursor: pointer;

			@include hover {
				color: blue;
			}
		}
	}

	.image {
		display: inline-block;

		height: 1.3ch;
		line-height: 0;

		img {
			width: auto;
			height: 100%;
		}
	}

	.highlight {
		position: fixed;

		top: 50%;
		left: 50%;

		width: 75%;
		height: 75%;

		pointer-events: none;

		transform: translate3d(-50%, -50%, 0);

		mix-blend-mode: multiply;

		img {
			width: 100%;
			height: 100%;

			object-fit: contain;
		}
	}
</style>

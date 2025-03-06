<script>
	import 'normalize.css';
	import '$lib/styles/global.scss';

	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	let { data, children } = $props();
</script>

<svelte:head>
	<title>MAJO – Artist</title>
	<link rel="icon" href="/favicon.ico" />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<main>
	{@render children()}
</main>

<footer>
	<span class="notice">Site under development</span>

	<div class="links">
		<a href="https://google.com" target="_blank">Portfolio / CV</a>
		<a href="">Instagram</a>
		<a href="mailto:hola@mfernandezplenge.com">hola@mfernandezplenge.com</a>
	</div>
</footer>

<style lang="scss">
	.app {
		display: flex;

		flex-direction: column;

		min-height: 100dvh;
	}

	main {
		display: flex;

		flex-direction: column;

		flex-grow: 1;

		padding-top: var(--header-clear);

		transition: {
			duration: 0.5s;
			property: opacity, transform;
			timing-function: var(--standard-easing);
		}
	}

	footer {
		display: flex;

		flex-direction: column;

		font-size: 24px;

		row-gap: 1em;

		@include tablet {
			justify-content: space-between;
			align-items: flex-end;
			flex-direction: row;
		}

		.notice {
			text-transform: uppercase;
		}

		.links {
			display: flex;

			flex-direction: column;

			@include tablet {
				align-items: flex-end;
			}
		}

		.links a {
			text-decoration: none;
			color: currentColor;

			@include hover {
				text-decoration: underline;
				text-underline-offset: 0.25em;
				text-decoration-skip-ink: none;
			}
		}
	}
</style>

/**
 * @typedef {(inview: boolean) => void} Handler
 *
 * @param {HTMLElement} node
 * @param {Handler | {handler: Handler}} opts
 */
export const inview = (node, opts) => {
	const handler = typeof opts === 'function' ? opts : opts.handler;

	/** @type {IntersectionObserverCallback} */
	const onObserve = (entries) => {
		handler(entries[0].isIntersecting);
	};

	const io = new IntersectionObserver(onObserve);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
};

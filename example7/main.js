import { initializeState } from './state.js';
import { configuration as renderConfiguration, initializeRender } from './render.js';

const configuration = Object.freeze({
	rootSelector: '.js-game-root',
	size: Object.freeze({ width: 1920, height: 1080 }),
	maxFramesPerSecond: 1000 / 60,
});

const createMain = () => {
	const { keyState, keydownListener, keyupListener, state, getNextState } = initializeState({
		configuration,
		renderConfiguration,
		onKeyStateChange: (nextKeyState) => {
			Object.assign(keyState, nextKeyState); // side-effect
		},
	});
	document.addEventListener('keydown', keydownListener); // side-effect
	document.addEventListener('keyup', keyupListener); // side-effect

	const { fragment, context, render } = initializeRender(configuration.size);

	let lastTimestamp = window.performance.now();
	const gameLoop = (timestamp) => {
		window.requestAnimationFrame(gameLoop);
		const sinceLastTimestamp = timestamp - lastTimestamp;
		if (sinceLastTimestamp >= configuration.maxFramesPerSecond) {
			const nextState = getNextState(sinceLastTimestamp, keyState, state);
			const renderedCanvas = render(nextState);
			context.clearRect(0, 0, configuration.size.width, configuration.size.height); // side-effect
			context.drawImage(renderedCanvas, 0, 0); // side-effect
			lastTimestamp = timestamp; // side-effect
			Object.assign(state, nextState); // side-effect
		}
	};

	document.querySelector(configuration.rootSelector).appendChild(fragment); // side-effect

	return gameLoop;
};

const main = createMain();

main();

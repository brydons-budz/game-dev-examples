import { initializeState } from './state.js';
import { configuration, initializeRender } from './render.js';

const initialize = () => {
	const { keyState, keydownListener, keyupListener, gameState, getNextGameState } = initializeState({
		configuration,
		onKeyStateChange: (nextKeyState) => {
			Object.assign(keyState, nextKeyState); // side-effect
		},
	});
	document.addEventListener('keydown', keydownListener); // side-effect
	document.addEventListener('keyup', keyupListener); // side-effect

	const { fragment, context, render } = initializeRender();

	document.querySelector(configuration.rootSelector).appendChild(fragment); // side-effect

	return {
		keyState,
		gameState,
		getNextGameState,
		context,
		render,
	};
};

const createMain = () => {
	const { keyState, gameState, getNextGameState, context, render } = initialize();

	let lastTimestamp = window.performance.now();
	const gameLoop = (timestamp) => {
		window.requestAnimationFrame(gameLoop);
		const sinceLastTimestamp = timestamp - lastTimestamp;
		if (sinceLastTimestamp >= configuration.maxFramesPerSecond) {
			const nextGameState = getNextGameState(sinceLastTimestamp, keyState, gameState);
			const renderedCanvas = render(nextGameState);
			context.clearRect(0, 0, configuration.size.width, configuration.size.height); // side-effect
			context.drawImage(renderedCanvas, 0, 0); // side-effect
			lastTimestamp = timestamp; // side-effect
			Object.assign(gameState, nextGameState); // side-effect
		}
	};

	return gameLoop;
};

const main = createMain();

main();

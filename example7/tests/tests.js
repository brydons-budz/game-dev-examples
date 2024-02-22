import { initializeState } from '../state.js';
import { configuration } from '../render.js';

const results = [];

const runTests = () => {
    let nextKeyState;
    const { keyState, keydownListener, keyupListener, state, getNextState } = initializeState({
		configuration,
		onKeyStateChange: (value) => {
			nextKeyState = value;
		},
	});

    // Act like we are triggering an event, no need to try and mock out the DOM
    keydownListener({ keyCode: 87 }); // "w"
    if (nextKeyState.player1.up !== true) {
        results.push('"w" is not mapped to the player1.up control on keydown');
    }
    keyupListener({ keyCode: 87 }); // "w"
    if (nextKeyState.player1.up === true) {
        results.push('"w" is not mapped to the player1.up control on keyup');
    }

    if (results.length > 0) {
        document.querySelector('output').value = `FAIL:\n${results.join('\n')}`;
    } else {
        document.querySelector('output').value = 'SUCCESS: All test pass!'
    }
};

runTests();
const keyCodeMap = Object.freeze({ w: 87, s: 83, up: 38, down: 40, esc: 27 });
const paddleVelocity = 0.5;
const winningScore = 11;

// Pass onKeyStateChange callback to move side effects out of this function
export const initializeState = ({ configuration, onKeyStateChange }) => {
	const keyState = {
		any: false, // Pressed for a single loop
		pause: false, // Pressed for a single loop
		player1: { up: false, down: false },
		player2: { up: false, down: false },
	};

	const keyEventListener = (value, event) => {
		// Pressed for a single loop
		if (value) {
			keyState.any = value;
			if (event.keyCode === keyCodeMap.esc) {
				keyState.pause = value;
			}
			onKeyStateChange(structuredClone(keyState));
		}

		// Can be continuously held down
		if (event.keyCode === keyCodeMap.w) {
			keyState.player1.up = value;
			onKeyStateChange(structuredClone(keyState));
		}
		if (event.keyCode === keyCodeMap.s) {
			keyState.player1.down = value;
			onKeyStateChange(structuredClone(keyState));
		}
		if (event.keyCode === keyCodeMap.up) {
			keyState.player2.up = value;
			onKeyStateChange(structuredClone(keyState));
		}
		if (event.keyCode === keyCodeMap.down) {
			keyState.player2.down = value;
			onKeyStateChange(structuredClone(keyState));
		}
	};

	const releaseKeyPresses = () => {
		if (keyState.pause) {
			keyState.pause = false;
		}
		if (keyState.any) {
			keyState.any = false;
			onKeyStateChange(structuredClone(keyState));
		}
	};

	const initialPaddleY = configuration.size.height / 2 - configuration.paddles.height / 2;
	const defaultBallState = Object.freeze({
		velocity: Object.freeze({ x: 0.5, y: 0.5 }),
		x: configuration.size.width / 2 - 240,
		y: configuration.size.height / 2 - configuration.ball.height / 2,
	});
	const initialGameState = Object.freeze({
		mode: 'playing', // 'playing' | 'paused' | 'gameOver'
		player1: Object.freeze({
			score: 0,
			paddle: Object.freeze({ y: initialPaddleY }),
		}),
		player2: Object.freeze({
			score: 0,
			paddle: Object.freeze({ y: initialPaddleY }),
		}),
		ball: Object.freeze(structuredClone(defaultBallState)),
	});
	return {
		keyState: structuredClone(keyState),
		keydownListener: keyEventListener.bind(undefined, true),
		keyupListener: keyEventListener.bind(undefined, false),
		releaseKeyPresses,
		gameState: structuredClone(initialGameState),
		getNextGameState: (sinceLastTimestamp, keyState, previousState) => {
			if (previousState.mode === 'gameOver' && keyState.any) {
				return initialGameState;
			}

			const gameState = structuredClone(previousState);

			// Handle pause/unpause
			if ((gameState.mode === 'playing' || gameState.mode === 'paused') && keyState.pause) {
				gameState.mode = gameState.mode === 'playing' ? 'paused' : 'playing';
			}

			// When game is not playing, early escape (no other state updates)
			if (gameState.mode !== 'playing') {
				return gameState;
			}

			// Move the paddles (NEW)
			if (keyState.player1.up) {
				gameState.player1.paddle.y -= paddleVelocity * sinceLastTimestamp;
			}
			if (keyState.player1.down) {
				gameState.player1.paddle.y += paddleVelocity * sinceLastTimestamp;
			}
			if (keyState.player2.up) {
				gameState.player2.paddle.y -= paddleVelocity * sinceLastTimestamp;
			}
			if (keyState.player2.down) {
				gameState.player2.paddle.y += paddleVelocity * sinceLastTimestamp;
			}

			// Prevent moving paddles off the screen (NEW)
			gameState.player1.paddle.y = Math.min(
				Math.max(gameState.player1.paddle.y, 0),
				configuration.size.height - configuration.paddles.height
			);
			gameState.player2.paddle.y = Math.min(
				Math.max(gameState.player2.paddle.y, 0),
				configuration.size.height - configuration.paddles.height
			);

			// Move the ball
			gameState.ball.x += gameState.ball.velocity.x * sinceLastTimestamp;
			gameState.ball.y += gameState.ball.velocity.y * sinceLastTimestamp;

			if (
				// AABB collision detection with first paddle (see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#axis-aligned_bounding_box)
				(gameState.ball.x < configuration.paddles.margin + configuration.paddles.width &&
					gameState.ball.x + configuration.ball.width > configuration.paddles.margin &&
					gameState.ball.y < gameState.player1.paddle.y + configuration.paddles.height &&
					gameState.ball.y + configuration.ball.height > gameState.player1.paddle.y) ||
				// AABB collision detection with second paddle
				(gameState.ball.x < configuration.size.width - configuration.paddles.margin + configuration.paddles.width &&
					gameState.ball.x + configuration.ball.width > configuration.size.width - configuration.paddles.margin &&
					gameState.ball.y < gameState.player2.paddle.y + configuration.paddles.height &&
					gameState.ball.y + configuration.ball.height > gameState.player2.paddle.y)
			) {
				gameState.ball.velocity.x = gameState.ball.velocity.x * -1; // Reverse direction
			}

			// Collision detection with top or bottom of the screen
			if (gameState.ball.y <= 0 || gameState.ball.y + configuration.ball.height > configuration.size.height) {
				gameState.ball.velocity.y = gameState.ball.velocity.y * -1; // Reverse direction
			}

			// Scoring
			if (gameState.ball.x <= 0) {
				gameState.player2.score += 1;
				gameState.ball = structuredClone(defaultBallState);
			}
			if (gameState.ball.x + configuration.ball.width >= configuration.size.width) {
				gameState.player1.score += 1;
				gameState.ball = structuredClone(defaultBallState);
			}
			if (gameState.player1.score >= winningScore || gameState.player2.score >= winningScore) {
				gameState.mode = 'gameOver';
			}

			return gameState;
		},
	};
};

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function parseFen(fen) {
	const pieces = [];

	let x = 0;
	let y = 0;

	let i;
	for (i = 0; i < fen.length; i++) {
		const char = fen[i];
		if (char === ' ') {
			break;
		}
		if (char === '/') {
			x = 0;
			y++;
			continue;
		}
		const spacing = parseInt(char);
		if (Number.isInteger(spacing)) {
			x += spacing;
			continue;
		}
		pieces.push({	name: char,	x: x, y: y });
		x++;
	}

	let whiteToMove = true;

	if (i + 1 < fen.length) {
		const moveToken = fen[i + 1];
		if (moveToken === 'b' || moveToken === 'B') {
			whiteToMove = false;
		} else if (moveToken !== 'w' && moveToken !== 'W') {
			throw new Error(`move token "${moveToken}" is not recognized`);
		}
	}

	return [pieces, whiteToMove];
}
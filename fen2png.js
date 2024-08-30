function main() {
  const canvas = document.getElementById("board-canvas");

  let images = {};

  const updateBoard = () => {
    const fenInput = document.getElementById("fen-input");
    const boardState = parseFen(fenInput.value);
    draw(canvas, images, boardState);
  }

  const fenForm = document.getElementById("fen-form");
  fenForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateBoard();
  });

  loadPieceImages().then((data) => {
    images = data;
    const fenSubmit = document.getElementById("fen-submit");
    fenSubmit.disabled = false;
    updateBoard();
  });

  const downloadForm = document.getElementById("download-form");
  downloadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const filenameInput = document.getElementById("filename");
    const a = document.createElement("a");
    a.download = filenameInput.value;
    a.href = canvas.toDataURL();
    a.click();
  })
}

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
    if (x > 7 || y > 7) {
      throw new Error("Piece placed out of bounds");
    }
    pieces.push({  name: char,  x: x, y: y });
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

  return { pieces, whiteToMove };
}

function draw(canvas, images, boardState) {
  const sq = 60;
  canvas.width = 9.8*sq;
  canvas.height = 9*sq;
  const ctx = canvas.getContext("2d");
  ctx.scale(sq, sq);
  ctx.fillStyle = "white";
  ctx.fillRect(-10, -10, 20, 20);
  ctx.translate(0.5, 0.5);

  drawBoard(ctx);
  drawTurnIndicator(ctx, boardState.whiteToMove);
  placePieces(ctx, images, boardState);
}

function drawBoard(ctx) {
  const darkFillBackground = "#EEE";
  const darkFillForeground = "#444";
  const lineDensity = 180;
  const lineWidth = 0.025;
  const lightFill = "#EEE";
  const borderWidth = 0.05;

  ctx.fillStyle = darkFillForeground;
  ctx.fillRect(-borderWidth, -borderWidth, 8+2*borderWidth, 8+2*borderWidth);

  ctx.fillStyle = darkFillBackground;
  ctx.fillRect(0, 0, 8, 8);

  ctx.strokeStyle = darkFillForeground;
  const dx = 16 / lineDensity;

  ctx.lineWidth = lineWidth;

  for (let i = 0; i < lineDensity; i++) {
    ctx.beginPath();

    if (i * dx < 8) {
      ctx.moveTo(0, i * dx);
      ctx.lineTo(i * dx, 0);
    } else {
      ctx.moveTo(i * dx - 8, 8);
      ctx.lineTo(8, i * dx - 8);
    }
    ctx.stroke();
  }

  ctx.fillStyle = lightFill;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(j, i, 1, 1);
      }
    }
  }
}

function drawTurnIndicator(ctx, whiteToMove) {
  ctx.beginPath();
  ctx.moveTo(8.4, 7.5);
  ctx.lineTo(8.6, 6.9);
  ctx.lineTo(8.8, 7.5);
  ctx.closePath();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.08;
  ctx.stroke();

  ctx.fillStyle = whiteToMove ? "white" : "black";
  ctx.fill();
}

function placePieces(ctx, images, boardState) {
  const orient = boardState.whiteToMove ? (c => c) : (c => 7 - c);
  boardState.pieces.forEach((piece) => {
    ctx.drawImage(images[piece.name], orient(piece.x), orient(piece.y), 1, 1);
  })
}

function loadPieceImages() {
  return new Promise((resolve) => {
    const theme = "companion";
    const pieceFiles = {
      'B': 'wB',
      'K': 'wK',
      'N': 'wN',
      'P': 'wP',
      'Q': 'wQ',
      'R': 'wR',
      'b': 'bB',
      'k': 'bK',
      'n': 'bN',
      'p': 'bP',
      'q': 'bQ',
      'r': 'bR',
    }

    const images = {};
    let loadingImages = Object.keys(pieceFiles).length;

    function onLoad() {
      loadingImages--;
      if (loadingImages <= 0) {
        resolve(images);
      }
    }

    Object.entries(pieceFiles).forEach((entry) => {
      const key = entry[0];
      const img = new Image();
      img.addEventListener("load", onLoad);
      img.src = `images/piece/${theme}/${entry[1]}.svg`;
      images[key] = img;
    })
  });
}

main();
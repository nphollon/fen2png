function main() {
  const fen = "";
  const boardState = parseFEN(fen);
  draw(boardState).then(download);
}

function parseFEN() {
  return [
    { name: 'r', x: '0', y: '0' },
    { name: 'n', x: '1', y: '0' },
    { name: 'b', x: '2', y: '0' },
    { name: 'q', x: '3', y: '0' },
    { name: 'k', x: '4', y: '0' },
    { name: 'b', x: '5', y: '0' },
    { name: 'n', x: '6', y: '0' },
    { name: 'r', x: '7', y: '0' },
    { name: 'R', x: '0', y: '7' },
    { name: 'N', x: '1', y: '7' },
    { name: 'B', x: '2', y: '7' },
    { name: 'Q', x: '3', y: '7' },
    { name: 'K', x: '4', y: '7' },
    { name: 'B', x: '5', y: '7' },
    { name: 'N', x: '6', y: '7' },
    { name: 'R', x: '7', y: '7' },
  ];
}

function draw(boardState) {
  return new Promise((resolve, reject) => {
    loadPieceImages().then((pieces) => {
      const sq = 60;
      const canvas = document.getElementById("board-canvas");
      canvas.width = 8*sq;
      canvas.height = 8*sq;
      const ctx = canvas.getContext("2d");
      ctx.scale(sq, sq);

      drawBoard(ctx);
      placePieces(ctx, pieces, boardState);
      resolve(canvas);
    });
  });
}

function drawBoard(ctx) {
  const darkFillBackground = "#9E728E"
  const darkFillForeground = "#4D3848";
  const lineDensity = 120;
  const lineWidth = 3/60;
  const lightFill = "#FFDCBD";

  ctx.fillStyle = darkFillBackground;
  ctx.fillRect(0, 0, 8, 8);

  ctx.strokeStyle = darkFillForeground;
  const dx = 16 / lineDensity;

  for (let i = 0; i < lineDensity; i++) {
    ctx.beginPath();
    ctx.lineWidth = (20 + i) * lineWidth / lineDensity;
    ctx.moveTo(i * dx, 0);
    ctx.lineTo(0, i * dx);
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

function placePieces(ctx, images, boardState) {
  boardState.forEach((piece) => {
    ctx.drawImage(images[piece.name], piece.x, piece.y, 1, 1);
  })
}

function loadPieceImages() {
  return new Promise((resolve) => {
    const theme = "alpha";
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

function download(canvas) {
  console.log(canvas.toDataURL());
}

main();